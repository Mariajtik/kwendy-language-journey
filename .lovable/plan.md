# Kwendi — passar de mockup para app real (Supabase + Premium)

Objetivo: eliminar 100% do `localStorage` de estado de utilizador, ligar tudo ao Supabase, implementar as features de Premium prometidas na Loja e o Chat Kwendi IA, e concluir corretamente o ciclo de vida de contas (incluindo stealth).

Login/OAuth ficam para o fim, como pediste. Ficamos no Supabase externo — nenhum bloqueio real; os problemas anteriores eram de config/código, não da plataforma.

## 1. Base de dados — tabelas novas e ajustes

Novas tabelas em `public` (todas com RLS `user_id = auth.uid()`, GRANTs explícitos para `authenticated` + `service_role`, sem `anon`):

- `user_saldo` — 1 linha por utilizador: `xp`, `diamantes`, `vidas`, `vidas_extra`, `fragmentos`, `ofensiva`, `ultimo_dia_ativo`, `curiosidades_lidas text[]`, `baus jsonb` (`{comum,raro,lendario}`).
- `user_inventario` — 1 linha: `power_ups jsonb` (`[{itemId,quantidade,expiraEm}]`), `desbloqueios text[]`.
- `user_missoes` — 1 linha: `missoes jsonb`, `conquistas jsonb`, `ultimo_reset jsonb` (`{diaria,semanal}`).
- `user_passaporte` — 1 linha: `estado jsonb` (carimbos, tier, temporada).
- `user_nivelamento` — 1 linha: `fez`, `ancao`, `percentagem`, `acertos`, `total`, `unidade_sugerida`, `todos_desbloqueados`, `popup_pendente`.
- `user_preferencias` — 1 linha: `notificacoes jsonb`, `acessibilidade jsonb`, `flags jsonb` (`seen_apresentation`, `seen_features`, `seen_fronteiras_intro`, etc.).
- `chat_threads` — `id`, `user_id`, `titulo`, `atualizado_em`.
- `chat_mensagens` — `id`, `thread_id`, `role`, `parts jsonb`, `criado_em`.

Ajustes em tabelas existentes:

- `profiles`: adicionar `avatar_url` já existe; adicionar `foto_base64 text` opcional só se avatar via Storage não for prioridade — preferir bucket `avatars` privado com policy por utilizador.
- `progresso`: passa a ser a fonte da verdade de `premium` **e** ganha `premium_expira_em timestamptz null`, `ads_off boolean default false` (para toggle rápido).

Storage: bucket privado `avatars` com policy `user_id = auth.uid()` no path (`{uid}/…`).

Trigger `handle_new_user` passa a criar linha vazia em cada nova tabela `user_*` (idempotente com `on conflict do nothing`).

## 2. Expiração do Modo Furtivo (7 dias) + aviso

- `stealth_expira_em` já existe em `profiles`. Adicionar edge function agendada `stealth-sweeper` (cron diário) que:
  1. Encontra utilizadores `tipo='stealth'` com `stealth_expira_em <= now()` → chama `admin.auth.deleteUser` (cascata apaga tudo).
  2. Marca `stealth_avisado_em` (nova coluna) 24h antes de expirar para o cliente mostrar aviso.
- No frontend: quando `profile.tipo='stealth'` e faltarem <24h, mostrar modal “O teu progresso será apagado em X horas. Cria conta para guardar tudo.” com CTA para signup real (que reaproveita o mesmo `user_id` via `updateUser({email,password})`, mantendo XP/inventário).

## 3. Substituir localStorage por hooks Supabase

Refactor de cada hook para o padrão “ler ao entrar + escrever com debounce + realtime opcional”:

- `useSaldo` → `user_saldo` (upsert com debounce 400ms; setState otimista).
- `useInventario` → `user_inventario`.
- `useMissoes` → `user_missoes` (reset diário/semanal calculado no cliente com base em `ultimo_reset`).
- `usePassaporte` → `user_passaporte`.
- `useNivelamento` → `user_nivelamento`.
- `useProgresso` → já usa Supabase, remover fallback local.
- `AcessibilidadeContext`, `NotificacoesScreen`, `ContaScreen (kwendi.def.conta)` → `user_preferencias` + `profiles`.
- Flags de tour (`kwendi_seen_*`) → `user_preferencias.flags`.
- `PremiumContext` → lê `progresso.premium` (e `premium_expira_em`); toggle local é removido — Premium só se ativa via compra (secção 5) ou stealth-degustação controlada por flag no backend.
- `AuthContext.kwendi.auth.user` → removido; a fonte é sempre `supabase.auth.getSession()`.
- `sessionTracker`/`stats` → passa a inserir em `sessoes`/`eventos`.
- `adminRegistry`/`LocalStorageDataSource` (só usados no admin em ambiente local) → apagar; admin já lê via `admin_overview` RPC.

