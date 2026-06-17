## Sistema de Missões & Conquistas — Kwendi

Reformulação completa da tela `/missoes` (hoje placeholder). Tudo com **mock local** (`localStorage` via hook `useMissoes`), mas estruturado em arquivos de dados (`src/data/missoes.ts`, `src/data/conquistas.ts`, `src/data/recompensas.ts`) que amanhã viram tabelas Supabase sem refatorar a UI.

---

### 1. Estrutura da tela `/missoes`

Tabs no topo (estilo Duolingo, pílulas grandes):

```
[ Missões ]   [ Conquistas ]
```

**Header sempre visível**: saldo de Kindeles (moeda), XP do dia, streak (🔥).

---

### 2. Aba MISSÕES

Três seções em cards expansíveis:

**A. Diárias** (4 missões, reset 24h, timer regressivo no canto)

- Completar 1 lição
- Ouvir 3 áudios em Umbundu
- Traduzir 10 palavras
- Acertar 5 respostas seguidas

**B. Semanais** (3 missões, reset domingo 23:59)

- Completar 7 lições
- 30 min de prática
- Concluir 1 história

**C. Especiais / Eventos** (1–2 por vez, datas culturais)

- "Mês da Cultura Umbundu" · "Dia da Independência (11/nov)" · "Carnaval de Luanda"
- Card destacado com banner ilustrado e prazo longo

**Card de missão** — layout:

```
┌─────────────────────────────────────┐
│ 🎯 Ícone   Título da missão         │
│            Descrição curta          │
│            ▓▓▓▓▓▓░░░░  3/5          │
│                       🪙 20  ⭐ 50  │
└─────────────────────────────────────┘
```

- Barra de progresso animada (Framer Motion).
- Quando 100%: botão **"Resgatar"** pulsante → modal de recompensa com confete e som.
- Concluídas viram cinza com check verde.

---

### 3. Sistema de RECOMPENSAS

Quatro moedas/tipos, combinados conforme a missão:


| Tipo                 | Símbolo | Como ganha                               | Onde gasta                                                          |
| -------------------- | ------- | ---------------------------------------- | ------------------------------------------------------------------- |
| **XP**               | ⭐       | Toda missão e lição                      | Sobe nível do perfil (coroa)                                        |
| **Kindeles** (moeda) | 🪙      | Missões diárias/semanais                 | Na loja compra vidas, bloqueios de ofesnivas e mais, e mais (pense) |
| **Baús**             | 📦      | Recompensa final de semanais e especiais | Abrem com itens aleatórios                                          |
| **Badges culturais** | 🛡️     | Marcos e conquistas                      | Exibidos no perfil                                                  |


**Baús** (3 raridades, usando suas imagens de referência):

- 🟫 **Comum** (madeira) — fim de diária
- ⚪ **Raro** (prata) — fim de semanal
- 🟡 **Lendário** (ouro) — fim de evento ou conquista grande

Abertura do baú = animação 2s (chacoalha → estoura) + lista de itens drop: kindeles, XP bônus, fragmentos de badge, item cosmético.

**Tabela de drops** definida em `src/data/recompensas.ts` (probabilidades) — fácil de ajustar.

---

### 4. Aba CONQUISTAS (18 badges no MVP)

Grid 3 colunas (mobile), badges circulares estilo as suas imagens (estrela ao centro, cor por categoria). Tap → modal com descrição, progresso, data de desbloqueio.

**Estados visuais**: bloqueada (cinza escuro + cadeado) · em progresso (colorida com barra) · desbloqueada (brilho + estrela cheia).

**18 conquistas iniciais**, agrupadas em 4 categorias:

**Primeiros passos** (4) — rosa

1. Primeira Palavra · 2. Primeira Lição · 3. Primeiro Áudio · 4. Bem-vindo, Kwendi

**Linguagem Umbundu** (5) — vermelho/crimson
5. 50 palavras · 6. 200 palavras · 7. Guardião do Umbundu (500) · 8. Mestre da Pronúncia · 9. Tradutor

**Explorador Cultural** (5) — laranja
10. Explorador Cultural (10 curiosidades) · 11. Contador de Histórias · 12. Conhecedor de Angola · 13. Provador (gastronomia) · 14. Naturalista (fauna/flora)

**Consistência** (4) — azul
15. 7 dias de streak · 16. 30 dias · 17. 100 dias · 18. Madrugador (lição antes das 8h)

Cada conquista em `conquistas.ts`: `{ id, titulo, descricao, categoria, icone, condicao, recompensa }`.

---

### 5. Hook `useMissoes` (mock local, API futura-proof)

```
useMissoes() → {
  diarias, semanais, especiais,
  conquistas,
  saldo: { xp, kindeles, baus },
  registrarAcao(tipo, qtd),    // ex.: registrarAcao('licao_completa', 1)
  resgatarRecompensa(id),
  abrirBau(id)
}
```

Persistência em `localStorage` (`kwendi_missoes_v1`). Quando migrar para Supabase, troca-se apenas a implementação interna do hook — UI não muda.

---

### 6. Detalhes técnicos

- **Tabs**: shadcn `Tabs` estilizado com cores Kwendi (crimson ativo).
- **Animações**: Framer Motion para barras, confete (`canvas-confetti`), shake do baú.
- **Ícones**: Lucide (Target, Flame, Coins, Trophy, Lock, Sparkles) + emojis para badges culturais.
- **Sem backend agora**: tudo mock. Estrutura de pastas:
  - `src/screens/MissoesScreen.tsx` (substitui placeholder)
  - `src/components/missoes/` (MissaoCard, BauModal, RecompensaModal, ConquistaCard, ConquistaModal, HeaderRecursos, AbaMissoes, AbaConquistas)
  - `src/data/missoes.ts`, `conquistas.ts`, `recompensas.ts`
  - `src/hooks/useMissoes.ts`
- Adicionar dependência: `bun add canvas-confetti @types/canvas-confetti`
- Quando você quiser ligar ao Supabase depois: tabelas `missoes_progresso`, `conquistas_usuario`, `recompensas_log`, todas com `user_id` + RLS — o hook é o único ponto de troca.

---

### Fora do escopo desta entrega

- Loja de gasto de Kindeles (próxima etapa).
- Notificações push de missão concluída.
- Conexão real ao Supabase (estruturado mas não implementado).