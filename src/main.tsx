import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Fontes empacotadas no build (sem depender de serviços externos durante a apresentação).
import '@fontsource/roboto/latin-300.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-500.css'
import '@fontsource/roboto/latin-700.css'
import '@fontsource/montserrat/latin-400.css'
import '@fontsource/montserrat/latin-500.css'
import '@fontsource/varela-round/latin-400.css'
import '@fontsource/satisfy/latin-400.css'
import '@fontsource/anton/latin-400.css'
import '@fontsource-variable/oswald/wght.css'
import '@fontsource-variable/league-spartan/wght.css'

import './styles/index.css'
import App from './App'
import { installFoodPattern } from './components/prato-aberto/foodPattern'

installFoodPattern()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
