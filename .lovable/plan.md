# Plano — Fechamento de Telas (pré-backend)

Tudo continua client-side (localStorage). O backend ligará depois.

## 1) Mochila (refinar)

Em `MochilaSheet.tsx`:

- Mostrar **só itens comprados ainda não usados** (não exibir desbloqueios culturais já permanentes — manter em secção separada "Coleção").
- Para cada item: nome, quantidade, e — quando aplicável — **"Expira em X"** (usar `tempoRestante()` já existente; formatar dias/horas/minutos).
- Vidas compradas aparecem como item "Vidas extra: ×N" (pool separado das vidas normais — ver §2).
- Estado vazio: "A tua mochila está vazia. Visita a Loja."

## 2) Vidas globais e persistência cross-tela

Hoje `useSaldo` só guarda vidas no contexto de lição. Vamos:

- Adicionar em `useSaldo` (ou novo `useVidas`) campo `vidasExtra` (pool separado vindo da Loja).
- **Header global**: vidas completas (5) sempre exibidas no header de Home, Missões e Lição. Quando perde vida na lição, primeiro consome `vidasExtra` antes de descontar das 5 normais.
- Em Home e Missões, header passa a mostrar vidas reais (não hardcoded). Em Lição já está integrado — apenas ler do mesmo estado.

## 3) Loja — Pacote Premium ($5)

Adicionar nova categoria/aba **"Premium"** em `loja.ts` e `LojaScreen.tsx`.

Card único **"Pacote Premium · $5"**:

- Ícone: Cadeado estilhaçado.
- Headline agressiva: *"Desbloqueia o teu poder total. $5 que mudam tudo."*
- Bullets (copy de escala):
  - 🔥 Chama eterna — nunca perdes ofensiva
  - ❤️ Vidas infinitas — pratica sem parar
  - ⚡ XP em dobro permanente
  - 🎵 Todas as músicas e histórias desbloqueadas
  - 🧠 Dicionário IA ilimitado
  - 🚫 Sem anúncios, para sempre
  - Badge de premium no perfil
  - Podes postar com foto
  - Mais eventos para participar
  - Converse com a IA Kwendi, faça chamadas, troque mensagenss.
  - outro idioma além do português - inglês e espanhol
  - Estatísticas
- CTA: **"Tenho interesse — avisem-me"** (não compra, apenas regista intenção - importante que o usuário saiba que apenas quem compraria na hora pode clicar no botão de interesse.).
- Ao tocar: modal "Ndapandula Calwa! És o nº **X** interessado. Quando atingirmos massa crítica, ativamos o Premium." (contador em localStorage `kwendi.premium.interessados`).
- Pequena copy abaixo: *"Quanto mais pessoas querem, mais rápido construímos."*

Sem moeda envolvida. Outros itens da Loja continuam em diamantes.

## 4) Home — Currículo expandido (Capítulo 1) e reordenação pedagógica

Reescrever `CURRICULO` em `src/data/curriculo.ts` com lógica progressiva.

**Módulo 1 — "Primeiros passos" (Saudações + tempo)**, agora com unidades:

1. Saudações & apresentação
2. Família próxima
3. **Números & numerais** (0–10, 11–100)
4. **Dias da semana**
5. **Meses do ano**
6. **Estações**
7. **O corpo humano**
8. Conversação básica

Reorganizar os módulos seguintes para fluxo pedagógico claro:
M2 Pronomes → M3 Ações & verbos básicos → M4 Casa & objetos → M5 Comida & mercado → M6 Natureza/animais/aves → M7 Trabalho/profissões → M8 Advérbios → M9 Conjunções → M10 Tempos verbais → M11 Sabedoria/provérbios → M12 Conversação avançada.

Ajustar `getProximaUnidade`, `PRIMEIRA_UNIDADE` continuam válidos.

## 5) Bottom Navigation — reorganizar "..."

Hoje o popover "..." tem 4 opções (Fala, Escuta, Palavras, Alfabeto). Passa a ter **4 pills**:

1. **Dicionário** (novo, primeiro) → `/dicionario`
2. `Palavras - /secao/palavras`
3. **Fala & Escuta** (mesclado) → `/secao/fala-escuta`
4. **Alfabeto** (mantido, agora último) → `/secao/alfabeto`

