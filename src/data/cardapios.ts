export type TipoRefeicao = 'lanche' | 'refeicao'

export interface Refeicao {
  tipo: TipoRefeicao
  titulo: string
  /** Texto dos alimentos, transcrito como aparece no Prato Aberto (itens separados por ";"). */
  alimentos: string
}

export interface LinhaNutricional {
  refeicao: string
  energiaKcal: number
  carboidratosG: number
  proteinasG: number
  lipidiosG: number
}

export interface Cardapio {
  data: string
  faixa: string
  /**
   * apresentacao: transcrito da captura do slide 14 (fonte primária).
   * ficticio: criado apenas para permitir navegar por outras datas na demonstração.
   */
  origem: 'apresentacao' | 'ficticio'
  publicadoEm: string
  refeicoes: Refeicao[]
  /** Valores sempre fictícios: o conteúdo desta seção não aparece nos slides. */
  nutricional: LinhaNutricional[]
}

/** Aviso exibido abaixo das refeições (transcrito do slide 14). */
export const AVISO_CARDAPIO =
  'Os cardápios poderão sofrer alterações em razão do grau de maturação dos hortifrutis, necessidade de adaptações excepcionais na unidade escolar, autorizações de troca previamente analisadas entre outros.'

const LANCHE_5_6 = 'Lanche - Permanência de 5 ou 6 horas'
const LANCHE_4_8 = 'Lanche - Permanência de 4 ou 8 horas'

const CARDAPIOS: Record<string, Record<string, Cardapio>> = {
  '91456': {
    // Fonte: slide 14 — transcrição literal, inclusive o espaço antes de "; maçã".
    '2026-10-14': {
      data: '2026-10-14',
      faixa: 'Todas as idades',
      origem: 'apresentacao',
      publicadoEm: '07/10/2026, às 10:44',
      refeicoes: [
        {
          tipo: 'lanche',
          titulo: LANCHE_5_6,
          alimentos: 'leite integral com chocolate em pó; biscoito salgado ; maçã',
        },
        {
          tipo: 'refeicao',
          titulo: 'Refeição',
          alimentos: 'arroz; feijão carioca; estrogonofe de carne; batata rústica; melão',
        },
        {
          tipo: 'lanche',
          titulo: LANCHE_4_8,
          alimentos: 'leite integral com chocolate em pó; pão tipo forma integral com muçarela',
        },
      ],
      nutricional: [
        { refeicao: LANCHE_5_6, energiaKcal: 280, carboidratosG: 44, proteinasG: 9, lipidiosG: 8 },
        { refeicao: 'Refeição', energiaKcal: 510, carboidratosG: 70, proteinasG: 23, lipidiosG: 15 },
        { refeicao: LANCHE_4_8, energiaKcal: 330, carboidratosG: 40, proteinasG: 15, lipidiosG: 12 },
      ],
    },
    // Datas próximas com cardápios FICTÍCIOS, apenas para a navegação livre pelo calendário.
    '2026-10-13': {
      data: '2026-10-13',
      faixa: 'Todas as idades',
      origem: 'ficticio',
      publicadoEm: '07/10/2026, às 10:44',
      refeicoes: [
        { tipo: 'lanche', titulo: LANCHE_5_6, alimentos: 'iogurte natural; bolo de cenoura; banana' },
        {
          tipo: 'refeicao',
          titulo: 'Refeição',
          alimentos: 'arroz; feijão preto; frango assado; abobrinha refogada; laranja',
        },
        { tipo: 'lanche', titulo: LANCHE_4_8, alimentos: 'leite integral; pão de queijo' },
      ],
      nutricional: [
        { refeicao: LANCHE_5_6, energiaKcal: 300, carboidratosG: 48, proteinasG: 8, lipidiosG: 9 },
        { refeicao: 'Refeição', energiaKcal: 480, carboidratosG: 62, proteinasG: 26, lipidiosG: 13 },
        { refeicao: LANCHE_4_8, energiaKcal: 290, carboidratosG: 34, proteinasG: 11, lipidiosG: 12 },
      ],
    },
    '2026-10-15': {
      data: '2026-10-15',
      faixa: 'Todas as idades',
      origem: 'ficticio',
      publicadoEm: '07/10/2026, às 10:44',
      refeicoes: [
        { tipo: 'lanche', titulo: LANCHE_5_6, alimentos: 'leite integral; pão integral com requeijão; mamão' },
        {
          tipo: 'refeicao',
          titulo: 'Refeição',
          alimentos: 'arroz; feijão carioca; peixe ao molho de tomate; purê de abóbora; tangerina',
        },
        { tipo: 'lanche', titulo: LANCHE_4_8, alimentos: 'leite integral; cuscuz de milho' },
      ],
      nutricional: [
        { refeicao: LANCHE_5_6, energiaKcal: 270, carboidratosG: 38, proteinasG: 12, lipidiosG: 8 },
        { refeicao: 'Refeição', energiaKcal: 470, carboidratosG: 66, proteinasG: 24, lipidiosG: 11 },
        { refeicao: LANCHE_4_8, energiaKcal: 310, carboidratosG: 46, proteinasG: 10, lipidiosG: 9 },
      ],
    },
    '2026-10-16': {
      data: '2026-10-16',
      faixa: 'Todas as idades',
      origem: 'ficticio',
      publicadoEm: '07/10/2026, às 10:44',
      refeicoes: [
        { tipo: 'lanche', titulo: LANCHE_5_6, alimentos: 'vitamina de banana; biscoito de polvilho' },
        {
          tipo: 'refeicao',
          titulo: 'Refeição',
          alimentos: 'macarrão com carne moída; salada de alface e tomate; abacaxi',
        },
        { tipo: 'lanche', titulo: LANCHE_4_8, alimentos: 'iogurte natural; pão tipo forma com muçarela' },
      ],
      nutricional: [
        { refeicao: LANCHE_5_6, energiaKcal: 260, carboidratosG: 42, proteinasG: 7, lipidiosG: 7 },
        { refeicao: 'Refeição', energiaKcal: 520, carboidratosG: 72, proteinasG: 25, lipidiosG: 14 },
        { refeicao: LANCHE_4_8, energiaKcal: 300, carboidratosG: 36, proteinasG: 14, lipidiosG: 11 },
      ],
    },
  },
}

export function getCardapio(codigoEscola: string, data: string): Cardapio | undefined {
  return CARDAPIOS[codigoEscola]?.[data]
}

export function datasComCardapio(codigoEscola: string): string[] {
  return Object.keys(CARDAPIOS[codigoEscola] ?? {}).sort()
}
