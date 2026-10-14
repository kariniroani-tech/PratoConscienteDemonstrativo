import type { StateStorage } from 'zustand/middleware'

// O armazenamento do navegador pode estar bloqueado (aba anônima, políticas da
// instituição, prévias). Todas as leituras e escritas são protegidas para que a
// demonstração funcione mesmo sem ele — apenas sem lembrar os relatos.

function safe(getStorage: () => Storage): StateStorage {
  return {
    getItem: (name) => {
      try {
        return getStorage().getItem(name)
      } catch {
        return null
      }
    },
    setItem: (name, value) => {
      try {
        getStorage().setItem(name, value)
      } catch {
        /* armazenamento indisponível: segue apenas em memória */
      }
    },
    removeItem: (name) => {
      try {
        getStorage().removeItem(name)
      } catch {
        /* armazenamento indisponível */
      }
    },
  }
}

export const safeLocalStorage = safe(() => window.localStorage)
export const safeSessionStorage = safe(() => window.sessionStorage)
