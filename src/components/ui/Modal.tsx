import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  className?: string
  /** Rodapé com ações; por padrão, um botão "Fechar". */
  footer?: ReactNode
}

/** Diálogo modal acessível baseado no elemento nativo <dialog> (foco e Esc já tratados pelo navegador). */
export function Modal({ open, onClose, title, children, className, footer }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
      className={cn(
        'm-auto w-[min(92vw,540px)] rounded-2xl border-0 bg-white p-0 text-pc-ink shadow-2xl backdrop:bg-[#140f1e]/55',
        className,
      )}
    >
      <div className="relative p-6 sm:p-7">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-[#6b6b6b] hover:bg-black/5"
        >
          <X size={20} />
        </button>
        <h2 id={titleId} className="pr-8 font-spartan text-[22px] font-bold leading-tight text-pc-green">
          {title}
        </h2>
        <div className="mt-3 font-roboto text-[15px] leading-relaxed text-[#3d4441]">{children}</div>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {footer ?? (
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-full bg-pc-green px-5 font-spartan text-[15px] font-semibold text-pc-cream hover:bg-pc-green-2"
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    </dialog>
  )
}
