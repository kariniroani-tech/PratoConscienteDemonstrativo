/** Classificação usada em toda a demonstração para não confundir o que existe e o que é proposta. */
export type Kind = 'existente' | 'proposta' | 'simulacao'

export const KIND_INFO: Record<Kind, { label: string; short: string; description: string }> = {
  existente: {
    label: 'Já existe no Prato Aberto',
    short: 'Já existe',
    description: 'Telas do Prato Aberto reconstruídas a partir das capturas da apresentação.',
  },
  proposta: {
    label: 'Proposta Prato Consciente',
    short: 'Proposta',
    description: 'A nova funcionalidade sugerida: o formulário de relato da família.',
  },
  simulacao: {
    label: 'Simulação da demonstração',
    short: 'Simulação',
    description: 'Fluxos futuros, dados fictícios e atalhos criados só para apresentar a ideia.',
  },
}

/** Classes de cor de cada tipo (sobre fundo claro). */
export const KIND_CHIP: Record<Kind, string> = {
  existente: 'bg-pc-soft text-pc-green-mid ring-pc-green-mid/25',
  proposta: 'bg-[#f1e6f8] text-pa-button ring-pa-button/25',
  simulacao: 'bg-pc-tan-soft text-[#8a5a1f] ring-[#b07a35]/30',
}

export const KIND_DOT: Record<Kind, string> = {
  existente: 'bg-pc-sage',
  proposta: 'bg-[#c7a6e6]',
  simulacao: 'bg-pc-tan',
}
