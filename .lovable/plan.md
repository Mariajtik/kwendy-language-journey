## Bottom Navigation + Profile + Comunidade (UI only, sem backend)

Tudo será frontend com dados mock. Nada de Supabase nesta fase.

### 1. Bottom Navigation (extrair em componente)

Criar `src/components/BottomNav.tsx` reutilizável, baseado na nav que já existe no `HomeScreen`. Aceita `active` (string) e cuida da navegação.

Mapeamento dos ícones:


| Ícone  | Rota            | Comportamento                                       |
| ------ | --------------- | --------------------------------------------------- |
| Casa   | `/home`         | Tela home (já existe)                               |
| Baú    | `/missoes`      | Tela "Missões" (placeholder)                        |
| Livro  | `/historias`    | Tela "Histórias" (placeholder)                      |
| Lupa   | `/curiosidades` | Tela "Curiosidades" (placeholder)                   |
| Perfil | `/profile`      | Tela completa de perfil                             |
| `...`  | —               | **Não navega.** Abre popover flutuante acima da nav |


O `HomeScreen` passa a usar `<BottomNav active="home" />` em vez de ter a nav inline.

### 2. Popover dos "..."

- Implementado dentro de `BottomNav` (estado local `moreOpen`).
- Posicionado `absolute` acima do botão `...`, com seta apontando para baixo.
- Animação Framer Motion: `scale: 0.9 → 1` + `opacity: 0 → 1` (saída inversa via `AnimatePresence`).
- Fundo branco, `rounded-2xl`, sombra suave.
- Opções em pills horizontais brancas empilhadas, exactamente como o mockup:
  - **Fala** → `/secao/fala`
  - **Escuta** → `/secao/escuta`
  - **Palavras** → `/secao/palavras`
  - **Alfabeto/pronúncia** → `/secao/alfabeto`
- Fecha ao clicar fora (listener em `document` ou overlay invisível) e ao clicar numa opção.

### 3. Telas placeholder simples

Cinco telas com layout idêntico (header com título, ícone temático, texto "Em breve", e `BottomNav` com o item correcto activo):

- `src/screens/MissoesScreen.tsx` (`/missoes`)
- `src/screens/HistoriasScreen.tsx` (`/historias`)
- `src/screens/CuriosidadesScreen.tsx` (`/curiosidades`)
- `src/screens/SecaoScreen.tsx` (`/secao/:tipo`) — reaproveita a mesma tela para Fala/Escuta/Palavras/Alfabeto, mostrando o título correspondente.

### 4. ProfileScreen (`/profile`)

`src/screens/ProfileScreen.tsx` — tela completa, fundo `kwendi-cream`.

**Header curvo vermelho:**

- Bloco grande `bg-primary` com curva orgânica no canto inferior esquerdo (border-radius assimétrico tipo `0 0 0 60% / 0 0 0 30%`, como no mockup).
- Top-right: dois ícones (compartilhar `Share2`, definições `Settings`).
- Username em branco, grande, bold (mock: "Angola").
- Avatar circular sobreposto ao header (semelhante ao mockup).

**Tabs (sticky abaixo do header):**

- `Perfil` | `Comunidade` | `Definições`
- Estado local `activeTab`. Underline crimson no activo.

**Tab "Perfil" mostra:**

- Bloco **Visão geral**: 3 cartões pequenos (Sequência 🔥, XP ⚡, Nível) + bloco INFO (nome, diamantes negros, data de ingresso "Membro desde Junho 2026").
- Bloco **Seguir / Seguindo**: dois contadores (mock 0 / 0) com botão "Seguir" desactivado.
- Bloco **Progresso**: barra de progresso do módulo actual (mock 1/5 lições).
- Bloco **Marcos**: linha de círculos `+` (desbloqueáveis), tal como mockup.
- Bloco **Conquistas**: grelha de 4 cartões cinza placeholder.

**Tab "Comunidade" mostra (versão dentro do perfil):**

- Seguir/Seguindo (resumo)
- Progresso
- Conquistas
- Botão "Abrir Comunidade" → navega para `/comunidade`.

**Tab "Definições":**

- Lista simples de itens (Conta, Notificações, Idioma, Sobre, Sair) — apenas UI, sem ação.

### 5. CommunityScreen (`/comunidade`) — tela completa

`src/screens/CommunityScreen.tsx`. Subtabs no topo:

- **Comunidade** (default): publicações recentes (mock). Cards com avatar, username, badge da conquista/sequência/progresso, texto, botões reagir 🔥 e comentar 💬.
- **Minha Tribo** (só aparece se `following.length > 0`; mock booleano local). Mostra publicações dos seguidos.
- **Ranking**: lista numerada top 10 (mock).
- **Feed**: alias de Comunidade (manteremos só "Comunidade" + "Minha Tribo" + "Ranking" + "Conquistas" para clarificar; "Feed" no enunciado mapeia para "Comunidade").
- **Conquistas**: grelha global de conquistas disponíveis.

**Composer de post (placeholder):**

- Input "Partilha algo sobre África, Angola, Umbundu ou o Kwendi…" + botão "Publicar".
- Ao clicar Publicar mostra `toast` informando que "A IA irá rever a tua publicação antes de aparecer na comunidade" (sem backend — só feedback visual).
- Comentários e reacções também só visualmente.

**Aviso de moderação por IA:** banner cinza no topo do feed:

> "Somente conteúdo sobre África, Angola, língua Umbundu e Kwendi é permitido. A IA Kwendi revê cada publicação."

A integração real com IA (moderação de posts/comentários + sugestão automática de partilha ao desbloquear marcos) fica documentada como TODO no código mas **não será implementada nesta fase** — backend virá depois.

### 6. Rotas adicionadas em `App.tsx`

```
/profile         → ProfileScreen
/comunidade      → CommunityScreen
/missoes         → MissoesScreen
/historias       → HistoriasScreen
/curiosidades    → CuriosidadesScreen
/secao/:tipo     → SecaoScreen
```

### 7. HomeScreen — pequenas alterações

- Substituir a nav inline por `<BottomNav active="home" />`.
- Header avatar continua a abrir o perfil (`navigate("/profile")`).

### Detalhes técnicos

- Tudo usa tokens de design existentes (`hsl(var(--primary))`, `kwendi-cream`, etc.) — sem cores hard-coded fora dos ícones que já estavam.
- Animações via `framer-motion` (`AnimatePresence`, `motion.div`).
- Sem chamadas a Supabase. Mocks como constantes no topo de cada ficheiro.
- Estado de tabs e popover puramente local com `useState`.
- Click-fora do popover: overlay transparente `fixed inset-0 z-10` por baixo do popover, ou listener `pointerdown` no document.