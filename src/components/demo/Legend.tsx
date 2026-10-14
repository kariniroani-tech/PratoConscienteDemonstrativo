import { cn } from '../../lib/cn'
import { KIND_DOT, KIND_INFO, type Kind } from './kinds'

const KINDS: Kind[] = ['existente', 'proposta', 'simulacao']

/** Legenda "Já existe · Proposta · Simulação". */
export function Legend({ tone = 'dark', detailed = false, className }: { tone?: 'dark' | 'light'; detailed?: boolean; className?: string }) {
  if (detailed) {
    return (
      <ul className={cn('space-y-2.5', className)}>
        {KINDS.map((kind) => (
          <li key={kind} className="flex gap-2.5">
            <span className={cn('mt-1.5 size-2.5 shrink-0 rounded-full', KIND_DOT[kind])} aria-hidden="true" />
            <span className="font-roboto text-[14px] leading-snug">
              <strong className="font-medium">{KIND_INFO[kind].label}.</strong> {KIND_INFO[kind].description}
            </span>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <ul className={cn('flex items-center gap-3', className)} aria-label="Legenda">
      {KINDS.map((kind) => (
        <li
          key={kind}
          className={cn(
            'flex items-center gap-1.5 font-spartan text-[12.5px] font-medium',
            tone === 'dark' ? 'text-pc-cream/90' : 'text-pc-ink',
          )}
          title={KIND_INFO[kind].description}
        >
          <span className={cn('size-2.5 rounded-full', KIND_DOT[kind])} aria-hidden="true" />
          {KIND_INFO[kind].short}
        </li>
      ))}
    </ul>
  )
}
