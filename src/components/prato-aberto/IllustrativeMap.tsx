import { memo, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import {
  COMMERCIAL_AREAS,
  DECORATIVE_CLUSTERS,
  DECORATIVE_MARKERS,
  DISTRICTS,
  MAJOR_ROADS,
  MAP_COLORS,
  MAP_VIEWS,
  NEIGHBORHOOD_LABELS,
  PARKS,
  RIVER_TAMANDUATEI,
  RIVER_TIETE,
  USER_LOCATION,
  WORLD,
  type District,
  type MapView,
} from '../../data/mapa'
import { EditIcon } from './icons'

/** Gerador pseudoaleatório determinístico: o mapa é sempre igual entre apresentações. */
function mulberry32(seed: number) {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const f = (n: number) => Math.round(n * 10) / 10

function districtStreets({ w, h }: District, seed: number): string {
  const rnd = mulberry32(seed)
  const parts: string[] = []
  const halfW = w / 2
  const halfH = h / 2
  const spacingA = 28 + rnd() * 14
  const spacingB = 30 + rnd() * 18

  for (let y = -halfH; y <= halfH; y += spacingA * (0.75 + rnd() * 0.5)) {
    const x0 = -halfW + rnd() * w * 0.16
    const x1 = halfW - rnd() * w * 0.16
    const tilt = (rnd() - 0.5) * 7
    if (rnd() < 0.3) {
      const mid = x0 + (x1 - x0) * (0.3 + rnd() * 0.4)
      const gap = 20 + rnd() * 60
      parts.push(`M${f(x0)} ${f(y)}L${f(mid)} ${f(y + tilt / 2)}`)
      parts.push(`M${f(mid + gap)} ${f(y + tilt / 2)}L${f(x1)} ${f(y + tilt)}`)
    } else {
      parts.push(`M${f(x0)} ${f(y)}L${f(x1)} ${f(y + tilt)}`)
    }
  }

  for (let x = -halfW; x <= halfW; x += spacingB * (0.75 + rnd() * 0.6)) {
    let y0 = -halfH + rnd() * h * 0.16
    let y1 = halfH - rnd() * h * 0.16
    if (rnd() < 0.35) {
      const start = y0 + rnd() * (y1 - y0) * 0.6
      y1 = start + (y1 - start) * (0.4 + rnd() * 0.6)
      y0 = start
    }
    const tilt = (rnd() - 0.5) * 9
    parts.push(`M${f(x)} ${f(y0)}L${f(x + tilt)} ${f(y1)}`)
  }

  for (let k = 0; k < 3; k++) {
    const y = (rnd() - 0.5) * h * 0.8
    parts.push(
      `M${f(-halfW)} ${f(y)}Q0 ${f(y + (rnd() - 0.5) * 140)} ${f(halfW)} ${f(y + (rnd() - 0.5) * 70)}`,
    )
  }
  return parts.join('')
}

/** Desenho base do mapa — calculado uma vez e nunca re-renderizado. */
const MapDrawing = memo(function MapDrawing() {
  return (
    <svg
      width={WORLD.width}
      height={WORLD.height}
      viewBox={`0 0 ${WORLD.width} ${WORLD.height}`}
      className="absolute left-0 top-0"
      aria-hidden="true"
      focusable="false"
    >
      <rect width={WORLD.width} height={WORLD.height} fill={MAP_COLORS.land} />
      {COMMERCIAL_AREAS.map((d) => (
        <path key={d} d={d} fill={MAP_COLORS.commercial} />
      ))}
      {PARKS.map((d) => (
        <path key={d} d={d} fill={MAP_COLORS.park} />
      ))}
      <g fill="none" stroke={MAP_COLORS.street} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        {DISTRICTS.map((district, i) => (
          <path
            key={i}
            transform={`translate(${district.cx} ${district.cy}) rotate(${district.angle})`}
            d={districtStreets(district, 1013 + i * 7919)}
          />
        ))}
      </g>
      <path d={RIVER_TAMANDUATEI} fill="none" stroke={MAP_COLORS.water} strokeWidth={9} strokeLinecap="round" />
      <g fill="none" strokeLinecap="round">
        {MAJOR_ROADS.map((d) => (
          <path key={d} d={d} stroke={MAP_COLORS.road} strokeWidth={10} />
        ))}
        {MAJOR_ROADS.map((d) => (
          <path key={`${d}-inner`} d={d} stroke={MAP_COLORS.roadInner} strokeWidth={6} />
        ))}
      </g>
      {/* Marginal Tietê e o rio */}
      <path d={RIVER_TIETE} fill="none" stroke={MAP_COLORS.highway} strokeWidth={86} />
      <path d={RIVER_TIETE} fill="none" stroke="#6e7377" strokeWidth={60} strokeDasharray="2 18" />
      <path d={RIVER_TIETE} fill="none" stroke={MAP_COLORS.water} strokeWidth={30} />
      <text
        x={1540}
        y={812}
        fill="#7da3a6"
        fontFamily="Roboto, sans-serif"
        fontStyle="italic"
        fontSize={15}
        transform="rotate(1 1540 812)"
      >
        Rio Tietê
      </text>
      <g
        fill={MAP_COLORS.label}
        fontFamily="Roboto, sans-serif"
        fontWeight={500}
        fontSize={15}
        letterSpacing={2.2}
        textAnchor="middle"
        stroke="#6f6868"
        strokeWidth={3}
        paintOrder="stroke"
      >
        {NEIGHBORHOOD_LABELS.map((label) => (
          <text key={label.text} x={label.x} y={label.y}>
            {label.text}
          </text>
        ))}
      </g>
    </svg>
  )
})

interface IllustrativeMapProps {
  view: MapView
}

/**
 * Mapa ilustrativo de São Paulo (substitui o mapa real das capturas).
 * Os tons escurecidos reproduzem a aparência dos slides 11 e 12.
 */
export function IllustrativeMap({ view }: IllustrativeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)

  useLayoutEffect(() => {
    const element = containerRef.current
    if (!element) return
    const update = () => setSize({ w: element.clientWidth, h: element.clientHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const rect = MAP_VIEWS[view]
  const scale = size ? Math.min(1.6, Math.max(0.62, size.w / rect.w, size.h / rect.h)) : 1
  const tx = size ? size.w / 2 - scale * (rect.x + rect.w / 2) : 0
  const ty = size ? size.h / 2 - scale * (rect.y + rect.h / 2) : 0

  const layerStyle = {
    width: WORLD.width,
    height: WORLD.height,
    transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
    opacity: size ? 1 : 0,
    '--inv-scale': 1 / scale,
  } as CSSProperties

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ background: MAP_COLORS.land }}
      role="img"
      aria-label="Mapa ilustrativo da cidade de São Paulo, sem dados reais de localização"
    >
      <div className="pa-map-layer absolute left-0 top-0" style={layerStyle}>
        <MapDrawing />
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: view === 'search' ? 1 : 0 }}
          aria-hidden="true"
        >
          {DECORATIVE_MARKERS.map((marker) => (
            <span
              key={`${marker.x}-${marker.y}`}
              className="absolute grid size-[26px] place-items-center rounded-full text-white shadow-[0_1px_3px_rgb(0_0_0/0.45)]"
              style={{
                left: marker.x,
                top: marker.y,
                transform: 'translate(-50%, -50%) scale(var(--inv-scale))',
                background: 'radial-gradient(circle at 35% 30%, #cf73da, #a936b3 70%)',
                boxShadow: '0 0 0 2px rgb(226 176 232 / 0.55), 0 1px 3px rgb(0 0 0 / 0.45)',
              }}
            >
              <EditIcon size={14} />
            </span>
          ))}
          {DECORATIVE_CLUSTERS.map((cluster) => (
            <span
              key={`${cluster.x}-${cluster.y}`}
              className="absolute grid size-[30px] place-items-center rounded-full bg-[#0a8cff] font-roboto text-[14px] font-bold text-black"
              style={{
                left: cluster.x,
                top: cluster.y,
                transform: 'translate(-50%, -50%) scale(var(--inv-scale))',
                boxShadow: '0 0 0 5px rgb(10 140 255 / 0.35), 0 0 0 11px rgb(10 140 255 / 0.16)',
              }}
            >
              {cluster.count}
            </span>
          ))}
          <span
            className="absolute size-[16px] rounded-full border-[2.5px] border-white bg-[#4285f4]"
            style={{
              left: USER_LOCATION.x,
              top: USER_LOCATION.y,
              transform: 'translate(-50%, -50%) scale(var(--inv-scale))',
              boxShadow: '0 0 0 9px rgb(66 133 244 / 0.22)',
            }}
          />
        </div>
      </div>
      <p className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/45 px-2.5 py-1 font-roboto text-[11px] text-white/85">
        Mapa ilustrativo — não representa dados reais
      </p>
    </div>
  )
}
