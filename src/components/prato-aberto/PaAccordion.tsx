import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface PaAccordionProps {
  id: string
  title: ReactNode
  subtitle: ReactNode
  open: boolean
  onToggle: () => void
  children: ReactNode
  className?: string
  bodyClassName?: string
}

/** Acordeão do cardápio no estilo das capturas (cabeçalho cinza, chevron roxo/cinza). */
export function PaAccordion({ id, title, subtitle, open, onToggle, children, className, bodyClassName }: PaAccordionProps) {
  const panelId = `${id}-painel`
  return (
    <section className={className}>
      <h2 className="m-0">
        <button
          type="button"
          id={`${id}-cabecalho`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="pa-acc-header focus-visible:outline-offset-[-3px]"
        >
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-montserrat text-[18px] font-normal leading-snug text-black">
              {title}
            </span>
            <span className="sr-only">. </span>
            <span className="mt-0.5 block font-montserrat text-[11.5px] font-normal text-[#5a5a5a]">{subtitle}</span>
          </span>
          {open ? (
            <ChevronUp size={28} strokeWidth={1.5} className="shrink-0 text-[#929293]" aria-hidden="true" />
          ) : (
            <ChevronDown size={28} strokeWidth={1.5} className="shrink-0 text-pa-violet" aria-hidden="true" />
          )}
        </button>
      </h2>
      <div
        id={panelId}
        role="region"
        aria-labelledby={`${id}-cabecalho`}
        hidden={!open}
        className={cn('animate-fade-up', bodyClassName)}
      >
        {open && children}
      </div>
    </section>
  )
}
