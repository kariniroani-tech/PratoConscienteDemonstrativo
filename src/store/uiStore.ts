import { create } from 'zustand'

/** Estado de janelas da moldura da demonstração (não persiste). */
interface UiStore {
  resetOpen: boolean
  aboutOpen: boolean
  setResetOpen: (open: boolean) => void
  setAboutOpen: (open: boolean) => void
}

export const useUiStore = create<UiStore>()((set) => ({
  resetOpen: false,
  aboutOpen: false,
  setResetOpen: (resetOpen) => set({ resetOpen }),
  setAboutOpen: (aboutOpen) => set({ aboutOpen }),
}))
