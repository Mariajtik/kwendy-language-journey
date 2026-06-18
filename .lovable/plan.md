## Diagnóstico

O resultado actual está pobre porque:
1. **Imagens stock com marca-d'água** (Vecteezy / Dreamstime) renderizadas com `mix-blend-mode: multiply` sobre relva — cinza fica sujo, marcas visíveis, fundos brancos esbatidos a destoar do estilo Duolingo.
2. **Estilos misturados** — foto realista de pedra + avatares JPG redondos + ilustração flat. Sem coerência visual.
3. **Cena da piscina** parece colagem amadora (dois círculos colados em cima da piscina).
4. **Separador** sem peso narrativo — não comunica "novo módulo".

## Nova direcção (game-art Kwendi)

Substituir tudo por **ilustrações geradas à medida**, no mesmo estilo flat-cartoon vibrante do Duolingo/Kwendi: contorno suave, sombras chapadas, paleta quente (terracota, ocre, verde sálvia, crimson), zero realismo fotográfico, zero marca-d'água.

### Assets a gerar (imagegen, qualidade `standard`, PNG transparente)

1. `portal-pedra.png` — Arco de pedra estilizado tipo portal de aldeia, pedras cinza-quentes com contorno escuro, grama na base, 2 totens/lanças com bandeirolas vermelhas dos lados, espaço central limpo para inserir o número do módulo num medalhão dourado.
2. `cairn-pedra.png` — Pilha de 5 pedras zen empilhadas, estilo cartoon, com folhinhas verdes e pequenas flores amarelas na base.
3. `cena-piscina.png` — **Uma única ilustração coesa** com a piscina oval estilo aldeia africana (bordo de pedras coloridas, água turquesa), Yellen e Otchali já desenhados dentro da cena (sentados à beira, pés na água, rindo), sombrinha de palha, palmeira ao lado. Tudo numa só imagem — sem colar avatares.

### Componentes

- **`TotemSeparador`** — Simplifica: só `<img>` da ilustração + medalhão dourado com o número do módulo posicionado no centro do arco (variante `arco`) ou em cima da pilha (variante `cairn`). Remove `mix-blend-mode` (PNG transparente já trata). Adiciona micro-animação `framer-motion` (subtle bob 2s loop).
- **`CenaPiscina`** — Substitui os 3 `<img>` colados por **uma só** imagem da cena completa. Largura ~200px, ligeira rotação (-3°), com `motion` opcional (água oscila via SVG overlay subtil — opcional, posso saltar).
- Posição no Módulo 4: em vez de `absolute right:-30` (corta no mobile estreito), passar a aparecer **entre duas unidades fechadas** do módulo (como cartão decorativo full-width centrado), título "Yellen e Otchali brincam".

### Tipografia do número no separador

Medalhão dourado redondo (#F2C84B → #C69118 gradient, borda #6B3F1D 3px), `Nunito 900`, texto crimson `hsl(var(--primary))`, sombra interior, sombra 3D de 4px.

### Limpeza

- Eliminar `.asset.json` antigos das fotos stock (`arco-pedra.jpg`, `pilha-pedras.jpg`, `piscina.jpg`) via `delete_asset`.

## Fora de escopo
- Animação da água (a confirmar se queres).
- Tia Teresa (continua sem asset — uso Otchali como na versão actual).
- Outras telas.

## Ficheiros tocados
- Gerar: 3 PNG via `imagegen--generate_image` + respectivos `.asset.json` (automático).
- Apagar: 3 `.asset.json` antigos.
- Editar: `src/components/TotemSeparador.tsx`, `src/components/CenaPiscina.tsx`, `src/screens/HomeScreen.tsx`.
