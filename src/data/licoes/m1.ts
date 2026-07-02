/**
 * Módulo 1 — Saúda a tua comunidade.
 * 5 unidades × ~7 lições, transcritas do livro de Umbundu.
 *
 * Cada lição segue o fluxo:
 *   Aprender palavra → (Diálogo) → Escuta → Escrita → Fala.
 * Nunca aparece um exercício com palavra que não tenha sido introduzida
 * antes no passo "aprender".
 */

import type { Passo, Licao } from "./tipos";

// -------- Helpers ---------------------------------------------------------

const A = (umbundu: string, pt: string, exemplo?: string): Passo => ({
  tipo: "aprender",
  umbundu,
  pt,
  ...(exemplo ? { exemplo } : {}),
});

const D = (falas: { p: string; u: string; t: string }[]): Passo => ({
  tipo: "dialogo",
  falas: falas.map((f) => ({
    personagem: f.p as never,
    umbundu: f.u,
    pt: f.t,
  })),
});

const E = (audio: string, pt: string, opcoes: string[], correta: number): Passo => ({
  tipo: "escuta_escolha",
  audio,
  pt,
  opcoes,
  correta,
});

const TPU = (pt: string, opcoes: string[], correta: number): Passo => ({
  tipo: "traduzir_pt_umbundu",
  pt,
  opcoes,
  correta,
});

const TUP = (umbundu: string, opcoes: string[], correta: number): Passo => ({
  tipo: "traduzir_umbundu_pt",
  umbundu,
  opcoes,
  correta,
});

const M = (pergunta: string, alvo: string, distratores: string[] = []): Passo => ({
  tipo: "montar_frase",
  pergunta,
  alvo,
  distratores,
});

const W = (pergunta: string, resposta: string): Passo => ({
  tipo: "escrever",
  pergunta,
  resposta,
});

const F = (frase: string, pt: string): Passo => ({
  tipo: "falar",
  frase,
  pt,
});

// -------- U1 · Identificação pessoal --------------------------------------

