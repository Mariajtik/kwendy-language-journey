## Objetivo

Manter o visual original do `HomeScreen` (que estava mais bonito) e apenas refinar a integração da nova estrutura Módulos → Unidades → Secções. Nada de telas novas — tudo continua acontecendo dentro do `HomeScreen`.

## Mudanças

### 1. `src/screens/HomeScreen.tsx`

**a) Separador de unidade (rodapé do mapa) — cor castanha**
Atualmente o texto usa `#5E5C5C` e as linhas usam `white/70`, ficando ilegível sobre o capim. Trocar por tons castanhos:
- Texto: `#6B3F1D` (castanho escuro), font-extrabold
- Linhas laterais: `rgba(107,63,29,0.55)`
- Adicionar leve `text-shadow` branca para reforçar contraste sobre o fundo verde.

**b) Banner da próxima unidade — ícone de livro abre o zig-zag**
Hoje o banner inteiro é um `<button>` que navega para `/unidade/:id`. Refatorar para:
- O **card** vira `<div>` apenas visual (não é mais clicável inteiro).
- O **ícone de livro** (à direita) passa a ser o `<button>` que abre a unidade — chama `navigate('/unidade/:id')` que já renderiza o zig-zag da próxima unidade dentro do mesmo `HomeScreen` (modo "preview de unidade", já existente).
- Adicionar `aria-label="Ver lições da próxima unidade"` e um leve `hover:scale-105` no botão do livro para indicar interação.
- Banner da unidade atual no topo continua igual (cor da unidade + sombra vermelha).

**c) Sem novas telas, sem novos componentes**
Não criar arquivos novos. A rota `/unidade/:unidadeId` (que já existe) continua usando o próprio `HomeScreen` em modo preview — exatamente como hoje.

### Fora do escopo

- Não mexer em `useProgresso`, `curriculo.ts`, `App.tsx`, `LessonScreen.tsx`.
- Não alterar o restante do layout (header, zig-zag, halo "COMEÇAR", scroll-to-top, bottom nav).
- Não tocar nas cores das unidades nem na cor primária do app.

## Resultado esperado

- O mapa volta a ter a estética anterior, com o separador agora legível em castanho.
- A próxima unidade aparece como um cartão informativo; o ícone de livro à direita é o gatilho explícito para "espiar" o zig-zag da próxima unidade — sem sair do `HomeScreen`.
