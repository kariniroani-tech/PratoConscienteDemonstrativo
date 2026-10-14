import type { NavigateFunction } from 'react-router'
import type { Kind } from '../components/demo/kinds'
import { DEMO_DATE, DEMO_QUERY, DEMO_SCHOOL_CODE, ROUTES } from '../data/constants'
import { EXEMPLOS_RELATO } from '../data/exemplos'
import { matchesQuery } from '../lib/text'
import { useDemoStore, type DemoState } from '../store/demoStore'

export interface TourCheckContext {
  state: DemoState
  pathname: string
  /** Momento em que a etapa começou: só interações posteriores contam. */
  startedAt: number
}

export interface TourApi {
  navigate: NavigateFunction
  store: typeof useDemoStore
  goToStep: (id: string) => void
}

export type Placement = 'right' | 'left' | 'bottom' | 'top'

export interface TourStep {
  id: string
  /** Número exibido ao visitante (1 a 10). */
  etapa: number
  kind: Kind
  title: string
  body: string
  /** Texto exibido depois que a ação da etapa foi concluída. */
  doneBody?: string
  /** Valor do atributo data-tour do elemento destacado. */
  target: string
  route: string
  placement?: Placement
  /** Interação obrigatória: "Próximo" só é liberado quando isDone for verdadeiro. */
  task?: {
    hint: string
    /** Avança sozinho quando a ação é feita (nunca pula a ação). */
    auto: boolean
    isDone: (ctx: TourCheckContext) => boolean
  }
  /** Ajusta a tela ao entrar na etapa (por exemplo, ao voltar). */
  prepare?: (api: TourApi) => void
  /** Atalho "faça por mim", útil em apresentações ao vivo. */
  shortcut?: {
    label: (ctx: TourCheckContext) => string
    run: (api: TourApi) => void
  }
}

export const TOTAL_ETAPAS = 10

const SCHOOL_ROUTE = ROUTES.school(DEMO_SCHOOL_CODE)

const isDemoQuery = (query: string) => matchesQuery(DEMO_QUERY, query) && query.trim().length >= 2

const openPcForm = ({ store }: TourApi) => {
  const state = store.getState()
  state.setPcOpen(true)
  state.setPcView('form')
}

