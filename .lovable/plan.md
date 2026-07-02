# Expansão do Módulo 1 — novo conteúdo do livro

Baseado nas 9 novas páginas enviadas (pp. 47, 49, 50, 51, 52, 53, Conversação I "Ohango I" p. 60, Conversação II "Ohango II"), o conteúdo será integrado **nas unidades já existentes** de `src/data/licoes/m1.ts` e no `vocabulario.ts`, sem criar módulo novo.

## 1. Novo vocabulário (`src/data/licoes/vocabulario.ts`)

Adicionar ~180 entradas novas ao `VOCAB_M1`, agrupadas por tema:

- **Meses do ano** (p. 50 + 47): Susu (Jan), Kayovo (Fev), Elombo (Mar), Kupupu (Abr), Kupemba (Mai), Kavambi (Jun), Evambi-linene (Jul), Kanyenye (Ago), Enyenye linene (Set), Mbala vipembe (Out), Kuvala (Nov), Cembanima (Dez).
- **Comida & mercado** (p. 50): Osema, Ocipoke, Ocitina (+ cokuyoka/cokuteleka), Onjevo, Okuyeva, Ositu yokuyoka/yokuteleka/yongulu/yongombe, Ondimba, Owa, Osanji, Ombisi, Owiki, Owoñgo, Usole, Ulela, Okukanga, Owalende, Olwoso.
- **Corpo humano** (p. 49 e p. 48): Etimba, Utwe, Upolo, Ocipala, Isso, Enyulu, Ekosi, Esinga, Etwi, Epito, Elimi, Omelã, Onyima, Onete, Utima, Okulu, Okwokwo, Ongolo, Omangu, Etc.
- **Cidade e lugares** (pp. 47, 50): Olupale, Okololo, Ocitanda, Onembele, Omilu, Yimbo, Osanjala, Vokati kolupale, Ombala.
- **Verbos e ações**: Okunywa, Okuyongola, Twendi, Okuteta, Kukatete, Olonjele, Okupemula, Ndipemula olonjele, Okuponda, Okuyota.
- **Substantivos abstratos**: Onjala, Enyona, Ocipito, Nasoma, Soma, Ovitangi, Ombambi, Onya, Onjo, Ovingumba, Ohali, Onanda, Uhembi, Ocili, Ohenda, Ondimbu.
- **Família (base para possessivos)** (pp. 51–53): Ise, Ina, Ocimumba, Ocepwa, Namãle, Pamãle, Ukãyi, Ulume, Manjange, Manjahe, Manjetu, Manjene, Manjavo, Epalume, Ndatembo, Nekulu.
- **Diversos** (p. 47 e "vocabulário"): Elivala, Ekukutu, Ndikasi palo, Okasi opo, Ndisala, Ndayongwile, Ovava vatokota/vatalala, Suku, Ñgala, Yesu, Onjovoli, Handi syo, Mbi talvéz, Lalimwe eteke, Cilo, Ekondombolo, Ekuwe.

Cada entrada segue o formato `{ umbundu, pt, exemplo? }` já existente.

## 2. Novas lições em `src/data/licoes/m1.ts`

Adicionar/expandir sem quebrar IDs existentes. Alvo: **+10 lições** distribuídas assim:

- **U1 · Identificação pessoal** — adicionar 2 lições:
  - `m1u1s8` "Conversação I — Chac & Kapt (Ohango I)": diálogo completo transcrito da p. 60 (Kalunga/kuku, Ove helye?, K'imbo lyeve kupi?, Ise yove helye?, Ina yove?, Ina yove pi acitiwila?, Ndapandula calwa). Passos: aprender (Kalunga, kuku, k'imbo, ise, ina) → diálogo (Chac ↔ Kapt) → escuta → traduzir → montar frase → falar.
  - `m1u1s9` "Conversação II — Ohango II" (p. da imagem 1): Helye u? / U ekamba lyange / K'imbo lyahe kupi / Eye Ukwima / Pi acitiwila? / Wacitiwila vongelenge / Wacitiwa vulima upi? / Wacitiwa vulima wolohulukãyi vivali. Passos: aprender (ekamba, u, eye, acitiwila, vulima) → diálogo → escuta → escrita.
- **U2 · De manhã** — adicionar 1 lição:
  - `m1u2s8` "Família em casa": possessivos "meu/teu/dele" com Ise/Ina/Ocimumba (usando texto das pp. 51–52). Kwendi apresenta a família (Ise yange, Ina yange, Ocimumba cange).
- **U3 · Na rua** — adicionar 2 lições:
  - `m1u3s8` "Meses e datas": Susu…Cembanima + "Wacitiwa vulima upi?" ligando ao ano.
  - `m1u3s9` "Onde nasceste": Pi acitiwila? / Wacitiwila…; diálogo curto Yellen ↔ Hossy.
- **U4 · No mercado** — adicionar 2 lições:
  - `m1u4s8` "Comida no mercado": Osema, Ocipoke, Ocitina, Ombisi, Ositu yongombe/yongulu (assada/cozida) + "Ciñgami?" aplicado a cada.
  - `m1u4s9` "Bebida e cozinha": Ovava okunywa/vatokota/vatalala, Okunywa, Okukanga, Ulela, Usole.
- **U5 · Palavras Novas + revisão** — adicionar 3 lições:
  - `m1u5s7` "Casa e família alargada": Ukãyi/Ulume/Manjange/Epalume/Ndatembo/Nekulu com possessivos completos.
  - `m1u5s8` "Corpo humano": Etimba, Utwe, Upolo, Isso, Elimi, Etwi, Ocipala, Enyulu, Ekosi, Utima, Okulu, Okwokwo.
  - `m1u5s9` "Cidade e natureza": Olupale, Okololo, Ocitanda, Yimbo, Osanjala, Vokati kolupale, Uti, Ombela, Onanga, Elende, Owyã (calor), Ombambi (frio).

Cada lição segue a mesma sequência já validada: **aprender → diálogo (quando aplicável) → escuta_escolha → traduzir_pt_umbundu → traduzir_umbundu_pt → montar_frase → escrever → falar**. Nada de pular passos; palavras novas sempre "aprender" antes.

Personagens: continua o padrão Kwendi↔Otchali e Yellen↔Hossy nas unidades.

&nbsp;

## 4. Currículo (`src/data/curriculo.ts`)

Aumentar `mk()` das unidades U1, U2, U3, U4, U5 nos totais correspondentes (+2, +1, +2, +2, +3 lições) mantendo báus finais. Total do módulo passa de ~34 para ~44 lições (ainda dentro do limite de 100).

## 5. Sem alterações em

- Componentes de passos (`PassoComponents.tsx`) — já cobrem todos os tipos usados.
- `PalavraTocavel` e popover — funcionam automaticamente para novo vocabulário.
- `LessonScreen` — genérica.
- Backend (Supabase) — nenhum impacto.

## 6. Verificação

- `tsgo` para type-check dos novos objetos.
- `bunx vitest run` para garantir que nada regride.
- Abrir manualmente `m1u1s8` (Conversação I) e `m1u4s8` (Comida) para conferir fluxo.

## Entregáveis

- ~180 entradas novas em `VOCAB_M1`.
- 10 lições novas espalhadas pelas 5 unidades existentes.
- Currículo atualizado sem renumeração retroativa (IDs antigos preservados).