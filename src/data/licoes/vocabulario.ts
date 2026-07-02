/**
 * Vocabulário unificado do Módulo 1.
 * Alimenta o popover "palavra tocável" que surge sempre que uma palavra
 * em Umbundu aparece em qualquer passo de uma lição.
 *
 * Fonte: livro de Umbundu — capítulos 1.1 (Identificação pessoal),
 * 1.2 (Lomele — de manhã), 1.3 (Vokololo — na rua),
 * 1.3 (Pocitanda — no mercado) + vocabulário e advérbios de lugar.
 */

export type EntradaVocab = {
  umbundu: string;
  pt: string;
  exemplo?: string;
};

export const VOCAB_M1: Record<string, EntradaVocab> = {
  // Saudações e identificação
  wakolapo: { umbundu: "Wakolapo?", pt: "Como estás?" },
  wakolelepo: { umbundu: "Wakolelepo", pt: "Bom dia / olá" },
  ndakolapo: { umbundu: "Ndakolapo ciwa", pt: "Estou bem", exemplo: "Ndakolapo ciwa — Estou bem" },
  ndakolelepo: { umbundu: "Ndakolelepo ciwa", pt: "Passei bem" },
  ndakolapomal: { umbundu: "Ame ndakolapo ciwa", pt: "Eu não estou bem" },
  wakolapovo: { umbundu: "Wakolapovo?", pt: "E tu, como estás?" },
  wosalapo: { umbundu: "Wosalapo?", pt: "Como passou o dia?" },
  ndosalapo: { umbundu: "Ndosalapo ciwa", pt: "Passei o dia bem" },
  ovehelye: { umbundu: "Ove helye?", pt: "Como te chamas?" },
  amekapoco: { umbundu: "Ame Kapoco", pt: "Eu sou o Kapoco" },
  hisepokamwe: { umbundu: "Hisepo kamwe", pt: "Mais ou menos" },
  andonyo: { umbundu: "Andonyo wakolapo?", pt: "Como está o António?" },
  okasilokuvela: { umbundu: "Okasi lokuvela", pt: "Está doente" },
  enevwakolipo: { umbundu: "Ene vwakolipo?", pt: "Como estáis vós?" },
  omalavavela: { umbundu: "Omala vavela", pt: "As crianças estão doentes" },

  // Personagens fixas (aparecem nos diálogos)
  ame: { umbundu: "Ame", pt: "Eu" },
  ove: { umbundu: "Ove", pt: "Tu" },

  // De manhã (Lomele)
  pasuki: { umbundu: "Pasuki!", pt: "Acordem!" },
  ekumbi: { umbundu: "Ekumbi", pt: "O sol" },
  ikasi: { umbundu: "likasi l'okutunda", pt: "está a nascer" },
  lyatunda: { umbundu: "Lyatunda ale?", pt: "Já saiu?" },
  kwacale: { umbundu: "Kwac'ale!", pt: "Já amanheceu!" },
  walali: { umbundu: "Walali?", pt: "Como passaste a noite?" },
  twalaleciwa: { umbundu: "Twalale ciwa", pt: "Passámos bem a noite" },
  piwendi: { umbundu: "Pi wendi omele?", pt: "Onde vais esta manhã?" },
  twendakosikola: { umbundu: "Twenda kosikola", pt: "Vamos à escola" },
  ongawu: { umbundu: "Ongawu?", pt: "Pequeno-almoço?" },
  katukwete: { umbundu: "Katukwete", pt: "Não temos" },
  onjala: { umbundu: "Onjala", pt: "Fome" },
  wendionjala: { umbundu: "Wendi onjala?", pt: "Tens fome?" },
  cokulya: { umbundu: "Cokulya", pt: "Comida" },
  ovava: { umbundu: "Ovava", pt: "Água" },
  onjombo: { umbundu: "Onjombo ya Njambela", pt: "Fonte da Jambela" },
  tucilwa: { umbundu: "Tucilwa", pt: "Vamos atrasar" },
  liponga: { umbundu: "Liponga ocowendi", pt: "Preparem-se para ir" },
  oco: { umbundu: "Oco", pt: "Está bem" },

  // Na rua (Vokololo)
  pienda: { umbundu: "Pi enda?", pt: "Onde vais?" },
  ndenda: { umbundu: "Ndenda kosikola", pt: "Vou à escola" },
  piontangela: { umbundu: "Pi ontangela?", pt: "Onde estudas?" },
  nditangela: { umbundu: "Nditangela Ko Ngola Kanini", pt: "Estudo na Escola Ngola Kanini" },
  alongisi: { umbundu: "Alongisi vañgami okwete?", pt: "Quantos professores tens?" },
  ekwilepandu: { umbundu: "Ndikwete ekwi l'epandu kalongisi", pt: "Tenho dezasseis professores" },
  aliima: { umbundu: "Aliima añgami okwete?", pt: "Quantos anos tens?" },
  ekwiatatu: { umbundu: "Ndikwete akwi atatu kalima", pt: "Tenho trinta anos" },
  onjoyene: { umbundu: "Onjo yene pi yikasi?", pt: "Onde fica a vossa casa?" },
  osanjala: { umbundu: "Osanjala yene yipi?", pt: "Qual é o vosso bairro?" },

  // Mercado (Pocitanda)
  cingami: { umbundu: "Ciñgami?", pt: "Quanto é?" },
  akwiavali: { umbundu: "Akwi avali kolokwanja", pt: "Vinte kwanzas" },
  catila: { umbundu: "Catila!", pt: "É caro!" },
  ocomwele: { umbundu: "Oco mwele oco!", pt: "É mesmo assim!" },
  osema: { umbundu: "Osema yikasi ciñgami?", pt: "Quanto é a fuba?" },
  akwialakwala: { umbundu: "Akwi akwala kolokwanja", pt: "Quarenta kwanzas o kilo" },
  silandivali: { umbundu: "Silandi vali", pt: "Não compro mais" },
  nyeolanda: { umbundu: "Nye olanda?", pt: "O que é que compras?" },
  ndilanda: { umbundu: "Ndilanda ñgo ocitina", pt: "Compro somente batata-doce" },
  omumu: { umbundu: "Omumu yocitina yikasi ekwi", pt: "O monte de batata-doce está a dez" },
  niheomumu: { umbundu: "Nihe omumu eyi", pt: "Dá-me este monte" },
  helyeokasi: { umbundu: "Helye okasi l'okulandisa atonono?", pt: "Quem está a vender batata-rena?" },
  lomwe: { umbundu: "Lomwe", pt: "Ninguém" },

  // Advérbios de lugar Pi / Kupi
  pi: { umbundu: "Pi", pt: "onde", nota: "Interrogativo antes do verbo — sujeito subentende-se", exemplo: "Pi enda? — Onde vais?" } as EntradaVocab,
  kupi: { umbundu: "Kupi", pt: "aonde", nota: "Colocado depois do verbo, indicando movimento", exemplo: "Twenda kupi? — Aonde vamos?" } as EntradaVocab,
  twendakupi: { umbundu: "Twenda kupi?", pt: "Aonde vamos?" },
  tukalanda: { umbundu: "Tukalanda kupi?", pt: "Aonde compraremos?" },
  ndikakala: { umbundu: "Ndikakala kupi", pt: "Aonde estarei" },

  // Vocabulário do dia-a-dia (fim da p. do vocabulário)
  onjoyi: { umbundu: "Onjoyi", pt: "Sonho" },
  ongeva: { umbundu: "Ongeva", pt: "Saudade" },
  ohenda: { umbundu: "Ohenda", pt: "Piedade" },
  onjuli: { umbundu: "Onjuli", pt: "Vencedor" },
  okufa: { umbundu: "Okufa", pt: "Morrer" },
  ocali: { umbundu: "Ocali", pt: "Caridade" },
  ocili: { umbundu: "Ocili", pt: "Verdade" },
  uhembi: { umbundu: "Uhembi", pt: "Mentira" },
  ondapandula: { umbundu: "Ndapandula calwa", pt: "Muito obrigado" },
  kwendepociwa: { umbundu: "Kwendepo ciwa", pt: "Vai bem" },
};

/** Localiza uma entrada por umbundu (case-insensitive, sem pontuação). */
export function encontrarNoVocab(umbundu: string): EntradaVocab | null {
  const chave = umbundu
    .toLowerCase()
    .replace(/[?!.,;:'"()]/g, "")
    .trim();
  for (const v of Object.values(VOCAB_M1)) {
    const alvo = v.umbundu
      .toLowerCase()
      .replace(/[?!.,;:'"()]/g, "")
      .trim();
    if (alvo === chave) return v;
  }
  return null;
}