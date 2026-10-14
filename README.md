# Prato Consciente — protótipo interativo

> **Conectando famílias, estudantes e escolas a fim de diminuir o desperdício alimentar na rede municipal de ensino.**

**▶ Acesse a demonstração:** https://kariniroani-tech.github.io/PratoConscienteDemonstrativo/

Feita para funcionar no celular — o público pode abrir pelo QR code durante a apresentação e seguir o tutorial guiado
na palma da mão.

> **Aviso:** protótipo demonstrativo. Não é um serviço oficial da Prefeitura de São Paulo. Dados e interações são
> usados apenas para apresentar a proposta — nenhum relato é enviado a servidores; tudo fica no próprio navegador.

---

## O que é

O **Prato Consciente** é uma proposta para **ampliar o Prato Aberto**, o serviço da Secretaria Municipal de Educação
de São Paulo em que as famílias encontram a escola e consultam o cardápio da alimentação escolar.

Hoje o Prato Aberto **informa**: a família vê o que será servido. Com o Prato Consciente, ele também passaria a
**escutar**: além de consultar o cardápio, a família poderia contar como foi a experiência da criança com aquela
refeição — se ela conhecia o alimento, se ele faz parte dos hábitos da casa, preferências ou sugestões.

Este repositório é a **demonstração interativa** dessa ideia: uma reconstrução das telas do Prato Aberto (feita a
partir das capturas da apresentação) com a nova funcionalidade incorporada, um tutorial que conduz o visitante por
toda a jornada e uma simulação de como os relatos poderiam apoiar a gestão pública.

## De onde vem

- **Autoria:** proposta conceitual de **Karini Roani**, estagiária na **Secretaria Municipal de Educação de São Paulo**.
- **Contexto:** desenvolvida para o desafio de projetos de estágio da Prefeitura de São Paulo (**Projetos de Estágios
  2026**), no tema *São Paulo Plural: Incluindo Pessoas, Transformando o Serviço Público*.
- 🏅 **Reconhecimento:** o Prato Consciente foi **selecionado no desafio** e ficou em **6º lugar** na classificação dos
  projetos aprovados na **ala individual**.

A proposta nasce de uma trajetória pessoal: a alimentação escolar sempre esteve presente na vida da autora — a mãe
dela trabalha com a merenda na cidade natal, no interior. Na faculdade e no estágio na Prefeitura, ela passou a
enxergar a dimensão dessa política pública em São Paulo — e as perguntas que ela ainda convida a fazer.

## O que o projeto significa

**Uma política enorme que precisa enxergar cada pessoa.** A rede municipal de São Paulo atende mais de 1 milhão de
estudantes e serve milhões de refeições por dia. Por trás dos números de refeições produzidas, aceitabilidade e
desperdício, existe um estudante — e cada criança chega à escola com uma realidade diferente.

**E se o desperdício também for um sinal?** Reduzir o desperdício exige investigar *por que* ele acontece:

| Observar | Compreender | Ouvir | Agir |
| --- | --- | --- | --- |
| O alimento não foi consumido | Por que isso pode estar acontecendo? | Incluir a perspectiva das famílias | Transformar escuta em melhoria |

**Incluir é reconhecer diferentes realidades:** cultura alimentar, hábitos de cada casa, contato prévio com o alimento
e preferências individuais. Uma criança pode recusar um alimento porque não gostou da preparação, porque teve pouco
contato com ele, porque o hábito em casa é diferente ou por uma experiência individual com sabor, cheiro ou textura —
*hipóteses a investigar, não conclusões antecipadas*.

**O que já existe — e a lacuna.** A rede já conta com o Prato Aberto (cardápio e informações nutricionais), o teste de
aceitabilidade (aceitação das preparações pelas crianças) e as ações de Educação Alimentar e Nutricional (EAN). A
pergunta que fica: *estamos compreendendo o que acontece antes de o estudante chegar à escola?*

**A proposta não cria uma plataforma do zero: amplia uma ferramenta existente.** O relato da família viraria um dado
para a gestão pública:

```
Famílias respondem → Respostas sistematizadas → CODAE identifica padrões
→ Análise cruza com o teste de aceitabilidade → EAN planeja ações → Acompanhamento observa resultados
```

Um exemplo: uma preparação apresenta baixa aceitação (**sinal**); famílias relatam que ela não faz parte dos hábitos
alimentares em casa (**contexto**); a equipe investiga o padrão e planeja ações de EAN ou reformula os cardápios
(**resposta**); e acompanha se a aceitação muda ao longo do tempo (**aprendizado**).

> *“Para entender o que sobra e por que isso acontece, precisamos ouvir.”*

## O que a demonstração faz

