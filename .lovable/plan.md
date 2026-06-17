## Objetivo

Transformar `CuriosidadesScreen` num "Museu vivo interativo da cultura angolana" — descoberta, orgulho, imersão, elegância. Sem backend. E usar somente as cores da paleta de cores fornecida.

## Arquitetura

```
src/screens/CuriosidadesScreen.tsx        (refeito)
src/data/curiosidades.ts                  (novo — conteúdo + tipos)
src/components/CuriosidadeCard.tsx        (novo — card premium)
src/components/CuriosidadeModal.tsx       (novo — modal fullscreen)
```

## Dados (`src/data/curiosidades.ts`)

Tipos:

```ts
type Categoria = "natureza" | "historia" | "cultura" | "gastronomia" | "linguas" | "monumentos";
type Section = { heading: string; body: string };
type Curiosidade = {
  id: string;
  categoria: Categoria;
  titulo: string;
  subtitulo: string;
  resumo: string;          // máx ~3 linhas
  imagem?: string;         // placeholder por ora — utilizador adicionará depois
  sections: Section[];
  destaque?: string;       // citação curta tipo "Pode viver mais de mil anos"
};
```

Cores por categoria (tokens semânticos via `--cur-{cat}`):


| Categoria   | Cor                | Token         |
| ----------- | ------------------ | ------------- |
| Natureza    | Verde              | `142 55% 42%` |
| História    | Vermelho (primary) | já existe     |
| Cultura     | Amarelo            | `45 95% 50%`  |
| Gastronomia | Laranja            | `22 90% 55%`  |
| Línguas     | Roxo               | `268 60% 55%` |
| Monumentos  | Azul               | `205 85% 55%` |


Adicionados a `index.css` como `--cur-natureza`, etc.

### 13 cards (storytelling, não-Wikipedia)

Cada um com `subtitulo`, `resumo` (2–3 linhas), e `sections` lapidadas a partir do briefing do user. Lista final:

1. **Imbondeiro** (Natureza) — *A árvore que cresce ao contrário*
2. **Rainha Nzinga** (História) — *A guerreira que enfrentou impérios*
3. **O Pensador** (Cultura) — *O símbolo da sabedoria angolana*
4. **Palanca Negra Gigante** (Natureza) — *O símbolo vivo de Angola*
5. **Welwitschia Mirabilis** (Natureza) — *A planta que desafia o tempo*
6. **Mufete** (Gastronomia) — *O sabor tradicional de Luanda*
7. **Agostinho Neto** (História) — *Manguxi Kilamba*
8. **Nontombi** (Cultura) — *O penteado ancestral africano*
9. **Umbundu** (Línguas) — *A língua mais falada de Angola*
10. **Fenda da Tundavala** (Monumentos) — *O abismo natural da Huíla*
11. **Floresta do Maiombe** (Natureza) — *O pulmão verde de Cabinda*
12. **Quedas de Kalandula** (Monumentos) — *A força das águas angolanas*
13. **Mussivi** (Natureza) — *A jóia das florestas de Angola*

Estrutura interna por card segue o briefing (Introdução / História ou Lenda / Importância cultural / Curiosidade final, adaptado a cada tema). Texto reescrito em tom emocional/elegante — sem citações tipo "(gov.br)" nem listas cruas. Cada `body` 2–5 frases curtas.

> Placeholders de imagem: gradiente da cor da categoria + ícone Lucide temático (ex: `Trees`, `Crown`, `UtensilsCrossed`, `Languages`, `Mountain`). O user troca depois.

## Tela (`CuriosidadesScreen`)

```
┌────────────────────────────────┐
│ Curiosidades de Angola         │   ← title (extrabold, 2xl)
│ Descubra histórias, símbolos…  │   ← subtitle (muted)
│                                │
│ 🔍 [Pesquisar…             ]   │   ← input arredondado
│                                │
│ [Todas][Natureza][História]…   │   ← chips horizontais scrolláveis,
│                                │     cor activa = cor da categoria
│ ┌────────────────────────┐     │
│ │  [imagem c/ overlay]   │     │   ← grid 1 col mobile,
│ │  BADGE CATEGORIA       │     │     2 col ≥640px, 3 col ≥1024px
│ │  Título                │     │
│ │  Resumo (3 linhas)     │     │
│ │  [ Saber mais ]        │     │
│ └────────────────────────┘     │
│  …                             │
└────────────────────────────────┘
  BottomNav active="search"
```

- Filtro de texto: case-insensitive em `titulo + subtitulo + resumo`.
- Filtro de categoria: chip activa highlight com cor da categoria, "Todas" por defeito.
- Animação: `motion` `fade-up` stagger nos cards ao montar / ao mudar filtro (`AnimatePresence` + `layout`).
- Botões: `whileTap={{ scale: 0.97 }}`.

## Card (`CuriosidadeCard`)

- `rounded-3xl border-2 border-border bg-card overflow-hidden`, sombra 3D suave.
- Topo: `aspect-[16/10]` com fundo gradient da categoria + ícone gigante semi-transparente; overlay `from-transparent to-black/50`.
- Badge categoria absoluta `top-3 left-3` (pill, cor da categoria).
- Corpo: título extrabold, resumo `line-clamp-3` muted.
- Footer: botão "Saber mais" pill com cor da categoria → abre modal.
- Tap: `scale: 0.97`, sombra aumenta.

## Modal (`CuriosidadeModal`)

- Fullscreen via `framer-motion` `<AnimatePresence>` + `fixed inset-0 z-50`.
- Entrada: imagem hero faz `layoutId={\`cur-${id}}` (hero animation a partir do card).
- Topo: imagem 280px altura, overlay gradient `to-b from-transparent to-background`, título + subtítulo + badge sobrepostos em baixo.
- Botão X: top-left, glassmorphism (`bg-white/20 backdrop-blur rounded-full w-10 h-10`).
- Conteúdo scrollável (`overflow-y-auto`): para cada `section` → `h2` (cor da categoria) + parágrafo. Por fim, se houver `destaque`, card grande em itálico com aspas.
- Trap simples: `body.style.overflow = "hidden"` ao abrir.
- Fechar: X, Escape, click no overlay (fora do conteúdo opcional — manter dentro do conteúdo). Animação saída: slide-down + fade.

## Regras visuais

- Todas as cores via tokens semânticos (`--cur-*`, `--primary`, `--border`, etc.). Zero `bg-white`/`text-black` hardcoded.
- Tipografia rounded/extrabold já no projeto.
- `app-shell` + `pb-32` para BottomNav.
- Animações: cards fade-up, modal scale+fade, hero layoutId, chips com `layoutId` para a "pílula" activa.

## Fora de âmbito

- Backend, persistência de favoritos, partilha.
- Upload real de imagens (placeholders por agora — user troca quando enviar).
- IA real a moderar — só conteúdo estático.

## Ficheiros afectados

- **novo** `src/data/curiosidades.ts`
- **novo** `src/components/CuriosidadeCard.tsx`
- **novo** `src/components/CuriosidadeModal.tsx`
- **edita** `src/screens/CuriosidadesScreen.tsx` (reescrita completa)
- **edita** `src/index.css` (adiciona tokens `--cur-*`)