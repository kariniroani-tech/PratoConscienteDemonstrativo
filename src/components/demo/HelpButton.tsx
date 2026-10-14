import { CircleQuestionMark, House, LogOut, Play, RotateCcw, StepForward, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { cn } from '../../lib/cn'
import { useDemoStore } from '../../store/demoStore'
import { useUiStore } from '../../store/uiStore'
import { useTour } from '../../tour/TourContext'
import { Legend } from './Legend'
import { Switch } from './Switch'

/** Botão flutuante "Ajuda / Tutorial": iniciar, retomar ou sair do tutorial e ajustes da apresentação. */
export function HelpButton() {
  const tour = useTour()
  const navigate = useNavigate()
  const presentationMode = useDemoStore((state) => state.presentationMode)
  const setPresentationMode = useDemoStore((state) => state.setPresentationMode)
  const annotations = useDemoStore((state) => state.annotations)
  const setAnnotations = useDemoStore((state) => state.setAnnotations)
  const setResetOpen = useUiStore((state) => state.setResetOpen)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const run = (action: () => void) => {
    setOpen(false)
    action()
  }

  const item =
    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left font-spartan text-[15px] font-semibold text-pc-ink hover:bg-pc-cream'

  return (
    <div
      ref={containerRef}
      className={cn('fixed bottom-4 right-4 z-[85] sm:bottom-5 sm:right-5', tour.active && 'max-md:hidden')}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Ajuda e tutorial"
          className="absolute bottom-[58px] right-0 w-[min(330px,calc(100vw-32px))] animate-fade-up rounded-2xl bg-white p-2 shadow-[0_18px_50px_rgb(10_8_20/0.3)] ring-1 ring-black/5"
        >
          <div className="flex items-center justify-between px-3 pb-1 pt-2">
            <p className="font-spartan text-[13px] font-semibold uppercase tracking-[0.08em] text-pc-green-mid">
              Ajuda / Tutorial
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar ajuda"
              className="grid size-8 place-items-center rounded-full text-[#6b6b6b] hover:bg-black/5"
            >
              <X size={18} />
            </button>
          </div>
          <ul>
            <li>
              <button type="button" className={item} onClick={() => run(tour.start)}>
                <Play size={18} className="text-pc-green-mid" aria-hidden="true" />
                {tour.active ? 'Reiniciar o tutorial do começo' : 'Iniciar o tutorial guiado'}
              </button>
            </li>
            {tour.canResume && (
              <li>
                <button type="button" className={item} onClick={() => run(tour.resume)}>
                  <StepForward size={18} className="text-pc-green-mid" aria-hidden="true" />
                  Retomar de onde parei
                </button>
              </li>
            )}
            {tour.active && (
              <li>
                <button type="button" className={item} onClick={() => run(() => tour.stop())}>
                  <LogOut size={18} className="text-pc-green-mid" aria-hidden="true" />
                  Sair do tutorial
                </button>
              </li>
            )}
            <li>
              <button type="button" className={item} onClick={() => run(() => setResetOpen(true))}>
                <RotateCcw size={18} className="text-pc-green-mid" aria-hidden="true" />
                Reiniciar a simulação
              </button>
            </li>
            <li>
              <button type="button" className={item} onClick={() => run(() => navigate('/'))}>
                <House size={18} className="text-pc-green-mid" aria-hidden="true" />
                Tela inicial da demonstração
              </button>
            </li>
          </ul>
          <div className="mt-1 space-y-3 border-t border-[#ece8dc] px-3 pb-3 pt-3">
            <Switch
              checked={presentationMode}
              onChange={setPresentationMode}
              label="Modo apresentação"
              description="Mostra o progresso da jornada e atalhos de teclado (← →)."
            />
            <Switch
              checked={annotations}
              onChange={setAnnotations}
              label="Marcações na tela"
              description="Identifica o que já existe, o que é proposta e o que é simulação."
            />
          </div>
          <div className="rounded-xl bg-pc-cream px-3 py-3 text-pc-ink">
            <Legend detailed />
          </div>
        </div>
      )}
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        className="flex h-12 items-center gap-2 rounded-full bg-pc-purple pl-3.5 pr-4 font-spartan text-[15px] font-semibold text-white shadow-[0_10px_28px_rgb(30_15_50/0.35)] hover:bg-[#4d3870]"
      >
        <CircleQuestionMark size={21} aria-hidden="true" />
        Ajuda / Tutorial
      </button>
    </div>
  )
}
