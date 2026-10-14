import { ArrowRight, CircleCheck, Info } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '../../data/constants'
import { formatBR, formatLong, formatTimestamp } from '../../lib/dates'
import { selectLastRelato, useDemoStore } from '../../store/demoStore'
import { KindTag } from '../demo/KindTag'

/** Confirmação do envio SIMULADO do relato (tela 6 da demonstração). */
export function PcConfirmation() {
  const relato = useDemoStore(selectLastRelato)
  const setPcView = useDemoStore((state) => state.setPcView)
  const navigate = useNavigate()
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  if (!relato) {
    return (
      <div className="mx-auto max-w-[560px] rounded-[4px] bg-white p-6 text-center font-roboto text-[14px] text-pa-muted shadow">
        <p>Nenhum relato registrado nesta simulação.</p>
        <button
          type="button"
          onClick={() => setPcView('form')}
          className="mt-3 font-medium text-pa-button underline underline-offset-2"
        >
          Escrever um relato
        </button>
      </div>
    )
  }

  return (
    <div
      data-tour="pc-confirmacao"
      className="mx-auto w-full max-w-[560px] animate-fade-up rounded-[4px] bg-white p-5 font-roboto shadow-[0_1px_4px_rgb(0_0_0/0.18)] sm:p-6"
    >
      <div className="flex items-start gap-3">
        <CircleCheck size={30} className="mt-0.5 shrink-0 text-pa-success" aria-hidden="true" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 ref={headingRef} tabIndex={-1} className="text-[19px] font-medium text-black outline-none">
              Relato registrado!
            </h3>
            <KindTag kind="simulacao">Simulação</KindTag>
          </div>
          <p className="mt-1 text-[14px] text-pa-muted">
            Obrigado por compartilhar a percepção da família sobre a alimentação escolar.
          </p>
        </div>
      </div>

      <p className="mt-4 flex gap-2 rounded-md border border-[#e6cfa9] bg-pc-tan-soft px-3 py-2.5 text-[13.5px] leading-snug text-[#5b4527]">
        <Info size={17} className="mt-px shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-medium">Nenhum relato foi enviado à Prefeitura.</strong> Esta é uma simulação: o texto
          ficou salvo apenas neste navegador.
        </span>
      </p>

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-md bg-pa-header px-4 py-3 text-[14px]">
        <dt className="text-pa-muted">Escola</dt>
        <dd className="font-medium text-black">{relato.escolaNome}</dd>
        <dt className="text-pa-muted">Cardápio</dt>
        <dd className="text-black">
          <span className="sr-only">{formatLong(relato.data)}</span>
          <span aria-hidden="true">{formatBR(relato.data)}</span>
        </dd>
        <dt className="text-pa-muted">Classe</dt>
        <dd className="text-black">{relato.classe}</dd>
        <dt className="text-pa-muted">Relato</dt>
        <dd className="whitespace-pre-line break-words text-black">“{relato.texto}”</dd>
        <dt className="text-pa-muted">Registro</dt>
        <dd className="text-black">{formatTimestamp(relato.criadoEm)}</dd>
      </dl>

      <p className="mt-4 text-[14px] leading-relaxed text-pa-text">
        Na proposta Prato Consciente, relatos como este seriam sistematizados e poderiam produzir dados para análises e
        melhorias — por exemplo, para a CODAE identificar padrões e planejar ações de Educação Alimentar e Nutricional
        (EAN).
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          data-tour="pc-entenda"
          onClick={() => {
            navigate(ROUTES.gestao)
            window.scrollTo({ top: 0 })
          }}
          className="flex h-[42px] items-center justify-center gap-2 rounded-[3px] bg-pa-button px-4 text-[15px] font-medium text-white shadow-sm hover:bg-[#5c1287]"
        >
          Entenda o que acontece com seu relato
          <ArrowRight size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setPcView('form')}
          className="h-[42px] rounded-[3px] px-3 text-[14px] font-medium text-pa-button hover:bg-[#f3e9f8]"
        >
          Enviar outro relato
        </button>
      </div>
    </div>
  )
}
