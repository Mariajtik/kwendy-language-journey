# Módulo 1 — Aprendizado guiado com fala, escuta e escrita integrados

Baseado nas 10 páginas do livro anexadas (Saudação/Identificação, De manhã, Na rua, Vokololo, No mercado, Pocitanda, vocabulário e diálogos com verbos e advérbios de lugar Pi/Kupi).

## 1. Remoções

- **BottomNav (`src/components/BottomNav.tsx`)**: remover a entrada `"Fala & Escuta"` da lista `moreOptions`. A pill/menu deixa de existir.
- **App.tsx**: remover a rota `/secao/fala-escuta` e o import de `FalaEscutaScreen`.
- **Arquivar** `src/screens/FalaEscutaScreen.tsx` (deletar) e `src/data/falaEscutaPool.ts` (o conteúdo migra para dentro das lições).
- **Conquistas**: manter a conquista "Boca de Ouro" mas atualizar a descrição para "Pratique 5 frases de pronúncia nas lições". O contador `STATS.falaGravacoes` continua sendo incrementado dentro dos passos de fala das lições.

## 2. Nova estrutura de dados de conteúdo (`src/data/licoes/`)

Cada lição do módulo 1 passa a ter um **script de passos**, tipo:

```ts
type Personagem = "kwendi" | "otchali" | "yellen" | "hossy" | "kapt" | "kapo" | "laura" | "cile" | "narrador";

type Passo =
  | { tipo: "aprender_palavra"; umbundu: string; pt: string; exemplo?: string }
  | { tipo: "dialogo"; falas: { personagem: Personagem; umbundu: string; pt: string }[] }
  | { tipo: "escuta_escolha"; audio: string; opcoes: string[]; correta: number }   // ouvir e escolher tradução
  | { tipo: "traduzir_pt_umbundu"; pt: string; opcoes: string[]; correta: number }
  | { tipo: "traduzir_umbundu_pt"; umbundu: string; opcoes: string[]; correta: number }
  | { tipo: "escrever"; pergunta: string; resposta: string }                        // escrita livre (normaliza acentos)
  | { tipo: "montar_frase"; alvo: string; pecas: string[] }                         // arrastar/tocar palavras em ordem
  | { tipo: "falar"; frase: string; pt: string };                                   // gravação + match simulado

type Licao = { id: string; titulo: string; personagens: Personagem[]; passos: Passo[] };
```

Arquivos:

- `src/data/licoes/m1.ts` — array de `Licao` para o módulo 1
- `src/data/licoes/vocabulario.ts` — dicionário unificado (umbundu → pt + exemplo) usado pelo popover de "palavra nova"

## 3. Currículo do Módulo 1 (reformulado)

Ampliar `CURRICULO[m1]` em `src/data/curriculo.ts` para refletir o livro. O `mk()` continua gerando lições numeradas + báu. Nova composição das unidades (5 unidades, ~35 lições):

- **U1 · Identificação pessoal (1.1)** — 7 lições: "Como te chamas", "Eu sou", "Como estás?", "Como passou o dia?", "Como estás doente?", "Reencontro", "Diálogo Kwendi ↔ Otchali".
- **U2 · De manhã (1.2 Lomele)** — 7 lições: "O sol nasce", "Já amanheceu", "Passei bem a noite", "Onde vais/vamos?", "Não temos comida", "Buscar água na fonte", "Diálogo Yellen ↔ Hossy".
- **U3 · Na rua (1.3 Vokololo)** — 7 lições: "Onde vais? / Pi enda?", "Vou à escola / Ndenda kosikola", "Onde estudas?", "Escola Ngola Kanini", "Quantos professores?", "Quantos anos tens?", "Diálogo Kwendi ↔ Otchali".
- **U4 · No mercado (1.3 Pocitanda)** — 7 lições: "Quanto é? / Ciñgami?", "Vinte kwanzas", "É caro!", "Preço do fuba", "Comprar batata-doce", "Não compro mais", "Diálogo Yellen ↔ Hossy".
- **U5 · Palavras Novas + revisão** — 6 lições: "Pi onde (interrogativo)", "Kupi aonde (após verbo)", "Twenda kupi", "Ndikakala kupi", "Vokololo — na rua alargado", "Revisão final do módulo".

Total ≈ 34 lições + 5 báus. Fica dentro do limite pedido (até 100) e mapeia 1:1 com o livro.

