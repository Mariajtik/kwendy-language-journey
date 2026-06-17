# Aba Comunidade no Perfil

## Lógica atual da aba "Comunidade" (em ProfileScreen)

Hoje ela mostra apenas um resumo do próprio utilizador:

- Card com **Seguidores / Seguindo**
- Card com **Progresso** compacto (módulo atual)
- Grade de **Conquistas** (4 trancadas)
- Botão **"Abrir Comunidade"** que navega para `/comunidade` (CommunityScreen)

Ou seja, era uma versão "preview" do perfil social — não tinha feed, ranking nem composer. Toda a comunidade real vivia numa rota separada.

## O que vou mudar

Substituir o conteúdo da aba "Comunidade" do `ProfileScreen` pelo conteúdo completo da `CommunityScreen` (feed, composer, subtabs, ranking, conquistas), removendo o botão "Abrir Comunidade" e o resumo redundante.

### Mudanças em `src/screens/ProfileScreen.tsx`

- Remover o bloco atual da aba `comunidade` (resumo + botão).
- Renderizar dentro dessa aba:
  - **Subtabs** internas: `Comunidade` · (`Minha Tribo` se `FOLLOWING_COUNT > 0`) · `Ranking` · `Conquistas` — com a mesma animação de underline (`layoutId` distinto, ex.: `profile-community-subtab`).
  - **Banner de moderação** da IA Kwendi.
  - **Composer** (textarea + contador 280 + botão Publicar) com o mesmo `toast` "A IA Kwendi irá rever…".
  - **Feed** de posts (PostCard) — reaproveitando os mocks (`Nzinga`, `Kiame`, `Suzana`).
  - **Ranking** com pódio (ouro/prata/bronze) e destaque para "Tu".
  - **Conquistas** em grid 3×3 trancadas.
- Reaproveitar `BottomNav active="user"` já existente.
- Manter scroll dentro do `app-shell`; subtabs ficam fixas logo abaixo do header de tabs principais (sticky com `top` ajustado, ou simplesmente roláveis no fluxo).

### Mudanças em `src/screens/CommunityScreen.tsx`

- Manter o ficheiro por agora (a rota `/comunidade` continua válida — Lupa/atalhos podem usar), mas como o acesso principal passa a ser via Perfil → Comunidade, **não removerei** o ficheiro neste passo para não quebrar a rota. (Posso remover num passo seguinte se quiseres.)

### Componentes auxiliares

- Mover o `PostCard` e os mocks (`posts`, `ranking`, `FOLLOWING_COUNT`) para dentro do `ProfileScreen.tsx` (escopo local) — ou extrair para `src/components/CommunityFeed.tsx` reutilizável e usar tanto em `ProfileScreen` quanto em `CommunityScreen`.
- **Decisão**: extrair para `src/components/CommunityFeed.tsx` (mantém DRY entre as duas telas).

## Detalhes técnicos

- Novo ficheiro `src/components/CommunityFeed.tsx` exportando `<CommunityFeed />` que encapsula: subtabs + banner + composer + feed + ranking + conquistas. Sem header próprio nem BottomNav.
- `ProfileScreen` importa e renderiza `<CommunityFeed />` na aba `comunidade`.
- `CommunityScreen` passa a ser um wrapper fino (header "Comunidade" + `<CommunityFeed />` + BottomNav) para a rota `/comunidade` continuar funcional.
- Sem backend, sem chamadas Supabase. Apenas UI e `toast`.

## Pergunta opcional

Queres que eu **remova a rota `/comunidade**` e o `CommunityScreen.tsx` (já que tudo vive no perfil agora), ou manter ambos? — Remova e me explique porquê queria manter.