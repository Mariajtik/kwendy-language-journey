
# Reconstrução Kwendi sobre Lovable Cloud

Lovable Cloud já está ativo (nova instância). O código antigo ainda referencia tabelas da instância anterior — daí os erros de build. O plano abaixo executa a reconstrução por fases, começando pela **autenticação**, como pediste. LocalStorage passa a ser apenas cache offline; a fonte de verdade é o Cloud.

---

## Ideias já discutidas mas bloqueadas pelo backend (inventário)

Recolhidas das conversas e do código:

1. **Autenticação real** (email/senha + Google) com criação e eliminação de conta refletida na base de dados.
2. **OTP de 6 dígitos** no primeiro login por dispositivo (30d de confiança) e em ações sensíveis (mudar senha, mudar email, eliminar conta).
3. **Modo Furtivo** com utilizador anónimo real, expiração em 7 dias e conversão para conta com preservação do progresso.
4. **Persistência de progresso** (XP, diamantes, vidas, ofensiva, secções completas, unidade atual) por utilizador no Cloud.
5. **Inventário** (power-ups, desbloqueios) por utilizador.
6. **Missões, conquistas e baús** persistidos por utilizador com reset diário/semanal.
7. **Nivelamento** (fez, ancião, percentagem, unidade sugerida) persistido.
8. **Passaporte** de província persistido.
9. **Preferências, acessibilidade e notificações** por utilizador.
10. **Kwendi Chat IA** com threads e mensagens persistidas + streaming via Lovable AI Gateway (`google/gemini-2.5-flash`).
11. **Loja e Premium** (compras, saldo insuficiente, ativação Premium, ads-off) com estado real no Cloud.
12. **Avatar de perfil** em Storage privado + moderação.
13. **Admin real**: dashboard, utilizadores, sessões, progresso, regiões, conquistas — com `has_role('admin')`.
14. **Sessões e eventos** para analytics (login, lição concluída, missão, compra).
15. **Realtime** para saldo/inventário refletirem entre abas/dispositivos.
16. **Route gate global**: sem sessão real e sem furtivo ativo → `/apresentation`.
17. **Mensagens de erro/sucesso reais** (só após `await` do Cloud, nada otimista).
18. **Sweeper diário** de contas furtivas expiradas.

---

## Fase 0 — Reset e limpeza (imediato)

- Apagar código de espelho LocalStorage↔Supabase: `src/lib/backend/mirror.ts`, `src/lib/backend/registry.ts`, `src/lib/backend/prefsFlags.ts`, `useBackendSync.ts`, `src/lib/sessionTracker.ts` (será reescrito), `src/admin/SupabaseDataSource.ts` (será reescrito).
- Apagar migração antiga `supabase/migrations/20260704121951_*.sql` (referencia instância antiga).
- Apagar screens/hooks temporariamente quebrados por referência a tabelas inexistentes; reintroduzidos nas fases seguintes.
- No arranque da app, se não houver sessão nem modo furtivo ativo, `localStorage.clear()` uma vez (chave-sentinela `kwendi.reset.v2`) para eliminar dados do LocalStorage antigo.

## Fase 1 — Autenticação real (foco desta primeira entrega)

### 1.1 Migração SQL única

Cria apenas o necessário para autenticação e perfil base:

- `public.profiles` (id ↔ `auth.users`, email, nome, província, país, motivação, fonte_kwendi, chokwe, objetivo_diario, nivel_declarado, tipo `signup|stealth`, stealth_expira_em, stealth_avisado_em, avatar_url, created_at, updated_at).
- Enum `app_role` (`admin`, `user`) + `public.user_roles` + `public.has_role(uuid, app_role)` (SECURITY DEFINER).
- `public.user_devices` (user_id, device_id uuid, device_name, ultimo_uso, created_at) — para OTP por dispositivo.
- `public.auth_otp` (id, user_id, purpose enum `login|password_change|email_change|account_delete`, code_hash, expires_at, consumed_at, tentativas).
- Trigger `handle_new_user()` → cria `profiles` + role `user` no signup. Guarda `tipo='stealth'` e `stealth_expira_em = now()+7d` se `is_anonymous`.
- RLS em todas as tabelas com `auth.uid() = user_id` + guard `(auth.jwt()->>'is_anonymous')::bool = false` onde aplicável.
- GRANTs obrigatórios (`authenticated`, `service_role`).
- Bucket privado `avatars` + policies por owner.

### 1.2 Configurar Auth

- `supabase--configure_auth`: `auto_confirm_email=false`, `external_anonymous_users_enabled=true` (necessário para modo furtivo), `password_hibp_enabled=true`, `disable_signup=false`.
- `supabase--configure_social_auth` com `providers=["google"]`. Google OAuth managed by Lovable Cloud — sem pedir Client ID/Secret ao utilizador.

### 1.3 Emails de auth

- `email_domain--scaffold_auth_email_templates` (usa o domínio já configurado do projeto). Aplicar branding Kwendi (crimson) aos 6 templates (`signup`, `recovery`, `magic-link`, `invite`, `email-change`, `reauthentication`).
- Deploy do `auth-email-hook`.

### 1.4 Edge functions

- `otp-issue` — verify_jwt on; gera código de 6 dígitos, hash SHA-256, TTL 10 min, máx 5 tentativas, um ativo por `(user_id, purpose)`; envia email via template dedicado (o hook usa Lovable Emails).
- `otp-verify` — valida código, marca `consumed_at`; se `purpose=login`, faz upsert em `user_devices`.
- `delete-account` — reescrever para exigir OTP `account_delete` verificado antes de `auth.admin.deleteUser`.
- `stealth-sweeper` — cron diário; elimina contas com `tipo='stealth'` e `stealth_expira_em < now()`.

