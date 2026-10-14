import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, MousePointerClick, Wand } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router'
import { KindTag } from '../components/demo/KindTag'
import { cn } from '../lib/cn'
import { useDemoStore } from '../store/demoStore'
import { HOLE_PADDING, inflate, placeCard, roundedRectPath, type CardPosition } from './geometry'
import { TOTAL_ETAPAS } from './steps'
import { useTour, type TourValue } from './TourContext'
import { useTargetRect } from './useTargetRect'

/** Largura abaixo da qual o tutorial usa a faixa compacta inferior (celulares). */
const MOBILE_BREAKPOINT = 768
/** Altura estimada da faixa do tutorial no celular, usada para rolar o destaque para cima dela. */
const MOBILE_SHEET_ESTIMATE = 250

function useViewport() {
  const [viewport, setViewport] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', update)
    window.visualViewport?.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('resize', update)
    }
  }, [])
  return viewport
}

const isTyping = (element: EventTarget | null) =>
  element instanceof HTMLElement &&
  (element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName))

/** Camada do tutorial: escurece a tela, destaca o elemento e mostra a caixa explicativa. */
export function TourOverlay() {
  const tour = useTour()
  if (!tour.active) return null
  return createPortal(<OverlayContent />, document.body)
}

function Progress({ etapa }: { etapa: number }) {
  return (
    <div
      className="mt-2 flex gap-1"
      role="progressbar"
      aria-label="Progresso do tutorial"
      aria-valuemin={1}
      aria-valuemax={TOTAL_ETAPAS}
      aria-valuenow={etapa}
    >
      {Array.from({ length: TOTAL_ETAPAS }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 flex-1 rounded-full',
            i < etapa - 1 && 'bg-pc-green-mid',
            i === etapa - 1 && 'bg-pc-tan',
            i > etapa - 1 && 'bg-[#e6e2d6]',
          )}
        />
      ))}
    </div>
  )
}

function NextButton({ tour, onActivate, compact = false }: { tour: TourValue; onActivate: () => void; compact?: boolean }) {
  const done = tour.canProceed
  return (
    <button
      type="button"
      aria-disabled={!done}
      title={done ? undefined : 'Conclua a ação destacada para continuar'}
      onClick={() => {
        onActivate()
        tour.next()
      }}
      className={cn(
        'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full font-spartan text-[15px] font-semibold transition-colors',
        compact ? 'px-3.5' : 'px-4',
        done ? 'bg-pc-green text-pc-cream hover:bg-pc-green-2' : 'bg-[#e9e5da] text-[#8b867a]',
      )}
    >
      {tour.isLast ? 'Concluir' : 'Próximo'}
      {!tour.isLast && <ArrowRight size={16} aria-hidden="true" />}
    </button>
  )
}

