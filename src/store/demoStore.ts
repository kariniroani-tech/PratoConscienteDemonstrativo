import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { DEMO_DATE, DEMO_MONTH } from '../data/constants'
import { monthKey } from '../lib/dates'
import { safeLocalStorage } from '../lib/storage'

export interface Relato {
  id: string
  escolaCodigo: string
  escolaNome: string
  /** Data do cardápio comentado (AAAA-MM-DD). */
  data: string
  classe: string
  texto: string
  criadoEm: number
}

export type PcView = 'form' | 'confirmation'

/** Sinais de interação usados pelo tutorial para saber se a ação foi feita. */
export type Signal = 'date-picked' | 'relato-submitted' | 'find-clicked'

interface UiState {
  searchQuery: string
  selectedDate: string
  visibleMonth: string
  menuOpen: boolean
  nutritionOpen: boolean
  pcOpen: boolean
  pcView: PcView
  formClasse: string
  formRelato: string
  lastRelatoId: string | null
  flowStep: number
  signals: Partial<Record<Signal, number>>
}

interface PersistedState {
  relatos: Relato[]
  presentationMode: boolean
  annotations: boolean
}

interface Actions {
  setSearchQuery: (query: string) => void
  /** Ao abrir uma escola, a tela volta ao estado das capturas (14/10, painéis fechados). */
  openSchool: () => void
  selectDate: (iso: string, byUser?: boolean) => void
  setVisibleMonth: (ym: string) => void
  setMenuOpen: (open: boolean) => void
  setNutritionOpen: (open: boolean) => void
  setPcOpen: (open: boolean) => void
  setPcView: (view: PcView) => void
  setFormClasse: (classe: string) => void
  setFormRelato: (texto: string) => void
  addRelato: (relato: Omit<Relato, 'id' | 'criadoEm'>) => Relato
  setFlowStep: (step: number) => void
  signal: (name: Signal) => void
  setPresentationMode: (on: boolean) => void
  setAnnotations: (on: boolean) => void
  /** Volta a interface ao início sem apagar relatos. */
  resetUi: () => void
  /** Reinicia toda a simulação, inclusive os relatos guardados neste navegador. */
  resetSimulation: () => void
}

export type DemoState = UiState & PersistedState & Actions

const initialUi: UiState = {
  searchQuery: '',
  selectedDate: DEMO_DATE,
  visibleMonth: DEMO_MONTH,
  menuOpen: false,
  nutritionOpen: false,
  pcOpen: false,
  pcView: 'form',
  formClasse: '',
  formRelato: '',
  lastRelatoId: null,
  flowStep: 0,
  signals: {},
}

function createId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `relato-${Date.now()}-${Math.round(Math.random() * 1e6)}`
  }
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      ...initialUi,
      relatos: [],
      presentationMode: false,
      annotations: false,

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      openSchool: () =>
        set({
          selectedDate: DEMO_DATE,
          visibleMonth: DEMO_MONTH,
          menuOpen: false,
          nutritionOpen: false,
          pcOpen: false,
          pcView: 'form',
        }),

      selectDate: (iso, byUser = true) =>
        set((state) => ({
          selectedDate: iso,
          visibleMonth: monthKey(iso),
          nutritionOpen: false,
          pcView: 'form',
          signals: byUser ? { ...state.signals, 'date-picked': Date.now() } : state.signals,
        })),

      setVisibleMonth: (visibleMonth) => set({ visibleMonth }),
      setMenuOpen: (menuOpen) => set({ menuOpen }),
      setNutritionOpen: (nutritionOpen) => set({ nutritionOpen }),
      setPcOpen: (pcOpen) => set({ pcOpen }),
      setPcView: (pcView) => set({ pcView }),
      setFormClasse: (formClasse) => set({ formClasse }),
      setFormRelato: (formRelato) => set({ formRelato }),

      addRelato: (input) => {
        const relato: Relato = { ...input, id: createId(), criadoEm: Date.now() }
        set((state) => ({
          relatos: [...state.relatos, relato],
          lastRelatoId: relato.id,
          pcView: 'confirmation',
          formRelato: '',
          signals: { ...state.signals, 'relato-submitted': Date.now() },
        }))
        return relato
      },

      setFlowStep: (flowStep) => set({ flowStep }),
      signal: (name) => set((state) => ({ signals: { ...state.signals, [name]: Date.now() } })),
      setPresentationMode: (presentationMode) => set({ presentationMode }),
      setAnnotations: (annotations) => set({ annotations }),

      resetUi: () => set({ ...initialUi }),
      resetSimulation: () => set({ ...initialUi, relatos: [] }),
    }),
    {
      name: 'prato-consciente-demo',
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state): PersistedState => ({
        relatos: state.relatos,
        presentationMode: state.presentationMode,
        annotations: state.annotations,
      }),
    },
  ),
)

export function selectLastRelato(state: DemoState): Relato | undefined {
  return state.relatos.find((relato) => relato.id === state.lastRelatoId)
}
