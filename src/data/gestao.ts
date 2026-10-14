/** Etapas do fluxo "Da escuta à gestão pública" — títulos e subtítulos transcritos do slide 16. */
export interface EtapaFluxo {
  id: string
  titulo: string
  subtitulo: string
  /** Explicação simples exibida ao clicar (texto da demonstração, não do slide). */
  explicacao: string
  /** Como a etapa aparece no exemplo do slide 17. */
  noExemplo: string
}

export const ETAPAS_FLUXO: EtapaFluxo[] = [
  {
    id: 'familias',
    titulo: 'Famílias',
    subtitulo: 'respondem',
    explicacao:
      'Ao consultar o cardápio no Prato Aberto, a família pode registrar uma percepção: se a criança conhecia o alimento, se ele faz parte dos hábitos de casa, preferências ou sugestões. Basta indicar a classe — sem nome ou dados pessoais da criança.',
    noExemplo: 'Várias famílias comentam que uma preparação não faz parte dos hábitos alimentares em casa.',
  },
  {
    id: 'respostas',
    titulo: 'Respostas',
    subtitulo: 'sistematizadas',
    explicacao:
      'Os relatos são organizados por escola, data, classe e preparação. A escuta individual passa a formar um conjunto de informações que pode ser lido com cuidado, sem expor as crianças.',
    noExemplo: 'Os relatos sobre a mesma preparação são agrupados por unidade e por período.',
  },
  {
    id: 'codae',
    titulo: 'CODAE',
    subtitulo: 'identifica padrões',
    explicacao:
      'A CODAE, área responsável pela alimentação escolar, observa padrões: preparações com muitos relatos parecidos, diferenças entre regiões ou entre faixas etárias.',
    noExemplo: 'O padrão chama atenção: o mesmo motivo aparece em diferentes unidades.',
  },
  {
    id: 'analise',
    titulo: 'Análise',
    subtitulo: 'cruza com o teste de aceitabilidade',
    explicacao:
      'Os relatos são comparados aos resultados do teste de aceitabilidade, que já avalia a aceitação das preparações pelas crianças. Juntas, as informações ajudam a entender não só se um alimento foi recusado, mas por que isso pode ter acontecido.',
    noExemplo: 'A preparação também apresenta baixa aceitação no teste de aceitabilidade.',
  },
  {
    id: 'ean',
    titulo: 'EAN',
    subtitulo: 'planeja ações',
    explicacao:
      'Com base nos padrões, a equipe de Educação Alimentar e Nutricional pode planejar ações educativas nas unidades — como apresentar alimentos pouco conhecidos às crianças — ou avaliar ajustes no cardápio.',
    noExemplo: 'A equipe planeja ações de EAN para aproximar as crianças do alimento ou reformula o cardápio.',
  },
  {
    id: 'acompanhamento',
    titulo: 'Acompanhamento',
    subtitulo: 'observa resultados',
    explicacao:
      'Depois das ações, acompanha-se a evolução da aceitabilidade e dos relatos ao longo do tempo. O ciclo se fecha: o feedback volta ao serviço em forma de ação.',
    noExemplo: 'Acompanha-se se a aceitação se modifica ao longo do tempo.',
  },
]

/** Exemplo "Da informação à ação" — texto transcrito do slide 17. */
export const EXEMPLO_ACAO: { rotulo: string; texto: string; cor: 'verde' | 'roxo' }[] = [
  { rotulo: 'Sinal', texto: 'Uma preparação apresenta baixa aceitação', cor: 'verde' },
  { rotulo: 'Contexto', texto: 'Famílias relatam que não faz parte dos hábitos alimentares em casa', cor: 'roxo' },
  {
    rotulo: 'Resposta',
    texto: 'A equipe investiga o padrão e planeja ações de EAN ou reformula os cardápios',
    cor: 'verde',
  },
  { rotulo: 'Aprendizado', texto: 'Acompanha se a aceitação se modifica ao longo do tempo', cor: 'roxo' },
]

/** Implementação gradual — slide 19. */
export const IMPLEMENTACAO: { numero: string; titulo: string; texto: string }[] = [
  { numero: '01', titulo: 'Piloto', texto: 'Testar em escala reduzida' },
  { numero: '02', titulo: 'Análise', texto: 'Organizar feedbacks e observar padrões' },
  { numero: '03', titulo: 'Ajustes', texto: 'Aprimorar perguntas e fluxo' },
  { numero: '04', titulo: 'Ampliação', texto: 'Expandir gradualmente conforme resultados' },
]

/*
 * PAINEL DEMONSTRATIVO — TODOS OS NÚMEROS ABAIXO SÃO FICTÍCIOS.
 * Servem só para ilustrar como os relatos poderiam ser lidos pela gestão.
 * Não são estatísticas oficiais nem resultados de qualquer escola.
 */
export const PAINEL_FICTICIO = {
  relatosRecebidos: 248,
  unidadesNoPiloto: 12,
  classesComRelatos: 41,
  /** As categorias são as hipóteses do slide 8 ("hipóteses a investigar"). */
  motivos: [
    { rotulo: 'Pouco contato com o alimento', valor: 96 },
    { rotulo: 'Hábito alimentar diferente em casa', valor: 71 },
    { rotulo: 'Não gostou da preparação', valor: 52 },
    { rotulo: 'Experiência individual com sabor, cheiro ou textura', valor: 29 },
  ],
  /** Aceitabilidade (%) de uma "Preparação A" fictícia, mês a mês. */
  aceitabilidade: [
    { rotulo: 'Mês 1', valor: 61 },
    { rotulo: 'Mês 2', valor: 58 },
    { rotulo: 'Mês 3', valor: 60 },
    { rotulo: 'Mês 4', valor: 66 },
    { rotulo: 'Mês 5', valor: 72 },
    { rotulo: 'Mês 6', valor: 77 },
  ],
  /** A ação de EAN fictícia acontece entre este mês (índice) e o seguinte. */
  acaoDepoisDoIndice: 2,
}
