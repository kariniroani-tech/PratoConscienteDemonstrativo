# Fidelidade aos slides

Registro de como cada tela do protótipo se relaciona com a apresentação *Prato Consciente — proposta conceitual*
(20 slides), o que foi reproduzido, o que não pôde ser identificado, o que foi simulado e quais decisões existem só
para facilitar a demonstração.

Cores, medidas e fontes foram conferidas nas capturas originais extraídas do PDF (amostragem de pixels). Exemplos: roxo
do painel `#863db7 → #701baa`, botão azul `#2881bb`, data selecionada `#9468ac`, fundo do cardápio `#e9e8ee`, botão
“Enviar Relato” `#6a1b9a`.

## 1. Slide de origem de cada tela

| Tela do protótipo | Slide(s) | Observação |
| --- | --- | --- |
| Tela inicial da demonstração | 1, 9, 10, 20 | Composição da capa (foto + painel roxo + cartão branco), “A proposta” (slide 9), jornada em 4 passos (slide 10) e logotipo (slide 20). |
| Prato Aberto — início | 11 | Painel roxo com padrão de alimentos, “COMIDA BOA NÃO TEM SEGREDO”, texto e botão “ENCONTRE SUA ESCOLA”; mapa escurecido à direita. |
| Prato Aberto — busca | 12 | Barra lateral com campo de busca e resultado “EMEI FELIPE MESTRE JOU (TERC.)”, mapa com marcadores, agrupamentos e localização. |
| Prato Aberto — escola e calendário | 13 | Cabeçalho roxo com o nome da escola, “Outubro 2026”, número grande 14 com 13 e 15 esmaecidos, “Quarta-feira, Outubro 2026”, grade do mês; acordeão “Todas as idades” fechado. |
| Prato Aberto — cardápio | 14 | Acordeão aberto com os três tipos de refeição, aviso sobre alterações, link “Notas” e “Informações nutricionais”. |
| Prato Consciente — formulário | 15 | Painel “Prato Consciente” com “Classe do aluno” (Infantil II - B), “Relato da família” e botão “Enviar Relato”. |
| Confirmação do relato | — | Não aparece nos slides; criada para fechar a jornada (ver seção 5). |
| Da escuta à ação | 16, 17, 19, 20 | Fluxo de seis etapas (16), exemplo Sinal/Contexto/Resposta/Aprendizado (17), implementação gradual (19), encerramento e citação (20). |
| Conteúdos de apoio | 2 a 8, 18 | Trajetória, contexto, problema, inclusão, ponto de partida e hipóteses aparecem nos textos explicativos, no painel e no README. |

## 2. Componentes reproduzidos

- **Painel roxo** com degradê e padrão de silhuetas de alimentos (desenhado do zero em SVG, sem copiar a arte oficial).
- **Logotipo “prato aberto”** recriado em fonte manuscrita (Satisfy) — aproximação, não é a arte original.
- **Botão “Encontre sua escola”** com ícone de alfinete, sombra inferior e caixa alta.
- **Campo de busca** sobre faixa roxa, com seta de voltar e “x” de limpar; **resultado** com ícone de lápis em círculo
  magenta, distância “9.3 km”, endereço “Avenida Joao Paulo I, 1347 - Freguesia Do Ó” e “Código: 91456” (grafia
  mantida como na captura, sem acento em “Joao”).
- **Mapa** com tons escurecidos, ruas, rio, áreas verdes e comerciais, nomes de bairros, marcadores magenta, agrupamentos
  azuis com “5” e ponto azul de localização.
- **Calendário** com setas triangulares azuis, número grande da data, dias vizinhos esmaecidos, legenda do dia da
  semana e grade “Dom … Sáb” com o dia selecionado em lilás e ponto embaixo.
- **Acordeão do cardápio** (cabeçalho cinza, título em Montserrat, “Cardápio publicado em 07/10/2026, às 10:44”,
  chevron lilás fechado e cinza aberto).
- **Refeições** com ícones de lanche (biscoito) e refeição (prato), transcritas literalmente:
  - Lanche - Permanência de 5 ou 6 horas: *leite integral com chocolate em pó; biscoito salgado ; maçã*
  - Refeição: *arroz; feijão carioca; estrogonofe de carne; batata rústica; melão*
  - Lanche - Permanência de 4 ou 8 horas: *leite integral com chocolate em pó; pão tipo forma integral com muçarela*
- **Formulário Prato Consciente** (cartão branco sobre fundo cinza, seletor, área de texto, botão roxo largo).
- **Fluxo e exemplo de gestão** com os textos dos slides 16 e 17.

## 3. Elementos que não puderam ser identificados (e a aproximação adotada)

