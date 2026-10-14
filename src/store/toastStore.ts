import { create } from 'zustand'

export interface Toast {
  id: number
  message: string
}

interface ToastState {
  toasts: Toast[]
  push: (message: string) => void
  dismiss: (id: number) => void
}

let nextId = 1

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (message) => {
    const id = nextId++
    set((state) => ({ toasts: [...state.toasts.filter((t) => t.message !== message), { id, message }] }))
    window.setTimeout(() => get().dismiss(id), 4200)
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}))

export const toast = (message: string) => useToastStore.getState().push(message)
