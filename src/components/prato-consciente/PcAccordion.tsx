import type { Cardapio } from '../../data/cardapios'
import type { Escola } from '../../data/escolas'
import { formatBR } from '../../lib/dates'
import { useDemoStore } from '../../store/demoStore'
import { AnnotationBadge } from '../demo/AnnotationBadge'
import { KindTag } from '../demo/KindTag'
import { PaAccordion } from '../prato-aberto/PaAccordion'
import { PcConfirmation } from './PcConfirmation'
import { PcForm } from './PcForm'

/**
 * PROPOSTA — painel "Prato Consciente" integrado ao cardápio (slide 15).
 * Segue o mesmo acordeão do Prato Aberto, com um filete roxo e a etiqueta
 * "proposta" para deixar claro que é a nova funcionalidade.
 */
export function PcAccordion({ escola, cardapio }: { escola: Escola; cardapio: Cardapio }) {
  const open = useDemoStore((state) => state.pcOpen)
  const setOpen = useDemoStore((state) => state.setPcOpen)
  const view = useDemoStore((state) => state.pcView)
  const ficticio = cardapio.origem === 'ficticio'

  return (
    <div data-tour="pc-accordion" className="relative border-l-4 border-pa-button" data-annot="proposta">
      <AnnotationBadge kind="proposta" className="right-14 top-3" />
      <PaAccordion
        id="prato-consciente"
        open={open}
        onToggle={() => setOpen(!open)}
        title={
          <>
            Prato Consciente
            <KindTag kind="proposta">Novo · proposta</KindTag>
          </>
        }
        subtitle={
          ficticio
            ? `Relato sobre o cardápio fictício de ${formatBR(cardapio.data)}`
            : `Cardápio publicado em ${cardapio.publicadoEm}`
        }
        bodyClassName="bg-[#e8e7ec] px-3 py-8 sm:px-6 sm:py-12"
      >
        {view === 'confirmation' ? <PcConfirmation /> : <PcForm escola={escola} data={cardapio.data} />}
      </PaAccordion>
    </div>
  )
}
