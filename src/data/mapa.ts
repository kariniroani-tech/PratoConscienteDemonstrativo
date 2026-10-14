// Mapa ILUSTRATIVO usado no lugar do mapa real do Prato Aberto.
// As posições aproximam a composição das capturas dos slides 11 e 12
// (coordenadas do desenho, não geográficas). Nenhum dado de mapa real é usado.

export const WORLD = { width: 2300, height: 1700 }

export type MapView = 'home' | 'search'

/** Área visível em cada tela, alinhada às capturas (slide 11: Freguesia do Ó; slide 12: centro). */
export const MAP_VIEWS: Record<MapView, { x: number; y: number; w: number; h: number }> = {
  home: { x: 0, y: 0, w: 1257, h: 825 },
  search: { x: 550, y: 787, w: 1519, h: 794 },
}

export const MAP_COLORS = {
  land: '#655e5e',
  commercial: '#766745',
  park: '#416d52',
  water: '#395a5d',
  street: '#5f6c75',
  road: '#5b6770',
  roadInner: '#74818a',
  highway: '#64696b',
  label: '#1c1c1e',
}

export const RIVER_TIETE =
  'M-20 615 C 200 625, 380 640, 560 652 S 900 690, 1100 740 S 1300 790, 1500 805 S 1850 812, 2050 800 S 2250 790, 2320 788'

export const RIVER_TAMANDUATEI = 'M1462 812 C 1478 1000, 1497 1230, 1514 1450 S 1536 1610, 1552 1720'

export const MAJOR_ROADS = [
  'M880 -10 C 870 160, 900 320, 875 470 S 860 600, 870 640',
  'M705 -10 C 690 120, 660 230, 640 330 S 600 500, 610 640',
  'M250 520 C 420 515, 560 545, 700 548 S 1000 560, 1257 590 L 1420 602',
  'M330 40 C 520 90, 700 140, 900 140 S 1180 110, 1420 80',
  'M1120 -10 C 1150 140, 1210 260, 1300 380 S 1420 520, 1480 640',
  'M-10 300 C 140 320, 260 380, 380 460 S 500 560, 560 640',
  'M1300 230 C 1100 260, 980 300, 900 380',
  'M610 640 C 620 700, 640 760, 660 900',
  'M1000 560 C 1020 650, 1040 760, 1060 900',
  'M800 900 C 880 1000, 920 1100, 940 1300 S 980 1500, 1000 1720',
  'M1240 830 C 1270 950, 1300 1050, 1320 1180',
  'M1320 1180 C 1300 1350, 1270 1500, 1250 1720',
  'M1340 1262 C 1600 1272, 1900 1300, 2320 1312',
  'M860 1170 C 1000 1180, 1150 1190, 1320 1200',
  'M1480 860 C 1500 1050, 1520 1250, 1540 1450 S 1560 1600, 1580 1720',
  'M600 1600 C 800 1550, 1000 1520, 1250 1560',
  'M1600 880 C 1700 1000, 1850 1120, 2000 1200 S 2200 1260, 2320 1280',
  'M480 1000 C 650 1050, 750 1100, 860 1170',
  'M1700 820 C 1720 980, 1760 1100, 1800 1260 S 1850 1500, 1880 1720',
  'M2000 300 C 2050 500, 2100 650, 2150 800',
]

export const COMMERCIAL_AREAS = [
  'M500 380 L 604 362 L 642 420 L 612 472 L 520 482 Z',
  'M1080 1080 L 1180 1060 L 1230 1120 L 1190 1190 L 1090 1180 Z',
  'M1250 1080 L 1340 1060 L 1380 1150 L 1320 1220 L 1250 1180 Z',
  'M1430 1050 L 1530 1040 L 1560 1110 L 1480 1150 L 1420 1120 Z',
  'M1140 1240 L 1240 1230 L 1270 1300 L 1200 1340 L 1130 1310 Z',
  'M900 1120 L 980 1110 L 1000 1170 L 940 1200 L 890 1170 Z',
  'M1620 1140 L 1720 1130 L 1750 1200 L 1660 1230 Z',
  'M1380 1400 L 1460 1390 L 1480 1450 L 1400 1470 Z',
  'M820 470 L 880 460 L 900 500 L 840 520 Z',
]

export const PARKS = [
  'M40 420 C 80 400, 120 430, 110 470 C 100 500, 50 500, 40 470 Z',
  'M840 760 C 880 750, 905 790, 885 822 C 862 842, 830 822, 840 760 Z',
  'M780 920 C 820 905, 860 925, 850 960 C 840 990, 790 985, 780 950 Z',
  'M1040 900 C 1100 890, 1130 930, 1110 960 C 1080 980, 1040 960, 1040 900 Z',
  'M1600 1500 C 1660 1480, 1720 1520, 1700 1570 C 1660 1600, 1610 1580, 1600 1500 Z',
  'M640 1250 C 700 1230, 730 1270, 710 1310 C 680 1330, 640 1310, 640 1250 Z',
  'M1880 960 C 1940 950, 1980 990, 1960 1030 C 1920 1050, 1880 1020, 1880 960 Z',
  'M330 300 C 360 290, 380 310, 372 334 C 360 350, 330 340, 330 300 Z',
]

