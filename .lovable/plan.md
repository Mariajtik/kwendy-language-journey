## Objetivo

Reorganizar `src/data/curriculo.ts` para que o **Módulo 1** funcione como uma "viagem" pelos primeiros cenários reais do dia-a-dia (mistura solta de saudações, perguntas, números, lugares, compras), e os módulos seguintes aprofundem cada tema com a espinha pedagógica acordada.

Único ficheiro alterado: `src/data/curriculo.ts`. IDs (`m{N}u{N}sN`, `…bau`) mantidos. Sem impacto em `useProgresso`, `HomeScreen`, `FalaEscutaScreen`, `SecaoScreen` — todos consomem `CURRICULO` dinamicamente.

---

## Módulo 1 — **Saúda a tua comunidade**

Cenários reais, vocabulário "solto" puxado de vários temas do livro (saudações, pronomes, números, verbos básicos, lugares, mercado). O objectivo é o aluno **safar-se em situações reais** antes de aprofundar a gramática.

1. **Identificação pessoal** — "Como te chamas?", "Quem sou eu?", "Como estás?", apresentar-se em poucas frases.
2. **De manhã** — Wakolelepo, bom dia, saudar mais-velhos, responder a "como passaste a noite".
3. **Na rua** — "Para onde vais?", "De onde vens?", "Quantos anos tens?", direcções simples, cumprimentar conhecidos.
4. **No mercado** — "Quanto é?", "Quero comprar…", números 1–10 aplicados, nomes de comida básica, agradecer.
5. **Conversação** — diálogo curto que junta os 4 cenários anteriores numa interacção corrida.

## Módulos 2–12 — espinha temática + absorção do livro

continue pelo 2 até 12 mesmo

- **M3 Eu e tu** — pronomes pessoais (sing./pl.), formas dos pronomes pessoais, conversação I, II, III
- **M4 Introduza a tua família** — família básica, alargada (avós/tios/primos/sogros), amizades e vizinhança, Prática
- **M5 Ações e rotina** — verbos presente do indicativo, preterito perfeito,imperfeito, futuro imperfeito, modo condicional, conjuntivo, p.i. do conjuntivo, f.i do conjuntivo
  perguntar com verbos ("o que fazes / onde vais / quando voltas").
- **M6 Explora a natureza** — animais da casa e selvagens, aves, plantas e árvores, agricultura e ferramentas.
- **M7 Corpo humano e saúde** — rosto/cabeça, tronco/membros, no médico, hábitos saudáveis.
- **M8 Tempo e calendário** — dias, meses, estações (cacimbo/chuvas), horas e momentos do dia.
- **M9 Em casa** — compartimentos, mobília, loiça/utensílios, vestuário (dia-a-dia + tradicional), alimentação.
- **M10 Trabalho e comunidade** — profissões da aldeia/cidade, comércio, vida na comunidade, provérbios do trabalho.
- **M11 Advérbios e ligações** — advérbios de modo/lugar/tempo/quantidade/dúvida/negação + conjunções (copulativas, adversativas, condicionais, temporais, disjuntivas, conclusivas, coordenativas, casuais,concessivas).
- **M12 Pronomes avançados e verbos** formação dos tempos verbais— possessivos, demonstrativos, interrogativos/indefinidos + presente, pretéritos, futuro, condicional, conjuntivo.
- m13 provérbios

Cada unidade mantém 3–5 secções `licao` + 1 `bau` no fim (via helper `mk`). Cores HSL reutilizadas das paletas já existentes nos módulos. Número de unidades varia por módulo (M5/M11/M12 podem ter 5–6 unidades para absorver toda a matéria do livro; outros 4).

---

## Notas técnicas

- `PRIMEIRA_UNIDADE` continua a ser `CURRICULO[0].unidades[0]` → passa a apontar para "Saúda a tua comunidade" (m1u1).
- Progresso guardado em `localStorage` (`useProgresso`): IDs antigos como `m1u3` continuam válidos estruturalmente; `carregar()` já faz fallback para `m1u1` se `unidadeAtual` for inválido. Utilizadores existentes que estivessem em unidades posteriores podem ser "recolocados" no início do módulo correspondente — aceitável dado o estágio do projecto.
- Sem alterações em `useMissoes`, `FalaEscutaScreen`, `SecaoScreen` (leem unidades desbloqueadas dinamicamente).