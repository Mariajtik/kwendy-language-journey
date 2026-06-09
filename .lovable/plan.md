# Plano — Reformulação visual + novas telas de onboarding

## 1. Paleta de cores (atualizar `src/index.css` e `tailwind.config.ts`)

Adotar oficialmente a Paleta Kwendi:

- Primary (vermelho logo): `#FF4D4D`
- Amarelo: `#FBBD12`
- Cinza: `#5E5C5C`
- Pêssego: `#FFA767`
- Castanho: `#B87656`
- Verde suave (CTA / fundo Apresentação): `#86D05D`
- Secundárias: `#78D0FF`, `#DA7FFF`, `#FF7BBF, cinza claro`

Atualizar tokens `--primary`, `--kwendi-red`, criar `--kwendi-green`, `--kwendi-yellow`, `--kwendi-peach`, `--kwendi-brown`, `--kwendi-gray` e variações para sombras dos botões 3D.

## 2. Splash Screen (`SplashScreen.tsx`)

- Fundo vermelho `#FF4D4D` puro nos primeiros 5s.
- Depois dos 5s: remover totalmente a imagem do logo. Mostrar apenas a palavra **"Kwendi"** centralizada, em branco, fonte Nunito 900 (grande, ~64px), com fade-in suave. Mantém-se mais 3s e navega para a próxima tela.

## 3. Welcome Screen (terceira tela atual)

- Remover o logo (já discutido). Confirmar layout limpo apenas com texto + botões.

## 4. NOVA — Apresentation Screen (`ApresentationScreen.tsx`)

Rota: `/apresentation`. Aparece **somente na primeira abertura do app** (flag em `localStorage`: `kwendi_seen_apresentation`).

### Layout

- Vídeo `mountain.mp4` como background fullscreen (`object-cover`, autoplay, loop, muted inicialmente — depois unmute on user gesture para respeitar políticas de browser).
- Em telas maiores: container central `max-w-md` com cantos arredondados estilo "mockup mobile" para manter usabilidade Duolingo-like; vídeo preenche esse container.
- Botão **PULAR** no canto superior direito (texto branco, fundo translúcido, vai direto para a tela FEATURES SCREEN).
- Caixa inferior com `background: rgba(134,208,93,0.85)` (verde suave da paleta), margem 16px, padding generoso, cantos arredondados, texto branco Nunito bold.

### Conteúdo (slides, fade-in/fade-out)

Reorganizado em 5 slides curtos para fluir melhor:

1. **"Olá, eu sou a Kwendi"** (Kwendi em bold maior)
2. *"Este fundo relaxante é para refletirmos. As línguas são como a natureza, concordas comigo?"*
3. *"Cada região tem fauna e flora únicas. É lindo, é majestoso — mas quando não cuidamos, entram em extinção."*
4. *"O mesmo acontece com as línguas: são a expressão mais perfeita da identidade cultural de um povo. «Línguas africanas são a base essencial para a descolonização da mente do africano.»"*
5. *"Que ninguém poupe esforço! Angola precisa de ser igual a si mesma. Tenha orgulho da herança do seu povo!"*

### Interação

- Avanço automático a cada ~3.5s por slide com fade-in/out via Framer Motion.
- **1 toque** = pausar/retomar autoplay.
- **Duplo toque no lado direito** = próximo slide.
- **Duplo toque no lado esquerdo** = slide anterior.
- Indicadores de progresso (barrinhas estilo stories) no topo.

### Final

- Após último slide: fade-out do texto e fade-in de botão verde `#86D05D` arredondado: **"Vamos?"**
- Ao clicar: estado `loading` muda label para **"Vamos!"** com spinner sutil; após 800ms marca flag e navega para Features Screen.

## 5. NOVA — Features Screen (`FeaturesScreen.tsx`)

Rota: `/features`. Também só na primeira vez (flag `kwendi_seen_features`).

- Fundo vermelho `#FF4D4D` (cor do logo).
- Seta voltar no canto superior esquerdo.
- Título: **"Aqui, você aprende Umbundu de verdade!"**
- Carrossel horizontal de cards (swipe + dots) com as funcionalidades organizadas em 6 cards concisos:
  1. **Conta & Progresso** — Cria conta e guarda o teu progresso; ou testa 7 dias com **Modo Furtivo**.
  2. **Aprende Umbundu** — Abecedário, lições, missões diárias e ofensivas (streak).
  3. **Dicionário Vivo** — Pesquisa por voz ou texto, vê tradução, sinónimos e ouve a pronúncia.
  4. **Cultura Angolana** — Curiosidades, gastronomia, expressões, música e festas das províncias Umbundu.
  5. **Gemas & Loja** — Ganha gemas ao completar missões e decora a tua casa no estilo mwangolé.
  6. **Premium** — Sem anúncios, lições exclusivas, IA de conversação, modo offline e estatísticas.
- Secção **"Conheça os personagens que lhe guiarão ao longo desta jornada"** — grid horizontal scroll com as 7 personagens (Kwendi, Suzana, Kiame, Otchali, Hossy, Yellen, Keke & Han). Cada uma num card circular com a imagem e o nome por baixo (mantendo o fundo colorido original de cada arte).
- Botão "Continuar" no rodapé → marca flag e navega para `/welcome`.

### Assets das personagens

Usar `lovable-assets create` a partir de `/mnt/user-uploads/` para cada uma das 8 imagens (Kwendi, Suzana, Kiame, Otchali, Hossy, Yellen, Keke+Han). Importar via JSON pointer em `src/assets/characters/`.

Vídeo `mountain.mp4` também via lovable-assets.

## 6. Roteamento (`App.tsx`)

Novo fluxo (primeira vez):

```
/ (Splash) → /apresentation → /features → /welcome → ...
```

Em aberturas subsequentes, Splash navega direto para `/welcome` se as flags já estiverem setadas.

## 7. Arquivos a criar/editar

**Criar:**

- `src/screens/ApresentationScreen.tsx`
- `src/screens/FeaturesScreen.tsx`
- `src/assets/characters/*.asset.json` (8 pointers)
- `src/assets/mountain.mp4.asset.json`

**Editar:**

- `src/index.css` — nova paleta + classes `.btn-duo-green`
- `tailwind.config.ts` — tokens novos
- `src/screens/SplashScreen.tsx` — remover img, mostrar texto "Kwendi"
- `src/screens/WelcomeScreen.tsx` — pequenos ajustes de cor
- `src/App.tsx` — registar `/apresentation` e `/features`

## Detalhes técnicos

- Animações via `framer-motion` (`AnimatePresence` + variantes fade).
- Gestos de duplo toque com handler manual `onClick` medindo timestamps e área (clientX vs largura/2).
- `localStorage` para flags de primeira visita.
- Vídeo: `<video autoPlay loop muted playsInline />` em wrapper `absolute inset-0` com `object-cover`. Em desktop, wrapper com `max-w-[480px]` centralizado.