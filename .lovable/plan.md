## Teste de Nivelamento — plano

### Comportamento por nível

- **Iniciante** → sem teste. Continua o fluxo atual (`/home`, unidade `m1u1` ativa, restantes bloqueadas).
- **Intermediário / Avançado** → após o passo de nível no `SignupFlow`, em vez de ir direto a `/processing`, o utilizador vai a `/nivelamento` (novo). O ecrã `ProcessingResultsScreen` deixa de mostrar valores fictícios: passa a receber `pontuacao`, `acertos`, `total` e `unidadeSugerida` reais via `location.state`.

### Estrutura do teste

- Base: **todas as unidades do Módulo 1** (`m1u1` a `m1u5`).
- Para cada unidade, retirar exercícios reais das lições em `src/data/licoes/m1.ts`, **excluindo passos `aprender` e `dialogo`** (só exercícios: `escuta_escolha`, `traduzir_pt_umbundu`, `traduzir_umbundu_pt`, `montar_frase`, `escrever`, `falar`, `preencher_lacuna`, `preencher_letras`, `emparelhar`, `escuta_montar`, `escuta_escrever`).
- Selecção difícil e curta: **3 exercícios por unidade = 15 exercícios totais** (~30–40s cada → ≤10 min). Preferir tipos difíceis: `escrever`, `montar_frase`, `preencher_lacuna`, `escuta_escrever`. Se `AcessibilidadeContext` marcar "não posso ouvir/falar", substituir por variantes de escrita (já suportado no LessonScreen — reutilizamos o mesmo filtro).
- Cada exercício guarda a `unidadeId` de origem para permitir o cálculo de posicionamento.

### Ecrã `NivelamentoScreen`

- Header com barra de progresso e botão `X` (sair volta a `/signup`).
- Sem vidas nem dicas — é avaliação. Sem feedback verde/vermelho imediato (evita ensinar as respostas); ao submeter, avança para o próximo exercício.
- Cronómetro discreto de 10 min no topo; ao esgotar, submete automaticamente.
- Reutiliza os componentes de `src/components/licao/PassoComponents.tsx` para renderizar cada tipo de exercício.
- No fim, calcula:
  - `acertos`, `total`, `percentagem = acertos/total * 100` (real, não mock).
  - `acertosPorUnidade`: mapa `unidadeId → nº acertos` (0–3).
  - `unidadeSugerida`: primeira unidade em ordem em que o utilizador acertou < 2 de 3 (i.e. onde o conhecimento falha). Se acertou tudo → `null` (100%).

### Resultados

Navega para `/processing` com o payload real. `ProcessingResultsScreen` passa a mostrar `A sua pontuação: {acertos}/{total} ({percentagem}%)` e uma frase dinâmica consoante a unidade sugerida. Depois de "Continuar":

- **100% (todas certas)**:
  - Marca `nivelamento.ancao = true` em `localStorage` (`kwendi:nivelamento`).
  - Desbloqueia **todas as unidades e módulos** para navegação (flag global).
  - Desbloqueia o marco **"Ancião"** + credita **+500 diamantes** e **+250 XP** via `useSaldo`/`useInventario`.
  - Ao entrar em `/home`, abre pop-up (Dialog do shadcn) com uma engrenagem/roda dentada:
    > "Você é um ancião, por acaso? Executou uma proeza de poucos!  
    > Infelizmente os outros módulos ainda não foram desenvolvidos mas por favor, continue usando a nossa app, pratique e nos ajude!"
  - Mostra também um aviso curto: "Recomendamos começar pelo início, ao seu critério."
- **< 100%**:
  - Define `unidadeAtual = unidadeSugerida` no estado de `useProgresso`.
  - Marca todas as unidades **anteriores** à sugerida como completamente concluídas (`seccoesCompletas` inclui todas as secções dessas unidades) — assim ficam desbloqueadas/checkadas no mapa.
  - Pop-up em `/home`: "Com base no teu teste, começaste em {Módulo X · Unidade Y}. As unidades anteriores ficam disponíveis para revisão."

### Marco "Ancião"

- Adicionar entrada em `src/data/conquistas.ts` (categoria `primeiros_passos` ou nova `nivelamento`) com ícone `Crown`, título "Ancião", descrição "Acertou 100% no teste de nivelamento".
- Desbloqueio é acionado por `useMissoes`/hook equivalente já usado para marcos.

### Ficheiros

**Novo**
- `src/screens/NivelamentoScreen.tsx` — teste real, reutilizando `PassoComponents`.
- `src/data/nivelamento.ts` — helper que extrai exercícios de `m1.ts` por unidade, aplica filtros de acessibilidade e devolve o conjunto de 15 exercícios.
- `src/hooks/useNivelamento.ts` — persiste `{ ancao, unidadeSugerida, percentagem }` em localStorage e expõe helpers (`aplicarResultado`, `isAncao`, `todosDesbloqueados`).

**Editado**
- `src/screens/SignupFlow.tsx` — no `next()` do passo de nível: `Iniciante → /home`, `Intermediário|Avançado → /nivelamento`.
- `src/screens/ProcessingResultsScreen.tsx` — lê valores reais de `location.state`; mensagem dinâmica.
- `src/screens/HomeScreen.tsx` — mostra pop-up `Ancião` ou `Posicionamento` na primeira visita pós-nivelamento (flag consumida uma vez).
- `src/hooks/useProgresso.ts` — método `setUnidadeAtual` e `completarAteUnidade(id)` para marcar unidades anteriores como concluídas, e flag `todosDesbloqueados` que faz `statusSeccaoNa` devolver `ativa/concluida` em vez de `bloqueada`.
- `src/data/conquistas.ts` — nova conquista "Ancião".
- `src/App.tsx` — rota `/nivelamento`.

### Fora do plano

- Não altera o fluxo do Iniciante.
- Não cria autenticação, backend ou persistência remota — tudo em `localStorage`, coerente com o resto do app.
- Não desbloqueia lições de módulos ainda não implementados no código (M2+ existem só como catálogo em `curriculo.ts`); o pop-up "Ancião" comunica isto explicitamente.
