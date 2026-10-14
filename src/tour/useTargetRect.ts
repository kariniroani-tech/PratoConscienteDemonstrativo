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

interface VisibilityOptions {
  /** Altura ocupada no topo (barras fixas). */
  top: number
  /** Altura ocupada embaixo (caixa do tutorial no celular). */
  bottom: number
  /**
   * center: centraliza o destaque (computador);
   * top: encosta o destaque logo abaixo das barras (celular, caixa do tutorial embaixo).
   */
  align: 'center' | 'top'
}

/** Rola a página para que o elemento destacado fique visível. */
function ensureVisible(rect: DOMRect, { top, bottom, align }: VisibilityOptions) {
  const viewportHeight = window.innerHeight
  const visibleTop = top + 12
  const visibleBottom = viewportHeight - bottom - 12
  if (rect.top >= visibleTop && rect.bottom <= visibleBottom) return
  const available = visibleBottom - visibleTop
  const offset = align === 'top' || rect.height >= available ? 0 : (available - rect.height) / 2
  const start = window.scrollY
  const target = Math.max(start + rect.top - visibleTop - offset, 0)
  if (prefersReducedMotion()) {
    window.scrollTo({ top: target })
    return
  }
  window.scrollTo({ top: target, behavior: 'smooth' })
  // Garantia: se a rolagem suave não começar (aba em segundo plano, economia de bateria), rola direto.
  window.setTimeout(() => {
    if (Math.abs(window.scrollY - start) < 2 && Math.abs(target - start) > 2) window.scrollTo({ top: target })
  }, 700)
}

/**
 * Acompanha, a cada quadro, a posição do elemento [data-tour="..."].
 * Funciona mesmo quando o elemento aparece depois (troca de tela, painel que abre).
 */
export function useTargetRect(target: string, stepKey: string, options: VisibilityOptions): Box | null {
  const [box, setBox] = useState<Box | null>(null)
  const { top, bottom, align } = options

  useEffect(() => {
    let frame = 0
    let scrolled = false
    const selector = `[data-tour="${target}"]`

    const measure = () => {
      const element = document.querySelector(selector)
      const rect = element?.getBoundingClientRect()
      if (rect && rect.width > 0 && rect.height > 0) {
        if (!scrolled) {
          scrolled = true
          ensureVisible(rect, { top, bottom, align })
        }
        const next: Box = { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
        setBox((current) => (sameBox(current, next) ? current : next))
      } else {
        setBox((current) => (current === null ? current : null))
      }
    }

    const tick = () => {
      measure()
      frame = requestAnimationFrame(tick)
    }

    tick()
    // Reforço para navegadores que reduzem a frequência de quadros (economia de bateria,
    // navegadores embutidos em aplicativos): a posição continua sendo atualizada.
    const interval = window.setInterval(measure, 250)
    window.addEventListener('scroll', measure, { passive: true, capture: true })
    return () => {
      cancelAnimationFrame(frame)
      window.clearInterval(interval)
      window.removeEventListener('scroll', measure, { capture: true })
    }
  }, [target, stepKey, top, bottom, align])

  return box
}
