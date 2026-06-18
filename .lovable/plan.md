## Objetivo

Estender `src/data/curriculo.ts` com novos módulos, seguindo a ordem dos capítulos do livro fotografado. Cada módulo mantém o mesmo formato dos atuais (cor HSL, cor escura, unidades com secções `licao` + báu final via `mk`). Faça o máximo de módulos tendo em conta o índice e o que já temos, sem ser repetitiva. 

## Novos módulos a adicionar

**M6 — Sabedoria Ovimbundu** (Cap. II — Provérbios) — castanho terroso

- U1 Provérbios do dia-a-dia
- U2 Provérbios sobre família e comunidade
- U3 Provérbios sobre trabalho e natureza
- U4 Interpretar e usar provérbios

**M7 — Pronomes** (Cap. III) — azul

- U1 Pronomes pessoais e suas formas
- U2 Pronomes possessivos
- U3 Pronomes demonstrativos
- U4 Pronomes interrogativos e indefinidos

**M8 — Advérbios** (Cap. IV) — amarelo-mostarda

- U1 Advérbios de modo
- U2 Advérbios de lugar (Pi, Kupi)
- U3 Advérbios de quantidade e tempo
- U4 Advérbios de dúvida e negação

**M9 — Conjunções e frases compostas** (Cap. V) — turquesa

- U1 Copulativas e disjuntivas
- U2 Adversativas e conclusivas
- U3 Condicionais e causais
- U4 Temporais, concessivas e comparativas

**M10 — Vida quotidiana** (vocabulário temático, parte 1) — laranja-quente

- U1 Compartimentos da casa
- U2 Loiça e utensílios
- U3 Vestuário
- U4 Alimentação

**M11 — Trabalho e campo** (vocabulário temático, parte 2) — verde-oliva

- U1 Vocabulário agrícola
- U2 Profissões
- U3 Animais (revisão e expansão)
- U4 Aves (revisão e expansão)

**M12 — Verbos e tempos** (Cap. VI) — vinho/bordô

- U1 Formação dos tempos verbais + Presente do indicativo
- U2 Pretérito perfeito e imperfeito do indicativo
- U3 Futuro do indicativo e Modo condicional
- U4 Modo conjuntivo (presente, pretérito, futuro)

Cada unidade reusa o helper `mk(unidadeId, [titulos])` (3–4 lições + báu).

## Notas técnicas

- Apenas edita `src/data/curriculo.ts` adicionando os módulos ao array `CURRICULO`. Nada mais muda — `HomeScreen`, animações, totem, progresso e cores funcionam automaticamente porque já leem `modulo.cor`/`corEscura` e iteram dinamicamente.
- Cores escolhidas para serem distintas das atuais (M1 vermelho, M2 laranja, M3 magenta, M4 roxo, M5 verde):
  - M6 `28 45% 38%` / `28 45% 28%` (castanho)
  - M7 `210 80% 48%` / `210 80% 36%` (azul)
  - M8 `42 90% 48%` / `42 90% 36%` (mostarda)
  - M9 `178 65% 40%` / `178 65% 30%` (turquesa)
  - M10 `15 85% 55%` / `15 85% 42%` (laranja-quente)
  - M11 `90 45% 38%` / `90 45% 28%` (verde-oliva)
  - M12 `345 65% 42%` / `345 65% 30%` (vinho)
- Animações temáticas em `HomeScreen` (mapa `ANIMACOES_UNIDADE`) só cobrem M1–M5; mantém-se. Posso opcionalmente adicionar mais variantes depois.
- Sem alterações de layout, rotas ou hooks. `getUnidade`, `getSeccao`, `getProximaUnidade`, `PRIMEIRA_UNIDADE` continuam corretos.

## Fora de escopo

- Conteúdo real das lições (perguntas/respostas). O builder apenas cria a estrutura do currículo; o conteúdo de cada lição é gerado/editado separadamente.
- Novas animações de banner para os módulos novos.
- Curiosidades culturais associadas aos novos módulos.
- Quantos módulos o duolingo tem?