# Primeira história: O Jacaré Bangão

Transformar a aba **Histórias** (hoje só com um placeholder "Em breve") numa biblioteca de contos angolanos, com **O Jacaré Bangão** como primeira história totalmente jogável, partindo do artigo da Revista Ecos (Sérgio de Carvalho Rodrigues, 2017).

## 1. Estrutura de dados

Novo ficheiro `src/data/historias.ts`:

```ts
type Capitulo = { id: string; titulo: string; paragrafos: string[]; vocabulario?: { umbundu: string; pt: string }[] };
type Historia = {
  id: string; titulo: string; subtitulo: string; regiao: string; epoca: string;
  duracaoMin: number; nivel: "Iniciante" | "Intermédio" | "Avançado";
  imagem: string; cor: string; sinopse: string;
  capitulos: Capitulo[];
  curiosidade: { titulo: string; texto: string };
  quiz: { pergunta: string; opcoes: string[]; correta: number }[];
  recompensa: { xp: number; diamantes: number };
};
```

Primeira entrada `jacare-bangao` com 5 capítulos curtos adaptados do artigo (linguagem de leitor, não académica):

1. **As margens do Dande** — apresentação de Caxito, do rio e do Sr. Ngandu.
2. **O Imposto Geral Mínimo** — o chefe de posto cruel e o peso colonial.
3. **A vingança do jacaré** — Ngandu vai à Administração pagar o imposto.
4. **A fuga do Sipaio** — o povo de Caxito assiste, o chefe foge.
5. **Lenda que virou estátua** — significado: oratura de combate, premissa da independência.

Mais: **vocabulário Umbundu** por capítulo (5–8 palavras: rio, jacaré, povo, chefe, fugir, etc.), **curiosidade cultural** (a estátua real em Caxito, foto fornecida pelo utilizador), e **quiz final** de 4 perguntas.

## 2. Imagem

Usar a foto da estátua enviada (`user-uploads://bangao.jpg`) via `lovable-assets create` → `src/assets/bangao.jpg.asset.json`, importada como capa da história e na tela de curiosidade. Sem usar a 2ª imagem (referência decorativa apenas).

## 3. Ecrãs / componentes

- `**src/screens/HistoriasScreen.tsx**` (reescrito): lista de cards de histórias (1 desbloqueada + cards "Em breve" para futuros contos), com capa, título, região, duração, nível, XP. Botão demo antigo removido.
- `**src/screens/HistoriaDetalheScreen.tsx**` (novo): tela de abertura — capa grande, sinopse, metadados, botão "Começar a ouvir".
- `**src/screens/HistoriaLeituraScreen.tsx**` (novo): leitura paginada capítulo a capítulo (1 capítulo por ecrã), barra de progresso topo, painel lateral de vocabulário Umbundu/PT por capítulo, botões anterior/próximo.
- `**src/screens/HistoriaFimScreen.tsx**` (novo): quiz de 4 perguntas → cartão de curiosidade (estátua de Caxito) → recompensa (XP + diamantes) via `setSaldo` e `registrarAcao("historia_concluida", 1)`.

## 4. Rotas

Adicionar em `src/App.tsx`:

- `/historias/:id` → detalhe
- `/historias/:id/ler` → leitura
- `/historias/:id/fim` → quiz/recompensa

Bottom nav continua a apontar `/historias` para a lista.

## 5. Estilo

- Paleta já existente (peach/crimson). Card da história destaca-se com gradiente terra/verde discreto a evocar o cenário do rio Dande.
- Tipografia Nunito (já no projeto). Sem mudanças globais de design.
- Animações Framer Motion suaves de entrada (fade/slide) — sem mascotes novos.

## 6. Fora de âmbito

- Áudio narrado (fica como gancho "Em breve" no detalhe).
- Outros contos completos — apenas placeholders bloqueados.
- Tradução integral do texto para Umbundu (só vocabulário-chave).
- Alterações em módulos, missões ou progresso de unidades.

## Notas técnicas

- Conteúdo dos capítulos é reescrita livre baseada no artigo (não cópia literal), tom narrativo acessível, ~80–120 palavras por capítulo.
- Vocabulário Umbundu: usar termos comuns + verificar com web search se necessário para palavras-chave (rio = `olui`/`olonjila`, jacaré = `ongandu`, etc.).
- Recompensa: 80 XP + 20 diamantes (mantém valor atual do botão demo).
- Sem mudanças em hooks (`useMissoes`, `useSaldo`, `useProgresso`).
- Colocar referência.