Padrão único num novo helper `src/lib/backend/userStore.ts` (getters/setters tipados por tabela) para todos os hooks acima consumirem, evitando duplicação.

Migração one-shot no arranque: `useAuthReady` — quando detetar sessão, tentar `upload` de qualquer chave `kwendi*` ainda no `localStorage` (merge com o que já existe em DB, DB ganha em conflito) e depois `localStorage.clear()` de tudo com prefixo `kwendi`.

## 4. Eliminar conta — garantir apagamento real

A edge function `delete-account` já existe e chama `admin.deleteUser`. Problemas a corrigir:

- Adicionar `ON DELETE CASCADE` explícito em todas as novas tabelas `user_*` para `auth.users(id)`.
- Confirmar cascata em `profiles`, `progresso`, `sessoes`, `eventos`, `user_roles` (auditar FKs; adicionar se em falta).
- No cliente `ContaScreen.eliminarConta`: aguardar `signOut()` **antes** de limpar `localStorage`; se `functions.invoke` devolver erro → mostrar mensagem específica; adicionar smoke test via Playwright para confirmar que o utilizador some do dashboard.

## 5. Premium — ativar as features reais da Loja

Fonte da verdade: `progresso.premium` + `progresso.premium_expira_em`.

Implementar efeitos reais nos hooks (todos consultam `usePremium()`):

- **Sem anúncios**: flag `ads_off` — componentes de anúncio (`AdSlot`) devolvem `null`.
- **Dobrador XP**: `useSaldo.ganharXp(n)` multiplica por 2 se premium ativo (já parcialmente feito; remover dependência de `premiumAtivoStatic` em localStorage).
- **Vidas infinitas**: `perderVida()` no-op se premium.
- **Baús premium**: nova raridade `premium` na tabela de drops, elegível só se premium (aparece em `LojaScreen`/recompensas).
- **Badge Premium no perfil**: `ProfileScreen` renderiza selo dourado quando `premium=true`.
- **Filtro anti-erros no dicionário / packs culturais exclusivos**: desbloqueio automático via `user_inventario.desbloqueios` quando premium ativa.

SEM COMPRA POR ENQUANTO; MANTER A INTERFACE DE PREMIUM NA DEGUSTAÇÂO GRÀTIS.

## 6. Chat Kwendi IA (feature Premium)

Nova secção acessível só a premium.

- Tabelas `chat_threads` + `chat_mensagens` (secção 1).
- Rota `/kwendi/:threadId` (React Router) com lista lateral de threads e composer AI Elements.
- Edge function `kwendi-chat` (streaming) usando AI SDK + Lovable AI Gateway (`google/gemini-2.5-flash` por defeito), `streamText` + `toUIMessageStreamResponse`, `onFinish` grava a mensagem final.
- System prompt: tutor de Umbundu e cultura angolana; tools opcionais `dictionary_lookup` (RPC no Supabase) e `story_lookup`.
- Rate limit simples por utilizador (contagem em `eventos.tipo='kwendi_chat'` no dia).

## 7. Varredura e limpeza final

- Apagar `src/admin/LocalStorageDataSource.ts` e `src/admin/dataSource.ts` (admin já consome `admin_overview`).
- Remover `src/hooks/useBackendSync.ts` (a sync passa a estar embutida em cada hook `user_*`).
- Garantir que `AuthContext` faz `upsert` em `profiles` **e** cria linhas nas novas tabelas `user_*` (também coberto pelo trigger, mas idempotente do lado cliente para OAuth).
- Rodar `supabase--linter` e `security--run_security_scan` no fim.

## Ordem de execução

1. Migração DB (tabelas `user_*`, colunas premium, cascatas, trigger, bucket avatars).
2. Helper `userStore` + refactor de todos os hooks.
3. Migração one-shot localStorage → Supabase no arranque + limpeza.
4. Cascade real + testes de `delete-account`.
5. Premium: efeitos in-app + Stripe checkout + webhook + cron expiração.
6. Chat Kwendi IA.
7. Stealth-sweeper + aviso 24h.
8. Varredura final, remoção de código morto, scans.

## Notas técnicas

- Todos os `CREATE TABLE` acompanhados por `GRANT SELECT,INSERT,UPDATE,DELETE … TO authenticated` + `GRANT ALL … TO service_role`, seguidos de `ENABLE ROW LEVEL SECURITY` e políticas `auth.uid() = user_id`.
- Hooks usam padrão `useAuthReady` (session-first) para evitar queries sem sessão.
- `onAuthStateChange` nunca fica `async` — apenas dispara `setTimeout(fetch, 0)` para evitar deadlocks.
- Escritas passam por debounce 400ms com merge otimista para não spammar Supabase durante lições.

Sobre `https://kwendi.xyz/oauth/consent`: essa rota é para o servidor MCP com OAuth — não foi implementada porque o MCP atual é público (read-only). Se quiseres MCP autenticado, abrimos essa peça noutro plano — não é bloqueador do que está acima.