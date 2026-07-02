
## O que vai mudar

### 1) Lições especiais do Báu — conversa pessoal com o utilizador como personagem

Hoje o báu abre apenas um popup de recompensa. Vou transformar cada báu numa **mini‑cena de conversação interactiva** em que:

- Duas personagens (ex.: Kwendi & Otchali, Yellen & Hossy, Chac & Kapit) aparecem em avatares recortados (PNG cutout, sem background), viradas uma para a outra num palco em ecrã cheio.
- O utilizador **encarna uma das personagens** (a que “fica do lado dele”). A outra fala primeiro.
- A cada turno da NPC surge um balão em Umbundu (+ tradução PT + botão Ouvir + palavras tocáveis já existentes). O utilizador escolhe **1 de 2–3 respostas** possíveis para prosseguir.
- Só uma resposta é apropriada; erradas custam vida (como qualquer exercício). Feedback verde/vermelho e a resposta certa é revelada.
- No fim da conversa, o báu abre normalmente e concede a recompensa que já existe hoje.

Tecnicamente:
- Novo tipo de passo `conversa_escolha` em `tipos.ts`: `{ tipo: "conversa_escolha", eu: Personagem, npc: Personagem, pergunta: Fala, opcoes: Fala[], correta: number }`.
- Novo componente `ConversaEscolhaPasso` em `PassoComponents.tsx` com layout de “palco”: fundo neutro/gradiente do tema, avatares grandes recortados nas laterais (mirror horizontal na do utilizador), balão da NPC em cima, cartões de resposta em baixo.
- Novo ficheiro `src/data/licoes/baus.ts` com 5 diálogos (1 por unidade do M1) reutilizando o vocabulário já introduzido nessa unidade.
- `LessonScreen`: quando `id` termina em `bau`, carrega da tabela dos báus em vez de `getLicao` normal; ao concluir, mantém a lógica actual de conclusão + recompensa.

### 2) Tipos de exercício ao estilo Duolingo em falta

Hoje temos: `aprender`, `dialogo`, `escuta_escolha`, `traduzir_pt_umbundu`, `traduzir_umbundu_pt`, `montar_frase`, `escrever`, `falar`.

Faltam quatro clássicos do Duolingo que vou adicionar:

| Novo tipo | O que faz |
|---|---|
| `emparelhar` | Grelha 2×N de pares Umbundu ↔ PT; utilizador toca em pares até esgotar. |
| `preencher_lacuna` | Frase Umbundu com `___`; escolhe a palavra certa entre 3–4 opções. |
| `escuta_escrever` | Ouve a frase (TTS) e digita em Umbundu. |
| `escuta_montar` | Ouve a frase e monta com banco de palavras (tap what you hear). |

Para cada um:
- Adicionar variante ao `Passo` union em `tipos.ts`.
- Adicionar componente correspondente em `PassoComponents.tsx` (reutilizando `EscolhaBase` / lógica de `MontarFrasePasso` / `EscreverPasso`).
- Adicionar branch em `LessonScreen.tsx` no render por `tipo`.
- Semear 2–3 exemplos em lições existentes de `m1.ts` para o utilizador ver os novos formatos em uso (sem mexer no total de lições nem no currículo).

### 3) Fora de âmbito (não mexer)

- Sem alterações a vidas, XP, missões, loja, HomeScreen (para além do click do báu já usar `LessonScreen`).
- Sem novo vocabulário — reutilizar `VOCAB_M1`.
- Sem alterações visuais globais.

### Verificação

- `tsgo` para type-check.
- Playwright: abrir a app, navegar até um báu do M1U1, jogar a conversa, verificar screenshots dos avatares sem fundo e o feedback certo/errado. Fazer também uma lição normal para ver `emparelhar` e `preencher_lacuna` renderizando.

Confirmas que avanço?
