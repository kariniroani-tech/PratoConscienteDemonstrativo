import { useLayoutEffect } from 'react'
import { Outlet } from 'react-router'
import { DemoBar } from '../components/demo/DemoBar'
import { HelpButton } from '../components/demo/HelpButton'
import { ProgressRail } from '../components/demo/ProgressRail'
import { ShellDialogs } from '../components/demo/ShellDialogs'
import { cn } from '../lib/cn'
import { useDemoStore } from '../store/demoStore'

/** Moldura das telas da demonstração: barra superior, progresso (modo apresentação) e ajuda. */
export function PrototypeShell() {
  const presentationMode = useDemoStore((state) => state.presentationMode)
  const annotations = useDemoStore((state) => state.annotations)

  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--shell-top', presentationMode ? '74px' : '40px')
  }, [presentationMode])

  return (
    // overflow-x-clip: nada pode alargar a página no celular (sem criar rolagem horizontal).
    <div className={cn('min-h-dvh overflow-x-clip bg-white', annotations && 'annotate')}>
      <button
        type="button"
        onClick={() => document.getElementById('conteudo')?.focus()}
        className="sr-only z-[100] rounded-md bg-white px-3 py-2 text-pc-green focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
      >
        Pular para o conteúdo
      </button>
      <DemoBar />
      {presentationMode && <ProgressRail />}
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <HelpButton />
      <ShellDialogs />
    </div>
  )
}
