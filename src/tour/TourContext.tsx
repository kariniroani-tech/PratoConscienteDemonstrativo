import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ROUTES } from '../data/constants'
import { safeSessionStorage } from '../lib/storage'
import { useDemoStore } from '../store/demoStore'
import { toast } from '../store/toastStore'
import { TOUR_STEPS, stepIndexById, type TourApi, type TourStep } from './steps'

interface TourSession {
  active: boolean
  index: number
  completed: string[]
  startedAt: number
}

export interface TourValue {
  active: boolean
  index: number
  step: TourStep
  startedAt: number
  /** A ação obrigatória da etapa foi feita (agora ou numa visita anterior à etapa). */
  canProceed: boolean
  /** A ação acabou de ser feita e a etapa avançará sozinha em instantes. */
  autoAdvancing: boolean
  isFirst: boolean
  isLast: boolean
  canResume: boolean
  /** Incrementa quando o visitante tenta avançar sem concluir a ação (animação de alerta). */
  nudgeCount: number
  finishedOpen: boolean
  api: TourApi
  start: () => void
  resume: () => void
  stop: (options?: { silent?: boolean }) => void
  next: () => void
  back: () => void
  nudge: () => void
  closeFinished: () => void
}

const SESSION_KEY = 'prato-consciente-tour'
const AUTO_ADVANCE_DELAY = 650

const TourContext = createContext<TourValue | null>(null)

function loadSession(): TourSession {
  const fallback: TourSession = { active: false, index: 0, completed: [], startedAt: 0 }
  try {
    const raw = safeSessionStorage.getItem(SESSION_KEY)
    if (typeof raw !== 'string') return fallback
    const parsed = JSON.parse(raw) as Partial<TourSession>
    if (typeof parsed.index !== 'number' || !TOUR_STEPS[parsed.index]) return fallback
    return {
      active: Boolean(parsed.active),
      index: parsed.index,
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      startedAt: Date.now(),
    }
  } catch {
    return fallback
  }
}

export function TourProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [session, setSession] = useState<TourSession>(loadSession)
  const [nudgeCount, setNudgeCount] = useState(0)
  const [finishedOpen, setFinishedOpen] = useState(false)
  const [autoKey, setAutoKey] = useState<string | null>(null)
  const pathnameRef = useRef(pathname)
  const goToRef = useRef<(index: number) => void>(() => undefined)
  const lastSeenRef = useRef<{ key: string; done: boolean }>({ key: '', done: false })
  const restoredRef = useRef(false)

  const step = TOUR_STEPS[session.index]
  const stepKey = `${session.index}:${session.startedAt}`

  const doneNow = useDemoStore((state) =>
    step.task ? step.task.isDone({ state, pathname, startedAt: session.startedAt }) : true,
  )
  const canProceed = !step.task || doneNow || session.completed.includes(step.id)

  useLayoutEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    safeSessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }, [session])

  const api = useMemo<TourApi>(
    () => ({
      navigate,
      store: useDemoStore,
      goToStep: (id: string) => goToRef.current(stepIndexById(id)),
    }),
    [navigate],
  )

  const goTo = useCallback(
    (index: number) => {
      const target = TOUR_STEPS[index]
      if (!target) return
      setSession((current) => ({ ...current, active: true, index, startedAt: Date.now() }))
      if (pathnameRef.current !== target.route) navigate(target.route)
      target.prepare?.(api)
    },
    [api, navigate],
  )

  useLayoutEffect(() => {
    goToRef.current = goTo
  }, [goTo])

  // Ao recarregar a página no meio do tutorial, volta para a tela da etapa atual.
  useEffect(() => {
    if (restoredRef.current) return
    restoredRef.current = true
    if (session.active && pathname !== ROUTES.landing) goTo(session.index)
  }, [goTo, pathname, session.active, session.index])

  // Avanço automático apenas quando a ação passa de "pendente" para "feita" DURANTE a etapa.
  // Assim, uma etapa nunca é pulada: se a ação já estava feita, o visitante usa "Próximo".
  useEffect(() => {
    const last = lastSeenRef.current
    const becameDone = last.key === stepKey && !last.done && doneNow
    lastSeenRef.current = { key: stepKey, done: doneNow }
    if (becameDone && session.active && step.task?.auto) setAutoKey(stepKey)
  }, [doneNow, session.active, step, stepKey])

  useEffect(() => {
    if (!session.active || !doneNow || !step.task) return
    setSession((current) =>
      current.completed.includes(step.id) ? current : { ...current, completed: [...current.completed, step.id] },
    )
  }, [doneNow, session.active, step])

  const autoAdvancing = session.active && autoKey === stepKey && doneNow

  useEffect(() => {
    if (!autoAdvancing) return
    const timer = window.setTimeout(() => goTo(session.index + 1), AUTO_ADVANCE_DELAY)
    return () => window.clearTimeout(timer)
  }, [autoAdvancing, goTo, session.index])

  const stop = useCallback((options?: { silent?: boolean }) => {
    setSession((current) => ({ ...current, active: false }))
    if (!options?.silent) toast('Tutorial encerrado. Para retomar, use “Ajuda / Tutorial”.')
  }, [])

  // Navegar de volta à tela inicial da demonstração encerra o tutorial.
  // (Só na mudança de rota: ao iniciar a partir da tela inicial, o tutorial já está ativo
  // por um instante antes de a navegação para o Prato Aberto ser concluída.)
  const activeRef = useRef(session.active)
  const previousPathRef = useRef(pathname)
  useLayoutEffect(() => {
    activeRef.current = session.active
  }, [session.active])
  useEffect(() => {
    const previous = previousPathRef.current
    previousPathRef.current = pathname
    if (previous !== pathname && pathname === ROUTES.landing && activeRef.current) stop({ silent: true })
  }, [pathname, stop])

  const start = useCallback(() => {
    useDemoStore.getState().resetUi()
    setFinishedOpen(false)
    setSession({ active: true, index: 0, completed: [], startedAt: Date.now() })
    navigate(TOUR_STEPS[0].route)
    window.scrollTo({ top: 0 })
  }, [navigate])

  const resume = useCallback(() => goTo(session.index), [goTo, session.index])

  const nudge = useCallback(() => setNudgeCount((count) => count + 1), [])

  const next = useCallback(() => {
    if (!canProceed) {
      nudge()
      return
    }
    if (session.index >= TOUR_STEPS.length - 1) {
      setSession({ active: false, index: 0, completed: [], startedAt: Date.now() })
      setFinishedOpen(true)
      return
    }
    goTo(session.index + 1)
  }, [canProceed, goTo, nudge, session.index])

  const back = useCallback(() => {
    if (session.index > 0) goTo(session.index - 1)
  }, [goTo, session.index])

  const closeFinished = useCallback(() => setFinishedOpen(false), [])

  const value: TourValue = {
    active: session.active,
    index: session.index,
    step,
    startedAt: session.startedAt,
    canProceed,
    autoAdvancing,
    isFirst: session.index === 0,
    isLast: session.index === TOUR_STEPS.length - 1,
    canResume: !session.active && session.index > 0,
    nudgeCount,
    finishedOpen,
    api,
    start,
    resume,
    stop,
    next,
    back,
    nudge,
    closeFinished,
  }

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>
}

/** Acesso ao tutorial guiado. */
// oxlint-disable-next-line react/only-export-components
export function useTour(): TourValue {
  const value = useContext(TourContext)
  if (!value) throw new Error('useTour precisa estar dentro de <TourProvider>')
  return value
}
