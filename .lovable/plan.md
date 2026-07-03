## Objetivo

Permitir que o usuário, dentro de uma lição, marque temporariamente:
- "Não posso falar agora" → remove só exercícios de fala
- "Não posso ouvir agora" → remove só exercícios de escuta
- Ambos → sobra apenas escrita

Estas escolhas duram apenas a **sessão da lição**. Sair da lição ou fechar a app volta ao fluxo normal — **nada é persistido**.

## Comportamento

**Exercícios afetados**
- Fala: `falar`
- Escuta: `escuta_escolha`, `escuta_escrever`, `escuta_montar`

**Transformações (só quando a flag correspondente está ativa)**
- `falar` → `escrever` (pergunta = PT, resposta = frase Umbundu)
- `escuta_escolha` → `traduzir_umbundu_pt` (mostra a frase escrita, mesmas opções e correta)
- `escuta_escrever` → `escrever` (pergunta = "Escreve em Umbundu: <PT>", resposta = frase que seria falada)
- `escuta_montar` → `montar_frase` (mesmo alvo/distratores, sem áudio)

Passos que **não** são de fala/escuta permanecem intactos. Regras de XP, vidas, dicas e progresso não mudam.

## UI

**1. Botão inline no topo do exercício** (só aparece em passos de fala ou escuta):
- Em passos de fala: pequeno link "Não posso falar agora" (ícone mic-off).
- Em passos de escuta: pequeno link "Não posso ouvir agora" (ícone volume-off).
- Ao tocar: ativa a flag correspondente e o passo atual é imediatamente re-renderizado na forma de escrita. Uma tela de confirmação curta (toast) explica que dura só esta lição.

**2. Botão de reverter**
- Enquanto a flag estiver ativa, um pequeno chip discreto no cabeçalho da lição ("Modo escrita: fala" / "Modo escrita: escuta") permite desligar novamente sem sair da lição.

## Estado

- Duas flags em `useState` dentro de `LessonScreen` (`semFala`, `semEscuta`) — resetam ao desmontar a tela.
- **Sem** localStorage, **sem** contexto global — a natureza efêmera é o requisito.
- Ao sair para `/home` ou dar reload, o componente desmonta e o estado se perde.

## Onde muda o código

- **`src/screens/LessonScreen.tsx`**
  - Adiciona `semFala` e `semEscuta` como estado local.
  - Função `transformarPasso(p, semFala, semEscuta): Passo` chamada no render; passa o passo transformado para o componente correspondente em vez do original.
  - Chip discreto no cabeçalho da lição para ligar/desligar quando ativo.
- **`src/components/licao/PassoComponents.tsx`**
  - `EscutaPasso`, `EscutaEscreverPasso`, `EscutaMontarPasso`: adiciona um link "Não posso ouvir agora" no topo, com callback `onNaoPossoOuvir`.
  - `FalarPasso`: adiciona um link "Não posso falar agora" no topo, com callback `onNaoPossoFalar`.
  - Callbacks propagam até `LessonScreen`, que seta a flag e o próximo render aplica a transformação (inclusive re-renderizando o passo atual como escrita).

## Fora de escopo

- Nenhuma alteração em tela de acessibilidade, contexto global, ou preferências persistidas.
- Nenhuma mudança no motor de progresso, XP, vidas, dicas, ou nos scripts das lições.
- Nenhum novo tipo de passo — reaproveita `escrever`, `traduzir_umbundu_pt` e `montar_frase` já existentes.
