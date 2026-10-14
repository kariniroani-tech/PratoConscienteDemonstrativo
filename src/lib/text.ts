/** Remove acentos, caixa e espaços extras — usado na busca de escolas. */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Verifica se todas as palavras da busca aparecem no texto. */
export function matchesQuery(text: string, query: string): boolean {
  const haystack = normalize(text)
  const tokens = normalize(query).split(' ').filter(Boolean)
  return tokens.length > 0 && tokens.every((token) => haystack.includes(token))
}

const PERSONAL_DATA_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /[\w.+-]+@[\w-]+\.[\w.]+/, label: 'e-mail' },
  { pattern: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/, label: 'CPF' },
  { pattern: /(\(?\d{2}\)?\s?)?\b9?\d{4}[-\s]?\d{4}\b/, label: 'telefone' },
]

/** Detecta dados pessoais óbvios no relato (e-mail, CPF, telefone). */
export function findPersonalData(text: string): string | null {
  const found = PERSONAL_DATA_PATTERNS.find(({ pattern }) => pattern.test(text))
  return found ? found.label : null
}
