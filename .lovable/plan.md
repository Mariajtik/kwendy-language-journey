# Kwendi — Plano de Front-End (sem back-end)

O escopo é enorme. Para entregar com qualidade no mesmo estilo visual atual (rounded, crimson, 3D buttons, baú/HomeScreen) proponho **dividir em 6 fases**. Cada fase é mergeada e testada antes da próxima. Tudo será **somente UI**, com dados mockados em memória — nada de Supabase, OAuth real, IA ou validação de token agora.

> Quando o usuário aprovar este plano, começo pela **Fase 1**. Posso entregar as fases seguintes em mensagens subsequentes ou tudo de uma vez — diga sua preferência depois.

---

## Fase 1 — Autenticação (UI)

**Telas/alterações**

- `LoginScreen.tsx` e início de `SignupFlow.tsx`: adicionar 3 botões grandes empilhados no topo:
  - "Continuar com Google" (ícone G colorido)
  - "Continuar com Apple" (logo Apple preta)
  - "Continuar com email" (abre os campos atuais)
- Separador "ou" entre social e formulário.
- Input de senha com toggle 👁️ mostrar/ocultar e feedback visual (barra de força: fraca/média/forte por regex de comprimento + variedade).
- Link "Esqueceu a senha?" abaixo do campo de senha → abre `ForgotPasswordScreen` (nova tela): input email, botão "Enviar código", depois 6 inputs OTP estilizados, depois 2 inputs de nova senha. Tudo apenas visual com transições; ao "validar" mostra toast "Autenticação concluída com sucesso." e volta para login.
- Nova mini-tela `AuthSuccessScreen` (overlay com checkmark animado + texto) reaproveitável.

**Sem back-end**: cliques nos sociais e no fluxo OTP apenas avançam visualmente.

---

## Fase 2 — Ajustes no SignupFlow existente

- Step "Como conheceu o Kwendi?": ao escolher **Outro**, mostrar `<Select>` com opções: Amigos, Escola, Nenhuma das opções acima.
- Step "Nível": opções Iniciante / Intermediário / Avançado (já parece existir — confirmar e padronizar).
- Após o teste de nivelamento (mesmo que mock), **nova tela `ProcessingResultsScreen**`:
  - Imagem da Kwendi sentada sobre linha preta fina.
  - Nuvem de pensamento acima com rabiscos SVG sendo desenhados/apagados em loop (4s).
  - Texto fade-in: "Aguarde um pouco, está bem? Daqui a nada receberá os resultados!"
  - Após 4s, fade-in segundo bloco com pontuação mock, nível e justificativa genérica; rabiscos somem e aparece "Avaliação completa!" com um grande ✦.
  - Botão "Continuar" → leva para `/home`.

---

## Fase 3 — Bottom Navigation + Popover "..."

**Novo componente** `BottomNav.tsx` reutilizável com 6 ícones (Casa, Baú, Livro, Lupa, Perfil, ...):

- Ícone ativo: bounce + glow (crimson).
- Coroa pequena sobre o Perfil quando rota = `/profile`.
- "..." abre `Popover` (radix) posicionado acima da nav, scale+fade, com pills brancas: Fala, Escuta, Palavras, Alfabeto/pronúncia. Clique fora fecha. Cada pill navega para `/practice/<tipo>` (placeholder screen).

**Novas rotas/telas placeholder** (cada uma só UI básica com header + bottom nav):

- `/missions` (Baú)
- `/library` (Livro — "Biblioteca" com grid colorido como no screenshot)
- `/curiosities` (Lupa)
- `/profile`
- `/practice/:type`

Atualizar `HomeScreen` para usar o novo `BottomNav`.

---

## Fase 4 — Profile + Modal "Módulo em desenvolvimento"

`**ProfileScreen.tsx**` (referência: screenshot vermelho):

- Header crimson grande com curva orgânica (clipPath) + nome do usuário em branco, ícones compartilhar e settings no topo direito.
- Tabs: Perfil / Comunidade / Definições.
- **Aba Perfil**: blocos
  - Visão geral: Sequência 🔥, XP ⚡, Nível.
  - Info: nome, diamantes negros, data de ingresso.
  - Marcos: 4 círculos com `+`.
  - Conquistas: grid de 4 cards cinza placeholder.
