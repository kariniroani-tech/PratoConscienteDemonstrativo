export interface Escola {
  codigo: string
  nome: string
  endereco: string
  /** Distância exibida no resultado da busca (slide 12). */
  distancia: string
  /** Turmas disponíveis no campo "Classe do aluno". */
  classes: string[]
}

/**
 * A demonstração usa somente a unidade que aparece nas capturas da apresentação,
 * com os dados transcritos do slide 12. Nenhuma outra escola é inventada.
 */
export const ESCOLAS: Escola[] = [
  {
    codigo: '91456',
    nome: 'EMEI FELIPE MESTRE JOU (TERC.)',
    // Grafia mantida exatamente como na captura do Prato Aberto (sem acento em "Joao").
    endereco: 'Avenida Joao Paulo I, 1347 - Freguesia Do Ó',
    distancia: '9.3 km',
    // "Infantil II - B" aparece no slide 15. As demais turmas são opções ilustrativas,
    // necessárias para que o campo de seleção funcione na demonstração.
    classes: ['Infantil I - A', 'Infantil I - B', 'Infantil II - A', 'Infantil II - B', 'Infantil II - C'],
  },
]

export function findEscola(codigo: string | undefined): Escola | undefined {
  return ESCOLAS.find((escola) => escola.codigo === codigo)
}