/** Nomes de bairros (dados geográficos públicos), posicionados como nas capturas. */
export const NEIGHBORHOOD_LABELS: { text: string; x: number; y: number }[] = [
  { text: 'VILA IORIO', x: 368, y: 35 },
  { text: 'MARILÂNDIA', x: 618, y: 60 },
  { text: 'VILA BRUNA', x: 388, y: 88 },
  { text: 'VILA CAVATON', x: 446, y: 158 },
  { text: 'MOINHO VELHO', x: 388, y: 240 },
  { text: 'VILA AMÉRICA', x: 410, y: 270 },
  { text: 'VILA BONILHA', x: 218, y: 362 },
  { text: 'NOSSA SRA. DO Ó', x: 430, y: 388 },
  { text: 'FREGUESIA DO Ó', x: 560, y: 450 },
  { text: 'PIQUERI', x: 208, y: 575 },
  { text: 'VILA ARCÁDIA', x: 470, y: 552 },
  { text: 'VILA PALMEIRAS', x: 820, y: 362 },
  { text: 'JARDIM DAS GRAÇAS', x: 878, y: 582 },
  { text: 'PAPATERRA LIMONGI', x: 1040, y: 590 },
  { text: 'VILA SIQUEIRA', x: 993, y: 418 },
  { text: 'VILA PRADO', x: 1088, y: 308 },
  { text: 'VILA CARBONE', x: 933, y: 200 },
  { text: 'VILA MARIA LUISA', x: 1030, y: 158 },
  { text: 'JARDIM PRIMAVERA', x: 1048, y: 52 },
  { text: 'LIDIANE', x: 1043, y: 692 },
  { text: 'LAPA DE BAIXO', x: 428, y: 812 },
  { text: 'ÁGUA BRANCA', x: 718, y: 798 },
  { text: 'BOM RETIRO', x: 1231, y: 928 },
  { text: 'CANINDÉ', x: 1485, y: 952 },
  { text: 'PARI', x: 1585, y: 946 },
  { text: 'BARRA FUNDA', x: 995, y: 975 },
  { text: 'POMPEIA', x: 715, y: 1014 },
  { text: 'PERDIZES', x: 840, y: 1073 },
  { text: 'SANTA CECÍLIA', x: 1038, y: 1089 },
  { text: 'SANTA IFIGÊNIA', x: 1257, y: 1081 },
  { text: 'BRÁS', x: 1513, y: 1083 },
  { text: 'SUMARÉ', x: 714, y: 1168 },
  { text: 'SÉ', x: 1348, y: 1275 },
  { text: 'BELA VISTA', x: 1168, y: 1308 },
  { text: 'LIBERDADE', x: 1341, y: 1365 },
  { text: 'MOOCA', x: 1710, y: 1370 },
  { text: 'PINHEIROS', x: 639, y: 1411 },
  { text: 'CAMBUCI', x: 1459, y: 1423 },
  { text: 'PARAÍSO', x: 1200, y: 1553 },
  { text: 'TATUAPÉ', x: 1983, y: 1051 },
  { text: 'BELÉM', x: 1803, y: 1201 },
  { text: 'ACLIMAÇÃO', x: 1410, y: 1559 },
]

/** Marcadores decorativos de unidades (sem nome), na disposição do slide 12. */
const SEARCH_CAPTURE_MARKERS: [number, number][] = [
  [1043, 344],
  [1154, 353],
  [1269, 335],
  [958, 409],
  [996, 410],
  [1003, 420],
  [1081, 438],
  [1036, 467],
  [976, 478],
  [1064, 523],
  [1104, 519],
  [1197, 460],
  [1297, 404],
  [1350, 400],
  [1356, 414],
  [1216, 242],
  [1268, 560],
  [1322, 551],
  [1174, 584],
  [1270, 607],
  [1242, 632],
  [1050, 600],
  [1030, 611],
]

/** Converte coordenadas da captura do slide 12 para o desenho do mapa. */
const fromSearchCapture = ([x, y]: [number, number]) => ({ x: x + 153, y: y + 787 })

export const DECORATIVE_MARKERS = SEARCH_CAPTURE_MARKERS.map(fromSearchCapture)

export const DECORATIVE_CLUSTERS = [
  { ...fromSearchCapture([1017, 550]), count: 5 },
  { ...fromSearchCapture([1217, 512]), count: 5 },
]

export const USER_LOCATION = fromSearchCapture([1157, 433])

/** Quarteirões: grades de ruas giradas, geradas de forma determinística. */
export interface District {
  cx: number
  cy: number
  w: number
  h: number
  angle: number
}

const ANGLES = [-18, 8, -12, 22, 5, 15, -6, 30, -20, 12, -8, 25, -14, 6, -28, 20, -10, 35, -5, 15]

export const DISTRICTS: District[] = ANGLES.map((angle, i) => {
  const col = i % 5
  const row = Math.floor(i / 5)
  return { cx: (col + 0.5) * 460, cy: (row + 0.5) * 425, w: 640, h: 600, angle }
})
