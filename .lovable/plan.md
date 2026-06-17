## Para Além de Fronteiras — tela introdutória

Nova tela de apresentação do jogo cultural pan-africano, no mesmo molde da `ApresentationScreen` (vídeo de fundo, slides estilo stories, botão final "Vamos?"). Acesso pelo ícone do mapa de África (`AfricaPlane`) no header da Home.

### 1. Asset do vídeo de fundo

- Upload do `.mp4` enviado para o CDN via `lovable-assets`:
  - `src/assets/fronteiras.mp4.asset.json` (pointer JSON; binário fica só no CDN).
- Reutiliza a mecânica do `mountain.mp4`: `<video autoPlay loop muted playsInline>` com overlay escuro `bg-black/20` para legibilidade.

### 2. Nova screen `FronteirasIntroScreen.tsx`

Ficheiro: `src/screens/FronteirasIntroScreen.tsx`.

Estrutura quase idêntica à `ApresentationScreen`:

- Wrapper `max-w-[480px]` centralizado, `100dvh`.
- Vídeo de fundo (asset novo) + overlay.
- Barra superior com indicadores de progresso tipo stories + botão "PULAR".
- Botão de mute/unmute.
- Toque na metade esquerda = anterior, direita = próximo.
- Auto-avanço de ~6.5 s por slide.
- Último slide: fade-out do texto e aparece botão verde "Vamos?" → "Vamos!" com spinner → navega para `/para-alem-fronteiras`.
- Botão "PULAR" e o final guardam `localStorage.setItem("kwendi_seen_fronteiras_intro", "1")` (intro só aparece na 1.ª vez; nas seguintes o `AfricaPlane` vai direto para `/para-alem-fronteiras`).

**Rascunho dos 5 slides** (Kwendi a apresentar o jogo):

1. **"Olá! Apresento-te o Para Além de Fronteiras"** — "Um jogo para descobrir África pelos olhos de quem a vive."
2. — "Cada país tem a sua história, os seus sabores, os seus heróis. Mas conhecemos mesmo os nossos vizinhos?"
3. — "«Sou angolano, conheço Angola.» E o Senegal? E o Quénia? E a Etiópia?"
4. — "Aqui vais responder a curiosidades de todo o continente — e ganhar diamantes a cada acerto."
5. — "Vamos atravessar fronteiras juntos? A primeira escala já está marcada."

(Textos editáveis depois.)

### 3. Tela placeholder do jogo

Ficheiro: `src/screens/FronteirasScreen.tsx`, rota `/para-alem-fronteiras`.

- Header simples com botão de voltar (`/home`).
- Imagem `africa.png` ao centro, com o `plane.png` orbitando suavemente (Framer Motion).
- Título: **"Para Além de Fronteiras"**.
- Subtítulo: **"Em breve — aguarda as primeiras escalas."**
- Caixa cinza-clara: "As perguntas estão a ser preparadas pelo Soba. Volta em breve."
- Botão `btn-duo` "Voltar à Home".

### 4. Routing (`src/App.tsx`)

```tsx
import FronteirasIntroScreen from "./screens/FronteirasIntroScreen";
import FronteirasScreen from "./screens/FronteirasScreen";
...
<Route path="/fronteiras-intro" element={<FronteirasIntroScreen />} />
<Route path="/para-alem-fronteiras" element={<FronteirasScreen />} />
```

### 5. Liga o `AfricaPlane` na Home

Em `src/screens/HomeScreen.tsx`, o `<button aria-label="Mapa de África">` (linhas ~222–227) ganha `onClick`:

```tsx
onClick={() => {
  const seen = localStorage.getItem("kwendi_seen_fronteiras_intro");
  navigate(seen ? "/para-alem-fronteiras" : "/fronteiras-intro");
}}
```

### 6. Fora do âmbito (não mexer agora)

- Lógica de quiz, banco de perguntas, pontuação, mapa interativo — fica para quando forneceres as perguntas.
- Sem alterações em `useSaldo`, `useMissoes`, dados existentes.

### Ficheiros tocados

- **Novo**: `src/assets/fronteiras.mp4.asset.json` (via CLI)
- **Novo**: `src/screens/FronteirasIntroScreen.tsx`
- **Novo**: `src/screens/FronteirasScreen.tsx`
- **Edit**: `src/App.tsx` (2 rotas + imports)
- **Edit**: `src/screens/HomeScreen.tsx` (onClick no `AfricaPlane`)