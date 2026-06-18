## Mudanças

### 1. Cores por módulo

Adicionar `cor` (HSL) e `corEscura` (sombra 3D) ao tipo `Modulo` em `src/data/curriculo.ts`. Paleta:

- **M1 Saudações** — Sem alteração
- **M2 Eu e tu** — laranja `25 90% 50%` / `25 90% 38%`
- **M3 Família** — rosa-magenta `330 75% 50%` / `330 75% 38%`
- **M4 Ações** — violeta `265 60% 50%` / `265 60% 38%`
- **M5 Natureza** — verde `150 55% 38%` / `150 55% 28%`

`renderBannerAtual`, `renderModuloHeader` e `UnidadeCardFechado` passam a usar `modulo.cor` em vez de `hsl(var(--primary))` fixo. O cabeçalho de módulo ganha um pequeno chip colorido (bolinha) ao lado do título.

### 2. Expandir unidade inline (sem popover)

Remover o `<Dialog>` de pré-visualização e o estado `popoverUnidadeId`. Substituir por:

- `expandedUnidades: Set<string>` no `HomeScreen`.
- Clicar no livro do `UnidadeCardFechado` → `toggle(u.id)`. Ao expandir, o cartão desaparece e renderiza-se em seu lugar `renderBannerAtual(mod, u) + renderZigZag(u, true)` (modo visualização: todas as lições bloqueadas, igual ao popover actual, mas inline na coluna). Botão "Fechar" pequeno aparece sobre o banner para colapsar.
- A unidade activa (a do progresso real) continua sempre aberta e não pode ser colapsada.

### 3. Cena da piscina ao lado do trilho do Módulo 4

Quando o utilizador estiver com **alguma unidade do M4 expandida ou activa**, envolver o bloco do M4 num `div relative` e colocar `<CenaPiscina />` em `position:absolute`, `right: -40px`, alinhada verticalmente ao meio do zig-zag, largura ~130px, `pointer-events:none`, `opacity:0.95`, ligeira rotação `-4deg`. No mobile estreito (viewport <420px) reduz para `width:100px, right:-20px` via responsive style. A `figcaption` "Yellen e Otchali brincam" sai (poluía).

### Ficheiros tocados

- `src/data/curriculo.ts` — adiciona `cor` + `corEscura` a `Modulo`.
- `src/components/UnidadeCardFechado.tsx` — usa cor do módulo + recebe estado expandido (faixa colorida e botão livro mudam de cor).
- `src/components/CenaPiscina.tsx` — remove `figcaption`, aceita `className` para posicionamento absoluto.
- `src/screens/HomeScreen.tsx` — substitui `popoverUnidadeId` por `expandedUnidades`, remove `<Dialog>` de preview, banner/header usam cor do módulo, cena piscina sai do popover e fica `absolute` lateral ao M4.

## Fora de escopo

- Mudar paleta global / tokens semânticos do tema.
- Animação da água.
- Cores nos botões redondos do zig-zag (continuam crimson activa / verde concluída — convém manter consistência Duolingo; posso mudar se quiseres).