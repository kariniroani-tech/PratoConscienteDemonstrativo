import { Outlet, useLocation } from 'react-router'
import { ROUTES } from '../../data/constants'
import { cn } from '../../lib/cn'
import { IllustrativeMap } from './IllustrativeMap'

/**
 * Estrutura das telas com mapa (slides 11 e 12): painel à esquerda e mapa à direita.
 * O mapa permanece montado entre a tela inicial e a busca para animar a transição.
 */
export function MapLayout() {
  const { pathname } = useLocation()
  const view = pathname === ROUTES.search ? 'search' : 'home'

  return (
    <div className="flex min-h-[calc(100dvh-var(--shell-top))] flex-col md:h-[calc(100dvh-var(--shell-top))] md:min-h-[560px] md:flex-row">
      <div
        className={cn(
          'relative z-10 shrink-0 transition-[width] duration-300 ease-out md:h-full',
          view === 'home' ? 'md:w-[33.5%] md:min-w-[340px]' : 'md:w-[400px]',
        )}
      >
        <Outlet />
      </div>
      <div className="relative h-[42vh] min-h-[260px] flex-1 md:h-auto md:min-h-0">
        <IllustrativeMap view={view} />
      </div>
    </div>
  )
}
