import { ArrowLeft, ChevronDown } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { ROUTES } from '../../data/constants'
import { findEscola } from '../../data/escolas'
import { formatBR } from '../../lib/dates'
import { useDemoStore } from '../../store/demoStore'
import { AnnotationBadge } from '../demo/AnnotationBadge'
import { Calendar } from './Calendar'
import { MenuPanel } from './MenuPanel'

/** Página da escola: cabeçalho + calendário à esquerda, cardápio à direita (slides 13 a 15). */
export function SchoolView() {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const selectedDate = useDemoStore((state) => state.selectedDate)
  const escola = findEscola(codigo)

  if (!escola) return <Navigate to={ROUTES.search} replace />

  return (
    <div className="md:flex">
      <aside
        aria-label="Escola selecionada e calendário"
        className="relative bg-white md:sticky md:top-[var(--shell-top)] md:h-[calc(100dvh-var(--shell-top))] md:w-[352px] md:shrink-0 md:overflow-y-auto md:border-r md:border-pa-line md:scrollbar-thin"
        data-annot="existente"
      >
        <AnnotationBadge kind="existente" className="bottom-2 top-auto" />
        <div className="pa-purple-header relative h-[112px] md:h-[215px]">
          <button
            type="button"
            onClick={() => navigate(ROUTES.search)}
            aria-label="Voltar para a busca de escolas"
            className="absolute left-1.5 top-1.5 grid size-11 place-items-center rounded-full text-white hover:bg-white/10"
          >
            <ArrowLeft size={24} strokeWidth={2} />
          </button>
          <h1 className="absolute bottom-[18px] left-3 right-3 font-roboto text-[17px] font-bold uppercase leading-tight text-white drop-shadow-sm md:bottom-[40px] md:text-[19px]">
            {escola.nome}
          </h1>
        </div>
        <Calendar />
        {/* Celular: o cardápio fica abaixo do calendário, então um atalho leva até ele. */}
        <div className="px-4 pb-4 md:hidden">
          <button
            type="button"
            onClick={() =>
              document.querySelector('[data-tour="pa-menu"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full border border-pa-line bg-pa-header font-roboto text-[14.5px] font-medium text-pa-purple-deep"
          >
            Ver o cardápio de {formatBR(selectedDate)}
            <ChevronDown size={18} aria-hidden="true" />
          </button>
        </div>
      </aside>
      {/* pb-24 no celular: folga para o botão flutuante de ajuda não cobrir o fim do conteúdo. */}
      <div className="relative min-w-0 flex-1 bg-white pb-24 md:min-h-[calc(100dvh-var(--shell-top))] md:pb-0">
        <MenuPanel escola={escola} />
      </div>
    </div>
  )
}
