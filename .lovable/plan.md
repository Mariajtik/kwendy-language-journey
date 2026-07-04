
# Reconstrução do backend em Lovable Cloud

Migração completa: nova base de dados Lovable Cloud, autenticação real (Google + email/senha), OTP no primeiro login de cada dispositivo, OTP em ações sensíveis (mudar senha, eliminar conta), e remoção total do LocalStorage como fonte da verdade. Toda a UI existente é preservada; só a camada de dados/auth muda.

---

## 1. Ativar Lovable Cloud e desligar Supabase externo

- Ativar Lovable Cloud (nova instância Supabase gerida pela Lovable, novo `VITE_SUPABASE_*`).
- Reescrever `.env` com as novas credenciais.
- Descartar toda a base de dados anterior (o utilizador confirmou).
- Ativar Lovable AI Gateway (necessário para o Kwendi Chat IA já existente).

## 2. Esquema de base de dados (do zero, Lovable Cloud)

Uma única migração cria tudo:

- `profiles` — id, email, nome, província, país, motivação, fonte_kwendi, chokwe, objetivo_diario, nivel_declarado, tipo (`signup`|`stealth`), stealth_expira_em, stealth_avisado_em, avatar_url.
- `progresso` — user_id, premium (bool), premium_expira_em, ads_off.
- `user_saldo` — xp, diamantes, vidas, vidas_extra, fragmentos, ofensiva, ultimo_dia_ativo, curiosidades_lidas (jsonb), baus (jsonb).
- `user_inventario` — power_ups (jsonb), desbloqueios (jsonb).
- `user_missoes` — missoes, conquistas, ultimo_reset (jsonb).
- `user_nivelamento` — fez, ancao, percentagem, acertos, total, unidade_sugerida, todos_desbloqueados, popup_pendente.
- `user_passaporte` — estado (jsonb).
- `user_preferencias` — flags, notificacoes, acessibilidade (jsonb).
- `chat_threads` / `chat_mensagens` — para Kwendi Chat IA.
- `user_devices` — user_id, device_id (uuid), device_name, ultimo_uso, criado_em. Marca dispositivos confiáveis (30 dias) para o OTP.
- `auth_otp` — id, user_id, purpose (`login`|`password_change`|`account_delete`), code_hash, expires_at (10min), consumed_at, tentativas.
- `user_roles` + `app_role` enum + `has_role()` (padrão obrigatório de segurança).
- Trigger `handle_new_user()` cria linhas em todas as tabelas per-user no signup.
- RLS: todas as tabelas com `auth.uid() = user_id` e guarda `is_anonymous = false` (herda a correção já validada).

## 3. Autenticação real

- **Cadastro Google + email/senha**: Supabase Auth padrão. Registar callback `/auth/callback` em Google Console (URL já configurada).
- **OTP no primeiro login por dispositivo**:
  - Após `signInWithPassword`/`signInWithOAuth` bem-sucedido, o cliente gera/lê `kwendi_device_id` num cookie httpOnly (via edge function) e chama `otp-issue`.
  - Se `user_devices` já tem esse `device_id` com `ultimo_uso > now() - 30d`, salta o OTP e vai para `/home`.
  - Caso contrário, `otp-issue` gera código de 6 dígitos, guarda `sha256` em `auth_otp`, envia por email via Lovable Emails (template dedicado), e a UI mostra ecrã de OTP.
  - Nova rota `/auth/otp` com 6 inputs; ao submeter chama `otp-verify` que valida (código, expira, tentativas ≤ 5), regista o dispositivo em `user_devices`, e liberta a sessão.
- **OTP em ações sensíveis**: mudar senha e eliminar conta pedem o mesmo fluxo com `purpose` diferente (não usa `user_devices`, sempre pede).
- **Emails**: scaffold dos templates auth Lovable + template custom `otp-code.tsx` para o código de 6 dígitos, com branding Kwendi.

## 4. Edge functions (Lovable Cloud)

