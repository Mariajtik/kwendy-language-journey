## Plano de ajustes

### 1) Pacote Premium — interesse toggle + sotaque angolano

`**PremiumPackCard.tsx**`

- Receber prop `jaInteressado: boolean` além de `onInteresse`.
- Quando `jaInteressado === true`:
  - CTA muda para **"Pensei melhor, retirar interesse"** (estilo mais suave: fundo `bg-white/15` + texto branco, em vez de fundo branco).
  - Texto de apoio passa a ser: *"Já pertences a família mas podes sair quando quiseres."*
- Adicionar 1 bullet novo (após o "Dicionário IA ilimitado"):
  - `🇦🇴 IA Kwendi com sotaque angolano — fala e escrita mais nossa.`
- Reforçar no parágrafo de abertura: acrescentar frase *"A IA Kwendi ganha sotaque angolano — fala e escreve como em Luanda, Huambo, Benguela."*

`**useLoja.ts**` (já gere a lista `kwendi.premium.interessados`)

- Adicionar `removerInteressePremium()` que faz splice do user atual e atualiza posição.
- Expor `jaInteressadoPremium: boolean` e nova função no hook.

`**LojaScreen.tsx**`

- Passar `jaInteressado` ao `PremiumPackCard`.
- `onInteresse` agora despacha: se já interessado → remover (mostrar toast "Interesse removido"); senão → registar e abrir modal.

`**PremiumInteresseModal.tsx**`

- Sem mudança estrutural; continua a mostrar a posição apenas quando há novo registo.

---

### 2) Reestruturação pedagógica de M1 e M2

Princípio: **M1 = primeiríssimo contacto** (sons, saudações, eu/tu, números até 10). **M2 = identificação e família próxima**. Tudo o que é vocabulário temático (corpo, dias, meses, estações) vai para módulos mais avançados, onde faz sentido pedagógico.

**Módulo 1 — "Primeiros passos"** (5 unidades, em vez de 8)

1. **Sons e alfabeto** — vogais, C-V-C, prefixo `ku-`, tonalidade básica *(novo, ancorado no que já existe em* `/secao/alfabeto`*)*. ( Não, essa sessão é apenas em alfabeto, como no Duo)
2. **Saudações** — `Wakolelepo`, `Ndapandula`, despedidas.
3. **Eu e tu** — pronomes pessoais singulares (`ame`, `ove`), frases mínimas "eu sou / tu és".
4. **Sim, não e cortesia** — `ee`, `tate`, pedir/agradecer, perdão.
5. **Números 0–10** — contar objetos básicos.

**Módulo 2 — "Quem sou eu"** (5 unidades)

1. **Identificação pessoal** — nome, idade ("eu chamo-me…", "tenho X anos").
2. **Família próxima** — pai, mãe, irmãos (movido de M1).
3. **Nacionalidade e origem** — de onde sou, países, terra natal.
4. **A minha casa** — onde vivo, compartimentos essenciais (ponte para M10).
5. **Conversação I** — diálogos curtos juntando 1–4.

**Restantes módulos (M3–M12)** — reorganizados para absorver o que sai de M1:

- M3 *Família alargada* (tios, avós, possessivos).
- M4 *Tempo e calendário* → **dias, meses, estações** (saem de M1).
- M5 *Corpo humano e saúde* → **corpo + no médico** (sai de M1).
- M6 *Ações e rotina* (verbos essenciais).
- M7 *Pronomes* (possessivos, demonstrativos, interrogativos).
- M8 *Advérbios*.
- M9 *Conjunções e frases compostas*.
- M10 *Vida quotidiana* (casa, loiça, vestuário, alimentação).
- M11 *Natureza e campo* (animais, aves, plantas, agricultura).
- M12 *Verbos e tempos*.
- *(Sabedoria Ovimbundu / provérbios)* — distribuídos como secções-bónus dentro de M3, M6 e M11, em vez de módulo próprio, para evitar bloco isolado pesado.

Arquivo afetado: `src/data/curriculo.ts` (reescrita completa do array `CURRICULO`, mantendo o shape `Modulo/Unidade/Seccao` e o helper `mk`).

---

### 3) Bottom Nav — repensar "Palavras"

Hoje o popover do "..." tem 4 pills: **Dicionário · Palavras · Fala & Escuta · Alfabeto**. *Palavras* sobrepõe-se a *Dicionário* e não tem lógica clara.

**Proposta — transformar "Palavras" em "Caderno"** (o teu vocabulário pessoal):

- Rota: `/secao/caderno` (renomear de `/secao/palavras`).
- Conteúdo:
  - **Guardadas** — palavras que o utilizador favoritou no Dicionário (estrela). Lista pesquisável, com áudio TTS e tradução.
  - **Aprendidas** — palavras que apareceram em lições concluídas (derivado de `useProgresso`). Mostradas como flashcards horizontais.
  - **Para rever** — palavras erradas em lições recentes, com botão "Treinar 5 agora" que abre um mini-quiz tipo Anki (4 cartões).
- Três tabs no topo (`Guardadas | Aprendidas | Rever`), mesmo padrão visual do `FalaEscutaScreen`.

Assim cada pill tem papel distinto:

- **Dicionário** = consulta + IA (entrada).
- **Caderno** = o teu acervo pessoal (saída/revisão).
- **Fala & Escuta** = treino oral.
- **Alfabeto** = referência fonética.

Arquivos afetados:

- `BottomNav.tsx` — renomear label "Palavras" → "Caderno", rota nova.
- `App.tsx` — registar `/secao/caderno`.
- `src/screens/CadernoScreen.tsx` — novo (reusa cards do Dicionário).
- `DicionarioScreen.tsx` — garantir que o botão estrela escreve em `localStorage` `kwendi.caderno.guardadas`.
- `useProgresso.ts` — expor lista de IDs de secções concluídas (já existente) para derivar "Aprendidas".

Sem backend; tudo localStorage até integrarmos Supabase.

---

### Resumo de ficheiros

**Editar:** `src/data/curriculo.ts`, `src/components/loja/PremiumPackCard.tsx`, `src/components/loja/PremiumInteresseModal.tsx` (sem mudança grande), `src/hooks/useLoja.ts`, `src/screens/LojaScreen.tsx`, `src/components/BottomNav.tsx`, `src/App.tsx`, `src/screens/DicionarioScreen.tsx`.

**Criar:** `src/screens/CadernoScreen.tsx`.