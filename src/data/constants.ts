/** Escola exibida nos slides 12 a 15 (código conferido na captura do slide 12). */
export const DEMO_SCHOOL_CODE = '91456'

/** Data selecionada nas capturas dos slides 13 a 15: quarta-feira, 14/10/2026. */
export const DEMO_DATE = '2026-10-14'

export const DEMO_MONTH = '2026-10'

/** Texto digitado na busca da captura do slide 12. */
export const DEMO_QUERY = 'EMEI FELIPE MESTRE JOU'

/** Texto do aviso exigido em todas as telas da demonstração. */
export const DISCLAIMER =
  'Protótipo demonstrativo do Prato Consciente. Dados e interações utilizados apenas para apresentação da proposta.'

export const ROUTES = {
  landing: '/',
  home: '/prato-aberto',
  search: '/prato-aberto/buscar',
  school: (codigo: string) => `/prato-aberto/escola/${codigo}`,
  gestao: '/da-escuta-a-acao',
} as const
