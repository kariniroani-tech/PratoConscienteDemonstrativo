import type { SVGProps } from 'react'

// Ícones no estilo Material usados pelo Prato Aberto nas capturas.
// Caminhos dos Material Icons (licença Apache 2.0) e ilustrações próprias.

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 24, ...props }: IconProps) {
  return { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false, ...props }
}

/** Alfinete de localização do botão "Encontre sua escola". */
export function PlaceIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
    </svg>
  )
}

/** "x" em círculo do campo de busca (slide 12). */
export function CancelIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
    </svg>
  )
}

/** Lápis branco dos marcadores de escola (slide 12). */
export function EditIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  )
}

/** Setas triangulares azuis do calendário (slide 13). */
export function TriangleLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M15 6.5v11L8 12z" />
    </svg>
  )
}

export function TriangleRightIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M9 6.5v11l7-5.5z" />
    </svg>
  )
}

/** Ícone do lanche: biscoito sobre círculo roxo (slide 14). */
export function SnackIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="snack-bg" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#7d22c2" />
          <stop offset="100%" stopColor="#560a99" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#snack-bg)" />
      <rect x="9" y="9" width="14" height="14" rx="2" transform="rotate(45 16 16)" fill="#eab97e" stroke="#c98a4b" strokeWidth="1" />
      {[
        [16, 11.5],
        [12.2, 15],
        [16, 15],
        [19.8, 15],
        [14, 18.5],
        [18, 18.5],
        [16, 21],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.9" fill="#b9773a" />
      ))}
    </svg>
  )
}

/** Ícone da refeição: prato com alimentos dentro de um anel roxo (slide 14). */
export function MealIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="16" fill="#7928b0" />
      <circle cx="16" cy="16" r="11.5" fill="#ffffff" />
      <circle cx="16" cy="16" r="8.5" fill="#f3efe6" />
      <path d="M10.5 16.5c0-3 2.3-5 4.6-5 .9 2.6.2 5.7-1.6 7.3-1.5-.2-3-1-3-2.3z" fill="#5f8f3a" />
      <ellipse cx="17.8" cy="14.6" rx="3" ry="2.6" fill="#f9ca45" />
      <path d="M15.4 18.6c1.6-1.5 4.3-1.9 6.2-.9-.4 2-2.4 3.3-4.6 3.3-1 0-1.6-.9-1.6-2.4z" fill="#5c1d1a" />
    </svg>
  )
}
