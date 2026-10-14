// Datas são tratadas como strings ISO (AAAA-MM-DD) e calculadas em UTC,
// para que o calendário não varie com o fuso horário de quem apresenta.

export const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const

export const DIAS_SEMANA = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
] as const

export const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const

export interface DateParts {
  y: number
  m: number
  d: number
}

export function parseISO(iso: string): DateParts {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m, d: d || 1 }
}

export function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function toUTC({ y, m, d }: DateParts): Date {
  return new Date(Date.UTC(y, m - 1, d))
}

export function addDays(iso: string, amount: number): string {
  const date = toUTC(parseISO(iso))
  date.setUTCDate(date.getUTCDate() + amount)
  return toISO(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate())
}

/** Dia da semana (0 = domingo). */
export function weekday(iso: string): number {
  return toUTC(parseISO(iso)).getUTCDay()
}

export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate()
}

/** Chave do mês no formato AAAA-MM. */
export function monthKey(iso: string): string {
  return iso.slice(0, 7)
}

export function addMonths(ym: string, amount: number): string {
  const [y, m] = ym.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1 + amount, 1))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  return `${MESES[m - 1]} ${y}`
}

/** 14/10/2026 */
export function formatBR(iso: string): string {
  const { y, m, d } = parseISO(iso)
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`
}

/** quarta-feira, 14 de outubro de 2026 */
export function formatLong(iso: string): string {
  const { y, m, d } = parseISO(iso)
  return `${DIAS_SEMANA[weekday(iso)].toLowerCase()}, ${d} de ${MESES[m - 1].toLowerCase()} de ${y}`
}

/** Quarta-feira, Outubro 2026 — rótulo usado sob o número grande do calendário. */
export function formatCalendarCaption(iso: string): string {
  const { y, m } = parseISO(iso)
  return `${DIAS_SEMANA[weekday(iso)]}, ${MESES[m - 1]} ${y}`
}

/** 13/10/2026, às 15:42 — horário local de quem usa a demonstração. */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, às ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Matriz de semanas (domingo a sábado) do mês; células vazias são null. */
export function monthMatrix(ym: string): (string | null)[][] {
  const [y, m] = ym.split('-').map(Number)
  const first = weekday(toISO(y, m, 1))
  const total = daysInMonth(y, m)
  const cells: (string | null)[] = Array.from({ length: first }, () => null)
  for (let d = 1; d <= total; d++) cells.push(toISO(y, m, d))
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (string | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}
