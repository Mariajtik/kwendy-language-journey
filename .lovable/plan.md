## 1 · Dicionário · só pesquisar, não listar guardados

`src/screens/DicionarioScreen.tsx`

- Remover a lista "GUARDADOS" e o fallback de favoritos antes de pesquisar — quando `query` está vazia, mostrar apenas o bloco **EXPLORAR** com sugestões aleatórias do dicionário.
- Manter o botão de bookmark em cada card (continua a gravar em `kwendi.caderno.guardadas`), mas com toast "Guardado no Caderno" e link rápido para `/secao/caderno`.
- Acrescentar contador local `kwendi.stats.dicionario.buscas` (incrementa a cada pesquisa válida) — usado pelas novas conquistas.

## 2 · Conquistas e Marcos das 4 pills

`src/data/conquistas.ts` — nova categoria `exploracao` com 4 conquistas:

- **Curioso** — primeira pesquisa no Dicionário (Bookmark)
- **Coleccionador** — 10 palavras guardadas no Caderno (BookOpen)
- **Boca de Ouro** — 5 frases gravadas em Fala & Escuta (Mic)
- **Som das Letras** — ouviu 15 letras do Alfabeto (AudioLines)

`src/hooks/useMissoes.ts` — ler contadores de `localStorage`:

- `kwendi.stats.dicionario.buscas`
- `kwendi.caderno.guardadas` (length)
- `kwendi.stats.fala.gravacoes`
- `kwendi.stats.alfabeto.escutas`

E atualizar `desbloqueada` automaticamente. Incrementos feitos nos respetivos ecrãs (DicionarioScreen, CadernoScreen, FalaEscutaScreen, SecaoScreen/AlfabetoView).

`src/screens/ProfileScreen.tsx` — adicionar **2 marcos** novos à grelha (passa de 4 → 6, 2 colunas × 3 linhas): "Caderno 50" e "Alfabeto" (todas as letras ouvidas).

## 3 · Fala & Escuta · estilo Duo, ligado às lições

`src/screens/FalaEscutaScreen.tsx` — passar a alimentar-se das **unidades desbloqueadas** via `useProgresso`:

- Calcular `unidadesDesbloqueadas` = unidade atual + todas as anteriores.
- Mapear ID da unidade → conjunto de frases (novo `src/data/falaEscutaPool.ts`, indexado por `unidadeId`, com `{umbundu, pt}` por tópico).
- Header com chip "Unidade: …" e seletor (`<select>` redondo) para escolher entre as desbloqueadas. Frases bloqueadas aparecem com cadeado e tooltip "Desbloqueia a unidade X".
- **FalaTab**: novo fluxo Duo — frase grande no topo, microfone gigante central, barra de "match" pós-gravação (placeholder 70–95% aleatório), botão "Próxima" para avançar como num exercício; XP +5 por frase praticada via `adicionarXP`.
- **EscutaTab**: 5 perguntas por sessão, contador "1/5", barra de progresso superior estilo lição, ecrã final com XP+ganho.

## 4 · Alfabeto · ícones melhores + limpeza

`src/screens/SecaoScreen.tsx` (`AlfabetoView`)

- Remover o botão **"Ouvir saudação completa"** e manter o bloco de citação Karl Marx.
- Substituir os emojis dos cards de fonologia por ícones Lucide consistentes (`Puzzle`, `Type`, `Music2`, `Link2`, `HandHelping`, `Quote`) num círculo colorido — mesmo padrão visual das `StatCard`.
- Cada letra abre um mini-card inline com palavra-exemplo + áudio (reaproveitando `DICIONARIO`). Incrementa `kwendi.stats.alfabeto.escutas`.
- No topo, manter título e adicionar pílula "Toca para ouvir · {n}/{total}" como progresso.

## 5 · Currículo · módulos por contexto

`src/data/curriculo.ts` — reestruturação completa. Padrão dos módulos: cada unidade faz parte do tema e tem lições temáticas dentro, faz parte.

**LÓGICA DE PENSAMENTO ERRADA. PULE A ETAPA 5**

## 6 · Loja · Pacote Premium = 3 meses

`src/components/loja/PremiumPackCard.tsx`

- Subtítulo passa a `EXCLUSIVO · $5 / 3 MESES`.
- Faixa nova abaixo do botão "Importante": "💡 $5 dão-te **3 meses completos** de Premium. Renovação opcional, sem cobrança automática."
- Atualizar o texto da CTA para "Tenho interesse — 3 meses por $5 🔥".

`src/components/loja/PremiumInteresseModal.tsx` — mensagem confirma "3 meses por $5".

## 7 · Perfil · Definições com sub-ecrãs

`src/screens/ProfileScreen.tsx` — cada linha de Definições passa a navegar para uma rota dedicada.

Novos ficheiros em `src/screens/definicoes/`:

- `ContaScreen.tsx` — nome, e-mail, foto, alterar password, eliminar conta (placeholder).
- `NotificacoesScreen.tsx` — switches para Lembretes diários, Ofensiva, Comunidade, E-mail marketing; horários de lembrete.
- `IdiomaScreen.tsx` — escolher idioma da interface (PT-PT / PT-AO / EN) BLOQUEADO POR SER PREMIUM e dialecto Umbundu, com rádios ( NÃO IMPLEMENTAR, NÃO ENTENDI).
- `SobreScreen.tsx` — versão, créditos, termos, privacidade, contacto , link à comunidade discord. e email [kwendi.xyz@gmail.com](mailto:kwendi.xyz@gmail.com) para feedback.
- `SairConfirmModal.tsx` — confirmação para "Sair".

`src/App.tsx` — adicionar rotas `/profile/conta`, `/profile/notificacoes`, `/profile/idioma`, `/profile/sobre`.

Cada sub-ecrã reutiliza o cabeçalho com `ArrowLeft`, mantém estilo do app (cards bordados + sombra 3D) e persiste opções simples em `localStorage` (`kwendi.def.*`).

---

### Detalhes técnicos (para a equipa)

- Helper novo `src/lib/stats.ts` com `bumpStat(key)` e `getStat(key)` (number em localStorage) para centralizar incrementos.
- `useMissoes` lê estes contadores em cada render — sem listeners de storage, basta o re-render do ecrã quando o utilizador volta.
- `src/data/falaEscutaPool.ts` exporta `getFrasesParaUnidade(unidadeId): Frase[]` com fallback para frases base se a unidade não tiver banco específico.
- `Modulo`/`Unidade` mantêm o tipo atual; só os títulos e ordenação mudam.
- O fluxo de Duo em Fala/Escuta usa `useState` + barra de progresso simples; sem novas dependências.