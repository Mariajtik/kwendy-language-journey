## Objetivo

Aplicar os assets enviados (baús + badges + trófeu da Kwendi - a mascote), trocar a moeda "Kindeles" por "Diamantes Negros" (sincronizada com a Home), e conectar de verdade as telas ao sistema de missões/conquistas.

---

## 1. Assets da imagem enviada

A imagem traz 3 grupos. Vou recortar e subir cada peça como asset CDN separado em `src/assets/missoes/`:

**Baús (3 raridades × 3 estados — fechado, semi-aberto, aberto):**

- `bau-comum-fechado.png`, `bau-comum-abrindo.png`, `bau-comum-aberto.png` (madeira marrom)
- `bau-raro-fechado.png`, `bau-raro-abrindo.png`, `bau-raro-aberto.png` (prata)
- `bau-lendario-fechado.png`, `bau-lendario-abrindo.png`, `bau-lendario-aberto.png` (dourado)

Usados no `BauModal.tsx`: o estado avança conforme a animação de abertura (atualmente é só shake → reveal; vou trocar por fechado → abrindo → aberto com crossfade).

**Badges (8 estrelas coloridas + 1 cinza para bloqueado):**

- `badge-vermelha.png`, `badge-laranja.png`, `badge-verde.png`, `badge-rosa.png`, `badge-roxa.png`, `badge-azul.png`, `badge-laranja-escuro.png`, `badge-branca.png`, `badge-bloqueada.png` (cinza)

Mapeamento por categoria de conquista (cor reaproveitada entre conquistas da mesma família):

- `primeiros_passos` (4) → rosa, verde, azul claro, branca
- `linguagem` (5) → vermelha (x2), laranja, roxa, vermelha escura
- `cultural` (5) → laranja, verde, azul, roxa, laranja-escuro
- `consistencia` (4) → vermelha, laranja, dourada (=laranja-escuro), azul

O `ConquistaCard` passa a renderizar `<img src={badge.url}>` em vez do ícone Lucide quando desbloqueada, e a versão `badge-bloqueada` (cinza) quando bloqueada. O ícone Lucide vira fallback/overlay pequeno no canto.

**Chapéu do Soba**

- O **chapéu de palha** (estilo tradicional angolano, mais coerente com "Soba"). Asset: `src/assets/missoes/soba.png`.
- Desbloqueado depois de uma conquista cultural pesada.
  &nbsp;

---

## 2. Moeda: Kindeles → Diamantes Negros

A Home já mostra um diamante facetado cinza (`HomeScreen.tsx` `<Diamond />`). Esse é o "Diamante Negro" oficial do app.

Mudanças:

- Extrair o componente `Diamond` para `src/components/icons/DiamanteNegro.tsx` (reuso entre Home, Profile, Missões).
- Renomear em todo o código `kindeles` → `diamantes` (saldo, recompensas, drops, hook, modais, header). Tipo em `recompensas.ts`: `{ tipo: "diamantes"; qtd: number }`.
- Labels visíveis: "Diamantes Negros" (singular: "Diamante Negro").
- Manter `localStorage` chave `kwendi_missoes_v1` mas adicionar migração leve: se ler `kindeles`, mover para `diamantes` na primeira leitura.

---

## 3. Saldo único de Diamantes Negros (Home ↔ Missões ↔ Perfil)

Hoje a Home tem um número estático de diamantes, o Perfil tem `1000` hardcoded, e Missões tem saldo próprio. Vou unificar:

- Criar `src/hooks/useSaldo.ts` (wrapper sobre `localStorage` `kwendi_saldo_v1`) com `{ diamantes, xp, baus, vidas, ofensiva }` e setters.
- `useMissoes` passa a ler/escrever via `useSaldo` (mesma fonte).
- `HomeScreen` e `ProfileScreen` consomem `useSaldo` para mostrar o mesmo valor que cresce ao resgatar missões.
- Valor inicial: `diamantes: 1000` (mantém o número da Home/Perfil atual).

---

## 4. Conectar telas ao sistema de missões

Hoje só existe o botão "Simular progresso". Vou disparar `registrarAcao` de verdade nos pontos certos:


| Tela / ação                                         | `registrarAcao(...)`                             |
| --------------------------------------------------- | ------------------------------------------------ |
| `LessonScreen` — concluir lição (tela de conclusão) | `licao_completa`, 1 + `palavra_aprendida`, N     |
| `LessonScreen` — clicar no botão de ouvir áudio     | `audio_ouvido`, 1                                |
| `LessonScreen` — resposta correta                   | `resposta_correta`, 1                            |
| `CuriosidadeModal` — abrir uma curiosidade nova     | `curiosidade_lida`, 1 (dedupe por id)            |
| `HistoriasScreen` — concluir história               | `historia_concluida`, 1                          |
| Login do dia / abertura do app                      | `dia_ativo`, 1 (atualiza ofensiva no `useSaldo`) |


A ofensiva (streak) passa a alimentar as conquistas de consistência (`c15`–`c17`) e o "Madrugador" (`c18`) checa `new Date().getHours() < 8` na conclusão da lição.

Deixe o botão "Simular progresso (demo)"  para testes, enquanto não há backend.

---

## 5. Resumo dos arquivos tocados

- **Novos**: `src/assets/missoes/*.png.asset.json` (baús + badges + mascote), `src/components/icons/DiamanteNegro.tsx`, `src/hooks/useSaldo.ts`
- **Editados**: `src/hooks/useMissoes.ts`, `src/data/recompensas.ts`, `src/data/missoes.ts`, `src/data/conquistas.ts`, `src/components/missoes/BauModal.tsx`, `ConquistaCard.tsx`, `ConquistaModal.tsx`, `RecompensaModal.tsx`, `HeaderRecursos.tsx`, `MissaoCard.tsx`, `src/screens/MissoesScreen.tsx`, `HomeScreen.tsx`, `ProfileScreen.tsx`, `LessonScreen.tsx`, `HistoriasScreen.tsx`, `CuriosidadesScreen.tsx` (ou `CuriosidadeModal.tsx`)
- **Fora do escopo**: backend Supabase real, loja de cosméticos, push notifications.

---