const U1: Licao[] = [
  {
    id: "m1u1s1",
    titulo: "Como te chamas?",
    personagens: ["kwendi", "otchali"],
    passos: [
      A("Ove helye?", "Como te chamas?", "Usa-se ao conhecer alguém."),
      A("Ame Kapoco", "Eu sou o Kapoco", "\"Ame\" = eu."),
      D([
        { p: "kwendi", u: "Ove helye?", t: "Como te chamas?" },
        { p: "otchali", u: "Ame Otchali. Ove helye?", t: "Eu sou a Otchali. E tu?" },
        { p: "kwendi", u: "Ame Kwendi.", t: "Eu sou o Kwendi." },
      ]),
      E("Ove helye?", "Como te chamas?", ["Bom dia", "Como te chamas?", "Quantos anos tens?"], 1),
      TPU("Eu sou o Kapoco", ["Ame Kapoco", "Ove Kapoco", "Ndakolapo Kapoco"], 0),
      M("Traduz para Umbundu: “Como te chamas?”", "Ove helye", ["Ame", "Kapoco"]),
      F("Ame Kwendi", "Eu sou o Kwendi"),
    ],
  },
  {
    id: "m1u1s2",
    titulo: "Eu sou…",
    personagens: ["kwendi", "otchali"],
    passos: [
      A("Ame", "Eu"),
      A("Ove", "Tu"),
      A("Ame ndakolapo ciwa", "Eu estou bem"),
      D([
        { p: "kwendi", u: "Wakolapo?", t: "Como estás?" },
        { p: "otchali", u: "Ame ndakolapo ciwa. Ove wakolapovo?", t: "Estou bem. E tu?" },
        { p: "kwendi", u: "Ame ndakolapo ciwa.", t: "Também estou bem." },
      ]),
      TUP("Ove", ["Eu", "Tu", "Ele"], 1),
      TPU("Eu estou bem", ["Ove ndakolapo ciwa", "Ame ndakolapo ciwa", "Ame Kapoco"], 1),
      M("Diz em Umbundu: “Eu estou bem”", "Ame ndakolapo ciwa"),
      F("Ame ndakolapo ciwa", "Estou bem"),
    ],
  },
  {
    id: "m1u1s3",
    titulo: "Como estás?",
    personagens: ["yellen", "hossy"],
    passos: [
      A("Wakolapo?", "Como estás?"),
      A("Ndakolapo ciwa", "Estou bem"),
      A("Hisepo kamwe", "Mais ou menos"),
      D([
        { p: "yellen", u: "Wakolapo?", t: "Como estás?" },
        { p: "hossy", u: "Hisepo kamwe.", t: "Mais ou menos." },
        { p: "yellen", u: "Ame ndakolapo ciwa.", t: "Eu estou bem." },
      ]),
      E("Hisepo kamwe", "Mais ou menos", ["Estou bem", "Mais ou menos", "Bom dia"], 1),
      TUP("Ndakolapo ciwa", ["Estou doente", "Estou bem", "Boa noite"], 1),
      W("Escreve em Umbundu: “Como estás?”", "Wakolapo"),
      F("Wakolapo?", "Como estás?"),
    ],
  },
  {
    id: "m1u1s4",
    titulo: "Passei bem, passei mal",
    personagens: ["kwendi", "otchali"],
    passos: [
      A("Wosalapo?", "Como passou o dia?"),
      A("Wosalapo ciwa", "Passei bem o dia"),
      A("Ame ndosalapo ciwa", "Eu passei bem o dia"),
      D([
        { p: "kwendi", u: "Wosalapo?", t: "Como passou o dia?" },
        { p: "otchali", u: "Ndosalapo ciwa.", t: "Passei bem." },
      ]),
      TPU("Passei bem", ["Ndosalapo ciwa", "Ndakolapo ciwa", "Twalale ciwa"], 0),
      M("Traduz: “Como passou o dia?”", "Wosalapo"),
      F("Ndosalapo ciwa", "Passei bem o dia"),
    ],
  },
  {
    id: "m1u1s5",
    titulo: "Como passou o dia?",
    personagens: ["yellen", "hossy"],
    passos: [
      A("Andonyo wakolapo?", "Como está o António?"),
      A("Okasi lokuvela", "Está doente"),
      A("Ene vwakolipo?", "Como estáis vós?"),
      D([
        { p: "yellen", u: "Andonyo wakolapo?", t: "Como está o António?" },
        { p: "hossy", u: "Okasi lokuvela.", t: "Está doente." },
        { p: "yellen", u: "Ene vwakolipo?", t: "E vós, como estais?" },
        { p: "hossy", u: "Kamwe ñgo, omãla vavela.", t: "Mais ou menos, as crianças estão doentes." },
      ]),
      E("Okasi lokuvela", "Está doente", ["Está bem", "Está doente", "Está com fome"], 1),
      TUP("Ene vwakolipo?", ["Como estás?", "Como estáis vós?", "Onde vais?"], 1),
      F("Okasi lokuvela", "Está doente"),
    ],
  },
  {
    id: "m1u1s6",
    titulo: "Reencontro depois de tempo",
    personagens: ["kwendi", "otchali"],
    passos: [
      A("Wakolopo", "Como estás", "Emprega-se ao reencontrar alguém depois de muito tempo."),
      A("Kamwe ñgo, omãla vavela", "Mais ou menos, as crianças estão doentes"),
      D([
        { p: "otchali", u: "Wakolopo, Kwendi!", t: "Como estás, Kwendi! (depois de tanto tempo)" },
        { p: "kwendi", u: "Ndakolapo ciwa, ndapandula.", t: "Estou bem, obrigado." },
      ]),
      TPU("As crianças estão doentes", ["Omãla vavela", "Okasi lokuvela", "Ame ndakolapo"], 0),
      M("Monta: “Estou bem, obrigado”", "Ndakolapo ciwa ndapandula"),
      F("Wakolopo, Kwendi!", "Como estás, Kwendi!"),
    ],
  },
  {
    id: "m1u1s7",
    titulo: "Diálogo: Kwendi e Otchali",
    personagens: ["kwendi", "otchali"],
    passos: [
      D([
        { p: "kwendi", u: "Ove helye?", t: "Como te chamas?" },
        { p: "otchali", u: "Ame Otchali. Ove wakolapo?", t: "Eu sou a Otchali. E tu, como estás?" },
        { p: "kwendi", u: "Ame ndakolapo ciwa. Wosalapo?", t: "Estou bem. Como passou o dia?" },
        { p: "otchali", u: "Ndosalapo ciwa, ndapandula.", t: "Passei bem, obrigada." },
        { p: "kwendi", u: "Kalapo ciwa!", t: "Fica bem!" },
      ]),
      E("Ove helye?", "Como te chamas?", ["Como estás?", "Como te chamas?", "Onde vais?"], 1),
      TUP("Ndosalapo ciwa", ["Estou bem", "Passei bem o dia", "Boa noite"], 1),
      M("Traduz: “Fica bem”", "Kalapo ciwa"),
      F("Ndosalapo ciwa, ndapandula", "Passei bem, obrigada"),
    ],
  },
  {
    id: "m1u1s8",
    titulo: "Conversação I — Ohango I",
    personagens: ["chac", "kapit"],
    passos: [
      A("Kalunga!", "Bom dia!"),
      A("Kuku", "Bom dia (resposta)"),
      A("Ove helye?", "Quem és tu?"),
      A("K'imbo lyeve kupi?", "Donde és?"),
      A("Ise yove helye?", "Quem é o seu pai?"),
      A("Ina yove?", "A sua mãe?"),
      A("Pi acitiwila?", "Onde nasceu?"),
      D([
        { p: "chac", u: "Kalunga!", t: "Bom dia!" },
        { p: "kapit", u: "Kuku.", t: "Bom dia." },
        { p: "chac", u: "Ove helye?", t: "Quem és tu?" },
        { p: "kapit", u: "Ame, Kapitango.", t: "Sou o Kapitango." },
        { p: "kapit", u: "Ovevo ove helye?", t: "Também, quem és tu?" },
        { p: "chac", u: "Ame, Chacusanga.", t: "Eu sou o Chacusanga." },
        { p: "kapit", u: "K'imbo lyeve kupi?", t: "Donde és?" },
        { p: "chac", u: "Ame Ndumbalundu.", t: "Eu sou do Bailundo." },
        { p: "kapit", u: "Ise yove helye?", t: "Quem é o seu pai?" },
        { p: "chac", u: "Ise yange Mbatolomeu.", t: "O meu pai é o Bartolomeu." },
        { p: "kapit", u: "Ina yove?", t: "A sua mãe?" },
        { p: "chac", u: "Ina yange Salomé.", t: "A minha mãe é a Salomé." },
        { p: "kapit", u: "Ina yove pi acitiwila?", t: "Onde nasceu a sua mãe?" },
        { p: "chac", u: "Ina yange wacitiwila ko Mbaka.", t: "A minha mãe nasceu em Benguela." },
        { p: "chac", u: "Ndapandula calwa.", t: "Muito obrigado." },
      ]),
      E("K'imbo lyeve kupi?", "Donde és?", ["Onde vais?", "Donde és?", "Quantos anos tens?"], 1),
      TPU("Sou o Kapitango", ["Ame, Kapitango", "Ove Kapitango", "Ina Kapitango"], 0),
      TUP("Ise yange Mbatolomeu", ["O meu pai é o Bartolomeu", "A minha mãe é a Salomé", "Sou do Bailundo"], 0),
      M("Traduz: “Donde és?”", "K'imbo lyeve kupi"),
      W("Escreve: “Bom dia!”", "Kalunga"),
      F("Ame Ndumbalundu", "Eu sou do Bailundo"),
    ],
  },
  {
    id: "m1u1s9",
    titulo: "Conversação II — Ohango II",
    personagens: ["chac", "kapit"],
    passos: [
      A("Helye u?", "Quem é este?"),
      A("U ekamba lyange", "Este é meu amigo"),
      A("K'imbo lyahe kupi", "Donde é ele?"),
      A("Eye Ukwima", "Ele é do Kuima"),
      A("Wacitiwila vongelenge", "Nasceu no Guerengue"),
      A("Wacitiwa vulima upi?", "Em que ano nasceu?"),
      A("Wacitiwa vulima wolohulukãyi vivali", "Ele nasceu em 2000"),
      D([
        { p: "chac", u: "Helye u?", t: "Quem é este?" },
        { p: "kapit", u: "U ekamba lyange.", t: "Este é meu amigo." },
        { p: "chac", u: "K'imbo lyahe kupi?", t: "Donde é?" },
        { p: "kapit", u: "Eye Ukwima.", t: "Ele é do Kuima." },
        { p: "chac", u: "Pi acitiwila?", t: "Onde nasceu?" },
        { p: "kapit", u: "Wacitiwila vongelenge.", t: "Nasceu no Guerengue." },
        { p: "chac", u: "Wacitiwa vulima upi?", t: "Em que ano nasceu?" },
        { p: "kapit", u: "Wacitiwa vulima wolohulukãyi vivali.", t: "Ele nasceu em 2000." },
      ]),
      E("Helye u?", "Quem é este?", ["Quem és tu?", "Quem é este?", "Onde vais?"], 1),
      TPU("Ele é do Kuima", ["Eye Ukwima", "Ame Ndumbalundu", "Ise yange"], 0),
      TUP("Wacitiwila vongelenge", ["Nasceu no Guerengue", "Vai ao mercado", "Está em casa"], 0),
      M("Traduz: “Este é meu amigo”", "U ekamba lyange"),
      W("Escreve em Umbundu: “Em que ano nasceu?”", "Wacitiwa vulima upi"),
      F("U ekamba lyange", "Este é meu amigo"),
    ],
  },
];

