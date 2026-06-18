## Objetivo

Criar a espinha dorsal de conteúdo do Kwendi (Módulos → Unidades → Secções) e a navegação correspondente, mantendo o `LessonScreen` atual como placeholder. Sem reescrever exercícios ainda.

## 1. Catálogo de conteúdo

Novo ficheiro `src/data/curriculo.ts` com tipos e dados:

```ts
export type Seccao = {
  id: string;           // ex: "m1u1s1"
  titulo: string;       // ex: "Olá, mundo"
  tipo: "licao" | "bau";
};
export type Unidade = {
  id: string;           // ex: "m1u1"
  numero: number;       // 1..n
  titulo: string;       // ex: "Saúda a tua comunidade"
  cor: string;          // HSL para banner
  seccoes: Seccao[];    // quantidade variável + 1 báu no fim
};
export type Modulo = {
  id: string;           // ex: "m1"
  numero: number;
  titulo: string;       // ex: "Comunicação básica"
  unidades: Unidade[];
};
export const CURRICULO: Modulo[] = [/* M1..M5 */];
```

Os 5 módulos iniciais (cada um com 2–4 unidades, derivadas do índice enviado):

- **M1 — Saúda a tua comunidade**: U1 Saudações · U2 De manhã / Na rua · U3 No mercado · U4 Conversação básica
- **M2 — Eu e tu**: U1 Identificação pessoal · U2 Pronomes pessoais · U3 Nacionalidade · U4 Frases completas
- **M3 — Introduza a tua família**: U1 Família básica · U2 Família extensa · U3 Amizades · U4 Possessivos e descrições
- **M4 — Ações**: U1 Verbos essenciais · U2 Rotina · U3 Perguntar com verbos · U4 Advérbios de tempo/modo
- **M5 — Explora a natureza**: U1 Animais · U2 Aves · U3 Plantas e vocabulário agrícola · U4 Estações e meses

Cada unidade terá um número variável de secções (3–5) + 1 báu no fim. IDs estáveis para servir de chave de progresso.

## 2. Progresso do utilizador

Novo hook `src/hooks/useProgresso.ts`:

- Persistência em `localStorage` (`kwendi:progresso`).
- Estado: `{ seccoesCompletas: string[], unidadeAtual: string, moduloAtual: string }`.
- Helpers: `concluirSeccao(id)`, `isCompleta(id)`, `proximaSeccao()`, `proximaUnidade()`, `unidadeAtualInfo()`, `moduloAtualInfo()`.
- Por defeito começa em `m1u1s1`.

## 3. Tela do mapa (refactor de `HomeScreen.tsx`)

Reaproveita o visual atual (grass, header, trilho zig-zag, báu, halo, balão "COMEÇAR") mas passa a ser orientado a **unidade**:

- Lê `unidadeAtual` do `useProgresso`.
- Banner do topo: `MÓDULO {n}, UNIDADE {n}` + título da unidade atual (já existe).
- Trilho zig-zag iterando `unidade.seccoes` (quantidade variável). Última secção = ícone báu.
- Estado de cada secção: `concluida | ativa | bloqueada` (ativa = primeira não concluída).
- **Rodapé do mapa (novo)** — barra fixa logo acima do `BottomNav`, com duas linhas decorativas e o nome da unidade atual centralizado (idêntico ao Figma circulado "Eu e tu"). Não navega.
- **Banner laranja da próxima unidade (novo)** — card clicável abaixo do rodapé mostrando `MÓDULO X, UNIDADE Y` + título da próxima unidade, com ícone de livro. Ao clicar, navega para `/unidade/:id` da próxima unidade (mapa preview, secções todas bloqueadas até concluir a atual).
- Clicar numa secção ativa abre o diálogo "Começar" existente e leva a `/lesson/:seccaoId` (placeholder atual).

## 4. Rota de unidade arbitrária

Nova rota `/unidade/:unidadeId` em `App.tsx` que renderiza a mesma `HomeScreen` em modo "preview de unidade" (recebe a unidade via prop/param em vez de usar `unidadeAtual`). Permite o banner da próxima unidade abrir o mapa correspondente.

## 5. Integração com o que já existe

- `LessonScreen.tsx` continua a usar as suas 3 perguntas demo. Ao concluir, chama `concluirSeccao(id)` para destravar a próxima.
- `BottomNav` inalterado.
- `FronteirasScreen`, missões, perfil, etc. inalterados.

## 6. Estrutura de ficheiros

```text
src/
  data/curriculo.ts         (novo)
  hooks/useProgresso.ts     (novo)
  screens/HomeScreen.tsx    (refactor para usar currículo + rodapé + banner próxima unidade)
  screens/LessonScreen.tsx  (pequena alteração: chama concluirSeccao ao terminar)
  App.tsx                   (adiciona rota /unidade/:unidadeId)
```

## Fora de escopo (próximas entregas)

- Perguntas reais por secção (módulo a módulo).
- Tela dedicada de "Árvore de módulos" para saltar livremente.
- Backend / sincronização de progresso.
