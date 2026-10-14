import { ArrowLeftRight, ArrowRight, Compass, Play } from 'lucide-react'
import { useNavigate } from 'react-router'
import capa from '../assets/capa-criancas.webp'
import logo from '../assets/logo-prato-consciente.webp'
import { Legend } from '../components/demo/Legend'
import { Switch } from '../components/demo/Switch'
import { DISCLAIMER, ROUTES } from '../data/constants'
import { useDemoStore } from '../store/demoStore'
import { useTour } from '../tour/TourContext'

const JORNADA = [
  { numero: 1, texto: 'Seleciona a escola', cor: 'bg-pc-purple' },
  { numero: 2, texto: 'Escolhe a data', cor: 'bg-pc-purple' },
  { numero: 3, texto: 'Consulta o cardápio', cor: 'bg-pc-purple' },
  { numero: 4, texto: 'Envia um feedback', cor: 'bg-pc-green-mid' },
]

/** Tela de entrada: explica a demonstração e oferece o tutorial guiado ou a exploração livre. */
export function Landing() {
  const navigate = useNavigate()
  const tour = useTour()
  const presentationMode = useDemoStore((state) => state.presentationMode)
  const setPresentationMode = useDemoStore((state) => state.setPresentationMode)
  const resetSimulation = useDemoStore((state) => state.resetSimulation)
  const resetUi = useDemoStore((state) => state.resetUi)

  const startGuided = () => {
    if (presentationMode) resetSimulation()
    tour.start()
  }

  const exploreFreely = () => {
    if (presentationMode) resetSimulation()
    else resetUi()
    navigate(ROUTES.home)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-dvh bg-pc-cream text-pc-ink">
      {/* Capa — composição do slide 1 */}
      <section className="grid min-h-dvh lg:grid-cols-[minmax(0,47fr)_minmax(0,53fr)]" aria-labelledby="titulo-demo">
        <div className="relative h-56 overflow-hidden sm:h-72 lg:h-auto">
          <img
            src={capa}
            alt="Crianças da educação infantil almoçando no refeitório da escola"
            className="absolute inset-0 size-full object-cover object-[50%_35%]"
          />
        </div>
        <div className="flex items-center justify-center bg-pc-purple px-4 py-8 sm:px-8 lg:py-12">
          <div className="w-full max-w-[640px] rounded-[32px] bg-white px-6 py-8 shadow-[0_24px_60px_rgb(20_10_40/0.35)] sm:rounded-[48px] sm:px-12 sm:py-12">
            <p className="font-spartan text-[13px] font-semibold uppercase tracking-[0.14em] text-pc-green-mid">
              Demonstração interativa · proposta conceitual
            </p>
            <h1 id="titulo-demo" className="mt-4 font-oswald uppercase leading-[0.98] text-pc-green">
              <span className="block text-[52px] font-bold sm:text-[68px]">Prato</span>
              <span className="block text-[52px] font-light tracking-[0.01em] sm:text-[68px]">Consciente</span>
            </h1>
            <div className="mt-6 h-1.5 w-40 rounded-full bg-pc-tan" aria-hidden="true" />
            <p className="mt-6 font-spartan text-[21px] font-light leading-snug text-pc-ink sm:text-[24px]">
              Conectando famílias, estudantes e escolas a fim de diminuir o desperdício alimentar na rede municipal de
              ensino
            </p>
            <p className="mt-5 font-roboto text-[15.5px] leading-relaxed text-[#4a524e]">
              Você vai usar uma reconstrução do <strong className="font-medium">Prato Aberto</strong>, que já existe, e
              ver onde entraria o <strong className="font-medium">Prato Consciente</strong>: um espaço para a família
              compartilhar percepções sobre a alimentação escolar.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={startGuided}
                className="group flex min-h-[54px] flex-1 items-center justify-center gap-2.5 rounded-full bg-pc-green px-6 font-spartan text-[17px] font-semibold text-pc-cream shadow-[0_8px_20px_rgb(23_54_46/0.3)] transition-colors hover:bg-pc-green-2"
              >
                <Play size={19} fill="currentColor" aria-hidden="true" />
                Iniciar demonstração guiada
              </button>
              <button
                type="button"
                onClick={exploreFreely}
                className="flex min-h-[54px] items-center justify-center gap-2 rounded-full border-2 border-pc-green px-6 font-spartan text-[17px] font-semibold text-pc-green transition-colors hover:bg-pc-soft"
              >
                <Compass size={19} aria-hidden="true" />
                Explorar livremente
              </button>
            </div>
            <p className="mt-2.5 text-center font-roboto text-[13px] text-[#6b716e] sm:text-left">
              Recomendado: a demonstração guiada leva de 3 a 5 minutos.
            </p>

            <div className="mt-6 rounded-2xl bg-pc-cream px-4 py-3.5">
              <Switch
                checked={presentationMode}
                onChange={setPresentationMode}
                label="Modo apresentação"
                description="Para apresentações ao vivo: começa sempre com dados de exemplo limpos, mostra o progresso da jornada e permite avançar com as setas do teclado."
              />
            </div>

            <div className="mt-7 border-t border-[#ebe7dc] pt-5 text-center font-spartan text-[14px] font-semibold leading-relaxed text-pc-green">
              <p>São Paulo Plural: Incluindo Pessoas, Transformando o Serviço Público</p>
              <p className="font-medium">Proposta de Karini Roani · Secretaria Municipal da Educação</p>
            </div>
          </div>
        </div>
      </section>

      <p className="border-y border-[#e3dfd2] bg-white px-4 py-3 text-center font-roboto text-[13.5px] text-[#5b625e]">
        {DISCLAIMER} Este protótipo não é um serviço oficial da Prefeitura de São Paulo.
      </p>

      {/* A proposta — slide 9 */}
      <section className="mx-auto max-w-[1180px] px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="titulo-proposta">
        <p className="font-spartan text-[13px] font-semibold uppercase tracking-[0.12em] text-pc-green-mid">
          Prato Consciente
        </p>
        <h2 id="titulo-proposta" className="mt-3 font-anton text-[34px] leading-tight text-pc-green sm:text-[46px]">
          A proposta: ampliação do Prato Aberto
        </h2>
        <div className="mt-4 h-1.5 w-32 rounded-full bg-pc-purple" aria-hidden="true" />

        <div className="mt-10 grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-[28px] bg-white p-7 shadow-sm">
            <h3 className="font-spartan text-[23px] font-bold text-pc-green">Hoje: informar</h3>
            <p className="mt-3 font-spartan text-[18px] font-light leading-snug">
              A família consulta o cardápio e conhece as refeições previstas
            </p>
            <p className="mt-5 font-spartan text-[15px] font-bold uppercase tracking-[0.06em] text-pc-purple">
              Informação
            </p>
          </div>
          <ArrowLeftRight className="mx-auto rotate-90 text-pc-purple md:rotate-0" size={34} aria-hidden="true" />
          <div className="rounded-[28px] bg-white p-7 shadow-sm">
            <h3 className="font-spartan text-[23px] font-bold text-pc-green">Com o Prato Consciente: escutar</h3>
            <p className="mt-3 font-spartan text-[18px] font-light leading-snug">
              Além de consultar, a família poderá compartilhar percepções sobre a alimentação
            </p>
            <p className="mt-5 font-spartan text-[15px] font-bold uppercase tracking-[0.06em] text-pc-purple">
              Escuta + ação
            </p>
          </div>
        </div>
        <p className="mt-8 rounded-[24px] bg-pc-soft px-6 py-6 text-center font-anton text-[20px] italic leading-snug text-pc-green sm:text-[25px]">
          A ideia não é criar uma plataforma do zero, mas ampliar uma ferramenta existente
        </p>
      </section>

      {/* Experiência da família — slide 10 */}
      <section className="bg-white" aria-labelledby="titulo-experiencia">
        <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-8 sm:py-20">
          <p className="font-spartan text-[13px] font-semibold uppercase tracking-[0.12em] text-pc-green-mid">
            Experiência da família
          </p>
          <h2 id="titulo-experiencia" className="mt-3 font-anton text-[34px] leading-tight text-pc-green sm:text-[46px]">
            Como funcionaria na prática?
          </h2>
          <div className="mt-4 h-1.5 w-32 rounded-full bg-pc-purple" aria-hidden="true" />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {JORNADA.map((passo, index) => (
              <li key={passo.numero} className="relative flex items-center gap-4 rounded-[24px] bg-pc-cream px-5 py-6">
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-xl font-spartan text-[22px] font-bold text-white ${passo.cor}`}
                >
                  {passo.numero}
                </span>
                <span className="font-spartan text-[20px] font-bold leading-tight text-pc-green">{passo.texto}</span>
                {index < JORNADA.length - 1 && (
                  <ArrowRight
                    className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-pc-tan lg:block"
                    size={22}
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
          <p className="mt-8 rounded-[24px] bg-pc-soft px-6 py-6 text-center font-anton text-[20px] italic leading-snug text-pc-green sm:text-[25px]">
            Este feedback geraria um dado que posteriormente serviria para gestão de recursos
          </p>
        </div>
      </section>

      {/* Como ler a demonstração */}
      <section className="mx-auto grid max-w-[1180px] gap-10 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_1fr]" aria-labelledby="titulo-leitura">
        <div>
          <h2 id="titulo-leitura" className="font-anton text-[30px] leading-tight text-pc-green sm:text-[38px]">
            Como ler esta demonstração
          </h2>
          <p className="mt-4 font-roboto text-[16px] leading-relaxed text-[#4a524e]">
            Para não haver confusão entre o que já funciona e o que é ideia, cada parte da demonstração é identificada.
            No modo apresentação, ative também as <strong className="font-medium">marcações</strong> para ver essas
            etiquetas sobre a tela.
          </p>
          <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
            <Legend detailed />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white p-8 text-center shadow-sm">
          <img src={logo} alt="Logotipo do Prato Consciente" className="w-full max-w-[360px]" />
          <p className="mt-6 font-spartan text-[20px] italic leading-snug text-pc-purple">
            “O que você tem a me dizer para que eu possa fazer melhor?”
          </p>
          <button
            type="button"
            onClick={startGuided}
            className="mt-7 flex min-h-[50px] items-center gap-2.5 rounded-full bg-pc-green px-6 font-spartan text-[16px] font-semibold text-pc-cream hover:bg-pc-green-2"
          >
            <Play size={17} fill="currentColor" aria-hidden="true" />
            Começar a demonstração
          </button>
        </div>
      </section>

      <footer className="bg-pc-green px-4 py-6 text-center font-roboto text-[13px] text-pc-cream/80">
        <p>{DISCLAIMER}</p>
        <p className="mt-1">Proposta conceitual de Karini Roani · Secretaria Municipal da Educação de São Paulo.</p>
      </footer>
    </div>
  )
}
