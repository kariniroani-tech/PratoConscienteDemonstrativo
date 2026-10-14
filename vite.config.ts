import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages publica o site em https://<usuario>.github.io/<nome-do-repositorio>/.
// O workflow de deploy define BASE_PATH=/<nome-do-repositorio>/ automaticamente.
// Sem a variável, './' mantém todos os caminhos relativos — o que também funciona
// em qualquer subpasta, porque a navegação usa HashRouter (#/rota).
const base = process.env.BASE_PATH || './'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 900,
  },
})
