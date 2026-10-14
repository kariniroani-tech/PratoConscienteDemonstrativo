import { X } from 'lucide-react'
import type { Cardapio } from '../../data/cardapios'
import { KindTag } from '../demo/KindTag'

/**
 * Conteúdo de "Informações nutricionais". A apresentação mostra apenas o link,
 * então a tabela é um exemplo com valores FICTÍCIOS, identificados como tal.
 */
export function NutritionInfo({ cardapio, onClose }: { cardapio: Cardapio; onClose: () => void }) {
  return (
    <div className="animate-fade-up border-t border-pa-line bg-white px-5 pb-6 pt-4" aria-labelledby="nutri-titulo">
      <div className="flex flex-wrap items-center gap-2">
        <h3 id="nutri-titulo" className="font-montserrat text-[16px] font-medium text-black">
          Informações nutricionais
        </h3>
        <KindTag kind="simulacao">Dados fictícios</KindTag>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar informações nutricionais"
          className="ml-auto grid size-8 place-items-center rounded-full text-pa-muted hover:bg-black/5"
        >
          <X size={18} />
        </button>
      </div>
      <p className="mt-2 max-w-[760px] font-roboto text-[13px] leading-relaxed text-pa-muted">
        A apresentação mostra apenas o link para esta seção; o conteúdo não aparece nos slides. Para ilustrar o
        componente, a tabela abaixo usa <strong className="font-medium text-pa-text">valores inventados</strong>, que
        não correspondem ao cardápio real.
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse font-roboto text-[13.5px] text-pa-text">
          <caption className="sr-only">Valores nutricionais fictícios por refeição</caption>
          <thead>
            <tr className="bg-pa-header text-left text-[12.5px] text-pa-muted">
              <th scope="col" className="px-3 py-2 font-medium">
                Refeição
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium">
                Energia (kcal)
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium">
                Carboidratos (g)
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium">
                Proteínas (g)
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium">
                Lipídios (g)
              </th>
            </tr>
          </thead>
          <tbody>
            {cardapio.nutricional.map((linha) => (
              <tr key={linha.refeicao} className="border-b border-pa-line">
                <th scope="row" className="px-3 py-2 text-left font-normal">
                  {linha.refeicao}
                </th>
                <td className="px-3 py-2 text-right tabular-nums">{linha.energiaKcal}</td>
                <td className="px-3 py-2 text-right tabular-nums">{linha.carboidratosG}</td>
                <td className="px-3 py-2 text-right tabular-nums">{linha.proteinasG}</td>
                <td className="px-3 py-2 text-right tabular-nums">{linha.lipidiosG}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
