## Objetivo

Remover o Chapéu de Palha como cosmético e transformá-lo numa **Conquista** desbloqueada ao ler as curiosidades **Pensador** + **Agostinho Neto**. Atualmente o aplicativo não terá cosméticos. Remover saldo.cosmeticos

## Mudanças

### 1. Nova conquista em `src/data/conquistas.ts`

Adicionar entrada:

- **id**: `sabio-das-letras`
- **título**: "Sábio das Letras"
- **descrição**: "Leu Pensador e Agostinho Neto — dois marcos da cultura angolana."
- **categoria**: cultura (badge laranja ou roxa, a escolher pelo tom mais distintivo dentro das existentes)
- **recompensa**: 30 diamantes + 50 XP (alinhado com conquistas de leitura existentes)
- **condição**: ambas curiosidades lidas

### 2. Lógica de desbloqueio em `src/components/CuriosidadeModal.tsx`

- Remover o bloco que adiciona `"chapeu-palha"` a `saldo.cosmeticos`.
- Substituir por verificação: se `curiosidadesLidas` contém `"pensador"` e `"agostinho-neto"` e a conquista `sabio-das-letras` ainda não está desbloqueada, marcá-la como concluída (via hook de conquistas existente) e disparar o modal de celebração já usado pelas outras conquistas.

### 3. Limpeza no Perfil `src/screens/ProfileScreen.tsx`

- Remover a secção "Cosméticos" e o `ChapeuPalhaCard`.
- A conquista passa a aparecer apenas no mural de Conquistas (tela de Missões), como todas as outras.

### 4. Limpeza opcional em `useSaldo`

- Se `cosmeticos` não tiver mais nenhum uso em outro lugar, remover o campo do estado para evitar código morto. (Verificar antes de remover.)

## Resultado

O feito cultural fica registado como conquista oficial, com badge, modal e recompensa — coerente com o resto do sistema. Nada de cosméticos órfãos sem avatar para equipar.