// -------- U2 · De manhã (Lomele) ------------------------------------------

const U2: Licao[] = [
  {
    id: "m1u2s1",
    titulo: "O sol nasce",
    personagens: ["kwendi", "suzana"],
    passos: [
      A("Ekumbi", "O sol"),
      A("Ekumbi likasi l'okutunda", "O sol está a nascer"),
      A("Pasuki!", "Acordem!"),
      D([
        { p: "suzana", u: "Pasuki! Ekumbi likasi l'okutunda.", t: "Acordem! O sol está a nascer." },
        { p: "kwendi", u: "Oco, tuende.", t: "Está bem, vamos." },
      ]),
      E("Ekumbi", "O sol", ["A lua", "O sol", "A noite"], 1),
      TPU("Acordem!", ["Pasuki!", "Tuende!", "Ndakolapo!"], 0),
      F("Ekumbi likasi l'okutunda", "O sol está a nascer"),
    ],
  },
  {
    id: "m1u2s2",
    titulo: "Já amanheceu!",
    personagens: ["kwendi", "kiame"],
    passos: [
      A("Ekumbi lyatunda ale?", "O sol já saiu?"),
      A("Kwac'ale!", "Já amanheceu!"),
      D([
        { p: "kwendi", u: "Ekumbi lyatunda ale?", t: "O sol já saiu?" },
        { p: "kiame", u: "Kwac'ale!", t: "Já amanheceu!" },
      ]),
      TUP("Kwac'ale!", ["Boa noite", "Já amanheceu!", "Vai bem"], 1),
      M("Traduz: “O sol já saiu?”", "Ekumbi lyatunda ale"),
      F("Kwac'ale!", "Já amanheceu!"),
    ],
  },
  {
    id: "m1u2s3",
    titulo: "Como passaste a noite?",
    personagens: ["yellen", "hossy"],
    passos: [
      A("Walali?", "Como passaste a noite?"),
      A("Twalale ciwa", "Passámos bem a noite"),
      D([
        { p: "yellen", u: "Walali?", t: "Como passaste a noite?" },
        { p: "hossy", u: "Twalale ciwa.", t: "Passámos bem." },
      ]),
      E("Twalale ciwa", "Passámos bem a noite", ["Estou doente", "Passámos bem a noite", "Boa manhã"], 1),
      TPU("Como passaste a noite?", ["Walali?", "Wakolapo?", "Pi enda?"], 0),
      F("Twalale ciwa", "Passámos bem a noite"),
    ],
  },
  {
    id: "m1u2s4",
    titulo: "Onde vamos? À escola",
    personagens: ["kwendi", "otchali"],
    passos: [
      A("Pi wendi omele?", "Onde vais esta manhã?"),
      A("Twenda kosikola", "Vamos à escola"),
      D([
        { p: "kwendi", u: "Pi wendi omele?", t: "Onde vais esta manhã?" },
        { p: "otchali", u: "Twenda kosikola.", t: "Vamos à escola." },
      ]),
      TUP("Twenda kosikola", ["Vamos ao mercado", "Vamos à escola", "Vamos a casa"], 1),
      M("Diz: “Onde vais esta manhã?”", "Pi wendi omele"),
      F("Twenda kosikola", "Vamos à escola"),
    ],
  },
  {
    id: "m1u2s5",
    titulo: "Temos fome, não temos comida",
    personagens: ["kwendi", "kiame"],
    passos: [
      A("Vukweti ongawu?", "Tendes vós pequeno-almoço?"),
      A("Katukwete", "Não temos"),
      A("Wendi onjala?", "Tens fome?"),
      A("Katukwete cokulya", "Não temos o que comer"),
      D([
        { p: "kiame", u: "Vukweti ongawu?", t: "Tendes pequeno-almoço?" },
        { p: "kwendi", u: "Katukwete.", t: "Não temos." },
        { p: "kiame", u: "Wendi onjala?", t: "Tens fome?" },
        { p: "kwendi", u: "Katukwete cokulya.", t: "Não temos o que comer." },
      ]),
      E("Onjala", "Fome", ["Água", "Fome", "Sonho"], 1),
      TPU("Não temos", ["Katukwete", "Ndikwete", "Tuende"], 0),
      F("Katukwete cokulya", "Não temos o que comer"),
    ],
  },
  {
    id: "m1u2s6",
    titulo: "Buscar água na fonte",
    personagens: ["suzana", "kwendi"],
    passos: [
      A("Pasuki vukatapi ovava", "Acordem para carretarem água"),
      A("Onjombo ya Njambela", "Fonte da Jambela"),
      A("Tucilwa", "Vamos atrasar"),
      D([
        { p: "suzana", u: "Pasuki vukatapi ovava.", t: "Acordem para carretarem água." },
        { p: "kwendi", u: "Pi tukatapa?", t: "Onde carretaremos?" },
        { p: "suzana", u: "Vukatapi ponjombo ya Njambela.", t: "Carretareis na fonte da Jambela." },
        { p: "kwendi", u: "Tucilwa, tuende.", t: "Vamos atrasar, vamos." },
      ]),
      TUP("Ovava", ["Fogo", "Água", "Sonho"], 1),
      M("Traduz: “Vamos atrasar”", "Tucilwa"),
      F("Onjombo ya Njambela", "Fonte da Jambela"),
    ],
  },
  {
    id: "m1u2s7",
    titulo: "Diálogo: Yellen e Hossy",
    personagens: ["yellen", "hossy"],
    passos: [
      D([
        { p: "yellen", u: "Pasuki, Hossy! Kwac'ale.", t: "Acorda, Hossy! Já amanheceu." },
        { p: "hossy", u: "Walali, Yellen?", t: "Como passaste a noite, Yellen?" },
        { p: "yellen", u: "Twalale ciwa. Twenda kosikola?", t: "Passámos bem. Vamos à escola?" },
        { p: "hossy", u: "Oco, tuende. Liponga ocowendi.", t: "Está bem, vamos. Preparem-se para ir." },
      ]),
      E("Kwac'ale", "Já amanheceu!", ["Vamos", "Bom dia", "Já amanheceu!"], 2),
      TUP("Liponga ocowendi", ["Estou doente", "Preparem-se para ir", "Vamos à escola"], 1),
      M("Traduz: “Vamos à escola”", "Twenda kosikola"),
      F("Twenda kosikola?", "Vamos à escola?"),
    ],
  },
  {
    id: "m1u2s8",
    titulo: "Família em casa",
    personagens: ["kwendi", "otchali"],
    passos: [
      A("Ise", "Pai"),
      A("Ina", "Mãe"),
      A("Ocimumba", "Sobrinho"),
      A("Ise yange", "O meu pai"),
      A("Ina yange", "A minha mãe"),
      A("Ocimumba cange", "O meu sobrinho"),
      D([
        { p: "kwendi", u: "Ise yange Mbatolomeu.", t: "O meu pai é o Bartolomeu." },
        { p: "otchali", u: "Ina yange Salomé.", t: "A minha mãe é a Salomé." },
        { p: "kwendi", u: "Eci ocimumba cange.", t: "Este é o meu sobrinho." },
      ]),
      E("Ina yange", "A minha mãe", ["O meu pai", "A minha mãe", "O meu sobrinho"], 1),
      TPU("O meu pai", ["Ise yange", "Ina yange", "Ocimumba cange"], 0),
      TUP("Ocimumba cange", ["O meu sobrinho", "A minha sobrinha", "Meu pai"], 0),
      M("Monta: “A minha mãe é a Salomé”", "Ina yange Salomé"),
      F("Ise yange Mbatolomeu", "O meu pai é o Bartolomeu"),
    ],
  },
];