### 1.5 Reescrever `AuthContext` + fluxo de login/signup

- `AuthContext`: `session`, `user`, `loading`, `isStealth`, `signOut`. Nada de `hydrateAll`/`clearAllLocal`.
- `LoginScreen`: `signInWithPassword` → se sucesso, cria/lê cookie `kwendi_device_id` (uuid, 400d, SameSite=Lax) → consulta `user_devices` para esse `device_id`; se `ultimo_uso > now()-30d` vai direto para `/home`; senão navega para `/auth/otp` com `purpose=login`.
- `SocialAuthButtons` (Google): `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth/callback" })`. `AuthCallbackScreen` faz o mesmo check de dispositivo antes de rotear.
- `SignupFlow`: `signUp` real + upsert em `profiles` com os dados do onboarding. Após signup, mesmo fluxo OTP.
- `/auth/otp` (nova screen): 6 inputs, chama `otp-verify`; suporta `purpose=login|password_change|email_change|account_delete`.
- `ForgotPasswordScreen` / `ResetPasswordScreen`: continuam via `resetPasswordForEmail` (Lovable Emails).
- `ContaScreen`: mudar senha e eliminar conta pedem OTP sempre (não usa `user_devices`).
- `StealthModeScreen`: `signInAnonymously()` → trigger cria profile com `tipo='stealth'` e expiração 7d. `StealthExpiryBanner` lê `profiles.stealth_expira_em`.

### 1.6 Route gate global

- `App.tsx`: enquanto `loading`, splash. Depois: `!user && !stealthValido` → redireciona para `/apresentation`. Rotas públicas: `/apresentation`, `/welcome`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/auth/callback`, `/auth/otp`, `/stealth`.

### 1.7 Corrigir build

Com o schema mínimo da Fase 1, os `types.ts` regenerados cobrem `profiles`, `user_roles`, `user_devices`, `auth_otp`. Ficheiros que ainda dependem de tabelas de fases seguintes são temporariamente **neutralizados** (retornam vazios/no-ops) para o build passar, e reescritos nas fases 2–4:

- `PremiumContext` → lê apenas de `profiles`/hardcoded `false` até fase 4.
- `useBackendSync`, `sessionTracker`, `admin/SupabaseDataSource`, `StealthExpiryBanner`, `KwendiChatScreen`, `ContaScreen` upsert → adaptados ou stubbed.
- `mirror.ts`/`registry.ts` removidos; imports em hooks (`useSaldo`, `useInventario`, `useMissoes`, `useNivelamento`, `usePassaporte`, `AcessibilidadeContext`, `NotificacoesScreen`) trocados para escrita direta em `localStorage` (cache offline) até fase 2 fazer a persistência Cloud.

## Fase 2 — Dados de progresso no Cloud

Migração 2: `progresso`, `user_saldo`, `user_inventario`, `user_missoes`, `user_nivelamento`, `user_passaporte`, `user_preferencias`. Trigger `handle_new_user` estendido para inicializar linhas. Reescrever os hooks correspondentes para React Query + Realtime; LocalStorage passa a ser cache read-through (Cloud é a fonte de verdade).

## Fase 3 — Chat IA + Sessões/Eventos

Migração 3: `chat_threads`, `chat_mensagens`, `sessoes`, `eventos`. Edge function `kwendi-chat` usa Lovable AI Gateway. `sessionTracker` reescrito.

## Fase 4 — Loja / Premium / Admin

Migração 4: `progresso.premium`, `compras`, `admin_overview` / `admin_sessions_stats` views. `PremiumContext` real. Admin screens reescritas com `has_role('admin')`.

## Fase 5 — Realtime + polimento

Ativar Realtime em `user_saldo`, `user_inventario`, `chat_mensagens`. QA end-to-end.

---

## Detalhes técnicos

- **Cookie de dispositivo**: `kwendi_dev` uuid, `SameSite=Lax`, 400d, renovado após cada OTP verificado.
- **OTP**: `crypto.randomInt(100000, 999999)`, hash `sha256(code + user_id + purpose)`, TTL 10 min, 5 tentativas, um ativo por `(user_id, purpose)`; ao emitir novo, os anteriores ficam `consumed_at = now()`.
- **Google managed**: sem Client ID/Secret manual — usa o proxy Lovable.
- **Erros/sucesso**: `toast.error(error.message)` só após `await`; nunca otimista.
- **AI Gateway**: modelo default `google/gemini-2.5-flash`; header `Lovable-API-Key` via `LOVABLE_API_KEY` (já provisionado).

## Fora de scope desta entrega

- UI/UX (mantém-se).
- Conteúdo pedagógico.
- Regras de negócio da Loja/Premium (apenas passam a persistir).

## Ordem imediata após aprovação

1. Migração Fase 1 (única).
2. `configure_auth` + `configure_social_auth` (Google).
3. Scaffold + branding dos email templates + deploy `auth-email-hook`.
4. Deploy `otp-issue`, `otp-verify`, `delete-account`, `stealth-sweeper`.
5. Reescrever `AuthContext`, login/signup/callback/OTP screens, gate global.
6. Neutralizar imports partidos (fases 2–4) para build limpo.
7. Confirmar login end-to-end antes de arrancar Fase 2.
