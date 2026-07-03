## Backend real — Supabase Auth + persistência + admin

Migrar o app do localStorage para Supabase como fonte da verdade em auth, perfis, progresso, sessões e modo furtivo. O painel admin passa a ler dados de todos os utilizadores. Sem migração dos dados locais existentes — recomeçar em produção.

### 1. Schema (uma migração)

```text
enums:
  app_role = ('admin', 'user')

public.profiles
  id uuid PK REFERENCES auth.users(id) ON DELETE CASCADE
  nome text, email text, avatar_url text
  provincia text, pais text, motivacao text
  fonte_kwendi text, chokwe text, objetivo_diario text
  nivel_declarado text
  tipo text CHECK IN ('signup','stealth') DEFAULT 'signup'
  stealth_expira_em timestamptz NULL
  criado_em, atualizado_em

public.user_roles
  id, user_id → auth.users, role app_role, UNIQUE(user_id, role)

public.progresso
  user_id PK → auth.users
  xp int, diamantes int, streak int
  seccoes_completas text[]
  unidade_atual text
  premium bool, nivelamento_percentagem int NULL, ancao bool
  atualizado_em

public.sessoes
  id, user_id → auth.users
  iniciada_em, terminada_em timestamptz NULL
  rota text, duracao_ms int GENERATED

public.eventos          -- opcional para métricas ricas (missões, testes, etc.)
  id, user_id, tipo text, payload jsonb, criado_em
```

**GRANTs em cada tabela pública:** `authenticated` SELECT/INSERT/UPDATE/DELETE (com RLS), `service_role` ALL. Sem `anon` — todos os dados exigem sessão.

**RLS:**

- `profiles`, `progresso`, `sessoes`, `eventos`: utilizador só vê/escreve as suas linhas (`auth.uid() = user_id` / `id`). Admin lê tudo via `public.has_role(auth.uid(),'admin')`.
- `user_roles`: `SELECT` só do próprio, escrita só por `service_role`.

**Funções/triggers:**

- `has_role(_user_id uuid, _role app_role)` — SECURITY DEFINER, evita recursão em RLS.
- `handle_new_user()` — trigger `AFTER INSERT ON auth.users` cria linha em `profiles` (com `raw_user_meta_data` → nome/tipo/província/…) e em `progresso` (zerados).
- `update_atualizado_em()` trigger em `profiles`/`progresso`.

### 2. Auth flow

`src/contexts/AuthContext.tsx` — provider com `session/user/loading`. Registra `onAuthStateChange` primeiro, depois `getSession()`; expõe `signIn`, `signUp`, `signInWithProvider`, `signOut`, `resetPassword`.

**Fluxos atualizados:**

- `SignupFlow.tsx` — no fim, chama `supabase.auth.signUp({ email, password, options: { emailRedirectTo: origin, data: { nome, provincia, pais, motivacao, fonte, chokwe, objetivo_diario, nivel_declarado, tipo:'signup' } } })`. Remove `registerLocalUser`. Trigger preenche `profiles`.
- `LoginScreen.tsx` — `signInWithPassword`. Botões Google/Apple via `signInWithOAuth({ provider, options:{ redirectTo: origin }})`.
- `ForgotPasswordScreen.tsx` — `resetPasswordForEmail(email, { redirectTo: origin + '/reset-password' })`.
- **Nova página** `/reset-password` (`ResetPasswordScreen.tsx`) — detecta `type=recovery`, chama `updateUser({ password })`.
- `StealthModeScreen.tsx` — usa `signUp` com email sintético `stealth-<uuid>@kwendi.local` e password aleatória, `data: { nome:username, tipo:'stealth', stealth_expira_em: now+7d }`; guarda a sessão normal. Remove `registerLocalUser`/`setStealthActive`.
- `ProfileScreen`, `HomeScreen`, etc.: substituir leituras de `kwendi.auth.user` por `useAuth().user` + `profiles` via query.

### 3. Progresso e saldo persistidos

Novo `src/hooks/useProgresso.ts` — carrega `progresso` do utilizador, expõe update helpers (`addXp`, `addDiamantes`, `completeSeccao`, `setStreak`, `unlockAncao`). Persistência com upsert + optimistic UI.

Substituir em todos os pontos hoje escritos em `localStorage` (`kwendi:progresso`, `kwendi_saldo_v1`, `kwendi:nivelamento`, `kwendi.premium.ativo`, `kwendi_missoes_v1`, `kwendi:caderno`) — LessonScreen, SecaoScreen, NivelamentoScreen, LojaScreen, ProfileScreen, MissoesScreen, CadernoScreen. Missões e caderno viram tabelas `eventos` (ou tabelas próprias, se preferir; aqui uso `eventos` para conter escopo).

Fallback offline: continua a escrever num "buffer" local que sincroniza ao voltar online.

### 4. Sessões no backend

`installSessionTracker`:

- Se `isAdminTesting()` → não faz nada.
- Se autenticado → cria uma linha em `sessoes` (`INSERT` com `iniciada_em=now()`) e mantém o `id`. A cada activity, `UPDATE terminada_em=now()`. `visibilitychange=hidden` ou 5 min idle fecham. `beforeunload` faz `UPDATE` best-effort com `keepalive` via `fetch`.
- `sessions_local` deixa de ser lido pelo painel.

