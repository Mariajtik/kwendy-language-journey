
# Plano — Alfabeto na U5 + escrita rápida após cada palavra nova

## Parte A — U5 (Palavras + Revisão) passa a ser a unidade mais extensa

A unidade `m1u5` recebe um bloco de lições dedicadas ao alfabeto Umbundu, encaixadas **antes** das lições já existentes (Pi/Kupi, vocabulário, revisão, família, corpo, cidade). A ordem final da U5 fica:

1. Vogais — `a e i o u` (cinco vogais claras, sem ditongos como em PT)
2. Consoantes simples I — `b c d f g h j`
3. Consoantes simples II — `k l m n p s`
4. Consoantes simples III — `t v w y` (o Umbundu **não** usa `q r x z`)
5. Digrafos nasais — `mb · nd · ng · ny` (com exemplos: *ombisi*, *ndakolapo*, *ongolo*, *onyima*)
6. Digrafos labiais/complexos — `mp · nc · ngw · mbw · ny + vogal`
7. Tabela completa do alfabeto Umbundu (visão global, 1 lição de leitura + escuta)
8. Letras que não existem em Umbundu (`q r x z`) e falsos amigos com o PT
9. Sons especiais — vogais nasalizadas `ã õ` (ex.: *Omelã*, *Ukãyi*)
10. Revisão do alfabeto (escuta + emparelhar letra ↔ palavra ↔ som)
11. Pi (onde) — antes do verbo *(já existente)*
12. Kupi (aonde) — depois do verbo *(já existente)*
13. Twenda kupi? *(já existente)*
14. Ndikakala kupi *(já existente)*
15. Vocabulário do dia-a-dia *(já existente)*
16. Revisão do módulo *(já existente)*
17. Casa e família alargada *(já existente)*
18. Corpo humano *(já existente)*
19. Cidade e natureza *(já existente)*

Cada nova lição do alfabeto segue o fluxo Kwendi:
`aprender letra` → `escrever (preencher letras)` → `escuta_escolha` → `emparelhar` → `falar`.

## Parte B — Escrita "muito fácil" após cada palavra nova (toda a app)

Sempre que numa lição aparece um passo `aprender`, o motor injeta **automaticamente** logo a seguir um mini-passo de escrita do tipo **preencher letras em falta**. Regras:

- É gerado em tempo de execução — os ficheiros de dados (`m1.ts` e módulos futuros) não precisam de ser reescritos.
- A palavra alvo é a do `aprender` que acabou de sair (`umbundu`).
- Uma ou duas letras (interiores, nunca a primeira) são substituídas por `_`. Vogais têm prioridade; se a palavra só tiver 3 letras esconde-se 1 letra.
- Palavras curtíssimas (≤ 2 caracteres) ou multipalavra longa (> 3 palavras) são saltadas — não faz sentido preencher.
- Tradução PT e a palavra "modelo" mantêm-se visíveis, para reforçar grafia sem frustrar (é o pedido "muito fácil").
- É considerado errado apenas se a letra digitada não corresponder à letra oculta (case-insensitive, ignorando acentos via `normalizar()` já existente).
- Não conta para XP negativo se falhar — apenas mostra a letra correta e continua.

Exemplo:
- `aprender` mostra **Ekumbi — O sol**
- imediatamente aparece **`Ek_mbi`** (o "u" oculto) com o hint "O sol"
- utilizador escreve `u` → verde → passo `falar`/`escuta` da lição prossegue

## Detalhes técnicos

### Dados (`src/data/licoes/m1.ts`)
Adicionar 10 novas lições `m1u5s1`..`m1u5s10` (alfabeto) e renumerar as atuais para `m1u5s11`..`m1u5s19`. Actualizar `curriculo.ts` (`m1u5.seccoes`) para refletir as 19 secções + báu.

### Novo tipo de passo (`src/data/licoes/tipos.ts`)
```ts
| {
    tipo: "preencher_letras";
    palavra: string;      // Umbundu completo — usado como resposta
    pt: string;           // dica em PT
    mascara: string;      // ex: "Ek_mbi"
    letras: string[];     // ex: ["u"] — respostas por ordem
  }
```

### Geração automática no motor da lição
Em `src/screens/LessonScreen.tsx`, ao construir a lista de passos da lição atual, aplicar uma função `expandirComEscrita(passos)`:

```
para cada passo:
  emitir passo
  se passo.tipo === "aprender" e elegível:
    emitir { tipo: "preencher_letras", ... } gerado a partir de passo.umbundu/pt
```

Elegibilidade: palavra tem entre 3 e 24 caracteres, contém pelo menos uma vogal interior. Se a palavra tiver espaços (frase curta), esconde apenas uma letra da **última** palavra.

### Renderização (`src/components/licao/PassoComponents.tsx`)
Novo componente `PassoPreencherLetras`:
- Mostra os caracteres da máscara como caixas quadradas grandes.
- Caixas fixas (letras já visíveis) usam o estilo `card` cinzento.
- Caixas vazias são inputs de 1 letra, com foco automático e avanço.
- Botão *"Verificar"* fica no rodapé; feedback verde/vermelho consistente com o resto da app.
- Botão pequeno *"Ouvir palavra"* reaproveita o TTS já usado em `escuta_escolha`.
- Feedback pedagógico: se errar, mostra a letra correta e prossegue automaticamente após 800 ms.

### Vocabulário (`src/data/licoes/vocabulario.ts`)
Adicionar entradas para as letras/digrafos e para palavras-exemplo novas usadas no alfabeto (ex.: nomes de letras em Umbundu com pronúncia PT).

## Fora do âmbito
- Não altero o design system nem os banners/cores da U5 (continua rosa `330 75% 55%`).
- Não mexo em módulos que não seja o M1 nos ficheiros de dados; a regra global só toma efeito quando eles existirem.
- Não adiciono TTS novo — reutilizo o existente.
- Não altero pontuação/XP; a mini-escrita é neutra em caso de erro.