function OverlayContent() {
  const tour = useTour()
  const { step, index, startedAt } = tour
  const { pathname } = useLocation()
  const presentationMode = useDemoStore((state) => state.presentationMode)
  const shortcutLabel = useDemoStore((state) => step.shortcut?.label({ state, pathname, startedAt }))
  const viewport = useViewport()
  const mobile = viewport.w < MOBILE_BREAKPOINT
  const topInset = presentationMode ? 74 : 40
  const stepKey = `${index}:${startedAt}`
  const rect = useTargetRect(step.target, stepKey, {
    top: topInset,
    bottom: mobile ? MOBILE_SHEET_ESTIMATE : 0,
    align: mobile ? 'top' : 'center',
  })

  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [cardHeight, setCardHeight] = useState(260)
  const [nudging, setNudging] = useState(false)
  const [nudgedKey, setNudgedKey] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [missing, setMissing] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const focusCardRef = useRef(false)
  const lastPositionRef = useRef<CardPosition | null>(null)

  const hole = rect ? inflate(rect, HOLE_PADDING, viewport) : null
  const placed = placeCard({ hole, cardHeight, viewport, topInset, preferred: step.placement, mobile })
  // Enquanto o elemento da etapa ainda está surgindo (troca de tela), a caixa fica onde estava.
  const waiting = !rect && !missing
  const position = waiting && lastPositionRef.current ? lastPositionRef.current : placed
  const hidden = waiting && !lastPositionRef.current

  useEffect(() => {
    if (rect) lastPositionRef.current = placed
  })

  useEffect(() => {
    if (rect) {
      setMissing(false)
      return
    }
    const timer = window.setTimeout(() => setMissing(true), 900)
    return () => window.clearTimeout(timer)
  }, [rect, stepKey])

  useLayoutEffect(() => {
    const height = cardRef.current?.offsetHeight
    if (height && Math.abs(height - cardHeight) > 1) setCardHeight(height)
  })

  // Cada etapa começa com a caixa aberta — exceto, no celular, as etapas de leitura.
  useEffect(() => {
    setCollapsed(mobile && Boolean(step.mobileStartCollapsed))
    // Só ao entrar na etapa: girar o aparelho no meio da etapa não deve reabrir a caixa.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey])

  // No celular, um espaço extra no fim da página permite rolar qualquer destaque para cima da
  // caixa do tutorial (inclusive os que ficam no fim da página, como o formulário).
  useEffect(() => {
    if (!mobile) return
    const previous = document.body.style.paddingBottom
    document.body.style.paddingBottom = '45vh'
    return () => {
      document.body.style.paddingBottom = previous
    }
  }, [mobile])

  // No celular, a caixa se recolhe enquanto a pessoa digita (teclado virtual aberto).
  // Ao sair do campo, volta a abrir — menos nas etapas que já começam minimizadas.
  const startsCollapsedRef = useRef(false)
  useLayoutEffect(() => {
    startsCollapsedRef.current = Boolean(step.mobileStartCollapsed)
  }, [step])

  useEffect(() => {
    if (!mobile) return
    let timer = 0
    const isPageField = (element: EventTarget | null) => isTyping(element) && !cardRef.current?.contains(element as Node)
    const onFocusIn = (event: FocusEvent) => {
      if (!isPageField(event.target)) return
      window.clearTimeout(timer)
      setCollapsed(true)
    }
    const onFocusOut = (event: FocusEvent) => {
      if (!isPageField(event.target)) return
      window.clearTimeout(timer)
      // Espera o toque terminar (por exemplo, em "Enviar Relato") antes de reabrir a caixa.
      timer = window.setTimeout(() => {
        if (!isPageField(document.activeElement) && !startsCollapsedRef.current) setCollapsed(false)
      }, 450)
    }
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [mobile])

  // Anuncia a etapa para leitores de tela e devolve o foco à caixa quando necessário.
  useEffect(() => {
    setAnnouncement(`Etapa ${step.etapa} de ${TOTAL_ETAPAS}: ${step.title}. ${step.body}`)
    const active = document.activeElement
    if (focusCardRef.current || !active || active === document.body) {
      focusCardRef.current = false
      requestAnimationFrame(() => titleRef.current?.focus({ preventScroll: true }))
    }
  }, [stepKey, step])

  useEffect(() => {
    if (tour.autoAdvancing) setAnnouncement('Feito! Avançando para a próxima etapa.')
  }, [tour.autoAdvancing])

  useEffect(() => {
    if (tour.nudgeCount === 0) return
    setNudging(true)
    setNudgedKey(stepKey)
    setCollapsed(false)
    setAnnouncement(step.task ? `Antes de continuar: ${step.task.hint}` : '')
    const timer = window.setTimeout(() => setNudging(false), 450)
    return () => window.clearTimeout(timer)
    // Só reage a novos "empurrões" (nudge), não à troca de etapa.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.nudgeCount])

  // Atalhos de teclado: Esc sai; no modo apresentação, ← e → navegam.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector('dialog[open]')) return
      if (event.key === 'Escape') {
        tour.stop()
        return
      }
      if (!presentationMode || isTyping(event.target) || event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        focusCardRef.current = true
        tour.next()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        focusCardRef.current = true
        tour.back()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [presentationMode, tour])

  const maskPath = `M0 0H${viewport.w}V${viewport.h}H0Z${hole ? roundedRectPath(hole, 12) : ''}`
  const done = tour.canProceed
  const showHint = !done && nudgedKey === stepKey
  const text = mobile
    ? done && step.mobileDoneBody
      ? step.mobileDoneBody
      : step.mobileBody
    : done && step.doneBody
      ? step.doneBody
      : step.body
  const markFocus = () => {
    focusCardRef.current = true
  }

  // No celular, a caixa vira uma faixa inferior (ou superior, se o destaque estiver embaixo).
  const holeCenter = hole ? hole.top + hole.height / 2 : 0
  const mobileAtTop = mobile && hole !== null && holeCenter > viewport.h * 0.62
  const mobileStyle = mobileAtTop
    ? { top: topInset + 8 }
    : { bottom: 'max(8px, env(safe-area-inset-bottom))' }

  const borderTone = cn(
    step.kind === 'existente' && 'border-pc-green-mid',
    step.kind === 'proposta' && 'border-pa-button',
    step.kind === 'simulacao' && 'border-pc-tan',
  )

  return (
    <>
      <svg
        className="pointer-events-none fixed inset-0 z-[60]"
        width={viewport.w}
        height={viewport.h}
        aria-hidden="true"
      >
        <path
          d={maskPath}
          fillRule="evenodd"
          fill="rgb(18 13 28 / 0.58)"
          style={{ pointerEvents: 'auto' }}
          onClick={tour.nudge}
        />
      </svg>

      {hole && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-[61] rounded-[12px] border-[3px] border-pc-tan animate-pulse-ring"
          style={{ top: hole.top, left: hole.left, width: hole.width, height: hole.height }}
        />
      )}

      {mobile ? (
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby="tour-titulo"
          aria-describedby="tour-texto"
          className={cn(
            'fixed inset-x-2 z-[70] overflow-y-auto rounded-2xl border-t-[5px] bg-white text-pc-ink shadow-[0_-6px_30px_rgb(10_8_20/0.35)]',
            borderTone,
            nudging && 'animate-nudge',
          )}
          style={{ ...mobileStyle, maxHeight: `calc(100dvh - ${topInset + 24}px)`, opacity: hidden ? 0 : 1 }}
        >
          {collapsed ? (
            <div className="flex items-center gap-2 py-1.5 pl-1.5 pr-2">
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                aria-expanded="false"
                aria-label={`Mostrar instruções da etapa ${step.etapa}: ${step.title}`}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-1.5 text-left hover:bg-pc-cream"
              >
                <ChevronUp size={20} className="shrink-0 text-pc-green-mid" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block font-spartan text-[11.5px] font-semibold uppercase tracking-[0.08em] text-pc-green-mid">
                    Etapa {step.etapa} de {TOTAL_ETAPAS}
                  </span>
                  <span id="tour-titulo" className="block truncate font-spartan text-[15.5px] font-bold text-pc-green">
                    {step.title}
                  </span>
                </span>
              </button>
              <span id="tour-texto" className="sr-only">
                {text}
              </span>
              {done && <NextButton tour={tour} onActivate={markFocus} compact />}
            </div>
          ) : (
            <div className="px-4 pb-3 pt-2.5">
              <div className="flex items-center gap-2">
                <p className="font-spartan text-[12px] font-semibold uppercase tracking-[0.09em] text-pc-green-mid">
                  Etapa {step.etapa} de {TOTAL_ETAPAS}
                </p>
                <KindTag kind={step.kind} />
                <button
                  type="button"
                  onClick={() => setCollapsed(true)}
                  aria-label="Minimizar instruções"
                  aria-expanded="true"
                  className="-mr-1 ml-auto grid size-9 place-items-center rounded-full text-[#6b6b6b] hover:bg-black/5"
                >
                  <ChevronDown size={20} />
                </button>
              </div>
              <Progress etapa={step.etapa} />
              <h2
                id="tour-titulo"
                ref={titleRef}
                tabIndex={-1}
                className="mt-2.5 font-spartan text-[18.5px] font-bold leading-tight text-pc-green outline-none"
              >
                {step.title}
              </h2>
              <p id="tour-texto" className="mt-1 font-roboto text-[14.5px] leading-snug text-[#38403c]">
                {text}
              </p>

              {missing && (
                <p className="mt-2 rounded-lg bg-pc-tan-soft px-3 py-2 font-roboto text-[13px] text-[#5b4527]">
                  Esta etapa está em outra tela.{' '}
                  <button type="button" className="font-medium underline" onClick={tour.resume}>
                    Ir para a etapa
                  </button>
                </p>
              )}
              {step.task && done && (
                <p className="mt-2 flex items-center gap-1.5 font-roboto text-[13.5px] font-medium text-pa-success">
                  <Check size={16} aria-hidden="true" />
                  {tour.autoAdvancing ? 'Feito! Avançando…' : 'Feito!'}
                </p>
              )}
              {showHint && step.task && (
                <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-pc-tan-soft px-2.5 py-1.5 font-roboto text-[13px] font-medium text-[#7a4f18]">
                  <MousePointerClick size={15} aria-hidden="true" />
                  {step.task.hint}
                </p>
              )}
              {step.shortcut && !done && shortcutLabel && (
                <button
                  type="button"
                  onClick={() => step.shortcut?.run(tour.api)}
                  className="mt-1.5 inline-flex min-h-[32px] items-center gap-1.5 rounded-md font-roboto text-[13px] text-[#6b5a45] underline decoration-dotted underline-offset-2"
                >
                  <Wand size={14} aria-hidden="true" />
                  {shortcutLabel}
                </button>
              )}

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => tour.stop()}
                  className="min-h-[40px] rounded-md px-1 font-roboto text-[13.5px] text-[#6b6b6b]"
                >
                  Sair
                </button>
                <div className="ml-auto flex gap-2">
                  {!tour.isFirst && (
                    <button
                      type="button"
                      aria-label="Voltar para a etapa anterior"
                      onClick={() => {
                        markFocus()
                        tour.back()
                      }}
                      className="grid size-10 place-items-center rounded-full border border-[#d6d0c2] text-pc-green"
                    >
                      <ArrowLeft size={17} aria-hidden="true" />
                    </button>
                  )}
                  <NextButton tour={tour} onActivate={markFocus} />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby="tour-titulo"
          aria-describedby="tour-texto"
          className={cn(
            'fixed z-[70] overflow-y-auto rounded-2xl border-t-[5px] bg-white p-5 text-pc-ink shadow-[0_18px_50px_rgb(10_8_20/0.38)] transition-[top,left] duration-200',
            borderTone,
            nudging && 'animate-nudge',
          )}
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            maxHeight: `calc(100dvh - ${topInset + 24}px)`,
            opacity: hidden ? 0 : 1,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-spartan text-[12.5px] font-semibold uppercase tracking-[0.09em] text-pc-green-mid">
              Etapa {step.etapa} de {TOTAL_ETAPAS}
            </p>
            <KindTag kind={step.kind} />
          </div>
          <Progress etapa={step.etapa} />

          <h2
            id="tour-titulo"
            ref={titleRef}
            tabIndex={-1}
            className="mt-3 font-spartan text-[21px] font-bold leading-tight text-pc-green outline-none"
          >
            {step.title}
          </h2>
          <p id="tour-texto" className="mt-2 font-roboto text-[15px] leading-relaxed text-[#38403c]">
            {text}
          </p>

          {missing && (
            <div className="mt-3 rounded-lg bg-pc-tan-soft px-3 py-2 font-roboto text-[13.5px] text-[#5b4527]">
              Esta etapa acontece em outra parte da demonstração.{' '}
              <button type="button" className="font-medium underline" onClick={tour.resume}>
                Ir para a etapa
              </button>
            </div>
          )}

          {step.task && (
            <div
              className={cn(
                'mt-3 flex items-center gap-2 rounded-lg px-3 py-2 font-roboto text-[13.5px] font-medium',
                done ? 'bg-[#e8f3e9] text-pa-success' : 'bg-pc-tan-soft text-[#7a4f18]',
              )}
            >
              {done ? <Check size={17} aria-hidden="true" /> : <MousePointerClick size={17} aria-hidden="true" />}
              <span>
                {done
                  ? tour.autoAdvancing
                    ? 'Feito! Avançando…'
                    : 'Feito! Toque em “Próximo” para continuar.'
                  : step.task.hint}
              </span>
            </div>
          )}

          {step.shortcut && !done && shortcutLabel && (
            <button
              type="button"
              onClick={() => step.shortcut?.run(tour.api)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 font-roboto text-[13px] text-[#6b5a45] underline decoration-dotted underline-offset-2 hover:text-pc-green"
            >
              <Wand size={14} aria-hidden="true" />
              {shortcutLabel}
            </button>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => tour.stop()}
              className="rounded-md px-1 py-1 font-roboto text-[13.5px] text-[#6b6b6b] underline-offset-2 hover:text-pc-ink hover:underline"
            >
              Sair do tutorial
            </button>
            <div className="ml-auto flex gap-2">
              {!tour.isFirst && (
                <button
                  type="button"
                  onClick={() => {
                    markFocus()
                    tour.back()
                  }}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#d6d0c2] px-3.5 font-spartan text-[15px] font-semibold text-pc-green hover:bg-pc-cream"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Voltar
                </button>
              )}
              <NextButton tour={tour} onActivate={markFocus} />
            </div>
          </div>

          {presentationMode && (
            <p className="mt-3 font-roboto text-[11.5px] text-[#8a8478]">Atalhos: ← voltar · → próximo · Esc sair</p>
          )}
        </div>
      )}

      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
    </>
  )
}
