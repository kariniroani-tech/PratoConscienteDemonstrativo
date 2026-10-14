import { cn } from '../../lib/cn'

/**
 * Logotipo "prato aberto" recriado em fonte manuscrita (não é a arte oficial),
 * apenas para que o visitante reconheça a tela do slide 11.
 */
export function PratoAbertoLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-block font-script leading-none text-white', className)} translate="no">
      prato aberto
    </span>
  )
}
