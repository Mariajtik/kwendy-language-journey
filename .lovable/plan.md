# Refinar experiência visual do "Para Além de Fronteiras"

Três problemas a resolver, mantendo tudo em código de apresentação (sem alterar lógica de jogo).

---

## 1. Cartão da curiosidade — um só cartão, sem réplicas

**Problema:** Existe um cartão branco "frente" que aparece brevemente antes do flip 3D — o utilizador vê duas versões da mesma informação.

**Solução:** Eliminar o flip 3D e a face frontal. Passa a existir **um único cartão**, já com as cores da bandeira do país, que entra com uma animação sóbria (fade + slide-up + leve escala, ~400 ms). Conteúdo coerente numa hierarquia clara:

- Chip de estado no topo: `✓ Acertaste` (verde translúcido) **ou** `Resposta correta` (branco translúcido) — usa a cor da bandeira como fundo do cartão em ambos os casos.
- Título grande: a resposta correta.
- Parágrafo: `explicacao` da pergunta.
- Divisória fina + rodapé: `Curiosidade · 🇦🇴 Angola` + texto da curiosidade.

Ficheiro afetado: `src/components/fronteiras/CartaoCuriosidade.tsx` (reescrito, sem `perspective`/`rotateY`, sem face absoluta).

---

## 2. Mapa de África — nitidez no zoom e enquadramento

**Problema:** A `africa-bandeiras.jpg` (37 KB) fica pixelizada ao aplicar `scale: 2.4`, e como o `<img>` usa `object-contain`, ao deslocar por `%` para centrar o país, partes do mapa saem do cartão.

**Solução dupla:**

**a) Substituir por versão de alta resolução.** Gerar um novo asset `africa-bandeiras@2x.jpg` (~1600 px de largura, mesma composição visual do mapa com bandeiras) e servi-lo via `srcSet` para que no zoom o browser use a imagem nítida. Usar `image-rendering: auto` e `will-change: transform` para suavizar.

**b) Corrigir o enquadramento no zoom.** Em vez do atual "deslocar por percentagem da imagem", passar a usar `transform-origin` dinâmico: `transformOrigin: \`${pais.x * 100}% ${pais.y * 100}%\`` e apenas `scale`. Isto mantém o país sempre visível dentro do cartão, sem cortes nas bordas, e é matematicamente estável para qualquer coordenada.

**c) Bónus visual:** Adicionar um leve `filter: saturate(1.1)` durante o zoom e um halo dourado à volta do alfinete (`box-shadow: 0 0 24px hsl(45 90% 55% / 0.6)`) para reforçar o "wow".

Ficheiros afetados: `src/components/fronteiras/MapaAfricaViva.tsx`, novo asset `src/assets/africa-bandeiras-hd.jpg.asset.json`.

---

## 3. Cartão de resultado partilhável — mapa dourado com alfinetes reais

**Problema:** O mini-mapa é apenas um círculo com pontos soltos — não parece África nem valoriza os países visitados.

**Solução:** Redesenhar o cartão (720 × 1000 canvas) com três camadas:

**a) Fundo cinemático.** Gradiente radial crimson → azul-noite + textura sutil de pontos dourados (ruído procedural leve no canvas).

**b) Mapa dourado com alfinetes precisos.** Carregar `africa-bandeiras-hd.jpg` (o mesmo asset novo) no canvas com `globalCompositeOperation = "luminosity"` + camada dourada por cima (`hsl(45 90% 55%)` com `multiply`) para obter silhueta dourada de África. Sobre esse mapa, desenhar alfinetes reais nas coordenadas `(pais.x, pais.y)` de cada país acertado — mesmo sistema já usado no `MapaAfricaViva`, garantindo posições coerentes entre jogo e cartão. Cada alfinete: círculo dourado + estrela pequena + sombra.

**c) Tipografia refinada.** Título em `letter-spacing` largo, pontuação com sublinhado dourado, streak como "selo carimbado" rodado -6°, nome do país destaque (top 1 acerto), frase da Kwendi em itálico com aspas tipográficas «...».

**d) Botões de partilha.** Mantêm-se (Baixar / WhatsApp / Comunidade) mas ganham ícone dourado e sombra 3D coerente com o resto da app.

Ficheiro afetado: `src/components/fronteiras/CartaoResultado.tsx` (reescrito, com helper para desenhar silhueta dourada e pins).

---

## Detalhes técnicos

- Sem mudanças em `FronteirasJogoScreen.tsx` além de remover a prop `explicacao` (agora integrada no cartão único — a prop passa a ser opcional para não partir a assinatura).
- Sem mudanças em `paisesAfrica.ts`, `fronteirasPerguntas.ts`, `usePassaporte.ts`, `conquistas.ts`, `sonsFronteiras.ts`.
- O novo asset de alta resolução vai ser gerado com `imagegen` e enviado para o CDN via `lovable-assets`.
- Verificação: `tsgo --noEmit` + inspeção visual via Playwright do estado "revelar" e do cartão de resultado.

## Fora do âmbito

- Não altero o timer, XP, sons, confetes nem as achievements.
- Não introduzo Griot mode nem música regional (adiado como combinado).