// -------- U3 · Na rua (Vokololo) ------------------------------------------

const U3: Licao[] = [
  {
    id: "m1u3s1",
    titulo: "Pi enda? — Onde vais?",
    personagens: ["kwendi", "otchali"],
    passos: [
      A("Pi", "Onde", "Interrogativo, colocado antes do verbo."),
      A("Pi enda?", "Onde vais?"),
      D([
        { p: "kwendi", u: "Wakolapo?", t: "Como estás?" },
        { p: "otchali", u: "Ndakolapo ciwa. Ove wakolapovo?", t: "Estou bem. E tu?" },
        { p: "kwendi", u: "Ndakolapo ciwa. Pi enda?", t: "Estou bem. Onde vais?" },
      ]),
      E("Pi enda?", "Onde vais?", ["Onde vais?", "Onde estudas?", "Quantos anos tens?"], 0),
      TPU("Onde vais?", ["Pi enda?", "Pi ontangela?", "Wakolapo?"], 0),
      F("Pi enda?", "Onde vais?"),
    ],
  },
  {
    id: "m1u3s2",
    titulo: "Vou à escola",
    personagens: ["kwendi", "otchali"],
    passos: [
      A("Ndenda", "Vou"),
      A("Ndenda kosikola", "Vou à escola"),
      D([
        { p: "otchali", u: "Pi enda?", t: "Onde vais?" },
        { p: "kwendi", u: "Ndenda kosikola.", t: "Vou à escola." },
      ]),
      TUP("Ndenda kosikola", ["Vou ao mercado", "Vou à escola", "Vou a casa"], 1),
      M("Diz: “Vou à escola”", "Ndenda kosikola"),
      F("Ndenda kosikola", "Vou à escola"),
    ],
  },
  {
    id: "m1u3s3",
    titulo: "Onde estudas?",
    personagens: ["yellen", "hossy"],
    passos: [
      A("Pi ontangela?", "Onde estudas?"),
      D([
        { p: "yellen", u: "Pi ontangela?", t: "Onde estudas?" },
        { p: "hossy", u: "Nditangela Ko Ngola Kanini.", t: "Estudo na Escola Ngola Kanini." },
      ]),
      E("Pi ontangela?", "Onde estudas?", ["Como estás?", "Onde estudas?", "Onde vais?"], 1),
      TPU("Onde estudas?", ["Pi enda?", "Pi ontangela?", "Wakolapo?"], 1),
      F("Pi ontangela?", "Onde estudas?"),
    ],
  },
  {
    id: "m1u3s4",
    titulo: "Escola Ngola Kanini",
    personagens: ["kwendi", "otchali"],
    passos: [
      A("Nditangela", "Estudo"),
      A("Ko Ngola Kanini", "Na Escola Ngola Kanini"),
      A("Nditangela Ko Ngola Kanini", "Estudo na Escola Ngola Kanini"),
      TUP("Nditangela Ko Ngola Kanini", [
        "Vou à escola",
        "Estudo na Escola Ngola Kanini",
        "Sou o Kanini",
      ], 1),
      M("Monta a frase: “Estudo na Escola Ngola Kanini”", "Nditangela Ko Ngola Kanini"),
      F("Nditangela Ko Ngola Kanini", "Estudo na Escola Ngola Kanini"),
    ],
  },
  {
    id: "m1u3s5",
    titulo: "Quantos professores tens?",
    personagens: ["kwendi", "otchali"],
    passos: [
      A("Alongisi vañgami okwete?", "Quantos professores tens?"),
      A("Ndikwete ekwi l'epandu kalongisi", "Tenho dezasseis professores"),
      D([
        { p: "kwendi", u: "Alongisi vañgami okwete?", t: "Quantos professores tens?" },
        { p: "otchali", u: "Ndikwete ekwi l'epandu kalongisi.", t: "Tenho dezasseis professores." },
      ]),
      TUP("Ndikwete ekwi l'epandu kalongisi", [
        "Tenho três professores",
        "Tenho dezasseis professores",
        "Não tenho professores",
      ], 1),
      M("Traduz: “Quantos professores tens?”", "Alongisi vañgami okwete"),
      F("Alongisi vañgami okwete?", "Quantos professores tens?"),
    ],
  },
  {
    id: "m1u3s6",
    titulo: "Quantos anos tens?",
    personagens: ["yellen", "hossy"],
    passos: [
      A("Aliima añgami okwete?", "Quantos anos tens?"),
      A("Ndikwete akwi atatu kalima", "Tenho trinta anos"),
      D([
        { p: "yellen", u: "Aliima añgami okwete?", t: "Quantos anos tens?" },
        { p: "hossy", u: "Ndikwete akwi atatu kalima.", t: "Tenho trinta anos." },
      ]),
      E("Aliima añgami okwete?", "Quantos anos tens?", [
        "Onde vais?",
        "Quantos anos tens?",
        "Quantos professores tens?",
      ], 1),
      W("Escreve em Umbundu: “Quantos anos tens?”", "Aliima añgami okwete"),
      F("Ndikwete akwi atatu kalima", "Tenho trinta anos"),
    ],
  },
  {
    id: "m1u3s7",
    titulo: "Diálogo: Kwendi e Otchali",
    personagens: ["kwendi", "otchali"],
    passos: [
      D([
        { p: "kwendi", u: "Wakolapo, Otchali?", t: "Como estás, Otchali?" },
        { p: "otchali", u: "Ndakolapo ciwa. Pi enda?", t: "Estou bem. Onde vais?" },
        { p: "kwendi", u: "Ndenda kosikola. Pi ontangela ove?", t: "Vou à escola. E tu, onde estudas?" },
        { p: "otchali", u: "Nditangela Ko Ngola Kanini.", t: "Estudo na Escola Ngola Kanini." },
        { p: "kwendi", u: "Onjo yene pi yikasi?", t: "Onde fica a vossa casa?" },
        { p: "otchali", u: "Onjo yetu yikasi Ko Samba.", t: "A nossa casa fica no Samba." },
      ]),
      E("Onjo yene pi yikasi?", "Onde fica a vossa casa?", [
        "Como estás?",
        "Onde fica a vossa casa?",
        "Onde vais?",
      ], 1),
      TUP("Onjo yetu yikasi Ko Samba", [
        "A nossa casa fica no Samba",
        "A minha família",
        "Vou à escola",
      ], 0),
      M("Traduz: “Onde fica a vossa casa?”", "Onjo yene pi yikasi"),
      F("Onjo yene pi yikasi?", "Onde fica a vossa casa?"),
    ],
  },
];

