import { useId } from 'react'
import { cn } from '../../lib/cn'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  className?: string
}

/** Interruptor acessível (role="switch"). */
export function Switch({ checked, onChange, label, description, className }: SwitchProps) {
  const id = useId()
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-describedby={description ? `${id}-desc` : undefined}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-pc-green-mid' : 'bg-[#cfcabd]',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white shadow transition-[left]',
            checked ? 'left-[22px]' : 'left-0.5',
          )}
        />
        <span className="sr-only">{label}</span>
      </button>
      <label htmlFor={id} className="cursor-pointer">
        <span className="block font-spartan text-[15px] font-semibold leading-tight text-pc-ink">{label}</span>
        {description && (
          <span id={`${id}-desc`} className="mt-0.5 block font-roboto text-[12.5px] leading-snug text-[#6b6b6b]">
            {description}
          </span>
        )}
      </label>
    </div>
  )
}
