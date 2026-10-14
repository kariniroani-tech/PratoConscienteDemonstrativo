import { useEffect, useState } from 'react'
import type { Box } from './geometry'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function sameBox(a: Box | null, b: Box | null): boolean {
  if (!a || !b) return a === b
  return (
    Math.abs(a.top - b.top) < 0.5 &&
    Math.abs(a.left - b.left) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5
  )
}

interface Insets {
  top: number
  bottom: number
}

/** Rola a página para que o elemento destacado fique visível (descontando barras e a caixa do tutorial). */
function ensureVisible(rect: DOMRect, insets: Insets) {
  const viewportHeight = window.innerHeight
  const visibleTop = insets.top + 12
  const visibleBottom = viewportHeight - insets.bottom - 12
  if (rect.top >= visibleTop && rect.bottom <= visibleBottom) return
  const available = visibleBottom - visibleTop
  const offset = rect.height >= available ? 0 : (available - rect.height) / 2
  const top = window.scrollY + rect.top - visibleTop - offset
  window.scrollTo({ top: Math.max(top, 0), behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/**
 * Acompanha, a cada quadro, a posição do elemento [data-tour="..."].
 * Funciona mesmo quando o elemento aparece depois (troca de tela, painel que abre).
 */
export function useTargetRect(target: string, stepKey: string, insets: Insets): Box | null {
  const [box, setBox] = useState<Box | null>(null)
  const { top, bottom } = insets

  useEffect(() => {
    let frame = 0
    let scrolled = false
    const selector = `[data-tour="${target}"]`

    const tick = () => {
      const element = document.querySelector(selector)
      const rect = element?.getBoundingClientRect()
      if (rect && rect.width > 0 && rect.height > 0) {
        if (!scrolled) {
          scrolled = true
          ensureVisible(rect, { top, bottom })
        }
        const next: Box = { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
        setBox((current) => (sameBox(current, next) ? current : next))
      } else {
        setBox((current) => (current === null ? current : null))
      }
      frame = requestAnimationFrame(tick)
    }

    tick()
    return () => cancelAnimationFrame(frame)
  }, [target, stepKey, top, bottom])

  return box
}