// -------- U4 · No mercado (Pocitanda) -------------------------------------

const U4: Licao[] = [
  {
    id: "m1u4s1",
    titulo: "Ciñgami? — Quanto é?",
    personagens: ["laura", "cile"],
    passos: [
      A("Ciñgami?", "Quanto é?"),
      D([
        { p: "laura", u: "Ciñgami?", t: "Quanto é?" },
        { p: "cile", u: "Akwi avali kolokwanja.", t: "Vinte kwanzas." },
      ]),
      E("Ciñgami?", "Quanto é?", ["Quanto é?", "É caro!", "Onde vais?"], 0),
      TPU("Quanto é?", ["Ciñgami?", "Wakolapo?", "Pi enda?"], 0),
      F("Ciñgami?", "Quanto é?"),
    ],
  },
  {
    id: "m1u4s2",
    titulo: "Vinte kwanzas",
    personagens: ["laura", "cile"],
    passos: [
      A("Akwi avali", "Vinte"),
      A("Kolokwanja", "Kwanzas"),
      A("Akwi avali kolokwanja", "Vinte kwanzas"),
      TUP("Akwi avali kolokwanja", [
        "Dez kwanzas",
        "Vinte kwanzas",
        "Cem kwanzas",
      ], 1),
      M("Monta: “Vinte kwanzas”", "Akwi avali kolokwanja"),
      F("Akwi avali kolokwanja", "Vinte kwanzas"),
    ],
  },
  {
    id: "m1u4s3",
    titulo: "É caro!",
    personagens: ["laura", "cile"],
    passos: [
      A("Catila!", "É caro!"),
      A("Oco mwele oco!", "É mesmo assim!"),
      D([
        { p: "laura", u: "Catila!", t: "É caro!" },
        { p: "cile", u: "Oco mwele oco!", t: "É mesmo assim!" },
      ]),
      E("Catila!", "É caro!", ["É caro!", "Está bem", "Não tem"], 0),
      TPU("É mesmo assim!", ["Oco mwele oco!", "Catila!", "Kalapo ciwa!"], 0),
      F("Catila!", "É caro!"),
    ],
  },
  {
    id: "m1u4s4",
    titulo: "Quanto é o fuba?",
    personagens: ["laura", "cile"],
    passos: [
      A("Osema yikasi ciñgami?", "Quanto é a fuba?"),
      A("Oneka yikasi akwi akwala kolokwanja", "O kilo está a quarenta kwanzas"),
      D([
        { p: "laura", u: "Osema yikasi ciñgami?", t: "Quanto é a fuba?" },
        { p: "cile", u: "Oneka yikasi akwi akwala kolokwanja.", t: "O kilo está a quarenta kwanzas." },
        { p: "laura", u: "Silandi vali.", t: "Não compro mais." },
      ]),
      TUP("Silandi vali", ["Compro tudo", "Não compro mais", "Quero mais"], 1),
      M("Traduz: “Quanto é a fuba?”", "Osema yikasi ciñgami"),
      F("Osema yikasi ciñgami?", "Quanto é a fuba?"),
    ],
  },
  {
    id: "m1u4s5",
    titulo: "Comprar batata-doce",
    personagens: ["laura", "cile"],
    passos: [
      A("Nye olanda?", "O que é que compras?"),
      A("Ndilanda ñgo ocitina", "Compro somente batata-doce"),
      A("Omumu yocitina yikasi ekwi", "O monte de batata-doce está a dez"),
      D([
        { p: "cile", u: "Nye olanda?", t: "O que é que compras?" },
        { p: "laura", u: "Ndilanda ñgo ocitina.", t: "Compro somente batata-doce." },
        { p: "cile", u: "Omumu yocitina yikasi ekwi.", t: "O monte está a dez." },
        { p: "laura", u: "Nihe omumu eyi.", t: "Dá-me este monte." },
      ]),
      E("Nye olanda?", "O que é que compras?", [
        "Onde vais?",
        "O que é que compras?",
        "Quantos anos tens?",
      ], 1),
      TPU("Dá-me este monte", ["Nihe omumu eyi", "Ndilanda ocitina", "Catila!"], 0),
      F("Ndilanda ñgo ocitina", "Compro somente batata-doce"),
    ],
  },
  {
    id: "m1u4s6",
    titulo: "Não compro mais",
    personagens: ["laura", "cile"],
    passos: [
      A("Silandi vali", "Não compro mais"),
      A("Helye okasi l'okulandisa atonono?", "Quem está a vender batata-rena?"),
      A("Lomwe", "Ninguém"),
      D([
        { p: "laura", u: "Helye okasi l'okulandisa atonono?", t: "Quem está a vender batata-rena?" },
        { p: "cile", u: "Lomwe.", t: "Ninguém." },
        { p: "laura", u: "Silandi vali. Ndapandula.", t: "Não compro mais. Obrigada." },
      ]),
      TUP("Lomwe", ["Alguém", "Ninguém", "Todos"], 1),
      M("Traduz: “Não compro mais”", "Silandi vali"),
      F("Silandi vali", "Não compro mais"),
    ],
  },
  {
    id: "m1u4s7",
    titulo: "Diálogo: Yellen e Hossy",
    personagens: ["yellen", "hossy"],
    passos: [
      D([
        { p: "yellen", u: "Wakolapo, Hossy?", t: "Como estás, Hossy?" },
        { p: "hossy", u: "Ndakolapo ciwa. Pi enda?", t: "Estou bem. Onde vais?" },
        { p: "yellen", u: "Ndenda kocitanda.", t: "Vou ao mercado." },
        { p: "hossy", u: "Nye olanda?", t: "O que é que compras?" },
        { p: "yellen", u: "Ndilanda ñgo ocitina.", t: "Compro somente batata-doce." },
        { p: "hossy", u: "Ciñgami?", t: "Quanto é?" },
        { p: "yellen", u: "Akwi avali kolokwanja. Catila!", t: "Vinte kwanzas. É caro!" },
      ]),
      E("Nye olanda?", "O que é que compras?", [
        "Como estás?",
        "O que é que compras?",
        "Onde vais?",
      ], 1),
      TUP("Catila!", ["É barato!", "É caro!", "Vai bem!"], 1),
      M("Diz: “Vou ao mercado”", "Ndenda kocitanda"),
      F("Ciñgami? Catila!", "Quanto é? É caro!"),
    ],
  },
];

