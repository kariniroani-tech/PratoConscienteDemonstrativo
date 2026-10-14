import { ArrowLeft, ArrowRight, MessageSquareText, Play, UtensilsCrossed } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import logo from '../assets/logo-prato-consciente.webp'
import { AnnotationBadge } from '../components/demo/AnnotationBadge'
import { KindTag } from '../components/demo/KindTag'
import { HorizontalBars, LineWithAnnotation, StatTile } from '../components/gestao/charts'
import { DEMO_SCHOOL_CODE, ROUTES } from '../data/constants'
import { ETAPAS_FLUXO, EXEMPLO_ACAO, IMPLEMENTACAO, PAINEL_FICTICIO } from '../data/gestao'
import { cn } from '../lib/cn'
import { formatBR } from '../lib/dates'
import { selectLastRelato, useDemoStore } from '../store/demoStore'
import { useTour } from '../tour/TourContext'

/** "Da escuta à ação" — SIMULAÇÃO do fluxo futuro descrito nos slides 16 e 17. */
export function GestaoPage() {
  const navigate = useNavigate()
  const tour = useTour()
  const flowStep = useDemoStore((state) => state.flowStep)
  const setFlowStep = useDemoStore((state) => state.setFlowStep)
  const relatos = useDemoStore((state) => state.relatos)
  const lastRelato = useDemoStore(selectLastRelato)
  const resetSimulation = useDemoStore((state) => state.resetSimulation)
  const chipsRef = useRef<HTMLOListElement>(null)
  const etapa = ETAPAS_FLUXO[flowStep]

  // Celular: mantém a etapa escolhida visível na faixa rolável (sem mexer na rolagem da página).
  useEffect(() => {
    const list = chipsRef.current
    const chip = list?.children[flowStep] as HTMLElement | undefined
    if (!list || !chip || list.offsetParent === null) return
    list.scrollTo({ left: Math.max(chip.offsetLeft - 16, 0), behavior: 'smooth' })
  }, [flowStep])

  return (
    <div className="bg-pc-cream text-pc-ink">
      {/* Fluxo proposto — slide 16 */}
      <section className="relative bg-pc-purple text-pc-cream" aria-labelledby="titulo-gestao" data-annot="simulacao">
        <AnnotationBadge kind="simulacao" />
        <div className="mx-auto max-w-[1240px] px-4 pb-10 pt-7 sm:px-8 sm:pb-12 sm:pt-12">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="font-spartan text-[13px] font-semibold uppercase tracking-[0.12em] text-pc-sage">
              Fluxo proposto
            </p>
            <KindTag kind="simulacao">Simulação de um fluxo futuro</KindTag>
          </div>
          <h1 id="titulo-gestao" className="mt-3 font-anton text-[38px] leading-[1.05] text-pc-cream sm:text-[58px]">
            Da escuta à ação
          </h1>
          <div className="mt-3 h-1.5 w-28 rounded-full bg-pc-green-mid sm:mt-4 sm:w-32" aria-hidden="true" />
          <p className="mt-4 max-w-[760px] font-spartan text-[17px] font-light leading-snug text-pc-cream/90 sm:mt-5 sm:text-[21px]">
            Como os relatos das famílias poderiam apoiar a gestão pública da alimentação escolar. Este módulo não existe
            no Prato Aberto: é uma ilustração da proposta.
          </p>

          {lastRelato && (
            <div className="mt-6 flex max-w-[760px] gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <MessageSquareText size={22} className="mt-0.5 shrink-0 text-pc-sage" aria-hidden="true" />
              <div className="min-w-0 font-roboto text-[14.5px] leading-relaxed">
                <p className="font-medium text-white">
                  Seu relato simulado ({lastRelato.classe} · cardápio de {formatBR(lastRelato.data)}) seria a etapa 1
                  deste fluxo.
                </p>
                <p className="mt-1 line-clamp-2 text-pc-cream/80">“{lastRelato.texto}”</p>
              </div>
            </div>
          )}

          <div data-tour="gestao-fluxo" className="mt-7 sm:mt-9">
            {/* Celular: as seis etapas viram uma faixa rolável na horizontal. */}
            <ol
              ref={chipsRef}
              className="relative -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-3 scrollbar-thin sm:hidden"
              aria-label="Etapas do fluxo"
            >
              {ETAPAS_FLUXO.map((item, index) => {
                const selected = index === flowStep
                return (
                  <li key={item.id} className="shrink-0 snap-start">
                    <button
                      type="button"
                      aria-pressed={selected}
                      aria-controls="fluxo-detalhe"
                      onClick={() => setFlowStep(index)}
                      className={cn(
                        'flex min-h-[72px] w-[138px] flex-col justify-center rounded-2xl px-3 py-2 text-left transition-colors',
                        selected ? 'bg-pc-cream ring-[3px] ring-pc-tan' : 'bg-white',
                      )}
                    >
                      <span className="font-spartan text-[11.5px] font-semibold text-[#9a7a4f]">
                        {index + 1} de {ETAPAS_FLUXO.length}
                      </span>
                      <span className="font-spartan text-[16.5px] font-bold leading-tight text-pc-green">{item.titulo}</span>
                      <span className="mt-0.5 font-spartan text-[13px] font-light leading-tight text-pc-ink">
                        {item.subtitulo}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>

            <ol className="hidden gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-6 lg:gap-0" aria-label="Etapas do fluxo">
              {ETAPAS_FLUXO.map((item, index) => {
                const selected = index === flowStep
                return (
                  <li key={item.id} className="relative lg:px-[11px]">
                    <button
                      type="button"
                      aria-pressed={selected}
                      aria-controls="fluxo-detalhe"
                      onClick={() => setFlowStep(index)}
                      className={cn(
                        'flex size-full min-h-[132px] flex-col items-center justify-center rounded-[28px] bg-white px-3 py-5 text-center transition-[transform,box-shadow] duration-200 lg:min-h-[170px]',
                        selected
                          ? '-translate-y-1 shadow-[0_14px_30px_rgb(10_6_20/0.35)] ring-4 ring-pc-tan'
                          : 'hover:-translate-y-0.5 hover:shadow-lg',
                      )}
                    >
                      <span className="font-spartan text-[12px] font-semibold text-[#9a7a4f]">{index + 1}</span>
                      <span
                        className={cn(
                          'mt-1 font-spartan font-bold leading-tight text-pc-green',
                          item.titulo.length > 10 ? 'text-[17px] xl:text-[18px]' : 'text-[20px] xl:text-[22px]',
                        )}
                      >
                        {item.titulo}
                      </span>
                      <span className="mt-2 font-spartan text-[15.5px] font-light leading-snug text-pc-ink">
                        {item.subtitulo}
                      </span>
                    </button>
                    {index < ETAPAS_FLUXO.length - 1 && (
                      <ArrowRight
                        size={20}
                        className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-pc-tan lg:block"
                        aria-hidden="true"
                      />
                    )}
                  </li>
                )
              })}
            </ol>

            <div
              id="fluxo-detalhe"
              aria-live="polite"
              className="mt-3 grid gap-4 rounded-[24px] bg-pc-cream p-4 text-pc-ink sm:mt-6 sm:gap-5 sm:rounded-[28px] sm:p-7 lg:grid-cols-[1.5fr_1fr]"
            >
              <div>
                <p className="font-spartan text-[12.5px] font-semibold uppercase tracking-[0.1em] text-pc-green-mid sm:text-[13px]">
                  Etapa {flowStep + 1} de {ETAPAS_FLUXO.length}
                </p>
                <h2 className="mt-1.5 font-spartan text-[22px] font-bold leading-tight text-pc-green sm:text-[26px]">
                  {etapa.titulo} <span className="font-light">{etapa.subtitulo}</span>
                </h2>
                <p className="mt-2.5 font-roboto text-[15px] leading-relaxed text-[#3d4441] sm:mt-3 sm:text-[16px]">
                  {etapa.explicacao}
                </p>
                {flowStep === 0 && lastRelato && (
                  <p className="mt-3 rounded-xl bg-white px-4 py-3 font-roboto text-[14px] text-[#3d4441]">
                    Na simulação, {relatos.length === 1 ? 'há 1 relato seu' : `há ${relatos.length} relatos seus`}{' '}
                    guardado{relatos.length === 1 ? '' : 's'} apenas neste navegador.
                  </p>
                )}
                <div className="mt-4 flex gap-2 sm:mt-5">
                  <button
                    type="button"
                    onClick={() => setFlowStep(Math.max(flowStep - 1, 0))}
                    disabled={flowStep === 0}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#d6d0c2] px-4 font-spartan text-[15px] font-semibold text-pc-green hover:bg-white disabled:opacity-40 sm:h-10 sm:flex-none"
                  >
                    <ArrowLeft size={16} aria-hidden="true" />
                    <span className="sm:hidden">Anterior</span>
                    <span className="hidden sm:inline">Etapa anterior</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowStep(Math.min(flowStep + 1, ETAPAS_FLUXO.length - 1))}
                    disabled={flowStep === ETAPAS_FLUXO.length - 1}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-pc-green px-4 font-spartan text-[15px] font-semibold text-pc-cream hover:bg-pc-green-2 disabled:opacity-40 sm:h-10 sm:flex-none"
                  >
                    <span className="sm:hidden">Próxima</span>
                    <span className="hidden sm:inline">Próxima etapa</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 sm:p-5">
                <p className="font-spartan text-[12.5px] font-semibold uppercase tracking-[0.1em] text-pc-purple sm:text-[13px]">
                  No exemplo abaixo
                </p>
                <p className="mt-1.5 font-spartan text-[17px] font-light leading-snug sm:mt-2 sm:text-[19px]">
                  {etapa.noExemplo}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 rounded-[24px] bg-pc-soft px-5 py-4 text-center font-spartan text-[17px] font-bold leading-snug text-pc-green sm:mt-8 sm:px-6 sm:py-5 sm:text-[23px]">
            O feedback não termina no formulário: ele pode voltar ao serviço em forma de ação
          </p>
        </div>
      </section>

      {/* Exemplo — slide 17 */}
      <section className="mx-auto max-w-[1240px] px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="titulo-exemplo">
        <p className="font-spartan text-[13px] font-semibold uppercase tracking-[0.12em] text-pc-green-mid">
          Aplicação possível
        </p>
        <h2 id="titulo-exemplo" className="mt-3 font-anton text-[34px] leading-tight text-pc-green sm:text-[46px]">
          Da informação à ação: um exemplo
        </h2>
        <div className="mt-4 h-1.5 w-32 rounded-full bg-pc-purple" aria-hidden="true" />
        <ol className="mt-10 space-y-4">
          {EXEMPLO_ACAO.map((linha) => (
            <li key={linha.rotulo} className="grid items-center gap-2 sm:grid-cols-[230px_1fr] sm:gap-9">
              <span
                className={cn(
                  'flex h-11 w-fit items-center justify-center rounded-xl px-5 font-spartan text-[15px] font-bold uppercase tracking-[0.06em] text-white sm:h-[70px] sm:w-auto sm:rounded-2xl sm:text-[19px]',
                  linha.cor === 'verde' ? 'bg-pc-green-2' : 'bg-pc-purple',
                )}
              >
                {linha.rotulo}
              </span>
              <p className="font-spartan text-[18px] font-light leading-snug sm:text-[25px]">{linha.texto}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 font-roboto text-[14px] italic text-[#6b716e]">
          São hipóteses a investigar — não conclusões antecipadas. Um relato não é um diagnóstico sobre a criança.
        </p>
      </section>

      {/* Painel demonstrativo — dados fictícios */}
      <section className="relative bg-white" aria-labelledby="titulo-painel" data-annot="simulacao">
        <AnnotationBadge kind="simulacao" />
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="titulo-painel" className="font-anton text-[30px] leading-tight text-pc-green sm:text-[40px]">
              Painel demonstrativo
            </h2>
            <KindTag kind="simulacao">Dados fictícios</KindTag>
          </div>
          <p className="mt-3 max-w-[820px] font-roboto text-[15.5px] leading-relaxed text-[#4a524e]">
            Uma ideia de como a gestão poderia ler os relatos depois de sistematizados. <strong className="font-medium">
            Todos os números são inventados</strong> para ilustrar a proposta — não são estatísticas oficiais nem
            resultados de escolas.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 lg:grid-cols-4">
            <StatTile label="Relatos recebidos" value={String(PAINEL_FICTICIO.relatosRecebidos)} note="Valor fictício" />
            <StatTile label="Unidades no piloto" value={String(PAINEL_FICTICIO.unidadesNoPiloto)} note="Valor fictício" />
            <StatTile label="Classes com relatos" value={String(PAINEL_FICTICIO.classesComRelatos)} note="Valor fictício" />
            <StatTile
              label="Seus relatos nesta simulação"
              value={String(relatos.length)}
              note="Guardados só neste navegador"
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <figure className="rounded-[24px] border border-[#ece8dc] p-5 sm:p-6">
              <figcaption>
                <p className="font-spartan text-[19px] font-bold text-pc-green">Possíveis motivos nos relatos</p>
                <p className="mt-1 font-roboto text-[13.5px] text-[#5b625e]">
                  Número de relatos por motivo após a sistematização (fictício). Os motivos são as hipóteses da proposta.
                </p>
              </figcaption>
              <div className="mt-6">
                <HorizontalBars data={PAINEL_FICTICIO.motivos} unit="relatos" tableId="tabela-motivos" />
              </div>
            </figure>
            <figure className="rounded-[24px] border border-[#ece8dc] p-5 sm:p-6">
              <figcaption>
                <p className="font-spartan text-[19px] font-bold text-pc-green">Aceitabilidade da “Preparação A”</p>
                <p className="mt-1 font-roboto text-[13.5px] text-[#5b625e]">
                  Percentual de aceitação mês a mês, antes e depois de uma ação de EAN (fictício).
                </p>
              </figcaption>
              <div className="mt-4">
                <LineWithAnnotation
                  data={PAINEL_FICTICIO.aceitabilidade}
                  annotationAfter={PAINEL_FICTICIO.acaoDepoisDoIndice}
                  annotationLabel="Ação de EAN"
                  domain={[40, 90]}
                  tableId="tabela-aceitabilidade"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* Implementação gradual — slide 19 */}
      <section className="mx-auto max-w-[1240px] px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="titulo-implementacao">
        <p className="font-spartan text-[13px] font-semibold uppercase tracking-[0.12em] text-pc-green-mid">
          Implementação gradual
        </p>
        <h2 id="titulo-implementacao" className="mt-3 font-anton text-[34px] leading-tight text-pc-green sm:text-[46px]">
          Como tirar a proposta do papel?
        </h2>
        <div className="mt-4 h-1.5 w-32 rounded-full bg-pc-purple" aria-hidden="true" />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {IMPLEMENTACAO.map((item) => (
            <li key={item.numero} className="rounded-[28px] bg-white px-6 py-7">
              <p className="font-spartan text-[17px] font-bold text-pc-purple">{item.numero}</p>
              <p className="mt-3 font-spartan text-[23px] font-bold uppercase text-pc-green">{item.titulo}</p>
              <p className="mt-3 font-spartan text-[18px] font-light leading-snug">{item.texto}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-center font-spartan text-[20px] font-bold text-pc-green sm:text-[24px]">
          Uma inovação que aproveita o que já funciona, com validação e ajustes
        </p>
      </section>

      {/* Encerramento — slide 20 */}
      <section className="bg-pc-purple text-pc-cream" aria-labelledby="titulo-final">
        {/* pb-28 no celular: folga para o botão flutuante de ajuda. */}
        <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-4 pb-28 pt-14 sm:px-8 sm:py-20 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 id="titulo-final" className="font-anton text-[34px] leading-[1.1] text-white sm:text-[48px]">
              Para entender o que sobra e por que isso acontece, precisamos ouvir.
            </h2>
            <div className="mt-5 h-1.5 w-32 rounded-full bg-pc-sage" aria-hidden="true" />
            <p className="mt-6 font-spartan text-[21px] font-semibold italic leading-snug text-pc-sage sm:text-[25px]">
              “O que você tem a me dizer para que eu possa fazer melhor?”
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  resetSimulation()
                  tour.start()
                }}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-pc-cream px-5 font-spartan text-[16px] font-semibold text-pc-green hover:bg-white"
              >
                <Play size={17} fill="currentColor" aria-hidden="true" />
                Refazer a demonstração guiada
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate(ROUTES.school(DEMO_SCHOOL_CODE))
                  window.scrollTo({ top: 0 })
                }}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-pc-cream/70 px-5 font-spartan text-[16px] font-semibold text-pc-cream hover:bg-white/10"
              >
                <UtensilsCrossed size={17} aria-hidden="true" />
                Voltar ao cardápio
              </button>
            </div>
          </div>
          <div className="rounded-[28px] bg-pc-cream p-8">
            <img src={logo} alt="Logotipo do Prato Consciente" className="mx-auto w-full max-w-[360px]" />
            <p className="mt-5 text-center font-spartan text-[15px] font-semibold text-pc-purple">
              Karini Roani · Secretaria Municipal da Educação
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
