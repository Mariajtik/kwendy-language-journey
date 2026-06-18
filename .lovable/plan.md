# Reverter e reestruturar a HomeScreen como sequência única

Tudo acontece dentro da `HomeScreen` (sem mais navegar para `/unidade/:id`). A tela vira uma trilha vertical contínua: módulos e unidades aparecem em sequência, somente Módulo 1 / Unidade 1 mostra o zig-zag aberto, todos os outros aparecem como cards fechados com ícone de livro que abre as lições num popover na mesma tela.

## O que muda

### 1. Cor do banner (volta ao crimson original)
- O banner do topo (unidade atual) e os botões da trilha hoje usam `hsl(${unidade.cor})` (cor variável por unidade — atualmente está cinza/azulado).
- Voltar a usar **`hsl(var(--primary))`** (crimson da marca) com sombra `hsl(var(--kwendi-red-dark))`, como na captura de tela enviada.
- O campo `unidade.cor` deixa de ser usado para colorir o banner principal; fica reservado para futura diferenciação se necessário.

### 2. Sequência única na mesma tela (zero navegação)
Estrutura vertical renderizada dentro do `<div ref={scrollRef}>`:

```text
[ Banner Módulo 1 · Unidade 1 ]    ← crimson, aberto
[ zig-zag completo da Unidade 1 ]
[ ─── separador “Saúda…” ────── ]
[ Card Unidade 2 (fechado) 📖 ]    ← clica no livro = popover
[ Card Unidade 3 (fechado) 📖 ]
…fim do Módulo 1…
[ 🗿 TOTEM separador de módulo 🗿 ]
[ Card Módulo 2 (fechado) ]
   [ Card Unidade 1 do M2 📖 ]
   [ Card Unidade 2 do M2 📖 ]
…
[ 🗿 TOTEM ]
[ Módulo 3… ]
```

Regras:
- A **única** unidade com zig-zag visível é a unidade atual (vinda de `useProgresso().unidadeAtualInfo()`).
- Todas as demais unidades aparecem como **cards compactos**: faixa colorida com `MÓDULO X, UNIDADE Y` + título + botão livro à direita.
- O botão livro do card abre um **Dialog/popover** que renderiza o mesmo componente de zig-zag da unidade (em modo somente leitura, com os botões de lição bloqueados/visualização). Nada navega para outra rota.

### 3. Remover navegação para `/unidade/:id`
- O `useParams()` e a lógica de “preview” saem da `HomeScreen`.
- O botão livro do banner da próxima unidade deixa de chamar `navigate(...)` e passa a abrir o mesmo popover.
- A rota `/unidade/:unidadeId` em `App.tsx` é removida (não há mais redirecionamento entre unidades).

### 4. Totem separador entre módulos
Entre o último item do Módulo N e o card do Módulo N+1, renderizar um separador visual estilo “marco de pedra / totem”:

```text
        ╱╲
       ▕░░▏        ← bloco de pedra com sombra
       ▕░░▏
       ▕░░▏
   ════╧══╧════    ← base/grama
```

Implementação:
- Componente `<TotemSeparador />` em `src/components/TotemSeparador.tsx`: SVG inline (~80×120) com forma de menir/pedra empilhada em tons de cinza-quente (`#6E6259`, `#8A7C70`), sombra inferior e pequenas marcas decorativas (pode incluir o número do próximo módulo gravado).
- Renderizado uma vez entre módulos diferentes durante o mapeamento da sequência.

### 5. Cabeçalho de módulo (antes do primeiro card de cada módulo)
Pequeno chip centralizado “MÓDULO 2 — Eu e tu” em marrom/branco com sombra para legibilidade (mesmo estilo do separador atual da unidade).

## Detalhes técnicos

Arquivos tocados:
- `src/screens/HomeScreen.tsx`:
  - Remover `useParams`, `preview`, e o uso de `unidade.cor` no banner principal (trocar por `hsl(var(--primary))`).
  - Construir lista linear iterando `CURRICULO`:
    - Para a unidade atual → renderiza banner + zig-zag existentes.
    - Para outras unidades do mesmo módulo da atual e dos módulos seguintes → renderiza `<UnidadeCardFechado>` (novo, inline ou em `src/components/UnidadeCardFechado.tsx`).
    - Entre módulos diferentes → `<TotemSeparador />`.
  - Estado novo: `popoverUnidadeId: string | null` → controla `<Dialog>` que mostra o zig-zag da unidade selecionada.
- `src/components/UnidadeCardFechado.tsx` (novo): faixa colorida + título + botão livro (`onClick` abre popover).
- `src/components/TotemSeparador.tsx` (novo): SVG do totem.
- `src/components/ZigZagUnidade.tsx` (novo, extraído do JSX atual da trilha): recebe `unidade` + `modoVisualizacao?: boolean`. Usado tanto na unidade atual quanto dentro do Dialog do popover.
- `src/App.tsx`: remover a rota `/unidade/:unidadeId`.
- `src/hooks/useProgresso.ts`: sem mudanças funcionais; continua sendo a fonte da unidade atual.

Fora de escopo: progresso/desbloqueio (continua igual), bottom nav, header, tela de lição.