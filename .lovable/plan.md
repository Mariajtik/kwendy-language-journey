## Problemas atuais

1. **Botão "Começar jogo" cortado** em `/para-alem-fronteiras`: o layout usa `overflow-hidden` num container de `100dvh` e empilha header + mapa de 256px + texto + caixa + 2 botões. Em telas baixas (ex.: 390×585), o botão dourado fica visível mas o CTA "Começar jogo" e o "Voltar à Home" caem fora da área visível.
2. **Conquistas do jogo isoladas**: `FronteirasJogoScreen` define `CONQUISTAS_FRONTEIRAS` localmente e guarda em `localStorage` (`kwendi:fronteiras:stats`). Nada disso aparece em **Missões → Conquistas** nem em **Perfil → Conquistas**, ficando desligado do resto do app.

## Plano

### 1. Tornar o FronteirasScreen rolável e compacto
`src/screens/FronteirasScreen.tsx`:
- Trocar `h-[100dvh] overflow-hidden` por `min-h-[100dvh] overflow-y-auto pb-8`.
- Reduzir o mapa de `h-64 w-64 mt-10` para `h-52 w-52 mt-6` (ajustar a órbita do avião proporcionalmente).
- Reduzir margens (`mt-8` → `mt-5`, `mt-6` → `mt-4`) para garantir que os dois botões caibam acima da dobra em viewports curtos. Em ecrãs maiores, o `pb-8` evita corte.

### 2. Mover as conquistas do jogo para o catálogo central
`src/data/conquistas.ts`:
- Adicionar nova categoria `"fronteiras"` em `ConquistaCategoria` e em `CATEGORIA_INFO` (label "Para Além de Fronteiras", cor `--kwendi-blue` ou dourada).
- Acrescentar 7 conquistas com ids `fr1`…`fr7`, replicando as atuais (`Explorador de Fronteiras`, `Sabedoria Angolana`, `Mestre do Continente`, `Sequência de Ouro`, `Pontuação Perfeita`, `Viajante Constante`, `Maratonista Cultural`), com `meta`, ícone (`Sparkles`/`Award`/`Trophy`/`Flame`) e recompensas coerentes (XP/diamantes/baú).
- Atualizar `CONQUISTAS_POR_CATEGORIA` para incluir a nova categoria.

### 3. Ligar o jogo ao `useMissoes`
`src/screens/FronteirasJogoScreen.tsx`:
- Importar `useMissoes` e usar `desbloquearConquista(id, progresso?)` para refletir o progresso real (`acertosTotais`, `partidas`, `diasJogados`, `tempoTotalMs`, `melhorStreak`) nas conquistas `fr1`…`fr7`.
- Manter o `localStorage` `kwendi:fronteiras:stats` como fonte das métricas brutas, mas no `finalizar()` chamar `desbloquearConquista` para cada uma cujo critério passe a estar cumprido.
- Remover `CONQUISTAS_FRONTEIRAS` local; o ecrã de "Partida concluída" passa a listar as conquistas recém-desbloqueadas filtrando do catálogo central (`CONQUISTAS_POR_CATEGORIA.fronteiras`) pelos ids desbloqueados nesta sessão.
- Deixar de creditar XP/diamantes manualmente pelas conquistas — quem entrega passa a ser `resgatarConquista` na tela Missões (mantém-se o XP/diamantes da partida em si).

### 4. Aparecer no Perfil e em Missões
- `MissoesScreen` e `ProfileScreen` já consomem `useMissoes().conquistas` e iteram por `CONQUISTAS_POR_CATEGORIA`, pelo que a nova categoria aparece automaticamente nos dois lugares assim que o catálogo for atualizado. Não é preciso mexer nesses ecrãs além de confirmar que renderizam todas as categorias (validar leitura rápida).

### Ficheiros alterados
- `src/screens/FronteirasScreen.tsx` (layout)
- `src/data/conquistas.ts` (nova categoria + 7 itens)
- `src/screens/FronteirasJogoScreen.tsx` (usa `useMissoes`)
- Verificação: `src/screens/MissoesScreen.tsx`, `src/screens/ProfileScreen.tsx` (sem alterações esperadas).

### Fora do âmbito
- Não alterar o sistema de baús, saldos ou design de cards.
- Não mexer em outras telas/jogos.
