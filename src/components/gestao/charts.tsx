import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '../../lib/cn'

// Gráficos do painel demonstrativo. Cada gráfico tem UMA série, então usa uma só cor
// (verde da identidade do Prato Consciente), sem legenda — o título nomeia a série.
// Rótulos e valores usam cores de texto, nunca a cor da série. Toda informação do
// tooltip também está na tabela ("Ver dados em tabela").

const SERIES = '#295748'
const ANNOTATION = '#cc995d'
const GRID = '#ebe7dc'
const TEXT_PRIMARY = '#29332e'
const TEXT_SECONDARY = '#5b625e'

function TableToggle({ open, onToggle, controls }: { open: boolean; onToggle: () => void; controls: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      className="mt-4 font-roboto text-[13px] font-medium text-pc-green-mid underline underline-offset-2 hover:text-pc-green"
    >
      {open ? 'Ocultar tabela' : 'Ver dados em tabela'}
    </button>
  )
}

export function StatTile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-[#ece8dc] bg-white px-3.5 py-3 sm:px-5 sm:py-4">
      <p className="font-roboto text-[13px] leading-snug text-[#5b625e] sm:text-[14px]">{label}</p>
      <p className="mt-1 font-spartan text-[30px] font-semibold leading-none text-pc-ink sm:text-[36px]">{value}</p>
      <p className="mt-1.5 font-roboto text-[12px] leading-snug text-[#8a8478] sm:mt-2 sm:text-[12.5px]">{note}</p>
    </div>
  )
}

interface BarDatum {
  rotulo: string
  valor: number
}