const showConfirmation = ({ store, goToStep }: TourApi) => {
  const state = store.getState()
  if (!state.lastRelatoId) {
    goToStep('relato')
    return
  }
  state.setPcOpen(true)
  state.setPcView('confirmation')
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'conhecer',
    etapa: 1,
    kind: 'existente',
    title: 'Conhecer o Prato Aberto',
    body: 'Esta é a tela inicial do Prato Aberto, serviço que já existe. Nele, as famílias encontram a escola e consultam as refeições oferecidas na Rede Municipal de Ensino.',
    target: 'pa-intro',
    route: ROUTES.home,
    placement: 'right',
  },
  {
    id: 'encontrar',
    etapa: 2,
    kind: 'existente',
    title: 'Encontrar uma escola',
    body: 'O Prato Aberto permite que as famílias encontrem a escola e consultem as refeições oferecidas. Clique em “Encontre sua escola” para começar.',
    target: 'pa-find-school',
    route: ROUTES.home,
    placement: 'right',
    task: {
      hint: 'Clique em “Encontre sua escola”.',
      auto: true,
      isDone: ({ pathname }) => pathname === ROUTES.search,
    },
    shortcut: { label: () => 'Clicar por mim', run: ({ navigate }) => navigate(ROUTES.search) },
  },
  {
    id: 'selecionar',
    etapa: 3,
    kind: 'existente',
    title: 'Selecionar a unidade',
    body: 'Pesquise pelo nome da unidade escolar. Para esta demonstração, selecione a escola indicada: EMEI FELIPE MESTRE JOU (TERC.).',
    target: 'pa-search',
    route: ROUTES.search,
    placement: 'right',
    task: {
      hint: 'Digite o nome da escola e toque no resultado.',
      auto: true,
      isDone: ({ pathname }) => pathname.startsWith('/prato-aberto/escola/'),
    },
    shortcut: {
      label: ({ state }) => (isDemoQuery(state.searchQuery) ? 'Selecionar a escola por mim' : 'Digitar o nome por mim'),
      run: ({ store, navigate }) => {
        const state = store.getState()
        if (!isDemoQuery(state.searchQuery)) {
          state.setSearchQuery(DEMO_QUERY)
          return
        }
        state.openSchool()
        navigate(SCHOOL_ROUTE)
      },
    },
  },
  {
    id: 'data',
    etapa: 4,
    kind: 'existente',
    title: 'Escolher a data',
    body: 'Escolha a data em que deseja consultar a alimentação oferecida na escola. Para seguir a apresentação, toque no dia 14 de outubro.',
    target: 'pa-calendar',
    route: SCHOOL_ROUTE,
    placement: 'right',
    task: {
      hint: 'Toque no dia 14 no calendário.',
      auto: true,
      isDone: ({ state, startedAt }) =>
        state.selectedDate === DEMO_DATE && (state.signals['date-picked'] ?? 0) > startedAt,
    },
    shortcut: {
      label: () => 'Selecionar 14/10 por mim',
      run: ({ store }) => store.getState().selectDate(DEMO_DATE),
    },
  },
  {
    id: 'cardapio',
    etapa: 5,
    kind: 'existente',
    title: 'Consultar o cardápio',
    body: 'Toque em “Todas as idades” para abrir o cardápio publicado para o dia.',
    doneBody:
      'Aqui a família pode visualizar as refeições planejadas e consultar as informações disponíveis sobre a alimentação escolar, como o link “Informações nutricionais”.',
    target: 'pa-menu',
    route: SCHOOL_ROUTE,
    placement: 'left',
    task: {
      hint: 'Abra “Todas as idades”.',
      auto: false,
      isDone: ({ state }) => state.menuOpen,
    },
    prepare: ({ store }) => {
      const state = store.getState()
      if (state.selectedDate !== DEMO_DATE) state.selectDate(DEMO_DATE, false)
    },
    shortcut: { label: () => 'Abrir por mim', run: ({ store }) => store.getState().setMenuOpen(true) },
  },
  {
    id: 'prato-consciente',
    etapa: 6,
    kind: 'proposta',
    title: 'Conhecer o Prato Consciente',
    body: 'Até aqui, tudo já existe. Esta é a proposta Prato Consciente: além de consultar o cardápio, a família poderá compartilhar suas percepções sobre a alimentação escolar. Toque em “Prato Consciente”.',
    target: 'pc-accordion',
    route: SCHOOL_ROUTE,
    placement: 'left',
    task: {
      hint: 'Abra o painel “Prato Consciente”.',
      auto: true,
      isDone: ({ state }) => state.pcOpen,
    },
    shortcut: { label: () => 'Abrir por mim', run: ({ store }) => store.getState().setPcOpen(true) },
  },
  {
    id: 'classe',
    etapa: 7,
    kind: 'proposta',
    title: 'Selecionar a classe',
    body: 'Selecione a classe do aluno. A proposta não pede o nome da criança: a classe basta para relacionar o relato ao cardápio servido.',
    target: 'pc-classe',
    route: SCHOOL_ROUTE,
    placement: 'left',
    task: {
      hint: 'Escolha uma classe na lista.',
      auto: true,
      isDone: ({ state }) => state.formClasse !== '',
    },
    prepare: openPcForm,
    shortcut: {
      label: () => 'Escolher “Infantil II - B”',
      run: ({ store }) => store.getState().setFormClasse('Infantil II - B'),
    },
  },
  {
    id: 'relato',
    etapa: 8,
    kind: 'proposta',
    title: 'Escrever e enviar um relato',
    body: 'Escreva um relato fictício — por exemplo, que a criança não conhecia um alimento ou que ele não faz parte dos hábitos da família — e toque em “Enviar Relato”.',
    target: 'pc-relato',
    route: SCHOOL_ROUTE,
    placement: 'left',
    task: {
      hint: 'Escreva o relato e toque em “Enviar Relato”.',
      auto: true,
      isDone: ({ state, startedAt }) => (state.signals['relato-submitted'] ?? 0) > startedAt,
    },
    prepare: openPcForm,
    shortcut: {
      label: ({ state }) => (state.formRelato.trim().length >= 15 ? 'Enviar por mim' : 'Preencher com um exemplo'),
      run: ({ store }) => {
        const state = store.getState()
        if (state.formRelato.trim().length >= 15) {
          document.querySelector<HTMLButtonElement>('[data-tour-submit]')?.click()
          return
        }
        if (!state.formClasse) state.setFormClasse('Infantil II - B')
        state.setFormRelato(EXEMPLOS_RELATO[0].texto)
      },
    },
  },
  {
    id: 'confirmacao',
    etapa: 9,
    kind: 'proposta',
    title: 'Visualizar a confirmação',
    body: 'A família recebe a confirmação com o resumo do relato. Nesta demonstração, nada foi enviado à Prefeitura: o relato ficou salvo apenas neste navegador.',
    target: 'pc-confirmacao',
    route: SCHOOL_ROUTE,
    placement: 'left',
    prepare: showConfirmation,
  },
  {
    id: 'entender',
    etapa: 10,
    kind: 'simulacao',
    title: 'Entender o caminho do relato',
    body: 'Toque em “Entenda o que acontece com seu relato” para ver como os relatos poderiam apoiar a gestão pública.',
    target: 'pc-entenda',
    route: SCHOOL_ROUTE,
    placement: 'left',
    task: {
      hint: 'Toque no botão destacado.',
      auto: true,
      isDone: ({ pathname }) => pathname === ROUTES.gestao,
    },
    prepare: showConfirmation,
    shortcut: { label: () => 'Abrir por mim', run: ({ navigate }) => navigate(ROUTES.gestao) },
  },
  {
    id: 'gestao',
    etapa: 10,
    kind: 'simulacao',
    title: 'Da escuta à ação',
    body: 'Na proposta, os relatos são sistematizados; a CODAE identifica padrões e os cruza com o teste de aceitabilidade; a equipe de EAN planeja ações, que depois são acompanhadas. Toque nas etapas para ver cada explicação.',
    target: 'gestao-fluxo',
    route: ROUTES.gestao,
    placement: 'bottom',
  },
]

export function stepIndexById(id: string): number {
  return TOUR_STEPS.findIndex((step) => step.id === id)
}
