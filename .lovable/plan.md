## Mudanças em `src/screens/FronteirasScreen.tsx`

1. **Remover** o botão grande flutuante "Trilha sonora" e o modal com iframe do Apple Music.
2. **Adicionar** um botão circular dourado fixo no canto superior direito (`absolute top-4 right-4 z-30`):
   - Fundo dourado (`hsl(45 90% 55%)`), sombra 3D no estilo Duo, ~48px.
   - Ícone `Play` (lucide) quando pausado, `Pause` quando a tocar.
   - `aria-label` "Tocar música de fundo" / "Pausar música".
3. **Adicionar** elemento `<audio ref loop preload="auto">` apontando para o MP3 (asset CDN).
4. **Estado** `isPlaying` controla play/pause; tentativa de autoplay no mount (silencioso se o browser bloquear — o utilizador clica no botão).
5. Ao desmontar a tela, pausar o áudio.

## Asset

- Tu envias o `.mp3` da música "África Minha – Bonga & Plutónio" no próximo turno.
- Faço upload via `lovable-assets` para `src/assets/africa-minha.mp3.asset.json` e referencio o `.url` no `<audio>`.

## Fora de scope

- Sem player visual com seek/volume — apenas play/pause discreto.
- Sem persistência entre telas (a música pára ao sair de `/para-alem-fronteiras`).
- Apple Music/Spotify embeds removidos — os links que enviaste ficam só como referência da faixa.

**Próximo passo:** envia o ficheiro `.mp3` para eu fazer o upload e implementar.