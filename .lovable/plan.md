## Diagnóstico

Três problemas independentes, um deles é bug no código, os outros são configuração no Supabase/Google Cloud.

### 1. Bug no SignupFlow (código) — causa raiz da falha "criar conta"

`SignupFlow.tsx > handleSocialAuth` faz apenas `setStep(2)` quando o utilizador escolhe Google no passo 1. O fluxo continua, chega ao passo final e executa:

```
supabase.auth.signUp({ email: "", password: "", data: {...} })
```

O servidor devolve `422 anonymous_provider_disabled` (visível nos network logs). Além disso, o `signInWithOAuth` do Google *já* redireciona para fora da app, portanto quando o utilizador volta perde o estado do wizard e cai no splash sem token.

### 2. Google OAuth — retorno com erro

Nos auth logs o Supabase responde `302 Redirecting to external provider` (provider está ativo). O erro só aparece **depois** do consentimento no Google — típico de redirect URI não autorizada em Google Cloud, ou Site URL/Redirect URLs incompletas no Supabase.

### 3. Login e-mail — "404 no login"

O login no servidor tem `status 200` (ver auth logs). O 404 é do lado do cliente ao navegar. Provavelmente relacionado ao SPA fallback do domínio `kwendi.xyz` ou a `/home` a assumir dados que não existem porque a conta nunca ficou realmente criada (pelo bug #1).

---

## Correções

### A) Código — corrigir SignupFlow (frontend)

Duas escolhas mutuamente exclusivas para o botão Google/Apple **dentro do wizard**:

- **Opção A (recomendada):** remover botões sociais **de dentro** do SignupFlow. Manter apenas em `LoginScreen`. O `SignupFlow` fica só para o fluxo email/senha completo. Quem quiser Google usa o LoginScreen (que já cria o utilizador automaticamente na primeira vez via OAuth).
- **Opção B:** manter Google no SignupFlow, mas **antes** de chamar `signInWithOAuth` guardar o estado do wizard em `sessionStorage`, e após o callback (num `useEffect` que corre em `/home` ou aqui) chamar `supabase.auth.updateUser({ data: {...} })` para gravar os metadados. Nunca mais chamar `signUp` no final quando o utilizador entrou via OAuth.

Também vou:

- Impedir o `signUp` de disparar se `email` ou `password` estiverem vazios (guarda defensiva).
- No `LoginScreen`, mostrar o ecrã de sucesso apenas depois de a `session` estar confirmada em `useAuth`, evitando a impressão de "sem token".

### B) Configuração — passos manuais no Supabase/Google (do utilizador)

Não posso executar isto pelas tools, mas listo o que **tem** de estar assim para o Google funcionar em `kwendi.xyz`:

**No Google Cloud Console → OAuth Client ID → Web application:**

- Authorized JavaScript origins:
  - `https://kwendi.xyz`
  - `https://www.kwendi.xyz`
  - `https://kwendi.lovable.app`
  - `https://hrbltonpknsxfwdyzykz.supabase.co`
- Authorized redirect URIs (uma linha, exata):
  - `https://hrbltonpknsxfwdyzykz.supabase.co/auth/v1/callback`

**No Supabase Dashboard → Authentication → URL Configuration:**

- Site URL: `https://kwendi.xyz`
- Redirect URLs (add): `https://kwendi.xyz/**`, `https://www.kwendi.xyz/**`, `https://kwendi.lovable.app/**`, `http://localhost:8080/**`

**Authentication → Providers → Email:**

- Manter `Confirm email` **desligado** enquanto testa (senão o cadastro exige clicar em link antes de logar). Ligar depois quando os templates de e-mail estiverem prontos.

### C) SPA/404 em kwendi.xyz

Depois de aplicar A) e testar, se o `/home` ainda der 404 ao fazer refresh no domínio custom, valido isto por Playwright no preview interno.

---

## Ordem de execução (após aprovar)

1. Ajustar `src/screens/SignupFlow.tsx` (Opção A: remover `SocialAuthButtons` do wizard + guarda anti-empty `signUp`).
2. Ajustar `src/screens/LoginScreen.tsx` para gate no `session` real antes de mostrar sucesso.
3. Devolver-te a checklist de URL Configuration + Google Cloud (secção B) para completares no dashboard — sem isso o Google continua a falhar mesmo com código correto.
4. Testar no preview: signup email/senha + login email/senha. Google só testável após passo 3.

Confirma: **Opção A** (remover Google do wizard de signup, mantendo só no login) ou **Opção B** (manter e persistir metadados via `updateUser` no callback)? Opção B.

E tratar agora do template de e-mail.