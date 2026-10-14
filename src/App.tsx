import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router'
import { Toaster } from './components/demo/Toaster'
import { HomePanel } from './components/prato-aberto/HomePanel'
import { MapLayout } from './components/prato-aberto/MapLayout'
import { SchoolView } from './components/prato-aberto/SchoolView'
import { SearchPanel } from './components/prato-aberto/SearchPanel'
import { GestaoPage } from './pages/GestaoPage'
import { Landing } from './pages/Landing'
import { PrototypeShell } from './pages/PrototypeShell'
import { TourProvider } from './tour/TourContext'
import { TourOverlay } from './tour/TourOverlay'

const TITLES: [prefix: string, title: string][] = [
  ['/prato-aberto/escola', 'Cardápio da escola · Prato Aberto (demonstração)'],
  ['/prato-aberto/buscar', 'Encontre sua escola · Prato Aberto (demonstração)'],
  ['/prato-aberto', 'Prato Aberto (demonstração)'],
  ['/da-escuta-a-acao', 'Da escuta à ação · Prato Consciente'],
]

/** Volta ao topo a cada troca de tela e atualiza o título da aba. */
function RouteEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
    const match = TITLES.find(([prefix]) => pathname.startsWith(prefix))
    document.title = match ? match[1] : 'Prato Consciente — protótipo interativo'
  }, [pathname])
  return null
}

export default function App() {
  return (
    // HashRouter: as rotas ficam depois do "#", então o GitHub Pages sempre serve o index.html.
    <HashRouter>
      <TourProvider>
        <RouteEffects />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<PrototypeShell />}>
            <Route path="/prato-aberto" element={<MapLayout />}>
              <Route index element={<HomePanel />} />
              <Route path="buscar" element={<SearchPanel />} />
            </Route>
            <Route path="/prato-aberto/escola/:codigo" element={<SchoolView />} />
            <Route path="/da-escuta-a-acao" element={<GestaoPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <TourOverlay />
        <Toaster />
      </TourProvider>
    </HashRouter>
  )
}
