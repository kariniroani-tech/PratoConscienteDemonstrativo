import { House, Info, RotateCcw, Tags } from 'lucide-react'
import { Link } from 'react-router'
import { DISCLAIMER } from '../../data/constants'
import { cn } from '../../lib/cn'
import { useDemoStore } from '../../store/demoStore'
import { useUiStore } from '../../store/uiStore'
import { Legend } from './Legend'

/** Barra superior da demonstração — fica fora do sistema simulado, com a identidade do Prato Consciente. */
export function DemoBar() {
  const annotations = useDemoStore((state) => state.annotations)
  const setAnnotations = useDemoStore((state) => state.setAnnotations)
  const setResetOpen = useUiStore((state) => state.setResetOpen)
  const setAboutOpen = useUiStore((state) => state.setAboutOpen)

  const iconButton =
    'inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-full px-2 font-spartan text-[13.5px] font-medium text-pc-cream hover:bg-white/10 sm:h-8 sm:px-2.5'

  return (
    <header
      aria-label="Barra da demonstração"
      className="sticky top-0 z-[80] flex h-10 items-center gap-2 bg-pc-green px-2 text-pc-cream shadow-[0_1px_0_rgb(255_255_255/0.06)] sm:gap-3 sm:px-4"
    >
      <Link
        to="/"
        className="flex min-w-0 shrink items-center gap-1.5 rounded-md px-1 py-1 hover:bg-white/10 sm:gap-2"
        title="Tela inicial da demonstração"
      >
        <span className="truncate font-spartan text-[14px] font-bold leading-none tracking-[0.01em] sm:text-[15px]">
          Prato Consciente
        </span>
        <span className="shrink-0 rounded-full bg-pc-tan px-1.5 py-[3px] font-spartan text-[9.5px] font-bold uppercase leading-none tracking-[0.08em] text-pc-green sm:px-2 sm:text-[10.5px]">
          protótipo
        </span>
      </Link>

      <p className="hidden min-w-0 truncate font-roboto text-[12.5px] text-pc-cream/75 2xl:block">{DISCLAIMER}</p>
      <button
        type="button"
        onClick={() => setAboutOpen(true)}
        className={cn(iconButton, '2xl:hidden')}
        aria-label="Sobre esta demonstração"
        title={DISCLAIMER}
      >
        <Info size={16} aria-hidden="true" />
        <span className="hidden md:inline">Sobre a demonstração</span>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2">
        <Legend className="mr-1 hidden lg:flex" />
        <button
          type="button"
          onClick={() => setAnnotations(!annotations)}
          aria-pressed={annotations}
          className={cn(iconButton, 'max-sm:hidden', annotations && 'bg-white/15')}
          title="Destaca na tela o que já existe, o que é proposta e o que é simulação"
        >
          <Tags size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Marcações</span>
        </button>
        <button
          type="button"
          onClick={() => setResetOpen(true)}
          className={iconButton}
          title="Reiniciar a simulação"
          aria-label="Reiniciar a simulação"
        >
          <RotateCcw size={17} aria-hidden="true" />
          <span className="hidden sm:inline">Reiniciar</span>
        </button>
        <Link to="/" className={iconButton} title="Tela inicial da demonstração" aria-label="Tela inicial da demonstração">
          <House size={17} aria-hidden="true" />
          <span className="hidden sm:inline">Início</span>
        </Link>
      </div>
    </header>
  )
}
