## Taxonomia proposta: Badges, Marcos e Conquistas

Hoje tudo está misturado: em **Missões → Conquistas** mostramos 19 itens como "badges coloridas", e no **Perfil** existem secções "Marcos" (4 círculos vazios) e "Conquistas" (grelha bloqueada) sem critério claro. Proposta de separação semântica e visual:

---

### 1. Badges (recompensa visual de missão)
- **O que é:** ícone colorido entregue ao concluir uma **missão diária/semanal/especial**. Vida curta, decorativo.
- **Onde vive:** apenas na tela **Missões**, junto da missão concluída (já é o badge colorido atual ao lado de cada `MissaoCard`).
- **No Perfil:** **não aparecem** individualmente — só contabilizadas como "missões concluídas" numa stat.
- **Exemplo:** "Completaste 3 lições hoje" → badge verde naquela missão.

### 2. Marcos (milestones de progresso pessoal)
- **O que é:** etapas grandes e **lineares** da jornada do utilizador na app — progresso de nível/módulo/ofensiva. Poucos, ordenados, sempre os mesmos para todos.
- **Onde vive:** **Perfil → Marcos** (a secção dos 4 círculos que já existe). Cada círculo representa um patamar: ex. Nível 5, Nível 10, Módulo 1 concluído, 30 dias de ofensiva.
- **Visual:** círculo grande com troféu/ícone, preenche-se à medida que o utilizador avança. Tipo "barra de XP gamificada".
- **Não dão recompensa nova** — celebram progresso já feito.

### 3. Conquistas (feitos culturais e de domínio)
- **O que é:** os **19 itens atuais** de `src/data/conquistas.ts` — feitos com critério específico ("Leia 10 curiosidades", "Sábio das Letras", "Guardião do Umbundu"). Dão XP + diamantes + (às vezes) baú.
- **Onde vive:**
  - **Missões → Conquistas:** o mural completo agrupado por categoria (Primeiros passos, Língua, Cultural, Consistência). Local principal de descoberta e resgate.
  - **Perfil → Conquistas:** **vitrine** das já desbloqueadas (substitui a grelha de cadeados atual). Mostra a badge colorida real (não cadeado) + contador "X de 19". Tocar abre o `ConquistaModal` reutilizado.

---

### Resumo de regras

| Conceito   | Origem                   | Tela principal      | No Perfil                          | Recompensa |
| ---------- | ------------------------ | ------------------- | ---------------------------------- | ---------- |
| Badge      | Concluir uma missão      | Missões (na missão) | Não aparece                        | XP/diamantes da missão |
| Marco      | Progredir nível/módulo   | Perfil → Marcos     | Sim (4 círculos lineares)          | Nenhuma extra |
| Conquista  | Cumprir critério cultural| Missões → Conquistas| Vitrine das desbloqueadas          | XP + diamantes + baú |

---

### Mudanças concretas (a implementar depois da aprovação)

1. **`ProfileScreen.tsx` → secção "Marcos":** definir 4 marcos reais (ex. Nv 5, Nv 10, Módulo 1, 30 dias ofensiva) com regra de desbloqueio baseada em `saldo` e progresso, em vez do array hard-coded `[false,false,false,false]`.
2. **`ProfileScreen.tsx` → secção "Conquistas":** trocar a grelha de cadeados pela **vitrine real**: mapear `conquistas.filter(c => c.desbloqueada)`, mostrar a badge colorida (`/assets/missoes/badge-<cor>.png`) com o ícone Lucide ao centro, contador "X / 19" no cabeçalho, e link "Ver todas →" que navega para `/missoes?tab=conquistas`. Estado vazio: ilustração + "Desbloqueia a tua primeira conquista nas Missões".
3. **Missões → Conquistas:** sem mudanças estruturais — já é o local correto. Apenas reforçar título da secção como "Conquistas culturais" para distinguir das "badges de missão" acima.
4. **Glossário interno:** comentário no topo de `conquistas.ts` a documentar a taxonomia para futuras adições não voltarem a misturar conceitos.

Sem alterações em dados de conquistas, baús, ou lógica de missões.
