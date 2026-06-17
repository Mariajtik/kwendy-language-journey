## Objetivo

Adicionar **reações** e **comentários** funcionais (UI only) a cada publicação na aba Comunidade do Perfil.

## Reações (5 tipos, com emoji sugestivo)


| Reação        | Emoji                                    |
| ------------- | ---------------------------------------- |
| Tá malaik     | olhos redondos e boca curvada para baixo |
| Granda mambo! | coração                                  |
| Concordo      | ✅                                        |
| Discordo      | ❌                                        |
| &nbsp;        | &nbsp;                                   |


> A 5ª pode ser ajustada; proponho "Erreh!" 😂 para reforçar o tom angolano. Se preferires outra, diz.

## Mudanças em `src/components/CommunityFeed.tsx`

1. **Tipo `Post**`: substituir `reactions: number` por `reactions: Record<ReactionKey, number>` e `comments: number` por `comments: Comment[]` (com `id`, `user`, `text`). Adicionar campo opcional `myReaction?: ReactionKey` no estado local.
2. **Estado local por post** (via `useState` num `Map<postId, {reactions, myReaction, comments, showComments, draft}>` inicializado a partir dos mocks) — mantém tudo client-side.
3. **Botão de reação no `PostCard**`:
  - Botão principal mostra o emoji da reação escolhida ( 🔥 somente quando não tem reações) + total agregado.
  - Ao tocar/segurar (`onClick` simples + popover), abre **popover horizontal flutuante** com os 5 emojis em linha, com `motion` (scale + fade, mola). Tocar num emoji aplica/troca/remove a reação e fecha o popover.
  - Reação ativa fica destacada (fundo `primary/10`, escala 1.1).
4. **Botão de comentários no `PostCard**`:
  - Mostra total de comentários.
  - Ao tocar, expande inline (animação `height auto` via framer-motion) uma secção com:
    - Lista de comentários (avatar inicial + nome + texto, separados por linhas finas).
    - Composer de comentário: avatar do user + input + botão enviar (ícone `Send`), max 200 chars, com aviso "A IA Kwendi revê antes de publicar" via `toast` ao enviar.
  - Comentário novo entra no estado local e aparece na lista (mock — sem persistência).
5. **Mocks iniciais**: converter os 3 posts atuais para o novo formato com algumas reações distribuídas e 1–2 comentários cada para demonstrar visual.
6. **Tokens semânticos apenas** (`hsl(var(--primary))`, `--border`, `--muted-foreground`, etc.) — sem cores hardcoded novas além dos emojis.

## Fora de âmbito

- Backend, persistência, moderação real, notificações.
- Mudanças na aba Ranking ou no resto do `ProfileScreen`.

## Arquivos afetados

- `src/components/CommunityFeed.tsx` (única edição)