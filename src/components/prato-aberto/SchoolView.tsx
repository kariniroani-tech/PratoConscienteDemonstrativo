import { ArrowLeft } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { ROUTES } from '../../data/constants'
import { findEscola } from '../../data/escolas'
import { AnnotationBadge } from '../demo/AnnotationBadge'
import { Calendar } from './Calendar'
import { MenuPanel } from './MenuPanel'

/** Página da escola: cabeçalho + calendário à esquerda, cardápio à direita (slides 13 a 15). */
export function SchoolView() {
  const { codigo } = useParams()
  const navigate = useNavigate()
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
        <div className="pa-purple-header relative h-[150px] md:h-[215px]">
          <button
            type="button"
            onClick={() => navigate(ROUTES.search)}
            aria-label="Voltar para a busca de escolas"
            className="absolute left-1.5 top-1.5 grid size-10 place-items-center rounded-full text-white hover:bg-white/10"
          >
            <ArrowLeft size={24} strokeWidth={2} />
          </button>
          <h1 className="absolute bottom-[30px] left-3 right-3 font-roboto text-[19px] font-bold uppercase leading-tight text-white drop-shadow-sm md:bottom-[40px]">
            {escola.nome}
          </h1>
        </div>
        <Calendar />
      </aside>
      <div className="relative min-w-0 flex-1 bg-white md:min-h-[calc(100dvh-var(--shell-top))]">
        <MenuPanel escola={escola} />
      </div>
    </div>
  )
}
