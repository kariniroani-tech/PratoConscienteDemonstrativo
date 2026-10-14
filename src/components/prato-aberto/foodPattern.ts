// Padrão de silhuetas de alimentos sobre o roxo do Prato Aberto (slides 7, 11 a 15).
// Desenhado do zero em SVG para lembrar o original sem reproduzir a arte oficial.

const SHAPES: Record<string, string> = {
  tomate: 'M-17 0a17 17 0 1 0 34 0a17 17 0 1 0-34 0Z M-9-15 Q0-26 9-15 Q2-19 0-24 Q-2-19-9-15Z',
  pimentao:
    'M0-18C8-20 18-14 17-2C16 10 10 20 3 18C1 17-1 17-3 18C-10 20-16 10-17-2C-18-14-8-20 0-18Z M-2-18Q0-27 7-28L7-24Q2-23 2-18Z',
  berinjela: 'M-4-20C6-24 12-12 12 2C12 17 4 26-4 24C-12 22-14 9-12-5C-11-13-10-18-4-20Z M-7-20L0-29L7-20Z',
  cenoura: 'M-7-17L7-17Q5 0 0 25Q-5 0-7-17Z M-4-17L-9-29L-1-20L0-32L1-20L9-29L4-17Z',
  banana: 'M-23-7C-15 15 15 17 25-5L20-8C13 7-10 6-18-11Z',
  cebola: 'M0-23C4-15 16-9 16 4C16 15 8 21 0 21C-8 21-16 15-16 4C-16-9-4-15 0-23Z',
  folhas:
    'M0-24C6-18 6-11 0-7C-6-11-6-18 0-24Z M1-8C9-5 11 2 3 4C-1 0-1-4 1-8Z M-1-8C-9-5-11 2-3 4C1 0 1-4-1-8Z M1 5C9 8 11 15 3 17C-1 13-1 9 1 5Z M-1 5C-9 8-11 15-3 17C1 13 1 9-1 5Z M-1 4L1 4L1 25L-1 25Z',
  batata: 'M-17-4C-15-14 2-17 12-11C21-5 19 10 9 14C-2 18-19 10-17-4Z',
  maca: 'M0-12C8-20 20-12 18 2C16 16 6 20 0 16C-6 20-16 16-18 2C-20-12-8-20 0-12Z M2-14C6-24 15-25 15-22C11-16 6-14 2-14Z',
  azeitonas:
    'M-14 0a7 9 0 1 0 14 0a7 9 0 1 0-14 0Z M2 6a7 9 0 1 0 14 0a7 9 0 1 0-14 0Z M-6-14a6 8 0 1 0 12 0a6 8 0 1 0-12 0Z M-2-24Q4-34 14-30Q6-27 2-22Z',
}

interface Placement {
  shape: keyof typeof SHAPES
  x: number
  y: number
  rotate: number
  scale: number
  tone: 'claro' | 'rosa'
}

const TILE = 320

const PLACEMENTS: Placement[] = [
  { shape: 'tomate', x: 42, y: 44, rotate: 0, scale: 1, tone: 'rosa' },
  { shape: 'pimentao', x: 150, y: 58, rotate: 18, scale: 1.15, tone: 'claro' },
  { shape: 'berinjela', x: 262, y: 48, rotate: -38, scale: 1.15, tone: 'claro' },
  { shape: 'folhas', x: 92, y: 142, rotate: 32, scale: 1, tone: 'claro' },
  { shape: 'banana', x: 212, y: 150, rotate: 24, scale: 1.25, tone: 'claro' },
  { shape: 'cenoura', x: 296, y: 170, rotate: -28, scale: 1.1, tone: 'claro' },
  { shape: 'cebola', x: 34, y: 232, rotate: 8, scale: 1, tone: 'claro' },
  { shape: 'maca', x: 140, y: 252, rotate: 0, scale: 1, tone: 'rosa' },
  { shape: 'batata', x: 248, y: 268, rotate: -18, scale: 1.05, tone: 'claro' },
  { shape: 'azeitonas', x: 196, y: 296, rotate: 12, scale: 0.85, tone: 'claro' },
]

const TONES = {
  claro: 'fill="#ffffff" fill-opacity="0.15"',
  rosa: 'fill="#f0559f" fill-opacity="0.42"',
}

function buildSvg(): string {
  const items = PLACEMENTS.map(
    (p) =>
      `<path transform="translate(${p.x} ${p.y}) rotate(${p.rotate}) scale(${p.scale})" ${TONES[p.tone]} d="${SHAPES[p.shape]}"/>`,
  ).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}">${items}</svg>`
}

export const FOOD_PATTERN_URL = `url("data:image/svg+xml,${encodeURIComponent(buildSvg())}")`

/** Disponibiliza o padrão como variável CSS (--pa-pattern) para os painéis roxos. */
export function installFoodPattern(): void {
  document.documentElement.style.setProperty('--pa-pattern', FOOD_PATTERN_URL)
}