### 5. Painel admin sobre o backend

- `useAdminAuth`:
  - Mantém a rota secreta `/grupo16Kwendi` e o combo `Ctrl+Shift+A`.
  - **Passo do login secreto** cria/valida sessão Supabase: se já existe um `auth.user` com role `admin`, aceita. Caso contrário faz `signInWithPassword({ email:'grupo16Kwendi@kwendi.admin', password:'Teremos19Valores!' })`. Este utilizador é criado uma vez (ver seed abaixo) e recebe `role='admin'` em `user_roles`.
  - `RequireAdmin` valida `has_role` chamando `.rpc('has_role',{ _user_id:user.id,_role:'admin' })`.
- `SupabaseDataSource` implementa `AdminDataSource` lendo:
  - `listUsers` — `profiles` + join com `progresso` + info stealth (calcula `stealthAtivo` de `stealth_expira_em > now()`).
  - `getOverview` — mesmas agregações mas SQL: uso duas RPCs (`admin_overview`, `admin_sessions_stats`) SECURITY DEFINER protegidas por `has_role`. Retornam JSON pronto (regiões, países, motivações, novos por dia, alertas).
  - `getSessions` — `sessoes` agregadas por dia (RPC).
  - `getProgress`, `getAchievements` — agregados sobre `progresso`/`eventos`.
- `dataSource.ts` — `getAdminDataSource()` deteta se há user autenticado + role admin e devolve `SupabaseDataSource`; caso contrário fica em `LocalStorageDataSource` (permite ainda ver dados locais no dev antes do login backend concluído). Remove flag `VITE_ADMIN_USE_BACKEND`.
- Modo "Abrir app (modo teste)" continua a funcionar: além de `startAdminTesting()`, o session tracker já ignora e `useProgresso` opcionalmente marca escritas com `?dry=true` — como o admin não tem `profiles`/`progresso` de utilizador comum, mesmo que grave não polui as métricas de outros. Para ficar simples: no modo teste, hooks de escrita ficam disabled (só leitura). Fica claro no banner.

### 6. Seed inicial do admin

Como não posso criar contas via SQL para `auth.users`, o setup do admin faz-se numa edge function `bootstrap-admin` (chamada uma vez pelo login secreto se `has_role` falhar) que:

1. Verifica que a password enviada bate com um segredo `ADMIN_BOOTSTRAP_PASSWORD`.
2. Chama `supabase.auth.admin.createUser({ email:'grupo16Kwendi@kwendi.admin', password, email_confirm:true })` se ainda não existir.
3. Insere `user_roles(user_id, 'admin')`.
4. Devolve OK; cliente faz `signInWithPassword`.

Segredo novo: `ADMIN_BOOTSTRAP_PASSWORD` (definido = `Teremos19Valores!` via `set_secret`).

### 7. Providers OAuth

Google + Apple: configurados no **dashboard Supabase → Authentication → Providers** pelo utilizador. Vou deixar instruções no chat e adaptar `SocialAuthButtons` para chamar `signInWithOAuth`. Sem edits em `supabase/config.toml` necessários.

### 8. Emails de auth

Manter os defaults Supabase por agora (confirmação de email, reset). Se quiser branding, corremos `scaffold_auth_email_templates` num passo separado.

### 9. Arquivos afetados

**Novos:**

- `src/contexts/AuthContext.tsx`
- `src/hooks/useProgresso.ts`
- `src/admin/SupabaseDataSource.ts`
- `src/screens/ResetPasswordScreen.tsx`
- `supabase/functions/bootstrap-admin/index.ts`

**Editados:**

- `src/App.tsx` — envolve com `AuthProvider`, adiciona `/reset-password`.
- `src/screens/SignupFlow.tsx`, `LoginScreen.tsx`, `ForgotPasswordScreen.tsx`, `StealthModeScreen.tsx`, `ProfileScreen.tsx`, `LessonScreen.tsx`, `SecaoScreen.tsx`, `NivelamentoScreen.tsx`, `LojaScreen.tsx`, `MissoesScreen.tsx`, `CadernoScreen.tsx`, `HomeScreen.tsx`.
- `src/hooks/useAdminAuth.ts` — usa Supabase + `bootstrap-admin`.
- `src/components/admin/RequireAdmin.tsx` — checa `has_role`.
- `src/admin/dataSource.ts` — factory decide local vs Supabase.
- `src/lib/sessionTracker.ts` — escreve em `sessoes`.
- `src/components/SocialAuthButtons.tsx` — usa `signInWithOAuth`.

**Removidos (uso deixa de existir, ficheiros mantidos como fallback histórico enquanto não estabiliza):**

- Continua a existir `src/lib/adminRegistry.ts` e `LocalStorageDataSource` como fallback dev; nova migração real vive na cloud.

### Notas

- Confirmar no dashboard Supabase → Authentication → URL Configuration que Site URL e Redirect URLs incluem `https://kwendi.lovable.app`, `https://kwendi.xyz`, `https://www.kwendi.xyz`, `http://localhost:8080`.
- Depois da migração vou correr um scan de segurança e resolver quaisquer avisos gerados pelas novas tabelas.
- Auth precisa de conta confirmada; enquanto os utilizadores confirmam email, `profiles` fica criado na mesma (trigger dispara no insert em `auth.users`).