- **Aba Comunidade**: feed mock com cards (avatar, nome, conquista, reações: "Tá malaik", "Granda mambo!", "Concordo", "Discordo" com emojis). Aba secundária "Minha Tribo" (placeholder vazio com mensagem amigável).
- **Aba Definições**: lista (Compartilhar, Notificações, Conta, Acessibilidade) — só UI.

**Modal "Módulo em desenvolvimento"** (componente reutilizável `ModuleLockedModal`):

- Pequeno, centralizado, X no canto.
- Animação Lottie/CSS de engrenagens girando no topo.
- Texto: "Desculpe! Este módulo ainda não foi desenvolvido... Estamos trabalhando nisso! Enquanto isso pode:"
- Botão "Explorar" → entra em modo exploração (todos módulos desbloqueados, mesma lógica do Modo Furtivo).
- Quando usuário clica num módulo cinza no HomeScreen: primeiro destaca a unidade com círculo branco pulsante, depois abre o modal.

---

## Fase 5 — Curiosidades (Museu vivo) + Dicionário

`**CuriositiesScreen.tsx**`:

- Header "Curiosidades de Angola" + subtítulo.
- Search bar grande.
- Chips horizontais scrolláveis com cores: Natureza (verde), História (vermelho), Cultura (amarelo), Gastronomia (laranja), Línguas (roxo), Monumentos (azul).
- Grid responsivo (1/2/3 colunas) de **cards premium**: imagem placeholder, overlay gradient escuro, badge categoria, título grande, mini-descrição 3 linhas, botão "Saber mais". Hover/tap: scale 0.97 + sombra.
- 12 cards mockados com os títulos/subtítulos fornecidos (Imbondeiro, Rainha Nzinga, O Pensador, Palanca Negra Gigante, Welwitschia, Mufete, Agostinho Neto, Nontombi, Umbundu, Fenda da Tundavala, Floresta do Maiombe, Quedas de Kalandula).

**Modal fullscreen `CuriosityModal**`:

- Hero image no topo com overlay gradient, título em branco.
- Botão X glassmorphism no top-left.
- Conteúdo scrollável com seções: Introdução, História, Importância cultural, Curiosidades (texto storytelling mock baseado no que o usuário forneceu).
- Transição: hero animation (layoutId framer-motion).

`**DictionaryScreen.tsx**` (já parte da Lupa? — clarificar abaixo): se a Lupa for Curiosidades, criar rota separada `/dictionary` acessível via Perfil ou popover. Por enquanto coloco em `/dictionary`:

- Search bar grande Umbundu ↔ Português.
- Lista de cards mock: palavra, tradução, botão ▶ áudio (placeholder), ⭐ favorito.

---

## Fase 6 — Missões + Stealth Mode polish + IA Kwendi "thinking" reusable

- `MissionsScreen.tsx` (Baú): header verde curvado, "Missões diárias" com timer 00h, lista de 4 cards "Descrição da missão" + barra 0/0 (mock estático).
- `StealthModeScreen.tsx`: adicionar perfil temporário editável (foto + username "Angola" com validação local: ≤24 chars, sem pontuação, toast de aviso quando violado). A "checagem de IA" fica como toast mock ("A equipa Kwendi analisará…") — sem IA real nessa fase.
- Refatorar a animação Kwendi pensando (Fase 2) em `<KwendiThinking />` reutilizável.

---

## Detalhes técnicos

- Stack: React + Vite + Tailwind + framer-motion + shadcn (Popover, Select, Dialog, Tabs já disponíveis).
- Tudo segue tokens crimson/cream do `index.css` — sem hardcode de cores.
- Imagens placeholder via `lovable-assets` ou gradientes coloridos onde ainda não há arte real (cards de curiosidades, avatar). Quando o usuário enviar imagens reais, troco depois.
- Estado de "usuário logado/exploração" mantido em `localStorage` apenas para alternar entre HomeScreen normal vs HomeScreen-com-tudo-desbloqueado.
- Zero chamadas de rede, zero Supabase, zero IA gateway nessa entrega.

---

## Perguntas rápidas antes de codar

1. Posso entregar **fase por fase** (recomendo), ou prefere que eu faça tudo de uma vez em uma mensagem só (mais lento, mais difícil de revisar)? Faça fase por fase.
2. A **Lupa** abre Curiosidades.
3. O Dicionário é nos 3 pontinhos.
4. Para os cards de Curiosidades, vou enviar as imagens.

Aprovando este plano, começo pela **Fase 1 (autenticação UI)**.