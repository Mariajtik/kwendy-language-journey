## Fase 3 — Mapa de lições + interatividade básica

Foco em refinar a `HomeScreen` (já existente) seguindo o padrão Duolingo: lição ativa destacada com halo branco, demais bloqueadas em cinza, modal ao tocar em bloqueada, modal de "começar lição" ao tocar na ativa. Sem back-end, sem lição real.

### 1. Lição ativa com halo/destaque (`src/screens/HomeScreen.tsx`)
- Manter o círculo crimson da lição 1, mas envolvê-lo com um **anel branco pulsante** (`motion` com `scale` 1 → 1.08 em loop, 1.8s, `repeat: Infinity`).
- Adicionar acima do botão um pequeno balão "COMEÇAR" em branco com seta apontando pra baixo (estilo Duolingo).

### 2. Estado de lições + dados
- Criar uma constante local `lessons` no `HomeScreen.tsx`:
  ```ts
  const lessons = [
    { id: 1, title: "Olá, mundo", status: "active" },
    { id: 2, title: "Saudações", status: "locked" },
    { id: 3, title: "Apresentar-se", status: "locked" },
    { id: 4, title: "Família", status: "locked" },
    { id: 5, title: "Báu de tesouro", status: "locked", kind: "chest" },
  ];
  ```
- Renderizar em zig-zag (offsets alternados left/center/right) via `.map`.
- A última (id 5) usa o `<Chest />` em vez de número.

### 3. Modal de lição bloqueada
- Novo componente local `LockedLessonDialog` usando `Dialog` (shadcn — já em `src/components/ui/dialog.tsx`).
- Aparece ao clicar em qualquer lição com `status: "locked"`.
- Conteúdo:
  - Ícone de cadeado grande (lucide `Lock`) em cinza.
  - Título: "Lição bloqueada"
  - Texto: "Conclua a lição anterior para desbloquear esta."
  - Botão único `btn-duo btn-duo-secondary` "Entendi" que fecha o modal.

### 4. Modal de "começar lição" ativa
- Novo componente local `StartLessonDialog` (mesmo `Dialog` shadcn).
- Aparece ao clicar na lição ativa (id 1).
- Conteúdo:
  - Faixa crimson no topo com "LIÇÃO 1".
  - Título da lição (ex.: "Olá, mundo").
  - Linha de XP: "+10 XP".
  - Botão primário `btn-duo btn-duo-primary` "Começar +10 XP" → por enquanto apenas fecha o modal (placeholder; tela real fica para Fase 4).
  - Botão secundário "Ver dica" desabilitado/cinza.

### 5. Ajustes visuais menores
- Aumentar o gap vertical entre lições para deixar a trilha mais ariosa.
- Adicionar uma linha pontilhada SVG ligando os círculos da trilha (decorativa, atrás dos botões).

## Arquivos afetados
- `src/screens/HomeScreen.tsx` — array `lessons`, halo pulsante, balão COMEÇAR, trilha pontilhada, handlers de clique, dois dialogs locais.

## Fora de escopo (Fase 4 e seguintes)
- Tela real de execução de lição (pergunta, alternativas, feedback).
- Teste de nivelamento real, IA da Kwendi, persistência de progresso.
- Funcionalidade dos outros itens da bottom nav.