// -------- U5 · Advérbios Pi/Kupi + revisão --------------------------------

const U5: Licao[] = [
  {
    id: "m1u5s1",
    titulo: "Pi (onde) — antes do verbo",
    personagens: ["narrador", "kwendi", "otchali"],
    passos: [
      A("Pi", "Onde", "Interrogativo. Vem antes do verbo — o sujeito subentende-se."),
      A("Pi okasi?", "Onde estás?"),
      A("Pi enda?", "Onde vais?"),
      A("Pi endanda?", "Onde tens ido?"),
      D([
        { p: "kwendi", u: "Pi okasi, Otchali?", t: "Onde estás, Otchali?" },
        { p: "otchali", u: "Ndakolapo kosikola.", t: "Estou na escola." },
      ]),
      TUP("Pi enda?", ["Onde vais?", "Vou à escola", "Como estás?"], 0),
      M("Traduz: “Onde estás?”", "Pi okasi"),
      F("Pi enda?", "Onde vais?"),
    ],
  },
  {
    id: "m1u5s2",
    titulo: "Kupi (aonde) — depois do verbo",
    personagens: ["narrador"],
    passos: [
      A("Kupi", "Aonde", "Colocado depois do verbo. Indica movimento."),
      A("Twenda kupi?", "Aonde vamos?"),
      A("Tukalanda kupi?", "Aonde compraremos?"),
      A("Ndikakala kupi", "Aonde estarei"),
      E("Twenda kupi?", "Aonde vamos?", [
        "Onde estás?",
        "Aonde vamos?",
        "Quanto é?",
      ], 1),
      TPU("Aonde compraremos?", [
        "Tukalanda kupi?",
        "Pi enda?",
        "Twenda kosikola",
      ], 0),
      F("Twenda kupi?", "Aonde vamos?"),
    ],
  },
  {
    id: "m1u5s3",
    titulo: "Twenda kupi? — Aonde vamos?",
    personagens: ["kwendi", "otchali"],
    passos: [
      A("Twenda", "Vamos"),
      A("Twenda kupi?", "Aonde vamos?"),
      D([
        { p: "kwendi", u: "Twenda kupi?", t: "Aonde vamos?" },
        { p: "otchali", u: "Twenda kocitanda.", t: "Vamos ao mercado." },
      ]),
      TUP("Twenda kocitanda", ["Vamos à escola", "Vamos ao mercado", "Vamos a casa"], 1),
      M("Monta: “Aonde vamos?”", "Twenda kupi"),
      F("Twenda kupi?", "Aonde vamos?"),
    ],
  },
  {
    id: "m1u5s4",
    titulo: "Ndikakala kupi — aonde estarei",
    personagens: ["narrador"],
    passos: [
      A("Ndikakala", "Estarei"),
      A("Ndikakala kupi", "Aonde estarei"),
      A("Ndikakala konjo", "Estarei em casa"),
      TUP("Ndikakala konjo", ["Estarei em casa", "Vou à escola", "Onde vais?"], 0),
      M("Traduz: “Aonde estarei”", "Ndikakala kupi"),
      F("Ndikakala konjo", "Estarei em casa"),
    ],
  },
  {
    id: "m1u5s5",
    titulo: "Vocabulário do dia-a-dia",
    personagens: ["narrador"],
    passos: [
      A("Ongeva", "Saudade", "Ame ndikwete oñgi — Tenho saudade."),
      A("Onjoyi", "Sonho", "Lalapo ciwa — Durma bem."),
      A("Ocali", "Caridade"),
      A("Ocili", "Verdade", "Ocili mwele — É mesmo verdade."),
      A("Uhembi", "Mentira", "Uhembiko — Não é mentira."),
      A("Ndapandula calwa", "Muito obrigado"),
      A("Kwendepo ciwa", "Vai bem"),
      E("Ocili", "Verdade", ["Mentira", "Verdade", "Saudade"], 1),
      TUP("Ondapandula calwa", [
        "Muito obrigado",
        "Vai bem",
        "Estou doente",
      ], 0),
      M("Diz: “Vai bem”", "Kwendepo ciwa"),
      F("Ndapandula calwa", "Muito obrigado"),
    ],
  },
  {
    id: "m1u5s6",
    titulo: "Revisão do módulo",
    personagens: ["kwendi", "otchali", "yellen", "hossy"],
    passos: [
      D([
        { p: "kwendi", u: "Wakolapo, Otchali?", t: "Como estás, Otchali?" },
        { p: "otchali", u: "Ndakolapo ciwa. Pi enda?", t: "Estou bem. Onde vais?" },
        { p: "kwendi", u: "Ndenda kocitanda.", t: "Vou ao mercado." },
        { p: "yellen", u: "Twenda kupi, Hossy?", t: "Aonde vamos, Hossy?" },
        { p: "hossy", u: "Twenda kosikola.", t: "Vamos à escola." },
      ]),
      E("Wakolapo?", "Como estás?", ["Como estás?", "Quanto é?", "Aonde vamos?"], 0),
      TUP("Twenda kosikola", ["Vou ao mercado", "Vamos à escola", "Estou doente"], 1),
      TPU("Onde fica a vossa casa?", [
        "Onjo yene pi yikasi?",
        "Ciñgami?",
        "Walali?",
      ], 0),
      M("Monta: “Estou bem, obrigado”", "Ndakolapo ciwa ndapandula"),
      W("Escreve em Umbundu: “Quanto é?”", "Ciñgami"),
      F("Ndakolapo ciwa, ndapandula", "Estou bem, obrigado"),
    ],
  },
];

// -------- Export ----------------------------------------------------------

export const LICOES_M1: Record<string, Licao> = Object.fromEntries(
  [...U1, ...U2, ...U3, ...U4, ...U5].map((l) => [l.id, l]),
);

export function getLicao(id: string): Licao | undefined {
  return LICOES_M1[id];
}