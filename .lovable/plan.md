# Para Além das Fronteiras — Jogo Interativo

## Visão geral

Manter a tela atual `/para-alem-fronteiras` (intro com vídeo) e adicionar uma nova tela de **jogo de perguntas e respostas** (`/para-alem-fronteiras/jogo`) com música de fundo (`Perola-Omboio.mp3` enviado), feedback de certo/errado, explicações, recompensas (XP + Diamantes) e conquistas.

A música tocará automaticamente em loop ao entrar no jogo, controlada pelo botão dourado no canto superior direito (já existente).

---

## 1. Upload da música

- Subir `Perola-Omboio.mp3` via `lovable-assets` → `src/assets/perola-omboio.mp3.asset.json`.
- Substituir o `TRACK_URL` vazio em `FronteirasScreen.tsx` pelo `url` do asset.

## 2. Banco de perguntas

Criar `src/data/fronteirasPerguntas.ts` com **~25–30 perguntas** sobre Angola, África, PALOPs e curiosidades do continente (extraídas do conteúdo enviado pelo utilizador). Estrutura:

```ts
export interface Pergunta {
  id: string;
  categoria: "Angola" | "PALOP" | "África Geral" | "Cultura" | "Curiosidades";
  enunciado: string;
  opcoes: string[];        // 4 opções
  respostaCorreta: number; // índice 0–3
  explicacao: string;      // texto curto exibido após responder
}
```

Exemplos:

- "Qual ritmo angolano deu origem ao samba brasileiro?" → Semba
- "Como se chama o pedido de casamento tradicional angolano?" → Alambamento
- "Qual é a planta rara que vive milhares de anos no deserto do Namibe?" → Welwitschia mirabilis
- "Qual é o maior país africano em extensão?" → Argélia (ou Sudão pré-2011, usar Argélia atual)
- "Em que país africano o espanhol é língua oficial?" → Guiné Equatorial
- "Qual é a moeda oficial de Angola e a que rio homenageia?" → Kwanza / Rio Kwanza
- etc.

## 3. Lógica do jogo

Criar `src/screens/FronteirasJogoScreen.tsx`:

- **Embaralhamento**: ao montar, embaralhar a ordem das perguntas (Fisher–Yates) e também as opções dentro de cada pergunta (mantendo `respostaCorreta` atualizado).
- **Sessão**: 10 perguntas por partida.
- **Fluxo por pergunta**:
  1. Mostra enunciado + 4 botões de opção (estilo 3D Duo).
  2. Ao clicar: bloqueia opções, marca verde (correta) / vermelha (errada).
  3. Mostra cartão de explicação + botão "Continuar".
  4. Próxima pergunta com transição (framer-motion).
- **Cabeçalho**: contador `3/10`, barra de progresso, acertos, streak atual.
- **Tela final**: resumo (X/10 acertos, XP ganho, Diamantes ganhos, conquistas desbloqueadas, melhor streak) + botões "Jogar novamente" e "Voltar".
- **Música de fundo**: mesmo padrão do `FronteirasScreen` (botão dourado + `<audio loop>`), persistente entre perguntas.

## 4. Recompensas (XP + Diamantes)

Usando `useSaldo`:


| Evento                | XP        | Diamantes |
| --------------------- | --------- | --------- |
| Resposta correta      | +10       | +1        |
| Streak de 3 seguidas  | +15 bónus | +2 bónus  |
| Streak de 5 seguidas  | +30 bónus | +5 bónus  |
| 10/10 acertos         | +50 bónus | +10 bónus |
| Completar uma partida | +20       | —         |


## 5. Conquistas

Adicionar em `src/data/conquistas.ts` (e expor via `useMissoes.registrarAcao` / `desbloquearConquista`):

- **Explorador de Fronteiras** — Jogar a primeira partida.
- **Sabedoria Angolana** — 10 respostas corretas acumuladas.
- **Mestre do Continente** — 50 respostas corretas acumuladas.
- **Sequência de Ouro** — Streak de 5 acertos numa partida.
- **Pontuação Perfeita** — Acertar 10/10 numa partida.
- **Viajante Constante** — Jogar em 3 dias diferentes.
- **Maratonista Cultural** — Acumular 10 minutos de tempo de jogo.

Persistir em localStorage (chave dedicada `kwendi:fronteiras:stats`):

```ts
{ partidas, acertosTotais, melhorStreak, tempoTotalMs, diasJogados: string[] }
```

Tempo de jogo medido com `performance.now()` entre montagem e desmontagem.

## 6. Navegação

- `FronteirasScreen.tsx` (atual): adicionar botão grande "Começar jogo" que navega para `/para-alem-fronteiras/jogo`.
- `App.tsx`: registar nova rota `<Route path="/para-alem-fronteiras/jogo" element={<FronteirasJogoScreen />} />`.
- Manter botão "Voltar à Home" e o botão dourado de música em ambas as telas.

## 7. Design

Reaproveitar paleta atual (azul primário + dourado dos botões de música), tipografia Nunito, cartões com `rounded-3xl`, sombras 3D Duo. Animar entrada/saída de cada pergunta com `framer-motion`. Feedback visual:

- Correto: opção verde + ícone `Check`, micro-confetti opcional.
- Errado: opção vermelha + ícone `X`, opção correta destacada.

## Fora do escopo

- Sincronização com backend (tudo local).
- Multiplayer / leaderboards.
- Editor de perguntas.
- Som de acerto/erro (pode ser adicionado depois).

## Arquivos afetados

- **Novos**: `src/assets/perola-omboio.mp3.asset.json`, `src/data/fronteirasPerguntas.ts`, `src/screens/FronteirasJogoScreen.tsx`.
- **Editados**: `src/App.tsx`, `src/screens/FronteirasScreen.tsx` (TRACK_URL + botão "Começar jogo"), `src/data/conquistas.ts`, `src/hooks/useMissoes.ts` (novos tipos de ação, se necessário).