&nbsp;

## 6) Dicionário (`/dicionario` — nova tela)

`src/screens/DicionarioScreen.tsx`:

**Topo**: search bar grande com microfone (ditado por voz via Web Speech API), placeholder "Procura em umbundu ou português…".

**Lista pré-existente**: criar `src/data/dicionario.ts` com ~80 entradas iniciais (palavras já espalhadas pelo app: saudações, família, números, dias, animais, corpo, etc.) — cada entrada: `{ pt, umbundu, categoria, audio? }`.

**Pesquisa**:

1. Busca local fuzzy primeiro (match em pt ou umbundu).
2. Se nada bate **e** o utilizador toca em "Pedir à IA", chamar edge function `dicionario-ia` (a criar depois com backend) — por agora, placeholder local que devolve uma de três respostas:
  - tradução sugerida
  - "Não entendi o que disseste — quis dizer X?"
  - "Esta palavra ainda não está na nossa base."

**Resultados (cards)**:

- palavra original
- tradução
- botão **áudio** (play TTS via `speechSynthesis` por agora)
- botão **salvar** (favoritos em localStorage `kwendi.dicionario.favoritos`)

**Voz**: botão de microfone usa `webkitSpeechRecognition` (pt-PT / um — fallback pt) para preencher a search bar.

## 7) Alfabeto (`/secao/alfabeto`)

Reescrever para mostrar:

- Alfabeto umbundu (a, e, i, o, u, b, c, d, f, h, j, k, l, m, n, ng, ñ, p, s, t, u, v, w, y) com botão de som por letra.
- Secção **"Fonética & Fonologia"** com cards reaproveitando o conhecimento das imagens enviadas:
  - Estrutura **C-V-C** (radical `kala`, `kwata`).
  - **Prefixo nominal classe 15 "ku"** para infinitivo verbal.
  - **Vogal de extensão** (ex.: `okukala`).
  - **Tonalidade** muda significado (musicalidade do umbundu).
  - **Palavras chave**: `ondaka` (palavra), `ondimbu` (gesto), `ocileñgi` (som), `ovisimilo` (sentimentos), `omunu` (pessoa), `owiki` (mel), `ovinganji` (palhaços).
- Citação destacada: *"Na ciência não há via magna…"* (Karl Marx, citado no livro).

## 8) Fala & Escuta (`/secao/fala-escuta`)

Substitui Fala e Escuta separadas. Tela com 2 abas:

- **Fala**: lista de frases curtas (5 do currículo atual). Cada item tem play do áudio modelo + botão "gravar" (MediaRecorder) + reprodução da gravação. Sem avaliação automática agora — só comparação auditiva.
- **Escuta**: mini-quiz "ouve e escolhe" (3 alternativas) com 5 itens iniciais usando frases do dicionário.

Mantém qualidade visual do app (cards 3D, framer-motion).

## 9) Rotas (App.tsx)

Adicionar:

- `/dicionario` → `DicionarioScreen`
- `/secao/fala-escuta` → tela própria (`FalaEscutaScreen`) em vez do placeholder genérico.
- Atualizar BottomNav popover.

---

## Arquivos a criar

- `src/screens/DicionarioScreen.tsx`
- `src/screens/FalaEscutaScreen.tsx`
- `src/data/dicionario.ts`
- `src/components/loja/PremiumPackCard.tsx`
- `src/components/loja/PremiumInteresseModal.tsx`

## Arquivos a editar

- `src/data/curriculo.ts` (Módulo 1 expandido + reordenação)
- `src/data/loja.ts` (categoria "premium")
- `src/screens/LojaScreen.tsx` (aba Premium)
- `src/hooks/useSaldo.ts` (campo `vidasExtra` global)
- `src/hooks/useInventario.ts` (filtrar mochila)
- `src/components/inventario/MochilaSheet.tsx` (UI + expiração)
- `src/components/BottomNav.tsx` (3 pills nova ordem)
- `src/screens/SecaoScreen.tsx` (substituir alfabeto por tela rica; manter fallback)
- `src/screens/HomeScreen.tsx` + `src/components/missoes/HeaderRecursos.tsx` (vidas globais)
- `src/App.tsx` (rotas novas)

Sem mudanças de backend nesta fase — tudo persistido em `localStorage`.