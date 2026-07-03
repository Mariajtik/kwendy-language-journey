## Painel Admin — Expansão de dados críticos

Adicionar instrumentação para capturar dados que o app já pergunta mas não persiste (região/província, país, modo furtivo, motivação, nível declarado), guardar num registo local de utilizadores e mostrar no painel com destaque para o que merece atenção operacional.

### 1. Instrumentação — capturar o que já é perguntado

**Signup (`src/screens/SignupFlow.tsx`)**
- No sucesso final, persistir um registo em `localStorage["kwendi_local_users"]` (array cumulativo, capado a 500):
  ```ts
  { id, tipo: "signup", nome, email, provincia | null, pais, motivacao, nivel, criadoEm }
  ```
- Não altera UX — apenas grava depois de todas as validações passarem.

**Stealth (`src/screens/StealthModeScreen.tsx`)**
- Depois do `data.allowed`, gravar no mesmo array:
  ```ts
  { id, tipo: "stealth", nome: username, ativadoEm, expiraEm: +7d }
  ```
- Persiste também `kwendi.stealth.ativo = { ativadoEm, expiraEm }` para o dashboard saber quantos ainda estão dentro da janela de 7 dias no dispositivo atual.

### 2. Data source — novos campos

Atualizar `AdminUser` e `LocalStorageDataSource.listUsers()` para:
- Ler `kwendi_local_users` e combinar com o utilizador ativo (auth/stealth atual).
- Cada `AdminUser` ganha: `regiao` (província/país), `pais`, `motivacao`, `tipo: "signup" | "stealth"`, `stealthAtivo: boolean`, `stealthExpiraEm`.

Adicionar novo método:
```ts
getOverview(): Promise<{
  totalCadastrados: number;
  totalStealth: number;
  stealthAtivosAgora: number;
  premiumAtivos: number;
  porRegiao: { regiao: string; total: number }[];
  porPais: { pais: string; total: number }[];
  porMotivacao: { motivo: string; total: number }[];
  porTipo: { tipo: string; total: number }[];
  novosPorDia: { dia: string; total: number }[]; // 30 dias
  alertas: { nivel: "warn" | "info"; texto: string }[];
}>
```

### 3. Dashboard — foco em dados críticos

Reorganizar `AdminDashboardScreen` numa faixa de destaque no topo com **cards críticos**:
1. Cadastrados totais
2. Modo furtivo (total + "N ativos agora")
3. Premium ativos
4. Ativos hoje (sessões)
5. Tempo médio/sessão
6. Retenção estimada (ativos hoje ÷ cadastrados)

Abaixo, uma **faixa de alertas** que aparece condicionalmente:
- "X contas em modo furtivo vão expirar nas próximas 24h"
- "Nenhum utilizador ativo nos últimos 7 dias"
- "Y% dos usuários no modo furtivo (sem cadastro real)" — quando > 40%
- "Sem dados de sessão ainda" — quando `porDia` está vazio

Gráficos adicionais:
- **Mapa de barras horizontal** — top 10 províncias (`porRegiao`).
- **BarChart** — distribuição por país (só quando >1 país).
- **PieChart** — Signup vs Furtivo (`porTipo`).
- **BarChart** — motivações de aprendizagem.
- **LineChart** — novos cadastros por dia (30d).
- Mantém: sessões/dia, XP top 10, secções por módulo, distribuição por nível.

### 4. Tabela de usuários — colunas adicionais

`AdminUsersScreen` ganha colunas:
- Tipo (Signup / Furtivo com badge âmbar)
- Região (província ou país)
- Motivação (truncada)
- Furtivo expira em (dias restantes; vermelho quando ≤ 1)

Filtros extra por chips: **Todos / Signup / Furtivo / Premium / Furtivo expirando**.
Export CSV incorpora as novas colunas.

### 5. Nova aba "Regiões"

`/grupo16Kwendi/regioes` (novo item na sidebar com ícone `MapPin`):
- StatCards: províncias distintas, países distintos, % Angola vs Diáspora.
- BarChart horizontal de todas as províncias.
- BarChart de países (excluindo Angola).
- Tabela ordenável região → n° usuários → % do total.

### Arquivos a criar
- `src/screens/admin/AdminRegionsScreen.tsx`

### Arquivos a editar
- `src/admin/dataSource.ts` — expandir `AdminUser`, adicionar `OverviewStats`, método `getOverview`.
- `src/admin/LocalStorageDataSource.ts` — ler `kwendi_local_users`, calcular agregados, alertas.
- `src/components/admin/AdminLayout.tsx` — nova entrada "Regiões".
- `src/screens/admin/AdminDashboardScreen.tsx` — layout com cards críticos + faixa de alertas + novos gráficos.
- `src/screens/admin/AdminUsersScreen.tsx` — colunas + filtros + CSV.
- `src/screens/SignupFlow.tsx` — persistir registo ao concluir.
- `src/screens/StealthModeScreen.tsx` — persistir registo + flag `kwendi.stealth.ativo`.
- `src/App.tsx` — registar rota `/grupo16Kwendi/regioes`.

### Notas
- Continua tudo local; quando o backend chegar, o `SupabaseDataSource` implementa a mesma interface e o painel não muda.
- Alertas são derivados dos próprios dados — nada de tracking externo.