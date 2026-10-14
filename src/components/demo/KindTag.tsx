import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { KIND_CHIP, KIND_INFO, type Kind } from './kinds'

interface KindTagProps {
  kind: Kind
  /** Texto alternativo; por padrão usa o rótulo curto do tipo. */
  children?: ReactNode
  className?: string
}

/** Etiqueta discreta que identifica se algo existe, é proposta ou é simulação. */
export function KindTag({ kind, children, className }: KindTagProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-[3px] font-spartan text-[11px] font-semibold uppercase leading-none tracking-[0.06em] ring-1 ring-inset',
        KIND_CHIP[kind],
        className,
      )}
      title={KIND_INFO[kind].description}
    >
      {children ?? KIND_INFO[kind].short}
    </span>
  )
}
