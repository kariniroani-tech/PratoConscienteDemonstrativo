import { Check } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { DEMO_DATE, DEMO_SCHOOL_CODE, ROUTES } from '../../data/constants'
import { getCardapio } from '../../data/cardapios'
import { cn } from '../../lib/cn'
import { useDemoStore, type DemoState } from '../../store/demoStore'
import { useTour } from '../../tour/TourContext'
import { KIND_DOT, type Kind } from './kinds'

interface Stage {
  label: string
  kind: Kind
}

const STAGES: Stage[] = [
  { label: 'Escola', kind: 'existente' },
  { label: 'Data', kind: 'existente' },
  { label: 'Cardápio', kind: 'existente' },
  { label: 'Relato', kind: 'proposta' },
  { label: 'Confirmação', kind: 'proposta' },
  { label: 'Da escuta à ação', kind: 'simulacao' },
]

const SCHOOL_ROUTE = ROUTES.school(DEMO_SCHOOL_CODE)

function currentStage(pathname: string, state: DemoState): number {
  if (pathname === ROUTES.gestao) return 5
  if (pathname.startsWith('/prato-aberto/escola/')) {
    if (state.pcOpen && state.pcView === 'confirmation') return 4
    if (state.pcOpen) return 3
    if (state.menuOpen) return 2
    return 1
  }
  return 0
}

/** Rola até um elemento do tutorial assim que ele aparecer na tela. */
function scrollToTarget(target: string) {
  let attempts = 0
  const tryScroll = () => {
    const element = document.querySelector(`[data-tour="${target}"]`)
    if (element) {
      element.scrollIntoView({ block: 'start', behavior: 'smooth' })
      return
    }
    if (attempts++ < 30) requestAnimationFrame(tryScroll)
  }
  requestAnimationFrame(tryScroll)
}

/** Indicador de progresso do modo apresentação, com atalhos para cada parte da jornada. */
export function ProgressRail() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const tour = useTour()
  const current = useDemoStore((state) => currentStage(pathname, state))
  const hasRelato = useDemoStore((state) => Boolean(state.lastRelatoId))

  const jump = (index: number) => {
    const state = useDemoStore.getState()
    const ensureMenuDate = () => {
      if (!getCardapio(DEMO_SCHOOL_CODE, state.selectedDate)) state.selectDate(DEMO_DATE, false)
    }
    switch (index) {
      case 0:
        navigate(ROUTES.search)
        break
      case 1:
        navigate(SCHOOL_ROUTE)
        scrollToTarget('pa-calendar')
        break
      case 2:
        navigate(SCHOOL_ROUTE)
        ensureMenuDate()
        state.setMenuOpen(true)
        scrollToTarget('pa-menu')
        break
      case 3:
        navigate(SCHOOL_ROUTE)
        ensureMenuDate()
        state.setPcOpen(true)
        state.setPcView('form')
        scrollToTarget('pc-accordion')
        break
      case 4:
        navigate(SCHOOL_ROUTE)
        state.setPcOpen(true)
        state.setPcView('confirmation')
        scrollToTarget('pc-accordion')
        break
      default:
        navigate(ROUTES.gestao)
        window.scrollTo({ top: 0 })
    }
  }

  return (
    <nav
      aria-label="Progresso da demonstração"
      className="sticky top-10 z-[79] h-[34px] border-b border-[#e3dfd2] bg-pc-cream"
    >
      <ol className="mx-auto flex h-full max-w-[1100px] items-center gap-1 overflow-x-auto px-2 scrollbar-thin sm:justify-center">
        {STAGES.map((stage, index) => {
          const isCurrent = index === current
          const isDone = index < current
          const disabled = tour.active || (index === 4 && !hasRelato)
          return (
            <li key={stage.label} className="flex shrink-0 items-center gap-1">
              {index > 0 && <span className="h-px w-3 bg-[#cfc8b6] sm:w-5" aria-hidden="true" />}
              <button
                type="button"
                onClick={() => jump(index)}
                disabled={disabled}
                aria-current={isCurrent ? 'step' : undefined}
                title={tour.active ? 'Durante o tutorial, use os botões da caixa explicativa' : `Ir para: ${stage.label}`}
                className={cn(
                  'flex h-[26px] items-center gap-1.5 rounded-full px-2.5 font-spartan text-[12.5px] font-semibold transition-colors',
                  isCurrent ? 'bg-pc-green text-pc-cream' : 'text-pc-ink hover:bg-white',
                  disabled && !isCurrent && 'cursor-default opacity-60 hover:bg-transparent',
                )}
              >
                {isDone ? (
                  <Check size={13} aria-hidden="true" />
                ) : (
                  <span className={cn('size-2 rounded-full', KIND_DOT[stage.kind])} aria-hidden="true" />
                )}
                <span>
                  {index + 1}. {stage.label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
