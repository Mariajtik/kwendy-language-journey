## Painel Admin — Kwendi

Painel isolado, sem link em nenhum fluxo do app, acessível apenas por rota secreta ou atalho de teclado, com login próprio. Lê dados do localStorage agora e já deixa a estrutura pronta para trocar para backend depois.

### Acesso
- Rota secreta: `/grupo16Kwendi` (não linkada em nenhum menu).
- Atalho global `Ctrl+Shift+A` (listener montado no `App.tsx`) — navega para `/grupo16Kwendi`.
- Tela de login própria (`AdminLoginScreen`) exigindo usuário e senha.
- Credenciais: `grupo16Kwendi` / `Teremos19Valores!` — hardcoded no frontend nesta fase (usuário aceitou adiar segurança real para quando existir backend). Comentário explícito no código marcando o ponto de substituição.
- Sessão de admin guardada em `sessionStorage` (`kwendi_admin_session`) para expirar ao fechar aba. Guard `RequireAdmin` protege rotas filhas — se não autenticado, redireciona para `/grupo16Kwendi/login`.

### Estrutura de rotas
```
/grupo16Kwendi              -> redireciona p/ login ou dashboard
/grupo16Kwendi/login        -> AdminLoginScreen
/grupo16Kwendi/dashboard    -> visão geral + gráficos
/grupo16Kwendi/usuarios     -> lista completa + filtros
/grupo16Kwendi/progresso    -> XP, diamantes, lições, streak
/grupo16Kwendi/sessoes      -> tempo médio, sessões
/grupo16Kwendi/conquistas   -> conquistas, nivelamento, Premium
```
Layout com sidebar exclusiva do admin (`AdminLayout`), fora do fluxo visual do app (sem BottomNav, sem tema do usuário).

### Camada de dados (abstração para backend futuro)
Criar `src/admin/dataSource.ts` com uma interface única:
```ts
interface AdminDataSource {
  listUsers(): Promise<AdminUser[]>;
  getProgress(): Promise<ProgressStats>;
  getSessions(): Promise<SessionStats>;
  getAchievements(): Promise<AchievementStats>;
  getPremiumStats(): Promise<PremiumStats>;
}
```
Duas implementações:
- `LocalStorageDataSource` — varre chaves conhecidas (`kwendi_user`, `kwendi_progresso`, `kwendi_saldo`, `kwendi_inventario`, `kwendi_nivelamento`, `kwendi_premium`, `kwendi_sessions`, etc.) do dispositivo atual.
- `SupabaseDataSource` — stub retornando `[]` / zeros por enquanto; será plugado quando o backend existir.

Um `getAdminDataSource()` decide qual usar (flag `VITE_ADMIN_USE_BACKEND`, hoje false). Assim, quando o backend chegar, só troca a flag — o painel não muda.

### Instrumentação de sessões (novo)
Como hoje não há tracking, adicionar util leve `src/lib/sessionTracker.ts` chamado do `App.tsx`:
- Regista `startedAt`, `endedAt`, `route` em `localStorage['kwendi_sessions']` (array capado a 200 entradas).
- Considera "sessão" cada abertura do app até 5 min de inatividade / `visibilitychange` hidden.
- Não afeta UI do usuário; apenas escreve dados que o painel lê.

### Métricas & gráficos
Usar **Recharts** (já compatível com o stack). Dashboard principal com cards + gráficos:
- Card: Total de usuários / Ativos hoje / Premium ativos / Tempo médio de sessão.
- LineChart: sessões por dia (últimos 30 dias).
- BarChart: XP total por usuário (top 10).
- PieChart: distribuição por nível (iniciante / intermediário / avançado).
- BarChart: lições concluídas por módulo.
- AreaChart: diamantes acumulados vs gastos ao longo do tempo.
- Tabela filtrável em `/usuarios` com nome, e-mail, nível, XP, diamantes, streak, data de cadastro, Premium, resultado do nivelamento.
- Exportar CSV (botão) da tabela de usuários.

Todas as telas mostram badge "Fonte: LocalStorage (dispositivo atual)" ou "Fonte: Backend" conforme o dataSource ativo, deixando claro o escopo dos dados.

### Estilo visual
Painel deliberadamente distinto do app: fundo escuro `hsl(220 20% 10%)`, sidebar com destaque em crimson do brand, tipografia mono para números, cards com bordas sutis. Objetivo: parecer ferramenta interna, não parte do produto.

### Arquivos a criar
- `src/screens/admin/AdminLoginScreen.tsx`
- `src/screens/admin/AdminDashboardScreen.tsx`
- `src/screens/admin/AdminUsersScreen.tsx`
- `src/screens/admin/AdminProgressScreen.tsx`
- `src/screens/admin/AdminSessionsScreen.tsx`
- `src/screens/admin/AdminAchievementsScreen.tsx`
- `src/components/admin/AdminLayout.tsx`
- `src/components/admin/RequireAdmin.tsx`
- `src/components/admin/StatCard.tsx`
- `src/admin/dataSource.ts` + `LocalStorageDataSource.ts` + `SupabaseDataSource.ts`
- `src/hooks/useAdminAuth.ts`
- `src/hooks/useAdminShortcut.ts` (Ctrl+Shift+A)
- `src/lib/sessionTracker.ts`

### Arquivos a editar
- `src/App.tsx` — registrar rotas `/grupo16Kwendi/*`, montar `useAdminShortcut` e `sessionTracker`. Não adicionar links visíveis.

### Segurança (assumido)
Credenciais no bundle são visíveis a quem inspecionar o JS — aceitável nesta fase por escolha do usuário. Quando o backend existir, substituir `useAdminAuth` por auth real (Supabase + tabela `user_roles` com role `admin`, seguindo o padrão seguro do projeto).