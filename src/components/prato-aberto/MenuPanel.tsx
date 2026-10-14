import { useEffect, useState } from 'react'
import { AVISO_CARDAPIO, getCardapio, type Cardapio, type Refeicao } from '../../data/cardapios'
import { DEMO_DATE } from '../../data/constants'
import type { Escola } from '../../data/escolas'
import { formatBR, formatLong } from '../../lib/dates'
import { useDemoStore } from '../../store/demoStore'
import { AnnotationBadge } from '../demo/AnnotationBadge'
import { DemoNote } from '../demo/DemoNote'
import { KindTag } from '../demo/KindTag'
import { PcAccordion } from '../prato-consciente/PcAccordion'
import { Modal } from '../ui/Modal'
import { MealIcon, SnackIcon } from './icons'
import { NutritionInfo } from './NutritionInfo'
import { PaAccordion } from './PaAccordion'

function MealSection({ refeicao }: { refeicao: Refeicao }) {
  return (
    <div className="border-b-2 border-pa-line px-4 pb-8 pt-9 sm:px-[17px]">
      <div className="flex items-center gap-5">
        {refeicao.tipo === 'lanche' ? <SnackIcon /> : <MealIcon />}
        <h3 className="font-montserrat text-[16px] font-normal text-black sm:text-[17px]">{refeicao.titulo}</h3>
      </div>
      <ul className="mt-7 pl-[47px] sm:pl-[47px]">
        <li className="flex gap-2.5 font-roboto text-[14px] leading-snug text-pa-text">
          <span className="mt-[7px] size-[3px] shrink-0 bg-pa-violet" aria-hidden="true" />
          <span>{refeicao.alimentos}</span>
        </li>
      </ul>
    </div>
  )
}

function MenuSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Carregando cardápio">
      <div className="h-[54px] border-b border-pa-line bg-pa-header px-5 py-3">
        <div className="h-4 w-40 rounded bg-[#e2e1e8]" />
        <div className="mt-2 h-2.5 w-56 rounded bg-[#e2e1e8]" />
      </div>
      <div className="h-24 bg-white" />
    </div>
  )
}

/** Atraso curto ao trocar de data, simulando a consulta ao cardápio publicado. */
function useShownDate(selectedDate: string) {
  const [shown, setShown] = useState(selectedDate)
  useEffect(() => {
    if (shown === selectedDate) return
    const timer = window.setTimeout(() => setShown(selectedDate), 320)
    return () => window.clearTimeout(timer)
  }, [selectedDate, shown])
  return { shown, loading: shown !== selectedDate }
}

export function MenuPanel({ escola }: { escola: Escola }) {
  const selectedDate = useDemoStore((state) => state.selectedDate)
  const menuOpen = useDemoStore((state) => state.menuOpen)
  const setMenuOpen = useDemoStore((state) => state.setMenuOpen)
  const nutritionOpen = useDemoStore((state) => state.nutritionOpen)
  const setNutritionOpen = useDemoStore((state) => state.setNutritionOpen)
  const selectDate = useDemoStore((state) => state.selectDate)
  const [notasOpen, setNotasOpen] = useState(false)
  const { shown, loading } = useShownDate(selectedDate)

  if (loading) return <MenuSkeleton />

  const cardapio: Cardapio | undefined = getCardapio(escola.codigo, shown)

  if (!cardapio) {
    return (
      <div data-tour="pa-menu" className="relative" data-annot="existente">
        <div className="pa-acc-header">
          <div>
            <p className="font-montserrat text-[18px] text-black">Sem cardápio publicado</p>
            <p className="mt-0.5 font-montserrat text-[11.5px] text-[#5a5a5a]">{formatLong(shown)}</p>
          </div>
        </div>
        <div className="space-y-4 bg-pa-body px-5 py-8 font-roboto text-[14px] text-pa-muted">
          <p>Não há cardápio publicado para esta data nesta demonstração.</p>
          <DemoNote label="Dados da demonstração">
            <p>
              O cardápio de <strong>14/10/2026</strong> reproduz a captura da apresentação. Os dias 13, 15 e 16/10 têm
              cardápios fictícios, apenas para navegação.
            </p>
            <button
              type="button"
              onClick={() => selectDate(DEMO_DATE)}
              className="mt-2 font-medium text-pa-button underline underline-offset-2 hover:text-pa-purple-deep"
            >
              Ver o cardápio de 14/10/2026
            </button>
          </DemoNote>
        </div>
      </div>
    )
  }

  const ficticio = cardapio.origem === 'ficticio'

  return (
    <>
      <div data-tour="pa-menu" className="relative" data-annot="existente">
        <AnnotationBadge kind="existente" className="right-14 top-3" />
        <PaAccordion
          id="cardapio"
          open={menuOpen}
          onToggle={() => setMenuOpen(!menuOpen)}
          title={
            <>
              {cardapio.faixa}
              {ficticio && <KindTag kind="simulacao">Cardápio fictício</KindTag>}
            </>
          }
          subtitle={
            ficticio
              ? `Cardápio fictício criado para a demonstração (${formatBR(cardapio.data)})`
              : `Cardápio publicado em ${cardapio.publicadoEm}`
          }
          bodyClassName="bg-pa-body"
        >
          {cardapio.refeicoes.map((refeicao) => (
            <MealSection key={refeicao.titulo} refeicao={refeicao} />
          ))}
          <div className="px-5 pb-4 pt-5 font-roboto text-[14px] leading-relaxed text-pa-muted">
            <p>{AVISO_CARDAPIO}</p>
            <button
              type="button"
              onClick={() => setNotasOpen(true)}
              className="text-pa-blue underline underline-offset-2 hover:text-pa-blue-dark"
            >
              Notas
            </button>
          </div>
        </PaAccordion>
        <div className="border-b border-pa-line bg-white px-5 py-3.5">
          <button
            type="button"
            className="pa-link text-[15px]"
            aria-expanded={nutritionOpen}
            onClick={() => setNutritionOpen(!nutritionOpen)}
          >
            Informações nutricionais
          </button>
        </div>
        {nutritionOpen && <NutritionInfo cardapio={cardapio} onClose={() => setNutritionOpen(false)} />}
      </div>

      <PcAccordion escola={escola} cardapio={cardapio} />

      <Modal open={notasOpen} onClose={() => setNotasOpen(false)} title="Notas do cardápio">
        <p>
          Na captura do Prato Aberto (slide 14), o link <strong>Notas</strong> aparece abaixo do aviso sobre alterações
          no cardápio. O conteúdo das notas não é mostrado na apresentação e, por isso, não foi reproduzido neste
          protótipo.
        </p>
      </Modal>
    </>
  )
}
