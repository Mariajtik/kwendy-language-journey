## Fase 2 — Inscrição & Processamento (somente front-end)

Continua a especificação original. Sem lógica de back-end, sem IA real — apenas UI e animações.

### 1. Etapa "Como você soube da Kwendi?" — sub-opções de "Outro"
Arquivo: `src/screens/SignupFlow.tsx` (step 4)

- Quando o usuário tocar em **Outro**, revelar abaixo um `Select` (shadcn) com as opções:
  - Amigos
  - Escola
  - Nenhuma das opções acima
- Novo estado `sourceOther` armazena o valor selecionado.
- `canAdvance` na step 4 passa a exigir:
  - `source !== ""` **e** (se `source === "Outro"` então `sourceOther !== ""`).
- Estilo idêntico ao select de país já usado na etapa de origem.

### 2. Nova tela de processamento dos resultados
Arquivo novo: `src/screens/ProcessingResultsScreen.tsx`
Rota nova em `src/App.tsx`: `/processing`

Fluxo de navegação:
- Ao final do `SignupFlow` (botão "Vou cumprir a meta" da step 7), em vez de ir direto para `/home`, navegar para `/processing`.
- A tela de sucesso atual ("Conta criada com sucesso") é removida desse fluxo e substituída pelo processamento.

Layout (fundo branco, sem app-shell escuro):
- Centralizado: ilustração da Kwendi (usar `@/assets/characters/kwendi.jpg` em círculo) "sentada" sobre uma linha preta fina horizontal (1px, ~60% da largura).
- Acima da cabeça da personagem: uma **nuvem de pensamento** desenhada em SVG.
- Dentro da nuvem, animação de **rabiscos** (paths SVG) sendo desenhados e apagados em loop (`strokeDasharray` + `motion` com `repeat: Infinity`, duração ~1.2s, 3 rabiscos defasados).
- Abaixo da personagem, com fade-in:
  > "Aguarde um pouco, está bem? Daqui a nada receberá os resultados!"

Após 4s (timer):
- Os rabiscos somem (fade-out da nuvem interna), e dentro da nuvem aparece um grande "!" (ou texto "Avaliação completa!").
- Abaixo, com **fade-in apenas** (sem sair), surgem em sequência (stagger ~600ms):
  1. "A sua pontuação: **78/100**" (valor mock)
  2. "O seu nível: **Iniciante**" (lê do estado passado por `location.state`, fallback "Iniciante")
  3. Linha genérica: "Você acertou a maioria das saudações e cumprimentos, mas ainda há espaço para melhorar a pronúncia."
- Botão **Continuar** (estilo `btn-duo btn-duo-primary`) aparece por último (fade-in).
- Ao clicar: `navigate("/home")`.

Detalhes técnicos:
- `useEffect` com `setTimeout(() => setPhase("done"), 4000)`.
- `AnimatePresence` para a troca dos rabiscos → "!".
- Sem áudio, sem back-end, sem cálculo real de pontuação.

### 3. Ajuste em `SignupFlow.tsx`
- Substituir `setDone(true)` no `next()` final por `navigate("/processing", { state: { level, username } })`.
- Remover (ou manter sem uso) a tela `done` se não houver mais ramo que a alcance.

## Arquivos afetados
- `src/screens/SignupFlow.tsx` — sub-select em "Outro", validação, navegação final
- `src/screens/ProcessingResultsScreen.tsx` — **novo**
- `src/App.tsx` — nova rota `/processing`

## Fora de escopo (próximas fases)
- Teste de nivelamento real, IA Kwendi, módulos cinza/destaque com círculo branco e modal de módulo bloqueado → ficam para a Fase 4.
- Tudo de back-end (envio real de OTP, persistência) continua adiado.
