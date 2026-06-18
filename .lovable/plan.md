## Loja Kwendi — Plano (revisto)

### 1. Acesso: o próprio contador de diamantes vira a porta da Loja

- O **chip de diamantes no header** (todos os ecrãs que o exibem: Home, Missões, Histórias, Curiosidades, Perfil) passa a ser **clicável** e abre `/loja`.
- Microinteração: ao tocar, o diamante faz um pequeno "bounce + brilho" (Framer Motion) e navega.
- Affordance discreta: um `+` ou pequena seta ao lado do número, e cursor pointer, para sinalizar que é interativo sem poluir.
- Tooltip/long-press: "Abrir loja".
- **Zero alterações na BottomNav** — fluxo preservado.
- Rota nova: `/loja`.

### 2. Estrutura da Loja (`/loja`)

Header próprio com botão voltar + saldo de diamantes (não clicável aqui, já estamos dentro). 3 tabs em pílula:

**a) Power-ups** (laranja)

- Manter chama — 30 💎
- Dobrador de XP (15 min) — 50 💎
- Dica extra na lição — 10 💎
- Vida/Coração extra — 20 💎

**b) Baús e Fragmentos** (roxo) — reutiliza assets `src/assets/missoes/bau-*`

- Baú Comum — 40 💎
- Baú Raro — 120 💎
- Baú Lendário — 300 💎
- Pacote 10 fragmentos — 60 💎

**c) Cultura Premium** (crimson/dourado)

- Desbloquear "A Kianda do Mar" — 5000 💎
- Desbloquear "Sumbi" — 1000 💎
- Pack de músicas tradicionais (escolhe o que tocar quando estiver jogando para além de fronteiras +2 opções) — 10.000 💎
- Desbloquear mais curiosidades - 1500 ( +3)

### 3. Componentes a criar

- `src/screens/LojaScreen.tsx` — tabs + grid de cards, animação stagger.
- `src/components/loja/ItemLojaCard.tsx` — card 3D arredondado (mesmo idioma das missões): imagem/ícone, nome, descrição curta, preço 💎, botão "Comprar".
- `src/components/loja/ConfirmarCompraModal.tsx` — bottom sheet com saldo antes/depois e CTA.
- `src/components/loja/CompraSucessoModal.tsx` — item a saltar + confettis discretos.
- `src/components/loja/SaldoInsuficienteModal.tsx` — "Faltam X 💎, vai às Missões" → CTA `/missoes`.

### 4. Tornar o diamante clicável

- Identificar o(s) componente(s) que renderizam o chip de diamantes (provavelmente `HeaderRecursos` em `src/components/missoes/HeaderRecursos.tsx` e equivalentes na Home). Envolver num `button`/`motion.button` com `onClick={() => navigate('/loja')}`.
- Garantir `aria-label="Abrir loja"`, foco visível, e que o XP **não** vira clicável (só diamantes — fica claro que diamantes = moeda da loja).

### 5. Dados e estado

- `src/data/loja.ts` — catálogo (id, categoria, nome, descrição, preço, ícone/asset, payload).
- `src/hooks/useLoja.ts` — `comprar(item)`: valida saldo (`useSaldo`), debita, aplica efeito, dispara modal.
- `src/hooks/useInventario.ts` — power-ups ativos (com `expiraEm`) e desbloqueios, persistidos em `localStorage` (`kwendi.inventario`, `kwendi.desbloqueios`).

### 6. Integração com o resto da app

- `HistoriasScreen.tsx` — "A Kianda do Mar" e "Sumbi" passam de "Em breve" a cadeado com preço; clique → `/loja` tab Cultura.
- `LessonScreen.tsx` (fase 2) — botão de dica consome power-up; indicador "Dobrador ativo".

### 7. Moeda

- **Só diamantes por agora**. Arquitetura preparada para `precoReal?: number` futuro, mas sem Stripe/Paddle nesta iteração.

### 8. Estilo visual

- Paleta atual (crimson primário, dourado nos preços).
- Fundo da Loja: gradiente creme → dourado suave com sutil padrão de losangos (tecido tradicional, baixo contraste).
- Tabs em pílula, cards arredondados 3D com sombra suave, entrada stagger via Framer Motion.

### Detalhes técnicos

- Rota `/loja` adicionada em `src/App.tsx`.
- Persistência local agora; migração para Supabase quando auth estiver consolidada.
- Power-ups com expiração calculada via timestamp ISO no hook.
- Sem alterações no `curriculo.ts` nem na `BottomNav`.