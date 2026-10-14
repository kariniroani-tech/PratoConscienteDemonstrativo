
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Nome exato do repositório no GitHub
const repositoryName = 'PratoConscienteDemonstrativo'

// Caminho base para publicação no GitHub Pages
const base = process.env.BASE_PATH || `/${repositoryName}/`

export default defineConfig({
  base,

  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 900,
  },
})
