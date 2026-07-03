## Objetivo

Adicionar um **switch global de Premium** na Loja com anúncio "GRÁTIS em degustação · por tempo indeterminado". Quando ligado, ativa todos os benefícios viáveis já hoje. Quando desligado, a app comporta-se exactamente como agora.

## Benefícios ligados ao switch (viáveis)

- **Vidas infinitas** — `perderVida()` vira no-op; UI mostra `∞` no lugar do número.
- **XP em dobro para sempre** — `dobradorXpAtivo()` retorna `true` sem consumir power-up.
- **Chama eterna** — piso da ofensiva não desce; visual sempre com chama acesa e badge "Eterna" ao lado do contador na Home.
- **Dicas ilimitadas grátis** — bypass do contador diário e do custo em diamantes em `LessonScreen`.
- **Cultura desbloqueada** — histórias/músicas/itens de cultura ficam sempre destravados (`inventario.desbloqueios` é considerado como contendo todos os IDs de cultura).
- **Badge Premium no perfil** — coroa dourada ao lado do nome + linha "Membro Premium (degustação)" no `ProfileScreen`.
- **Foto na comunidade** — o composer do `CommunityFeed` mostra botão "Adicionar foto" (input file → data URL local, preview na publicação). Sem Premium o botão fica oculto.

Bullets que **não** viram Premium ainda (marcadas como "em breve" no card, riscadas quando o switch está On para deixar claro): IA com sotaque angolano, chat/chamada com IA Kwendi, dicionário IA ilimitado, inglês/espanhol, eventos exclusivos, estatísticas avançadas, sem anúncios (a app já não tem anúncios), $5/3 meses (a mensagem é grátis por tempo indeterminado).

## Comportamento do switch

- Estado global `premiumAtivo: boolean`, persistido em `localStorage` (chave `kwendi.premium.ativo`).
- Default `false` — a app abre no comportamento actual.
- Ligar/desligar produz efeito imediato em todas as telas (dispatch de `CustomEvent` para sincronizar hooks abertos, seguindo o padrão de `useSaldo`).
- O antigo fluxo de "Tenho interesse por $5" é **removido** da Loja (o card é substituído). As chaves `kwendi.premium.interessados` e `kwendi.premium.eu` deixam de ser lidas/escritas mas não são apagadas do storage do utilizador.

## UI do card Premium na Loja

Novo `PremiumSwitchCard` substitui `PremiumPackCard`:

- Faixa "🎉 GRÁTIS em degustação · por tempo indeterminado" no topo.
- Título "Pacote Premium" + subtítulo "Ativa/desativa a qualquer momento".
- Switch grande centralizado (estado ligado/desligado com animação).
- Lista dos 7 benefícios ativos com check verde quando ligado, cinza quando desligado.
- Bloco separado "Em breve" listando as features futuras (IA, chat, EN/ES, etc.), sempre em cinza.
- Rodapé: "Enquanto durar a degustação, aproveita sem limites."

O `PremiumInteresseModal` deixa de ser usado (não removo o ficheiro para não quebrar imports; simplesmente não é importado).

## Onde muda o código

**Novo**
- `src/contexts/PremiumContext.tsx` — provider + hook `usePremium()` com `{ ativo, setAtivo }`. Persistência em localStorage + `CustomEvent` para sincronizar.
- `src/components/loja/PremiumSwitchCard.tsx` — novo card.

**Editar**
- `src/App.tsx` — envolver com `PremiumProvider` (junto do `AcessibilidadeProvider`).
- `src/screens/LojaScreen.tsx` — substituir render da tab "premium" pelo novo card; remover o toggle de interesse.
- `src/hooks/useSaldo.ts` — `perderVida()` verifica flag Premium (leitura directa do localStorage) e não faz nada quando ligada.
- `src/hooks/useInventario.ts` — `dobradorXpAtivo()` retorna `true` se Premium; helpers que consultam `desbloqueios` de cultura consideram tudo destravado se Premium.
- `src/hooks/useLoja.ts` — se aplicável, itens de cultura reportam "já desbloqueado" quando Premium.
- `src/screens/LessonScreen.tsx` — quando `usePremium().ativo`, dicas grátis e pagas viram grátis; UI mostra "Dicas ilimitadas". Contador de vidas exibe `∞`.
- `src/screens/HomeScreen.tsx` — contador de vidas mostra `∞`; chama sempre acesa com etiqueta "Eterna".
- `src/screens/ProfileScreen.tsx` — coroa dourada + "Membro Premium (degustação)" quando ligado; contador de streak sempre com `chamaAcesa`.
- `src/components/CommunityFeed.tsx` — botão "Adicionar foto" no composer só quando Premium; anexa preview local ao post.

## Fora de escopo

- IA Kwendi com sotaque, chat/chamada com IA, dicionário IA — exigem gateway/modelo e ficam para outra iteração.
- Tradução da UI para EN/ES.
- Sistema de eventos exclusivos e telas de estatísticas avançadas.
- Cobrança real, integração de pagamentos, expiração de degustação (é "tempo indeterminado" por design).
- Backend/migração para Cloud — tudo continua em localStorage, coerente com o resto da app.
