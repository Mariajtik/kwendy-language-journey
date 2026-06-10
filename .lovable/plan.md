# Plano — Tela Home (Mapa de Lições) + Conexões

## 1. Conexões de navegação para `/home`

- **Modo Furtivo** (`StealthModeScreen.tsx`): botão final → `/home`.
- **Login** (`LoginScreen.tsx`): sucesso → `/home`.
- **Começar/Signup** (`SignupFlow.tsx`): última etapa do fluxo → `/home`.

## 2. Nova tela `HomeScreen.tsx` (rota `/home`)

Layout inspirado no screenshot anexado (estilo Duolingo), com **background de grama** (`grass.jpg`).

### Header (top bar)

Da esquerda para a direita, sobre faixa translúcida clara para legibilidade:

1. **Avatar circular** com a foto usada no Modo Furtivo (`src/assets/avatar.jpg`), borda branca.
2. **Fogueira**: composição = ícone `Flame` (lucide, cinza claro) sobre 2 pequenos retângulos cruzados castanhos `#B87656` simulando troncos. Contador "0".
3. **Diamante**: SVG inline custom em `#5E5C5C`, com linhas internas dividindo o diamante em facetas (4 partes) para dar detalhe. Texto "1000" em `#5E5C5C` bold.
4. **Coração** preenchido vermelho `hsl(var(--primary))` + "5".

### Banner do módulo

Card vermelho arredondado: "MÓDULO 1, UNIDADE 1" (small) + "Saúda a tua comunidade" (bold).

### Caminho de lições (zig-zag)

3 botões circulares 3D verticais:

- Lição 1 — vermelho ativo com halo branco, número "1".
- Lições 2 e 3 — cinza claro.

Após o avatar e antes da fogueira, um ícone de decoração de interiores (lucide `Sofa` ou `Lamp`)  com borda castanha — representa secção de decoração da casa mwangolé.

Botão flutuante circular branco no canto inferior direito com triângulo vermelho que faz scroll ao ínicio da tela.

### Bottom Navigation

Container branco com **cantos inferiores arredondados** (`rounded-b-3xl`), pequenas curvas esverdeadas decorativas nos cantos superiores . 6 ícones, cada um numa cor da paleta:

1. **Casa** (Home) — amarelo `#FBBD12`, ativo com dot embaixo.
2. **Báu** (segundo ícone) — SVG custom de báu/tesouro em castanho `#B87656` (substitui a mala).
3. **Livro** — pêssego `#FFA767`.
4. **Lupa** — azul `#78D0FF`.
5. **Pessoa** — rosa `#FF7BBF`.
6. **Três pontinhos** — pontinhos **brancos** dentro de um **quadrado arredondado amarelo `#FBBD12**` da paleta.

## 3. Assets

- `src/assets/grass.jpg.asset.json` — criado via `lovable-assets create --file /mnt/user-uploads/grass.jpg`.

## 4. Arquivos a criar/editar

**Criar:**

- `src/screens/HomeScreen.tsx`
- `src/assets/grass.jpg.asset.json`

**Editar:**

- `src/App.tsx` — registrar rota `/home`.
- `src/screens/StealthModeScreen.tsx` — botão final → `/home`.
- `src/screens/LoginScreen.tsx` — botão final → `/home`.
- `src/screens/SignupFlow.tsx` — último passo → `/home`.

## Detalhes técnicos

- Grama: `background-image` + overlay `rgba(255,255,255,0.2)` para legibilidade do conteúdo.
- Diamante e báu: SVG inline custom (não há ícone perfeito no lucide).
- Fogueira: `Flame` lucide + 2 `<div>` rotacionados (-30°/+30°) em castanho.
- Animação Framer Motion fade-in na entrada.
- Preview em mobile.

&nbsp;

O MAIS IMPORTANTE, DEVE ESTAR HARMÓNICO.