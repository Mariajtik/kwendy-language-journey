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

  // ===== Expansão: Conversação I & II (Ohango I / II) =====
  kalunga: { umbundu: "Kalunga!", pt: "Bom dia!" },
  kuku: { umbundu: "Kuku", pt: "Bom dia (resposta)" },
  ovehelye2: { umbundu: "Ove helye?", pt: "Quem és tu?" },
  amekapt: { umbundu: "Ame, Kapitango", pt: "Sou o Kapitango" },
  ovevo: { umbundu: "Ovevo ove helye?", pt: "Também, quem és tu?" },
  chacusanga: { umbundu: "Ame, Chacusanga", pt: "Eu sou o Chacusanga" },
  kimbolyeve: { umbundu: "K'imbo lyeve kupi?", pt: "Donde és?" },
  ndumbalundu: { umbundu: "Ame Ndumbalundu", pt: "Eu sou do Bailundo" },
  iseyove: { umbundu: "Ise yove helye?", pt: "Quem é o seu pai?" },
  iseyange: { umbundu: "Ise yange", pt: "O meu pai" },
  inayove: { umbundu: "Ina yove?", pt: "A sua mãe?" },
  inayange: { umbundu: "Ina yange", pt: "A minha mãe" },
  piacitiwila: { umbundu: "Pi acitiwila?", pt: "Onde nasceu?" },
  wacitiwilambaka: { umbundu: "Wacitiwila ko Mbaka", pt: "Nasceu em Benguela" },
  umbakavo: { umbundu: "Umbakavo", pt: "Também é de Benguela" },
  helyeu: { umbundu: "Helye u?", pt: "Quem é este?" },
  uekamba: { umbundu: "U ekamba lyange", pt: "Este é meu amigo" },
  kimbolyahe: { umbundu: "K'imbo lyahe kupi", pt: "Donde é (ele)?" },
  eyeukwima: { umbundu: "Eye Ukwima", pt: "Ele é do Kuima" },
  wacitiwilavongelenge: { umbundu: "Wacitiwila vongelenge", pt: "Nasceu no Guerengue" },
  wacitiwavulima: { umbundu: "Wacitiwa vulima upi?", pt: "Em que ano nasceu?" },
  vulima2000: { umbundu: "Wacitiwa vulima wolohulukãyi vivali", pt: "Nasceu em 2000" },
  eye: { umbundu: "Eye", pt: "Ele/ela" },
  ekamba: { umbundu: "Ekamba", pt: "Amigo" },

  // ===== Família (possessivos) =====
  ise: { umbundu: "Ise", pt: "Pai" },
  ina: { umbundu: "Ina", pt: "Mãe" },
  ocimumba: { umbundu: "Ocimumba", pt: "Sobrinho" },
  ocepwa: { umbundu: "Ocepwa", pt: "Sobrinha" },
  namale: { umbundu: "Namãle", pt: "Madrasta" },
  pamale: { umbundu: "Pamãle", pt: "Padrasto" },
  ukayi: { umbundu: "Ukãyi", pt: "Mulher / esposa" },
  ulume: { umbundu: "Ulume", pt: "Homem / marido" },
  manjange: { umbundu: "Manjange", pt: "Meu irmão" },
  manjahe: { umbundu: "Manjahe ukãyi", pt: "Irmã dele" },
  manjetu: { umbundu: "Manjetu ukãyi", pt: "Nossa irmã" },
  manjene: { umbundu: "Manjene ukãyi", pt: "Vossa irmã" },
  manjavo: { umbundu: "Manjavo ulume", pt: "Irmão deles" },
  epalume: { umbundu: "Epalume lyange", pt: "Meu primo" },
  ndatembo: { umbundu: "Ndatembo yange", pt: "Meu sogro(a)" },
  nekulu: { umbundu: "Nekulu yange", pt: "Meu neto" },
  yange: { umbundu: "yange", pt: "meu / minha", nota: "Sufixo possessivo 1ª pessoa" } as EntradaVocab,
  yove: { umbundu: "yove", pt: "teu / tua", nota: "Sufixo possessivo 2ª pessoa" } as EntradaVocab,
  yahe: { umbundu: "yahe", pt: "dele / dela" } as EntradaVocab,
  yetu: { umbundu: "yetu", pt: "nosso / nossa" } as EntradaVocab,
  yene: { umbundu: "yene", pt: "vosso / vossa" } as EntradaVocab,
  yavo: { umbundu: "yavo", pt: "deles / delas" } as EntradaVocab,

  // ===== Meses do ano =====
  susu: { umbundu: "Susu", pt: "Janeiro" },
  kayovo: { umbundu: "Kayovo", pt: "Fevereiro" },
  elombo: { umbundu: "Elombo", pt: "Março" },
  kupupu: { umbundu: "Kupupu", pt: "Abril" },
  kupemba: { umbundu: "Kupemba", pt: "Maio" },
  kavambi: { umbundu: "Kavambi", pt: "Junho" },
  evambilinene: { umbundu: "Evambi-linene", pt: "Julho" },
  kanyenye: { umbundu: "Kanyenye", pt: "Agosto" },
  enyenyelinene: { umbundu: "Enyenye linene", pt: "Setembro" },
  mbalavipembe: { umbundu: "Mbala vipembe", pt: "Outubro" },
  kuvala: { umbundu: "Kuvala", pt: "Novembro" },
  cembanima: { umbundu: "Cembanima", pt: "Dezembro" },

  // ===== Comida & mercado =====
  osema2: { umbundu: "Osema", pt: "Fuba" },
  ocipoke: { umbundu: "Ocipoke", pt: "Feijão" },
  ocitina: { umbundu: "Ocitina", pt: "Batata-doce" },
  ocitinacokuyoka: { umbundu: "Ocitina cokuyoka", pt: "Batata-doce assada" },
  ocitinacokuteleka: { umbundu: "Ocitina cokuteleka", pt: "Batata-doce cozida" },
  onjevo: { umbundu: "Onjevo", pt: "Caça" },
  okuyeva: { umbundu: "Okuyeva", pt: "Caçar" },
  situyokuyoka: { umbundu: "Ositu yokuyoka", pt: "Carne assada" },
  situyokuteleka: { umbundu: "Ositu yokuteleka", pt: "Carne cozida" },
  situyongulu: { umbundu: "Ositu yongulu", pt: "Carne de porco" },
  situyongombe: { umbundu: "Ositu yongombe", pt: "Carne de vaca" },
  ondimba: { umbundu: "Ondimba", pt: "Coelho" },
  owa: { umbundu: "Owa", pt: "Cogumelo" },
  osanji: { umbundu: "Osanji", pt: "Galinha" },
  osanjiyutenda: { umbundu: "Osanji yutenda", pt: "Frango" },
  ombisi: { umbundu: "Ombisi", pt: "Peixe" },
  owiki: { umbundu: "Owiki", pt: "Mel" },
  owongo: { umbundu: "Owoñgo", pt: "Cérebro" },
  usole: { umbundu: "Usole", pt: "Molho" },
  ulela: { umbundu: "Ulela", pt: "Óleo" },
  okukanga: { umbundu: "Okukanga", pt: "Fritar" },
  owalende: { umbundu: "Owalende", pt: "Aguardente" },
  olwoso: { umbundu: "Olwoso", pt: "Arroz" },
  ombolo: { umbundu: "Ombolo", pt: "Pão" },
  omongwa: { umbundu: "Omongwa", pt: "Sal" },
  esala: { umbundu: "Esala", pt: "Ovo" },
  esalalyokutele: { umbundu: "Esala lyokutele", pt: "Ovo cozido" },
  esalalyokukanga: { umbundu: "Esala lyokukanga", pt: "Ovo frito" },

  // ===== Corpo humano =====
  etimba: { umbundu: "Etimba", pt: "Corpo" },
  utwe: { umbundu: "Utwe", pt: "Cabeça" },
  upolo: { umbundu: "Upolo", pt: "Testa" },
  ocipala: { umbundu: "Ocipala", pt: "Cara / rosto" },
  isso: { umbundu: "Isso", pt: "Olho" },
  enyulu: { umbundu: "Enyulu", pt: "Nariz" },
  ekosi: { umbundu: "Ekosi", pt: "Nuca" },
  ekumbi2: { umbundu: "Ekumbi", pt: "Sol / dia" },
  esinga: { umbundu: "Esinga", pt: "Cabelo" },
  etwi: { umbundu: "Etwi", pt: "Orelha" },
  epito: { umbundu: "Epito", pt: "Porta" },
  elimi: { umbundu: "Elimi", pt: "Língua" },
  omela: { umbundu: "Omelã", pt: "Boca" },
  onyima: { umbundu: "Onyima", pt: "Costas" },
  onete: { umbundu: "Onete", pt: "Peito" },
  utima: { umbundu: "Utima", pt: "Coração" },
  okulu: { umbundu: "Okulu", pt: "Perna" },
  okwokwo: { umbundu: "Okwokwo", pt: "Braço" },
  ongolo: { umbundu: "Ongolo", pt: "Joelho" },
  omangu: { umbundu: "Omangu", pt: "Cadeira" },
  eko: { umbundu: "Eko", pt: "Culpa" },
  akamba: { umbundu: "Akamba", pt: "Amigos" },

  // ===== Cidade e natureza =====
  olupale: { umbundu: "Olupale", pt: "Cidade" },
  okololo: { umbundu: "Okololo", pt: "Rua" },
  ocitanda: { umbundu: "Ocitanda", pt: "Praça / mercado" },
  onembele: { umbundu: "Onembele", pt: "Igreja" },
  omilu: { umbundu: "Omilu", pt: "Negócio" },
  yimbo: { umbundu: "Yimbo", pt: "Aldeia" },
  osanjala2: { umbundu: "Osanjala", pt: "Bairro" },
  vokati: { umbundu: "Vokati kolupale", pt: "Dentro da cidade" },
  ombala2: { umbundu: "Ombala", pt: "Capital" },
  uti: { umbundu: "Uti", pt: "Árvore" },
  ombela: { umbundu: "Ombela", pt: "Chuva" },
  elende: { umbundu: "Elende", pt: "Nuvem" },
  onanga: { umbundu: "Onanga", pt: "Pano" },
  owya: { umbundu: "Owyã", pt: "Calor" },
  ombambi: { umbundu: "Ombambi", pt: "Frio" },
  utanya: { umbundu: "Utanya", pt: "Sol ardente" },
  olwali: { umbundu: "Olwali", pt: "Mundo" },
  eve: { umbundu: "Eve", pt: "Terra" },
  eseke: { umbundu: "Eseke", pt: "Areia" },
  owi: { umbundu: "Owi", pt: "Lua" },
  ulima: { umbundu: "Ulima", pt: "Ano" },
  otembo: { umbundu: "Otembo", pt: "Tempo" },
  hela: { umbundu: "Helã", pt: "Amanhã" },
  cilo: { umbundu: "Cilo", pt: "Agora" },
  handisyo: { umbundu: "Handi syo", pt: "Ainda não" },
  lalimwe: { umbundu: "Lalimwe eteke", pt: "Nunca mais, de modo nenhum" },

  // ===== Verbos e ações =====
  okunywa: { umbundu: "Okunywa", pt: "Beber" },
  okuyongola: { umbundu: "Okuyongola", pt: "Querer" },
  twendi: { umbundu: "Twendi", pt: "Vamos" },
  okuteta: { umbundu: "Okuteta", pt: "Cortar" },
  kukatete: { umbundu: "Kukatete calwa", pt: "Não cortes muito" },
  olonjele: { umbundu: "Olonjele", pt: "Barbas" },
  okupemula: { umbundu: "Okupemula", pt: "Rapar (cabelo)" },
  ndipemulaolonjele: { umbundu: "Ndipemula olonjele", pt: "Rapo a barba" },
  okuponda: { umbundu: "Okuponda", pt: "Matar" },
  okuyota: { umbundu: "Okuyota", pt: "Aquecer-se" },
  ndayongwile: { umbundu: "Ndayongwile", pt: "Queria (queria visitar…)" },
  ovavaokunywa: { umbundu: "Ovava okunywa", pt: "Água para beber" },
  ovavavatokota: { umbundu: "Ovava vatokota", pt: "A água está quente" },
  ovavavatalala: { umbundu: "Ovava vatalala", pt: "A água está fria" },
  suku2: { umbundu: "Suku", pt: "Deus" },
  ngala: { umbundu: "Ñgala", pt: "Senhor" },
  onjovoli: { umbundu: "Onjovoli", pt: "Salvador" },
  yesu: { umbundu: "Yesu", pt: "Jesus" },
  ndikasipalo: { umbundu: "Ndikasi palo", pt: "Estou aqui" },
  okasiopo: { umbundu: "Okasi opo?", pt: "Estás lá?" },
  ndisala: { umbundu: "Ndisala", pt: "Fico" },
  elivala: { umbundu: "Elivala", pt: "Hora" },
  ekukutu: { umbundu: "Ekukutu", pt: "Minuto" },
  ombambi2: { umbundu: "Ombambi", pt: "Frio" },
  ovitangi: { umbundu: "Ovitangi", pt: "Problemas" },
  onya: { umbundu: "Onya", pt: "Inveja" },
  onjo: { umbundu: "Onjo", pt: "Casa" },
  ovingumba: { umbundu: "Ovingumba", pt: "Bandidos" },
  sukukalembwi: { umbundu: "Suku kalembwi cimwe", pt: "A Deus nada é impossível" },
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