| Parte | O que o visitante vê |
| --- | --- |
| **Tela inicial** | Explica a demonstração e oferece dois caminhos: **demonstração guiada** (recomendada, 3 a 5 minutos) ou **exploração livre**. |
| **Prato Aberto** *(já existe)* | Reconstrução das telas dos slides 11 a 14: início com mapa, busca da escola (EMEI FELIPE MESTRE JOU (TERC.)), calendário e cardápio de 14/10/2026 com “Informações nutricionais”. |
| **Prato Consciente** *(proposta)* | Painel integrado ao cardápio (slide 15) com **Classe do aluno** e **Relato da família**, validação, envio simulado e confirmação com resumo. Não pede nome nem dados pessoais da criança. |
| **Da escuta à ação** *(simulação)* | Fluxo clicável do slide 16, exemplo do slide 17, painel com **dados fictícios**, implementação gradual (slide 19) e encerramento (slide 20). |
| **Tutorial interativo** | 10 etapas que acompanham as interações reais: destaca o elemento, escurece o resto, mostra progresso, tem **Voltar / Próximo / Sair** e só avança quando a ação obrigatória é feita. Atalhos “fazer por mim” ajudam em apresentações ao vivo. |
| **Modo apresentação** | Recomeça com dados limpos, mostra o progresso da jornada, permite navegar com ← → e liga **marcações** que identificam na tela o que já existe, o que é proposta e o que é simulação. |

### Pensada para o celular

O público acessa pelo QR code, então a experiência foi priorizada para telas pequenas: botões principais visíveis sem
rolar, tutorial em faixa compacta (que pode ser minimizada e se recolhe sozinha enquanto a pessoa digita), campos com
fonte de 16 px (sem zoom automático no iPhone), áreas de toque maiores e nenhuma rolagem horizontal.

### O que é real, proposta e simulação

| Tipo | Na demonstração |
| --- | --- |
| **Já existe** (Prato Aberto) | Telas reconstruídas a partir das capturas da apresentação. O mapa é **ilustrativo** (não usa dados de mapas reais). |
| **Proposta** (Prato Consciente) | O formulário de relato e sua confirmação, identificados com a etiqueta “Novo · proposta”. |
| **Simulação** | Envio do relato (fica só no navegador), fluxo “Da escuta à ação”, painel com números fictícios, cardápios de 13, 15 e 16/10 e valores nutricionais (todos fictícios e sinalizados). |

O mapeamento completo entre slides e telas está em [`FIDELIDADE_SLIDES.md`](FIDELIDADE_SLIDES.md), e o roteiro de
fala para a apresentação em [`ROTEIRO_APRESENTACAO.md`](ROTEIRO_APRESENTACAO.md).

## Como rodar localmente

Requer Node.js 20.19+ (ou 22.12+).

```bash
npm ci
npm run dev
```

Depois, abra http://localhost:5173/PratoConscienteDemonstrativo/

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos + build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Lint com oxlint |

## Publicação no GitHub Pages

O workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) compila e publica o site a cada `push` na
branch `main` (e também pode ser disparado manualmente em **Actions**).

1. Em **Settings → Pages → Build and deployment**, escolha **Source: GitHub Actions** (uma única vez).
2. Envie alterações para `main`; ao fim do workflow, o site fica em
   `https://kariniroani-tech.github.io/PratoConscienteDemonstrativo/`.

O `base` do Vite está em [`vite.config.ts`](vite.config.ts) com o nome do repositório
(`/PratoConscienteDemonstrativo/`). Se o repositório for renomeado, ajuste `repositoryName` ou defina a variável
`BASE_PATH`. As rotas usam `HashRouter` (`#/...`), então atualizar a página ou abrir um link direto nunca dá erro 404.

## Estrutura

```
src/
├── pages/                 Tela inicial, moldura do protótipo e “Da escuta à ação”
├── components/
│   ├── prato-aberto/      Telas reconstruídas do Prato Aberto (mapa, busca, calendário, cardápio)
│   ├── prato-consciente/  A proposta: painel, formulário e confirmação
│   ├── gestao/            Gráficos do painel demonstrativo
│   ├── demo/              Barra da demonstração, ajuda, legendas e etiquetas
│   └── ui/                Componentes genéricos (modal)
├── tour/                  Tutorial interativo (etapas, estado, camada de destaque)
├── data/                  Dados da demonstração, separados das telas
├── store/                 Estado da simulação (Zustand, salvo no navegador)
└── lib/                   Datas, textos e armazenamento seguro
```

## Tecnologias

React 19 · TypeScript · Vite · Tailwind CSS · React Router (HashRouter) · Zustand · Lucide · fontes empacotadas com
Fontsource (funciona sem depender de serviços externos durante a apresentação).

## Créditos

- **Proposta Prato Consciente:** Karini Roani — Secretaria Municipal de Educação de São Paulo.
- O nome e a identidade visual do **Prato Aberto** pertencem à Prefeitura de São Paulo e aparecem aqui apenas para
  ilustrar onde a proposta se encaixaria. Este protótipo não tem vínculo oficial com o serviço.