/** Barras horizontais — magnitude por categoria (série única). */
export function HorizontalBars({ data, unit, tableId }: { data: BarDatum[]; unit: string; tableId: string }) {
  const [active, setActive] = useState<number | null>(null)
  const [tableOpen, setTableOpen] = useState(false)
  const max = Math.max(...data.map((d) => d.valor))
  const total = data.reduce((sum, d) => sum + d.valor, 0)

  return (
    <div>
      <ul className="space-y-4">
        {data.map((d, i) => {
          const share = Math.round((d.valor / total) * 100)
          return (
            <li key={d.rotulo}>
              <p className="font-roboto text-[14px] leading-snug" style={{ color: TEXT_PRIMARY }}>
                {d.rotulo}
              </p>
              <div
                tabIndex={0}
                role="img"
                aria-label={`${d.rotulo}: ${d.valor} ${unit} (${share}% do total)`}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive((current) => (current === i ? null : current))}
                onFocus={() => setActive(i)}
                onBlur={() => setActive((current) => (current === i ? null : current))}
                className="relative mt-1.5 flex items-center gap-2 rounded-md py-1 outline-offset-2"
              >
                <div
                  className="h-[20px] rounded-r-[4px] transition-opacity"
                  style={{
                    width: `calc(${(d.valor / max) * 100}% - 44px)`,
                    background: SERIES,
                    opacity: active === null || active === i ? 1 : 0.55,
                  }}
                />
                <span className="font-roboto text-[14px] font-medium tabular-nums" style={{ color: TEXT_PRIMARY }}>
                  {d.valor}
                </span>
                {active === i && (
                  <span
                    role="presentation"
                    className="pointer-events-none absolute -top-9 left-0 z-10 whitespace-nowrap rounded-lg bg-pc-ink px-2.5 py-1.5 font-roboto text-[12.5px] text-white shadow-lg"
                  >
                    <strong className="font-semibold">{share}%</strong> dos {unit} sistematizados
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ul>
      <TableToggle open={tableOpen} onToggle={() => setTableOpen((v) => !v)} controls={tableId} />
      {tableOpen && (
        <table id={tableId} className="mt-3 w-full border-collapse font-roboto text-[13.5px]" style={{ color: TEXT_PRIMARY }}>
          <thead>
            <tr className="border-b border-[#ece8dc] text-left" style={{ color: TEXT_SECONDARY }}>
              <th scope="col" className="py-1.5 font-medium">
                Motivo
              </th>
              <th scope="col" className="py-1.5 text-right font-medium">
                Relatos
              </th>
              <th scope="col" className="py-1.5 text-right font-medium">
                %
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.rotulo} className="border-b border-[#f1eee6]">
                <th scope="row" className="py-1.5 pr-3 text-left font-normal">
                  {d.rotulo}
                </th>
                <td className="py-1.5 text-right tabular-nums">{d.valor}</td>
                <td className="py-1.5 text-right tabular-nums">{Math.round((d.valor / total) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

interface LinePoint {
  rotulo: string
  valor: number
}

/** Linha com evolução no tempo, cruz de leitura (hover/teclado) e marcação da ação de EAN. */
export function LineWithAnnotation({
  data,
  annotationAfter,
  annotationLabel,
  domain,
  tableId,
}: {
  data: LinePoint[]
  /** A anotação fica entre este índice e o seguinte. */
  annotationAfter: number
  annotationLabel: string
  domain: [number, number]
  tableId: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(560)
  const [active, setActive] = useState<number | null>(null)
  const [tableOpen, setTableOpen] = useState(false)

  useLayoutEffect(() => {
    const element = containerRef.current
    if (!element) return
    const update = () => setWidth(element.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const height = 250
  const pad = { top: 34, right: 44, bottom: 30, left: 38 }
  const plotW = Math.max(width - pad.left - pad.right, 80)
  const plotH = height - pad.top - pad.bottom
  const [min, max] = domain
  const x = (i: number) => pad.left + (i / (data.length - 1)) * plotW
  const y = (v: number) => pad.top + (1 - (v - min) / (max - min)) * plotH
  const ticks = Array.from({ length: (max - min) / 10 + 1 }, (_, i) => min + i * 10)

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(d.valor)}`).join('')
  const areaPath = `${linePath}L${x(data.length - 1)} ${y(min)}L${x(0)} ${y(min)}Z`
  const annotationX = (x(annotationAfter) + x(annotationAfter + 1)) / 2
  const last = data.length - 1

  const pickIndex = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const relative = clientX - rect.left - pad.left
    const index = Math.round((relative / plotW) * (data.length - 1))
    setActive(Math.min(Math.max(index, 0), last))
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    setActive((current) => {
      const base = current ?? (event.key === 'ArrowRight' ? -1 : data.length)
      return Math.min(Math.max(base + (event.key === 'ArrowRight' ? 1 : -1), 0), last)
    })
  }

  const activePoint = active === null ? null : data[active]

  return (
    <div>
      <div
        ref={containerRef}
        tabIndex={0}
        role="img"
        aria-label={`Gráfico de linha: ${data.map((d) => `${d.rotulo}, ${d.valor}%`).join('; ')}. ${annotationLabel} entre ${data[annotationAfter].rotulo} e ${data[annotationAfter + 1].rotulo}. Use as setas para percorrer os pontos.`}
        onPointerMove={(event) => pickIndex(event.clientX)}
        onPointerLeave={() => setActive(null)}
        onKeyDown={onKeyDown}
        onBlur={() => setActive(null)}
        className="relative touch-pan-y rounded-lg outline-offset-4"
      >
        <svg width={width} height={height} className="block" aria-hidden="true">
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={pad.left} x2={pad.left + plotW} y1={y(tick)} y2={y(tick)} stroke={GRID} strokeWidth={1} />
              <text
                x={pad.left - 8}
                y={y(tick)}
                dy="0.32em"
                textAnchor="end"
                fontSize={12}
                fontFamily="Roboto, sans-serif"
                fill={TEXT_SECONDARY}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {tick}%
              </text>
            </g>
          ))}
          {data.map((d, i) => (
            <text
              key={d.rotulo}
              x={x(i)}
              y={height - 8}
              textAnchor="middle"
              fontSize={12}
              fontFamily="Roboto, sans-serif"
              fill={TEXT_SECONDARY}
            >
              {d.rotulo}
            </text>
          ))}

          <line x1={annotationX} x2={annotationX} y1={pad.top - 6} y2={pad.top + plotH} stroke={ANNOTATION} strokeWidth={1.5} />
          <text
            x={annotationX}
            y={pad.top - 14}
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            fontFamily="Roboto, sans-serif"
            fill={TEXT_PRIMARY}
          >
            {annotationLabel}
          </text>

          <path d={areaPath} fill={SERIES} fillOpacity={0.1} />
          <path d={linePath} fill="none" stroke={SERIES} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {active !== null && (
            <line
              x1={x(active)}
              x2={x(active)}
              y1={pad.top}
              y2={pad.top + plotH}
              stroke="#b9b3a3"
              strokeWidth={1}
            />
          )}
          {data.map((d, i) => (
            <circle
              key={d.rotulo}
              cx={x(i)}
              cy={y(d.valor)}
              r={active === i ? 6 : 4.5}
              fill={SERIES}
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}
          <text
            x={x(last) + 10}
            y={y(data[last].valor)}
            dy="0.32em"
            fontSize={13}
            fontWeight={600}
            fontFamily="Roboto, sans-serif"
            fill={TEXT_PRIMARY}
          >
            {data[last].valor}%
          </text>
        </svg>

        {activePoint && active !== null && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg bg-pc-ink px-3 py-2 font-roboto text-white shadow-lg"
            style={{
              left: Math.min(Math.max(x(active) - 70, 0), width - 140),
              top: Math.max(y(activePoint.valor) - 70, 0),
              width: 140,
            }}
          >
            <p className="text-[18px] font-semibold leading-none">{activePoint.valor}%</p>
            <p className="mt-1 flex items-center gap-1.5 text-[12px] text-white/80">
              <span className="inline-block h-0.5 w-3 rounded" style={{ background: '#8fc2a9' }} aria-hidden="true" />
              {activePoint.rotulo} · {active <= annotationAfter ? 'antes da ação' : 'depois da ação'}
            </p>
          </div>
        )}
      </div>
      <TableToggle open={tableOpen} onToggle={() => setTableOpen((v) => !v)} controls={tableId} />
      {tableOpen && (
        <table id={tableId} className="mt-3 w-full border-collapse font-roboto text-[13.5px]" style={{ color: TEXT_PRIMARY }}>
          <thead>
            <tr className="border-b border-[#ece8dc] text-left" style={{ color: TEXT_SECONDARY }}>
              <th scope="col" className="py-1.5 font-medium">
                Período
              </th>
              <th scope="col" className="py-1.5 text-right font-medium">
                Aceitabilidade
              </th>
              <th scope="col" className="py-1.5 pl-3 text-left font-medium">
                Momento
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={d.rotulo} className={cn('border-b border-[#f1eee6]')}>
                <th scope="row" className="py-1.5 text-left font-normal">
                  {d.rotulo}
                </th>
                <td className="py-1.5 text-right tabular-nums">{d.valor}%</td>
                <td className="py-1.5 pl-3">{i <= annotationAfter ? 'antes da ação' : 'depois da ação'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
