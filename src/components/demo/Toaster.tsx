import { X } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'

/** Mensagens rápidas (por exemplo, "Simulação reiniciada"). */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[90] flex flex-col items-center gap-2 px-4 sm:bottom-6"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto flex max-w-[520px] animate-fade-up items-center gap-3 rounded-full bg-pc-green py-2 pl-4 pr-2 font-roboto text-[14px] text-pc-cream shadow-lg"
        >
          <span>{item.message}</span>
          <button
            type="button"
            onClick={() => dismiss(item.id)}
            aria-label="Fechar aviso"
            className="grid size-7 place-items-center rounded-full hover:bg-white/10"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  )
}
