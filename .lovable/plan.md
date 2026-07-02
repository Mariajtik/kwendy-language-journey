
## Objetivo

Transformar a resolução de cada pergunta num pequeno momento cinematográfico e criar uma sensação clara de "viajar por África". Tudo mantém-se front-end, sem servidor.

## 1. Fundação de dados — país por pergunta

Ficheiro: `src/data/fronteirasPerguntas.ts`

Adicionar a cada `Pergunta`:
- `pais: string` — código ISO-2 (ex.: `"AO"`, `"CV"`, `"NG"`, `"ET"`).
- Opcional `paisSecundario` para perguntas continentais.

Criar `src/data/paisesAfrica.ts` com, por país:
- nome PT, ISO-2, coordenadas normalizadas `x,y` (0-1) sobre a imagem `africa.png`, cores da bandeira (2-3 HSL) e emoji da bandeira.
- Uma lista de 54 países é finita — preencho os que aparecem nas perguntas existentes e deixo helper `paisPorCodigo(code)` com fallback para Angola.

## 2. Mapa de África vivo (a tua ideia base + upgrade)

Novo componente: `src/components/fronteiras/MapaAfricaViva.tsx`

- Renderiza `africa.png` num `<div>` com `overflow:hidden` e um wrapper com `motion` para `scale` e `translate` (framer-motion, já em uso).
- Estados: `idle`, `perguntar`, `revelar`.
  - `perguntar`: pin do país da pergunta pulsa suavemente no local certo.
  - `revelar`: `scale` de 1 → 2.2 e `translate` para centrar o país, `duration: 0.9s, ease: [0.22, 1, 0.36, 1]`. Alfinete aparece com um `spring` (bounce), sombra a crescer para simular "queda".
- Balão junto ao alfinete com bandeira em emoji, nome do país e a `explicacao` da pergunta como curiosidade.
- No `FronteirasJogoScreen.tsx`, o mapa passa a viver no topo do ecrã (altura ~180px). O bloco de explicação atual é substituído pelo balão do mapa.

## 3. Card da pergunta 3D com bandeira (flip)

- Envolver o cartão da pergunta num wrapper com `perspective: 1200px` e um `motion.div` com `rotateY: 0 → 180` ao responder.
- Face frontal: enunciado atual. Face traseira: bandeira do país como fundo em gradiente (`from cores.bandeira[0] to cores.bandeira[1]`), com a curiosidade em cima.
- Duração ~0.8s. Uma vez virado, o botão "Continuar" aparece por baixo.

## 4. Feedback sensorial: confetes + som

- Confetes: pequena implementação com `canvas` num `useRef` (sem dependência nova). 60 partículas com cores da bandeira do país, `requestAnimationFrame`, ~1.2s.
- SFX curtos (base64 embutido, ~5 kB cada) em `src/data/sonsFronteiras.ts`:
  - `acerto.mp3` — "ding" alegre.
  - `erro.mp3` — som seco.
  - `carimbo.mp3` — usado no passaporte.
- Respeita o botão de música existente: SFX só tocam se o utilizador não silenciou tudo (adiciono estado `sfxOn` a partir do mesmo `isPlaying`).

## 5. Cronómetro dramático + multiplicador XP

- Barra fina por baixo da pergunta, 12s por defeito, `linear` de 100% → 0%.
- Cor muda: `>60%` verde `hsl(142 70% 45%)` → `30-60%` laranja `hsl(35 90% 55%)` → `<30%` vermelho `hsl(0 75% 55%)` com `scale` pulsante nos últimos 3s.
- Ao esgotar sem resposta: conta como errado, tremor no cartão.
- Multiplicador XP na função `finalizar`:
  - resposta em <4s → x2, 4-8s → x1.5, 8-12s → x1.
  - Média da partida decide o bonus final; já hoje há `xp += 15/30/50`, apenas somo `x mult`.

## 6. Passaporte carimbado

- Novo hook `src/hooks/usePassaporte.ts` com persistência em `localStorage` (`kwendi:fronteiras:passaporte`):
  - `carimbados: Record<isoCode, { data: string; acertos: number }>`.
  - `carimbar(iso)` chamado ao acertar uma pergunta desse país.
- No ecrã de resultados, aparece uma secção "Passaporte" com uma grelha de bandeiras. Os países acertados nesta partida entram com `scale-in` + som `carimbo`. Rotação de -6° e opacidade 0.9 para parecer tinta.
- Conquistas novas em `src/data/conquistas.ts` (categoria fronteiras):
  - `fr8` — Passaporte PALOP (5 países PALOP carimbados).
  - `fr9` — Volta a África (20 países).
  - `fr10` — Continente inteiro (54).

## 7. Cartão de resultado partilhável

Substitui a ideia genérica de "share": três ações claras.

- Componente `CartaoResultado.tsx` desenha num `<canvas>` (não precisa lib nova):
  - fundo com gradiente crimson→azul, mini-mapa de África com pontos nos países visitados, pontuação grande, streak, frase da Kwendi em umbundu, wordmark "Kwendi".
- Três botões, todos front-end puros:
  - **Baixar imagem** → `canvas.toBlob` + `URL.createObjectURL` → `<a download="kwendi-fronteiras.png">`.
  - **Partilhar** → `navigator.share({ files: [...] })` quando disponível (móvel); fallback abre WhatsApp Web com texto.
  - **Comunidade** → `navigator.share` sem `files` para partilhar link do site.

## 8. Ajustes visuais menores

- Cabeçalho `Para Além de Fronteiras` ganha um pequeno avião a orbitar o mini-mapa quando idle (aproveita `plane.png` já usado no `HomeScreen`).
- Barra de progresso passa a ter divisões (10 segmentos), preenchidas por passo — leitura mais clara.
- Botão dourado de música muda de ícone para nota musical quando toca; adiciono controlo separado para SFX no menu long-press desse botão.

## Ficheiros novos

- `src/components/fronteiras/MapaAfricaViva.tsx`
- `src/components/fronteiras/CartaoDeCurioidade.tsx` (o balão flip)
- `src/components/fronteiras/Confetes.tsx`
- `src/components/fronteiras/Cronometro.tsx`
- `src/components/fronteiras/CartaoResultado.tsx`
- `src/data/paisesAfrica.ts`
- `src/data/sonsFronteiras.ts`
- `src/hooks/usePassaporte.ts`

## Ficheiros editados

- `src/screens/FronteirasJogoScreen.tsx` — orquestra mapa + card 3D + confetes + cronómetro + passaporte + cartão de resultado.
- `src/data/fronteirasPerguntas.ts` — adiciona campo `pais`.
- `src/data/conquistas.ts` — 3 conquistas novas + progressos.

## O que fica de fora (proposto pelo user mas com nota)

- Modo Griot com voz e música por região e streak épico com frases em umbundu ficam de fora desta ronda — posso adicionar num passo seguinte para não sobrecarregar as animações já pesadas do mapa + flip + confetes na mesma tela.

## Notas técnicas

- Nada requer novas dependências: framer-motion, canvas nativo e `navigator.share` já existem.
- Todas as cores usam tokens semânticos (`hsl(var(--kwendi-*))`) ou HSL calculado a partir da bandeira; nenhum hex em componentes.
- Todo o estado persistente (passaporte, stats) fica em `localStorage`, sem backend.