| Elemento | Situação | Aproximação |
| --- | --- | --- |
| Conteúdo de “Informações nutricionais” | Os slides mostram só o link. | Painel com tabela de **valores fictícios**, identificados como tal. |
| Conteúdo de “Notas” | Só o link aparece. | Janela explicando que o conteúdo não foi reproduzido. |
| Mapa real | As capturas usam um mapa de terceiros com marca d’água “For development purposes only” e escurecimento típico de chave de desenvolvimento. | Mapa **ilustrativo** em SVG com tons semelhantes, sem marca d’água, sem estabelecimentos comerciais e com aviso “Mapa ilustrativo”. |
| Fonte exata do logotipo e dos títulos do Prato Aberto | Não identificável com certeza. | Satisfy (logotipo), Varela Round (slogan), Montserrat (títulos do cardápio) e Roboto (textos). |
| Demais opções do campo “Classe do aluno” | Só “Infantil II - B” aparece. | Opções ilustrativas: Infantil I - A/B e Infantil II - A/B/C. |
| Aviso no rodapé do slide 15 | Texto truncado/ilegível na montagem (“…excepcionais escolar, autorizaçem se troca”). | Usado o texto completo e legível do slide 14, no painel do cardápio, ao qual ele se refere. |
| Título do slide 15 | “Selecionar **quase** do aluno” (erro de digitação). | Interpretado como “classe do aluno”. |
| Posição do painel Prato Consciente | No slide 15 ele ocupa o lugar de “Todas as idades”. | O cardápio existente fica intacto e o painel da proposta entra **logo abaixo**, como extensão. |

## 4. Informações simuladas

- **Envio do relato:** nada sai do navegador; os relatos ficam no `localStorage` e podem ser apagados em “Reiniciar”.
- **Cardápios de 13, 15 e 16/10/2026:** fictícios, com a etiqueta “Cardápio fictício”. Outros dias mostram que não há
  cardápio publicado na demonstração.
- **Valores nutricionais:** fictícios (etiqueta “Dados fictícios”).
- **Painel demonstrativo** (relatos recebidos, unidades, classes, motivos e aceitabilidade da “Preparação A”):
  fictício, com aviso explícito de que não são estatísticas oficiais. As categorias de motivo são as hipóteses do
  slide 8.
- **Marcadores do mapa:** decorativos e sem nome; nenhuma outra escola foi inventada.
- **Exemplos de relato:** textos fictícios, oferecidos como atalho.

## 5. Recursos que representam a nova proposta

- Painel **Prato Consciente** integrado ao cardápio, com a etiqueta “Novo · proposta” e um filete roxo à esquerda.
- Campos **Classe do aluno** e **Relato da família**, botão **Enviar Relato**.
- Validação: classe obrigatória, relato obrigatório com mínimo de 15 caracteres e bloqueio de dados pessoais óbvios
  (e-mail, CPF, telefone).
- **Confirmação** com resumo (escola, data do cardápio, classe, relato, horário), aviso de que nada foi enviado e o
  botão **Entenda o que acontece com seu relato**.
- **Da escuta à ação:** simulação do fluxo futuro de gestão (não é um módulo existente).

## 6. Decisões de UX adicionadas para a apresentação

- **Tela inicial** com “Iniciar demonstração guiada” e “Explorar livremente” e o aviso de protótipo.
- **Barra superior verde** (fora do sistema simulado) com o aviso, a legenda “Já existe / Proposta / Simulação”,
  **Marcações**, **Reiniciar** e **Início**.
- **Tutorial de 10 etapas** com destaque, escurecimento, progresso, Voltar/Próximo/Sair, avanço só após a ação
  obrigatória, retomada após recarregar a página e atalhos “fazer por mim”.
- **Modo apresentação:** dados limpos ao começar, trilha de progresso clicável e atalhos de teclado (← → Esc).
- **Etiquetas e notas tracejadas** (“Atalho da demonstração”, “Dados fictícios”) para separar complementos do sistema.
- **Atraso curto** ao trocar de data e ao enviar, imitando a resposta de um servidor.
- **Experiência no celular** (o público acessa por QR code):
  - tela inicial com os botões principais visíveis sem rolar;
  - tutorial em faixa compacta, minimizável, que se recolhe enquanto a pessoa digita e começa minimizada nas etapas de
    leitura e no formulário;
  - espaço extra no fim da página durante o tutorial, para que qualquer destaque possa subir acima da faixa;
  - calendário compacto com dias maiores para toque e atalho “Ver o cardápio de …”;
  - campos com fonte de 16 px (evita zoom automático no iPhone) e teclado que só abre quando a pessoa toca no campo;
  - etapas de “Da escuta à ação” em faixa rolável horizontal;
  - botão de ajuda só com ícone e folga no fim das páginas para ele não cobrir conteúdo;
  - nenhuma rolagem horizontal (testado em 360 px de largura).
