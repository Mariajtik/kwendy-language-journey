## Correções na cena de conversa do báu

Três problemas a resolver em `src/components/licao/PassoComponents.tsx` (e um pequeno ajuste em `src/screens/LessonScreen.tsx`).

### 1) Personagens na mesma linha, sem flutuar — apenas piscam os olhos

Hoje `AvatarCena` faz o cutout subir/descer 6px em loop quando `falando`. Além disso, o utilizador está dentro de um `<div className="relative">` para ancorar o balão, enquanto o NPC não — pequenas diferenças de layout entre os dois lados.

- Remover a animação `y: [0, -6, 0]` do cutout. Nada de flutuar.
- Uniformizar os dois lados: envolver **ambos** os `AvatarCena` no mesmo tipo de wrapper `relative`, para o balão do NPC e o balão de pensamento do utilizador ficarem em elementos gémeos dentro do `flex items-end`.
- Alinhar pelas pernas: o container passa a `flex items-end justify-center gap-6` (em vez de `justify-between`) para os dois cutouts ficarem lado a lado, mesma base, sem esticar até às bordas do ecrã (o que os fazia parecer desalinhados em ecrãs estreitos como 679px).
- Adicionar **piscar de olhos**: um pequeno overlay SVG absoluto por cima do cutout (retângulo cor de pele fina na zona dos olhos) animado com `scaleY: [1, 0.05, 1]` a cada ~2.5s (delay diferente entre personagens para não piscarem em sincronia). Como não sabemos a posição exacta dos olhos em cada PNG, uso uma faixa a ~22% do topo do cutout — funciona genericamente sem depender de coordenadas por personagem.
  - Nota: se preferires não mexer nos olhos por não haver mapeamento por personagem, alternativa é aplicar uma leve animação de opacidade (`opacity: [1, 0.92, 1]`) em vez do overlay. Fica em aberto na questão abaixo.

### 2) Balão de pensamento deixa de tapar os dizeres

O `motion.div` do balão está em `absolute -top-14 -left-16` e sobrepõe-se ao NPC / ao balão da pergunta abaixo.

- Reservar espaço vertical acima dos cutouts: adicionar `pt-20` no palco (`flex-1 px-4 pt-4 pb-2` → `pt-20`) para o balão caber por cima sem sobrepor nada.
- Reposicionar o balão a `-top-16 right-0` (em vez de `-left-16`) e reduzir para `width: 96, height: 64` — fica encostado à cabeça do utilizador, virado para o NPC, e não invade o balão da pergunta.
- Ajustar as bolhinhas da nuvem (as duas circunferências pequenas que ligam à cabeça) para saírem do canto inferior-esquerdo do balão em direcção à cabeça do utilizador, coerente com a nova posição.

### 3) Bug: após responder a 1ª pergunta do báu, não dá para selecionar nas seguintes

`ConversaEscolhaPasso` mantém `sel` e `checked` em `useState`. Como os passos consecutivos do báu são todos `conversa_escolha`, o React reutiliza a mesma instância entre passos e `checked` continua `true` — todos os botões ficam `disabled`.

Duas correcções (aplicar ambas para robustez):

- Em `LessonScreen.tsx`, passar `key={index}` ao `ConversaEscolhaPasso` (linha 345) para forçar o remount a cada passo. Aplicar o mesmo `key={index}` aos restantes passos de escolha para evitar bugs idênticos no futuro.
- Em `ConversaEscolhaPasso`, adicionar um `useEffect(() => { setSel(null); setChecked(false); }, [passo])` como cinto-e-suspensórios, caso o `key` seja omitido nalgum ponto.

### Verificação

- `tsgo --noEmit`.
- Playwright em `http://localhost:8080/lesson/m1u1bau`: screenshot do 1º passo (confirmar cutouts alinhados, balão sem tapar), clicar numa resposta correcta, avançar, confirmar que no 2º passo as opções são clicáveis e nenhum estado ficou preso.

### Fora de âmbito

- Não mexer em `baus.ts`, currículo, XP, vidas, personagens não usados nos báus, nem noutros tipos de passo.

## Questão

Como quer o "piscar de olhos"? Perfeitos que parece que estão piscando mesmo, mapeie os olhos e faça de forma perfeita.