- `otp-issue` (público, verify_jwt=false depois de validar sessão manualmente) — gera código, guarda hash, chama Lovable Emails.
- `otp-verify` — valida código, marca `consumed_at`, cria/atualiza `user_devices` se `purpose=login`.
- `delete-account` — pede OTP, valida, chama `auth.admin.deleteUser(uid)` com service role. O `ON DELETE CASCADE` em `auth.users(id)` limpa tudo.
- `kwendi-chat` — reaproveitar (já existe), reapontar para nova instância.
- `stealth-sweeper` — cron diário elimina contas stealth expiradas.
- `auth-email-hook` — Lovable Emails para signup/recovery/magic-link com branding Kwendi.

## 5. Remoção total do LocalStorage

- Apagar `src/lib/backend/mirror.ts` e `src/lib/backend/registry.ts` (camada de espelho).
- Reescrever hooks (`useSaldo`, `useInventario`, `useMissoes`, `useNivelamento`, `usePassaporte`, prefs, `AcessibilidadeContext`, notificações) para ler/escrever direto na Cloud via `supabase.from(...)`. Estado em memória com React Query + subscription realtime para invalidação.
- Remover `pushKey`, `hydrateAll`, `clearAllLocal`.
- `useAuthReady` (padrão recomendado) para bloquear queries até sessão restaurada.
- **Gate global**: em `App.tsx`, se `!user && !stealthAtivo` redireciona para `/apresentation`. Nenhuma tela do app é acessível sem sessão real ou modo furtivo.

## 6. Modo Furtivo (mantido)

- Continua a criar utilizador `is_anonymous=true` na Auth (Supabase Anonymous Sign-in), com `profiles.tipo='stealth'` e `stealth_expira_em = now()+7d`.
- Banner de aviso já existe; migra sem alterações lógicas grandes.
- Ao converter para conta real: `linkIdentity` migra o UUID, sem perder progresso.

## 7. Mensagens de erro/sucesso reais

- Todos os `toast.success`/`toast.error` passam a espelhar exatamente a resposta da Cloud (`error.message` traduzido). Sem toasts otimistas — só após `await` bem-sucedido.
- Login/signup/OTP/mudar-senha/eliminar-conta seguem o mesmo padrão.

## 8. Ordem de execução (para a fase de build)

1. Ativar Lovable Cloud + AI Gateway.
2. Migração SQL única (tabelas, RLS, grants, triggers, roles).
3. Scaffold auth email templates + template OTP com branding Kwendi.
4. Deploy edge functions (`otp-issue`, `otp-verify`, `delete-account`, `stealth-sweeper`, `kwendi-chat`, `auth-email-hook`).
5. Reescrever hooks para Cloud direto; apagar mirror/registry.
6. Adicionar `/auth/otp` screen + integrar no fluxo de login (Google e email/senha).
7. Adicionar OTP em `ContaScreen` (mudar senha, eliminar conta).
8. Gate global de rotas.
9. Configurar Google OAuth no dashboard Lovable Cloud (o utilizador terá de colar Client ID/Secret).

## Detalhes técnicos

- OTP: 6 dígitos, `crypto.randomInt(100000, 999999)`, hash `sha256(code + user_id)`, TTL 10 min, máx 5 tentativas, um código ativo por `(user_id, purpose)` (invalida os anteriores).
- `user_devices.device_id`: UUID em cookie httpOnly `kwendi_dev` com `SameSite=Lax`, 400 dias. Renovado a cada OTP verificado.
- Realtime: `supabase.channel(user_id).on('postgres_changes', ...)` para saldo/inventário refletirem entre abas.
- Google OAuth: o utilizador cola Client ID/Secret no dashboard da Cloud (tela Auth → Providers). Sem esses valores, apenas email/senha funciona.

## Fora de scopo (não vai mudar)

- UI/UX das telas atuais.
- Conteúdo pedagógico (lições, curiosidades, histórias, jogo Fronteiras).
- Loja e catálogo Premium (as regras já existem no código; só passam a persistir na Cloud).
