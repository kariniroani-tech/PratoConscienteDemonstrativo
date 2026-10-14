import type { Placement } from './steps'

export interface Box {
  top: number
  left: number
  width: number
  height: number
}

export interface CardPosition {
  top: number
  left: number
  width: number
  /** float: ao lado do destaque; sheet: faixa inferior/superior (celulares). */
  mode: 'float' | 'sheet' | 'center'
}

const MARGIN = 12
const GAP = 16
const MAX_WIDTH = 380
const MIN_WIDTH = 288

export const HOLE_PADDING = 8

export function inflate(box: Box, amount: number, viewport: { w: number; h: number }): Box {
  const left = Math.max(box.left - amount, 2)
  const top = Math.max(box.top - amount, 2)
  const right = Math.min(box.left + box.width + amount, viewport.w - 2)
  const bottom = Math.min(box.top + box.height + amount, viewport.h - 2)
  return { left, top, width: Math.max(right - left, 0), height: Math.max(bottom - top, 0) }
}

export function roundedRectPath({ left: x, top: y, width: w, height: h }: Box, radius: number): string {
  const r = Math.min(radius, w / 2, h / 2)
  return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
}

interface PlacementInput {
  hole: Box | null
  cardHeight: number
  viewport: { w: number; h: number }
  topInset: number
  preferred?: Placement
  mobile: boolean
}

/** Escolhe onde mostrar a caixa explicativa sem cobrir o elemento destacado. */
export function placeCard({ hole, cardHeight, viewport, topInset, preferred, mobile }: PlacementInput): CardPosition {
  const { w: vw, h: vh } = viewport

  if (mobile) {
    const width = vw - MARGIN * 2
    const holeCenter = hole ? hole.top + hole.height / 2 : 0
    const usableMiddle = topInset + (vh - topInset) / 2
    // Destaque na metade de baixo: a caixa vai para o topo; caso contrário, para baixo.
    const atTop = hole !== null && holeCenter > usableMiddle + 24
    return {
      left: MARGIN,
      width,
      top: atTop ? topInset + 8 : Math.max(vh - cardHeight - MARGIN, topInset + 8),
      mode: 'sheet',
    }
  }

  if (!hole) {
    const width = Math.min(MAX_WIDTH + 40, vw - MARGIN * 2)
    return { left: (vw - width) / 2, top: Math.max((vh - cardHeight) / 2, topInset + MARGIN), width, mode: 'center' }
  }

  const clampTop = (top: number) => Math.min(Math.max(top, topInset + MARGIN), Math.max(vh - cardHeight - MARGIN, topInset + MARGIN))
  const clampLeft = (left: number, width: number) => Math.min(Math.max(left, MARGIN), vw - width - MARGIN)

  const space = {
    right: vw - (hole.left + hole.width) - GAP - MARGIN,
    left: hole.left - GAP - MARGIN,
    bottom: vh - (hole.top + hole.height) - GAP - MARGIN,
    top: hole.top - GAP - MARGIN - topInset,
  }

  const order: Placement[] = [preferred ?? 'right', 'right', 'left', 'bottom', 'top']
  const centeredTop = hole.top + Math.min(hole.height, vh) / 2 - cardHeight / 2

  for (const side of order) {
    if (side === 'right' && space.right >= MIN_WIDTH) {
      const width = Math.min(MAX_WIDTH, space.right)
      return { left: hole.left + hole.width + GAP, top: clampTop(centeredTop), width, mode: 'float' }
    }
    if (side === 'left' && space.left >= MIN_WIDTH) {
      const width = Math.min(MAX_WIDTH, space.left)
      return { left: hole.left - GAP - width, top: clampTop(centeredTop), width, mode: 'float' }
    }
    if (side === 'bottom' && space.bottom >= cardHeight) {
      const width = Math.min(MAX_WIDTH + 40, vw - MARGIN * 2)
      return {
        left: clampLeft(hole.left + hole.width / 2 - width / 2, width),
        top: hole.top + hole.height + GAP,
        width,
        mode: 'float',
      }
    }
    if (side === 'top' && space.top >= cardHeight) {
      const width = Math.min(MAX_WIDTH + 40, vw - MARGIN * 2)
      return {
        left: clampLeft(hole.left + hole.width / 2 - width / 2, width),
        top: hole.top - GAP - cardHeight,
        width,
        mode: 'float',
      }
    }
  }

  // Sem espaço livre (destaque muito grande): canto inferior direito, sobre o destaque.
  const width = Math.min(MAX_WIDTH, vw - MARGIN * 2)
  return { left: vw - width - MARGIN - 8, top: Math.max(vh - cardHeight - MARGIN - 8, topInset + MARGIN), width, mode: 'float' }
}
