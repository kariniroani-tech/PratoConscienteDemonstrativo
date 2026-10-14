import { useDemoStore } from '../../store/demoStore'
import { cn } from '../../lib/cn'
import { KIND_INFO, type Kind } from './kinds'

const COLORS: Record<Kind, string> = {
  existente: 'bg-pc-green-mid',
  proposta: 'bg-pa-button',
  simulacao: 'bg-[#b07a35]',
}

/**
 * Selo exibido sobre as áreas da tela quando as "marcações" estão ligadas
 * (modo apresentação). O contêiner precisa estar posicionado (relative/sticky).
 */
export function AnnotationBadge({ kind, className }: { kind: Kind; className?: string }) {
  const on = useDemoStore((state) => state.annotations)
  if (!on) return null
  return (
    <span
      className={cn(
        'pointer-events-none absolute right-2 top-2 z-20 rounded-full px-2.5 py-1 font-spartan text-[11px] font-semibold uppercase tracking-[0.06em] text-white shadow',
        COLORS[kind],
        className,
      )}
    >
      {KIND_INFO[kind].label}
    </span>
  )
}
