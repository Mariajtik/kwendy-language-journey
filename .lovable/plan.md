## Objetivo

Três ajustes na Loja Kwendi:

1. **Conectividade**: o que se compra fica acessível em **qualquer tela** (não só na Loja).
2. **Rebalancear preços** (estavam baratos demais para a economia do app).
3. **Corrigir descrições truncadas** nos cards (Pack de Músicas, etc.) no mobile.

---

## 1. Inventário global ("Mochila")

Hoje `useInventario` já persiste em `localStorage` e dispara eventos, mas só a Loja consome. Vamos expor o inventário em todas as telas com header.

### 1a. Chip "Mochila" no `HeaderRecursos`

- Novo item clicável ao lado dos diamantes, com ícone 🎒 e badge numérico (total de power-ups ativos + vidas + dicas).
- Aparece em: Home, Missões, Histórias, Curiosidades, Perfil (todas usam `HeaderRecursos` ou o header da Home).
- Tap abre o **MochilaSheet** (Drawer/Sheet inferior).

### 1b. `MochilaSheet` (novo componente, `src/components/inventario/MochilaSheet.tsx`)

- Lista os power-ups ativos com quantidade e tempo restante (para Dobrador de XP):
  - 🔥 Manter Chama × N — "pronto a usar"
  - ⚡ Dobrador de XP × N — "ativo: 12:34" ou "pronto a usar"
  - 💡 Dica Extra × N
  - ❤️ Coração Extra × N
- Desbloqueios culturais listados abaixo (com check).
- CTAs: "Usar agora" (quando aplicável no contexto — ex.: vida extra), "Abrir loja".
- Empty state amigável com botão para a Loja.

### 1c. Uso contextual dos power-ups

- `**LessonScreen**`: botão 💡 "Dica" lê do inventário; ❤️ "Recuperar vida" aparece quando vidas = 0 e há `vida-extra`. Dobrador de XP, se ativo, multiplica XP ganho ao finalizar lição.
- `**HomeScreen` / streak**: `manter-chama` é consumido automaticamente quando o streak corre risco (passo já preparado no `useProgresso` — apenas ler do inventário).
- `**HistoriasScreen**`: cards com `bloqueado: true` ficam livres quando `inventario.desbloqueios` inclui o id correspondente (já existe).

### 1d. API do hook

Adicionar helpers em `useInventario.ts`:

- `usarPowerUp(id)` — decrementa quantidade, dispara evento.
- `temPowerUp(id): boolean`
- `tempoRestante(id): number | null` (minutos) para dobrador.

---

## 2. Rebalancear preços

Economia atual (referência): missão diária ≈ 20-50 💎. Loja deve sentir-se aspiracional.


| Item                         | Antes  | Depois                                   |
| ---------------------------- | ------ | ---------------------------------------- |
| Dica Extra                   | 10     | **25**                                   |
| Coração Extra                | 20     | **50**                                   |
| Manter Chama                 | 30     | **80**                                   |
| Dobrador de XP (15min)       | 50     | **120**                                  |
| Baú Comum                    | 40     | **100**                                  |
| Pacote 10 Fragmentos         | 60     | **180**                                  |
| Baú Raro                     | 120    | **350**                                  |
| Baú Lendário                 | 300    | **900**                                  |
| Mais Curiosidades (×3)       | 1.500  | **950**                                  |
| História: Sumbi              | 1.000  | **1.200**                                |
| História: A Kianda do Mar    | 5.000  | **1.500** *(reduzir — bloqueava demais)* |
| Pack de Músicas Tradicionais | 10.000 | **5.000** *(reduzir — era proibitivo)*   |


(Valores podem ser ajustados depois; ficam num único arquivo.)

---

## 3. Fix descrições truncadas no mobile

Em `ItemLojaCard.tsx`:

- `line-clamp-3` corta no 390px porque o card divide a largura em 2 colunas e a descrição é longa.
- **Mudanças**:
  - Aumentar área da descrição: `min-h-[3.5rem]` e subir para `line-clamp-4` em telas pequenas (ou remover clamp e deixar fluir, já que o card é flex-col).
  - Encurtar copys longas (ex.: Pack de Músicas → "Trilha sonora extra em 'Para Além de Fronteiras' (+2 opções).").
  - Para garantir que o conteúdo nunca colide com o CTA, dar `flex-1` à descrição (já tem) e remover o clamp restritivo.
  - Aumentar leve `text-[11px] sm:text-xs` para caber mais palavra por linha.

---

## Arquivos afetados

**Novos**

- `src/components/inventario/MochilaSheet.tsx`

**Editados**

- `src/data/loja.ts` — novos preços e copy mais curta do pack de músicas.
- `src/hooks/useInventario.ts` — `usarPowerUp`, `temPowerUp`, `tempoRestante`.
- `src/components/missoes/HeaderRecursos.tsx` — novo chip "Mochila" abrindo o sheet.
- `src/screens/HomeScreen.tsx` — incluir chip Mochila no header.
- `src/screens/LessonScreen.tsx` — consumir dica/vida/dobrador a partir do inventário.
- `src/components/loja/ItemLojaCard.tsx` — fix do truncamento da descrição.

**Não tocar**: `BottomNav`, `curriculo.ts`, rotas existentes, fluxo da Loja em si.