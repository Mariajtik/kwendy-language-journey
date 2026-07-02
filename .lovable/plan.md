## Personagens em corpo inteiro, sem avatar e sem fundo

No Teste de Nivelamento, a Kwendi aparece como um recorte em corpo inteiro (PNG transparente `kwendi-cutout.png`) sobre fundo branco — sem círculo de avatar e sem cenário. Vou fazer o mesmo nas conversas do báu.

### 1) Gerar recortes transparentes para cada personagem

Hoje só existe `src/assets/characters/kwendi-cutout.png`. Vou gerar PNGs equivalentes (fundo transparente, corpo inteiro, mesmo estilo do da Kwendi) para as personagens usadas nos báus, a partir dos avatares atuais:

- `otchali-cutout.png`
- `yellen-cutout.png`
- `hossy-cutout.png`
- `suzana-cutout.png` (Vovó Suzana)
- `kiame-cutout.png`
- `kekehan-cutout.png`

Para `chac` e `kapit, não existe, tudo é Kwendi e Otchali`, substituir esses nomes, pelos delas.

### 2) `src/components/licao/personagens.ts`

Adicionar um campo `cutout: string | null` ao lado do `avatar`. Quem tem cutout usa-o na cena do báu; onde faltar, cai de volta ao avatar redondo.

### 3) `AvatarCena` em `PassoComponents.tsx`

Reescrever o avatar da cena para:

- Renderizar o `cutout` como `<img>` grande (~200–240px de altura), sem `rounded-full`, sem borda branca, sem sombra de anel dourado.
- Manter a leve animação de “falando” (subir/descer ~4px em loop) só na personagem que está a falar.
- Manter o espelho horizontal na personagem do utilizador (para as duas ficarem viradas uma para a outra).
- Nome da personagem por baixo em minúsculas caps, como está.
- Fallback: quando não há `cutout`, continua a mostrar o avatar redondo atual.

### 4) Palco sem cenário

No `ConversaEscolhaPasso`, remover o gradiente de fundo (`cenario: dia/tarde/noite`) e usar fundo branco liso, igual ao ecrã do Nivelamento. A prop `cenario` do tipo `Passo` fica marcada como opcional/ignorada por agora (não mexo em `baus.ts`, apenas paro de usar). O balão de pensamento com “…” em ondas mantém-se sobre o personagem do utilizador.

### Verificação

- `tsgo` para type-check.
- Playwright: entrar em `/lesson/m1u1bau`, tirar screenshot da cena — confirmar que ambas as personagens aparecem em corpo inteiro sem círculo, sobre fundo branco, com o balão de pensamento sobre o utilizador.

### Fora de âmbito

- Não mexer em vidas, XP, recompensas, currículo ou textos das conversas.
- Não gerar arte nova para personagens sem avatar (kapt, kapo, laura, cile, narrador) — continuam com fallback.