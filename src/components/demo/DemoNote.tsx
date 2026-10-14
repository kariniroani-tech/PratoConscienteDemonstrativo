import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { KindTag } from './KindTag'

interface DemoNoteProps {
  children: ReactNode
  /** Rótulo da etiqueta; por padrão "Atalho da demonstração". */
  label?: string
  className?: string
}

/**
 * Complemento criado só para a demonstração (dicas, atalhos, avisos).
 * Visual tracejado e etiqueta "simulação" para não se confundir com o sistema.
 */
export function DemoNote({ children, label = 'Complemento da demonstração', className }: DemoNoteProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-dashed border-[#c9a06b] bg-pc-tan-soft/70 px-3.5 py-3 font-roboto text-[13.5px] leading-snug text-[#5b4527]',
        className,
      )}
    >
      <KindTag kind="simulacao" className="mb-1.5">
        {label}
      </KindTag>
      <div>{children}</div>
    </div>
  )
}