## 4. Fluxo de cada lição (ordem obrigatória, sem pular)

Para cada palavra/frase nova, a lição avança sempre nesta sequência:

1. **Aprender** — cartão "Palavra nova" com Umbundu grande, PT em cinza, botão 🔊 pronúncia e exemplo. Botão único **"Entendi"** para avançar. Toda palavra em Umbundu que aparecer em passos seguintes vira **tocável** (popover com tradução + 🔊), estilo Duolingo.
2. **Diálogo** — quando presente, cartão de conversação animado com avatares (Kwendi/Otchali ou Yellen/Hossy) em balões alternados; cada balão em Umbundu com 🔊, e tradução por baixo. Botão "Continuar".
3. **Exercícios de escuta** — `escuta_escolha` (ouvir e escolher a tradução correta entre 3 opções).
4. **Exercícios de escrita** — `traduzir_pt_umbundu`, `traduzir_umbundu_pt`, `montar_frase` (arrastar peças) e `escrever` (input livre, comparação normalizada — ignora acentos/caps).
5. **Exercícios de fala** — `falar`: mostra a frase, botão de microfone grande (reaproveita `MediaRecorder` do `FalaEscutaScreen` atual), match simulado 70–95%, incrementa `STATS.falaGravacoes` e dá XP.

Regras:

- Um passo só se desbloqueia depois do anterior; passos de exercício exigem que **todas** as palavras usadas já tenham sido apresentadas em passos "aprender".
- Barra de progresso superior + coração/vidas mantidos como já existem.
- Erro em exercício → tira 1 vida (`perderVida()`), como hoje.
- Ao fim: mesma tela de "Lição completa" com XP e diamantes, `concluirSeccao(id)`.

## 5. Refactor da tela

`src/screens/LessonScreen.tsx` deixa de ter `QUESTIONS` hard-coded e passa a:

- carregar `LICOES[id]` do novo `src/data/licoes/m1.ts`;
- renderizar um dos componentes por passo em `src/components/licao/*`:
  - `AprenderPalavra.tsx`
  - `DialogoPersonagens.tsx` (usa avatares de `src/assets/characters/*`)
  - `EscutaEscolha.tsx` (extraído do `FalaEscutaScreen`)
  - `TraduzirEscolha.tsx` (o quiz atual, reutilizado)
  - `MontarFrase.tsx`
  - `EscreverLivre.tsx`
  - `FalarFrase.tsx` (gravação, extraído do `FalaEscutaScreen`)
- palavra clicável: componente `PalavraTocavel.tsx` usado por `Aprender`, `Dialogo` e prompts de exercícios.
- Fallback: se `LICOES[id]` não existir (unidades de outros módulos ainda não migradas), continuar com o quiz antigo estático para não quebrar o resto do app.

## 6. Personagens e áudio

- Reusa `src/assets/characters/{kwendi,otchali,yellen,hossy,kiame,suzana,kekehan}.jpg` para diálogos.
- Áudio: continua com `speechSynthesis` PT-PT (rate 0.85) — não há gravações reais das falas. Fica preparado para trocar por MP3s no futuro (`audio?: string` no passo).

## 7. Detalhes técnicos

- Conteúdo em `m1.ts` transcrito palavra-por-palavra das 10 fotografias (Kapt/Kapo/Kwendi/Otchali/Yellen/Hossy/Laura/Cile), preservando as saudações "Wakolapo?", "Ndakolapo ciwa", "Pi enda?", "Ndenda kosikola", numerais 1–10 até "vakwi atatu" (30), "Onjo yene pi yikasi?", advérbios Pi/Kupi, etc.
- Novas palavras únicas aproveitam também o `DICIONARIO` existente (`src/data/dicionario.ts`), estendido para cobrir todos os termos do livro que ainda faltam.
- Sem alterações no back-end (Supabase).
- Testes: `bunx vitest run` e `tsgo` para type-check.

## Entregáveis

- Módulo 1 com ~34 lições novas guiadas, com diálogos Kwendi↔Otchali e Yellen↔Hossy em cada unidade.
- Palavra nova sempre aprendida antes de ser exercitada, com popover clicável de tradução + pronúncia.
- Escrita, fala e escuta integrados dentro da lição.
- Pill/menu **"Fala & Escuta" removida** do BottomNav e rota apagada.