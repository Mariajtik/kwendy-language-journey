## Objetivo
Ajustar o fluxo de inscrição em `src/screens/SignupFlow.tsx` para que os botões sociais apareçam apenas na etapa de email, juntamente com a senha, e que ao "autenticar" via social o usuário avance para a próxima etapa do fluxo.

## Mudanças

### 1. Etapa 0 — Nome de usuário (`step === 0`)
- Remover o bloco `<SocialAuthButtons mode="signup" />` e o separador "ou" desta tela.
- Manter foto + nome de usuário como única responsabilidade da etapa.

### 2. Fundir etapas 1 (Email) e 2 (Senha) em uma única tela
- Nova etapa 1 passa a conter:
  - Título: "Crie sua conta"
  - Subtítulo curto
  - `<SocialAuthButtons mode="signup" />` no topo
  - Separador "ou"
  - Input de email
  - `<PasswordInput />` logo abaixo, com dica de força mínima
- Remover a antiga etapa 2 (senha isolada).
- Renumerar as etapas seguintes (origem, motivação, nível, etc.) deslocando todas em -1.
- Atualizar `totalSteps` de 9 para 8 para manter a barra de progresso correta.

### 3. Fluxo pós-autenticação social (apenas UI)
- Passar callback `onProvider` ao `SocialAuthButtons` que:
  - Mostra um toast "Conectado com Google/Apple" (sonner)
  - Pula direto para a próxima etapa do fluxo (`setStep(2)` — origem), considerando email/senha como já resolvidos pelo provedor.
- Sem lógica de back-end; é apenas avanço de UI conforme solicitado.

### 4. Botão "Continuar" da nova etapa unificada
- Habilitado apenas quando `email` for válido (regex simples) e `password.length >= 6`.

## Arquivos afetados
- `src/screens/SignupFlow.tsx` (única alteração)

Sem mudanças em back-end, rotas ou outros componentes.
