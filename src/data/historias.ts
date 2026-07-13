/**
 * historias.ts — Catálogo de histórias/contos angolanos.
 * Primeira história: "O Jacaré Bangão" (lenda de Caxito, província do Bengo).
 * Adaptação livre baseada em Rodrigues (Revista Ecos, 2017) e tradição oral.
 */
import bangaoAsset from "@/assets/bangao.jpg.asset.json";
import kiandaAsset from "@/assets/kianda.jpg.asset.json";
import sumbiAsset from "@/assets/sumbi.jpg.asset.json";

export type Vocabulario = { umbundu: string; pt: string };
export type Capitulo = {
  id: string;
  titulo: string;
  paragrafos: string[];
  vocabulario?: Vocabulario[];
};
export type QuizPergunta = {
  pergunta: string;
  opcoes: string[];
  correta: number;
};
export type Historia = {
  id: string;
  titulo: string;
  subtitulo: string;
  regiao: string;
  epoca: string;
  duracaoMin: number;
  nivel: "Iniciante" | "Intermédio" | "Avançado";
  imagem: string;
  cor: string;
  corEscura: string;
  sinopse: string;
  desbloqueada: boolean;
  capitulos: Capitulo[];
  curiosidade: { titulo: string; texto: string; imagem?: string };
  quiz: QuizPergunta[];
  recompensa: { xp: number; diamantes: number };
  referencia?: string;
};

export const HISTORIAS: Historia[] = [
  {
    id: "jacare-bangao",
    titulo: "O Jacaré Bangão",
    subtitulo: "Uma lenda do rio Dande",
    regiao: "Caxito, Província do Bengo",
    epoca: "Século XIX — Angola colonial",
    duracaoMin: 7,
    nivel: "Iniciante",
    imagem: bangaoAsset.url,
    cor: "28 55% 42%",
    corEscura: "28 55% 28%",
    sinopse:
      "Diz-se que, há muito tempo, nas margens do rio Dande, vivia um jacaré chamado Sr. Ngandu. Cansado da crueldade de um chefe de posto colonial, decidiu ele próprio ir pagar o imposto — e dar uma lição que Caxito nunca mais esqueceu.",
    desbloqueada: true,
    capitulos: [
      {
        id: "c1",
        titulo: "As margens do Dande",
        paragrafos: [
          "Em Caxito, pequena cidade da província do Bengo, corre o rio Dande, sereno e antigo. Foi nas suas margens que, há mais de cem anos, viveu um jacaré enorme, de escamas escuras, conhecido por toda a gente como Sr. Ngandu.",
          "Diziam os mais velhos que ele era irascível, brigão, sempre zangado — até com a própria sombra. Mas Ngandu não era apenas um animal qualquer: era um crocodilo da mais alta linhagem do Dande, e por isso o respeitavam.",
        ],
        vocabulario: [
          { umbundu: "Ongandu", pt: "Jacaré, crocodilo" },
          { umbundu: "Olui", pt: "Rio" },
          { umbundu: "Imbo", pt: "Aldeia, terra" },
          { umbundu: "Ukulu", pt: "Ancião, mais velho" },
          { umbundu: "Otembo", pt: "Tempo, época" },
        ],
      },
      {
        id: "c2",
        titulo: "O Imposto Geral Mínimo",
        paragrafos: [
          "Naqueles tempos, as autoridades coloniais portuguesas obrigavam cada angolano a pagar o Imposto Geral Mínimo. Quem não pagasse era espancado, humilhado, levado à força para o trabalho contratado.",
          "Em Caxito, o Chefe de Posto era implacável. Feroz e desumano, batia nos mais velhos, atemorizava as mães, arrancava as últimas moedas das mãos das crianças. O povo sofria em silêncio, mas o rio escutava.",
        ],
        vocabulario: [
          { umbundu: "Olombongo", pt: "Dinheiro" },
          { umbundu: "Soma", pt: "Chefe, autoridade" },
          { umbundu: "Omanu", pt: "Pessoas, povo" },
          { umbundu: "Ohali", pt: "Sofrimento" },
        ],
      },
      {
        id: "c3",
        titulo: "A vingança do jacaré",
        paragrafos: [
          "Já tinha o Sr. Ngandu, em tempos idos, escapado por pouco de caçadores que queriam mandar a sua pele para o Putu, para se fazerem carteiras. Não esqueceu a humilhação.",
          "Numa certa manhã, quando o sol mal beijava o Dande, Ngandu saiu da água com uma moeda presa entre os dentes. Atravessou a estrada, subiu os degraus da Administração e bateu à porta do Chefe de Posto. Vinha — disse-se depois — pagar o seu imposto.",
        ],
        vocabulario: [
          { umbundu: "Okuenda", pt: "Caminhar, ir" },
          { umbundu: "Onjo", pt: "Casa" },
          { umbundu: "Ekumbi", pt: "Sol" },
        ],
      },
      {
        id: "c4",
        titulo: "A fuga do Sipaio",
        paragrafos: [
          "O Sipaio que guardava a porta deu um grito e fugiu de imediato. O Chefe de Posto, ao ver aquele jacaré enorme no seu gabinete, saltou pela janela e correu pelas ruas de Caxito, branco como a cal.",
          "Alertados pelo Sipaio, os populares juntaram-se à porta da Administração e a tudo assistiram, rindo-se às gargalhadas. Aquele dia, o medo trocou de lado.",
        ],
        vocabulario: [
          { umbundu: "Okuyuvuka", pt: "Fugir" },
          { umbundu: "Oyembu", pt: "Riso, alegria" },
          { umbundu: "Usumba", pt: "Medo" },
        ],
      },
      {
        id: "c5",
        titulo: "Lenda que virou estátua",
        paragrafos: [
          "A história do Sr. Ngandu correu de boca em boca, de avó para neto, de aldeia em aldeia. Tornou-se uma das lendas mais conhecidas de Angola — uma oratura de combate, que prenunciava a luta pela libertação do povo.",
          "Hoje, em Caxito, ergue-se uma estátua: um grande jacaré com uma moeda entre os dentes, sustentado por figuras do povo de braços erguidos. É o Jacaré Bangão, lembrando a todos que mesmo o mais fraco pode fazer o opressor fugir pela janela.",
        ],
        vocabulario: [
          { umbundu: "Esanju", pt: "Alegria, vitória" },
          { umbundu: "Ekanga", pt: "Liberdade" },
          { umbundu: "Ukulu wetu", pt: "A nossa tradição" },
        ],
      },
    ],
    curiosidade: {
      titulo: "A estátua do Jacaré Bangão",
      texto:
        "Na entrada da cidade de Caxito, província do Bengo, ergue-se uma estátua que homenageia esta lenda: um enorme jacaré de pedra, com uma moeda entre os dentes, sustentado por figuras do povo de braços levantados. É a única lenda angolana com monumento próprio numa cidade do país, sinal da importância que a tradição oral tem para a identidade do Bengo e de Angola.",
      imagem: bangaoAsset.url,
    },
    quiz: [
      {
        pergunta: "Em que rio vivia o Sr. Ngandu?",
        opcoes: ["Kwanza", "Dande", "Cunene", "Cuango"],
        correta: 1,
      },
      {
        pergunta: "O que foi o Sr. Ngandu fazer à Administração?",
        opcoes: [
          "Pedir um emprego",
          "Roubar comida",
          "Pagar o Imposto Geral Mínimo",
          "Visitar o Sipaio",
        ],
        correta: 2,
      },
      {
        pergunta: "Como reagiu o Chefe de Posto ao ver o jacaré?",
        opcoes: [
          "Cumprimentou-o",
          "Saltou pela janela e fugiu",
          "Chamou o exército",
          "Pediu desculpa ao povo",
        ],
        correta: 1,
      },
      {
        pergunta: "Em Umbundu, o que significa \"Ongandu\"?",
        opcoes: ["Rio", "Chefe", "Jacaré", "Dinheiro"],
        correta: 2,
      },
    ],
    recompensa: { xp: 80, diamantes: 20 },
    referencia:
      "Adaptado livremente de Sérgio de Carvalho Rodrigues, \"O Jacaré Bangão: uma lenda da oratura angolana\", Revista Ecos, vol. 23, n.º 02, 2017, e da tradição oral do Bengo.",
  },
  {
    id: "kianda",
    titulo: "A Kianda, Rainha dos Mares",
    subtitulo: "A sereia da Praia do Bispo",
    regiao: "Ilha de Luanda / Praia do Bispo",
    epoca: "Lenda atemporal — tradição Axiluanda",
    duracaoMin: 7,
    nivel: "Iniciante",
    imagem: kiandaAsset.url,
    cor: "200 70% 45%",
    corEscura: "200 70% 30%",
    sinopse:
      "Nas águas da orla atlântica de Luanda vive Kianda, sereia venerada pelos Axiluandas. Diz-se que já ofereceu a sua fortuna a um pescador triste — mas a ganância do homem virou o coração do mar. Desde então, o seu canto ecoa entre os rochedos.",
    desbloqueada: true,
    capitulos: [
      {
        id: "c1",
        titulo: "A rainha dos mares",
        paragrafos: [
          "Diante da cidade de Luanda ergue-se Muazanga, a Ilha, como lhe chamam os Axiluandas, seus nativos. Nas águas que a rodeiam, entre a Fortaleza de S. Miguel, a Marginal e a Praia do Bispo, vive Kianda — a Rainha dos Mares.",
          "Cada rio, cada lagoa, cada braço de água tem a sua kianda, que toma o nome do lugar onde habita. Mas há uma que é a mais poderosa de todas: a sereia das sereias, senhora do império das águas, das montanhas e dos bosques. Essa é A Kianda.",
        ],
        vocabulario: [
          { umbundu: "Kalunga", pt: "Mar, oceano" },
          { umbundu: "Onduko", pt: "Nome" },
          { umbundu: "Ukulu", pt: "Ancião, tradição antiga" },
        ],
      },
      {
        id: "c2",
        titulo: "O pescador triste",
        paragrafos: [
          "Numa tarde de vento manso, um pescador caminhava sozinho pela Praia do Bispo. Tinha o coração pesado: a rede rasgada, os filhos com fome, e a vida sem rumo. Sentou-se numa pedra a olhar o horizonte, à espera que o mar lhe respondesse.",
          "Foi então que Kianda o viu. Sentiu pena daquele homem e, num gesto raro, ergueu-se sobre as ondas e mostrou-lhe o caminho até um tesouro secreto que só ela conhecia, guardado nos rochedos submersos.",
        ],
        vocabulario: [
          { umbundu: "Omunu", pt: "Pessoa, homem" },
          { umbundu: "Ohenda", pt: "Piedade, compaixão" },
          { umbundu: "Olombongo", pt: "Dinheiro, riqueza" },
        ],
      },
      {
        id: "c3",
        titulo: "A ganância",
        paragrafos: [
          "Da noite para o dia, o pescador enriqueceu. Comprou casa, comprou barcos, comprou nome. Mas a fortuna, em vez de o alegrar, endureceu-lhe o coração: tornou-se mesquinho, avarento, e usava o dinheiro apenas para si próprio.",
          "Kianda, que o acompanhava de longe entre as ondas, foi ficando triste. Onde estava o homem humilde que se sentara à beira-mar? A ambição tinha-o cegado.",
        ],
        vocabulario: [
          { umbundu: "Ohali", pt: "Sofrimento, tristeza" },
          { umbundu: "Ocipululu", pt: "Egoísmo, avareza" },
        ],
      },
      {
        id: "c4",
        titulo: "A lição do mar",
        paragrafos: [
          "Uma manhã, o pescador acordou e não tinha nada. Os barcos partidos, a casa vazia, o ouro desaparecido como areia entre os dedos. Kianda tinha retirado tudo o que lhe dera.",
          "E prometeu, a partir daquele dia, jamais confiar nas mãos de um homem ganancioso. O seu canto, antes de piedade, tornou-se um chamamento perigoso: atraía navegantes imprudentes até aos rochedos, e prendia-os no fundo do mar.",
        ],
        vocabulario: [
          { umbundu: "Ocilonga", pt: "Lição, castigo" },
          { umbundu: "Usumba", pt: "Medo, receio" },
        ],
      },
      {
        id: "c5",
        titulo: "Oferendas ao mar",
        paragrafos: [
          "Até hoje, no início de Novembro, os Axiluandas honram Kianda. Levam comida para a praia, cantam, batem no batuque, e organizam uma procissão em barcos ao largo da baía. Depois, atiram as melhores porções ao mar — para que a Rainha aceite a oferenda e proteja quem vive das suas águas.",
          "Dizem os mais velhos que Kianda pode trazer o bem ou o mal, o amor ou o medo. Por isso se lhe fala com respeito. Porque quem escuta o mar de Luanda com o coração aberto ainda hoje ouve, entre as ondas, a voz da sereia mais poderosa de Angola.",
        ],
        vocabulario: [
          { umbundu: "Esanju", pt: "Alegria, festa" },
          { umbundu: "Etaili", pt: "Oferenda" },
          { umbundu: "Osumbila", pt: "Respeito" },
        ],
      },
    ],
    curiosidade: {
      titulo: "O Desejo de Kianda — Pepetela",
      texto:
        "Em 1995, o escritor angolano Pepetela (Prémio Camões 1997) publicou o romance «O Desejo de Kianda». A história passa-se no Kinaxixi, em Luanda, onde os prédios começam a ruir misteriosamente uns após os outros. É Cassandra, uma jovem que escuta uma voz vinda da água, quem descobre a verdade: o bairro foi construído sobre uma antiga lagoa onde vivia Kianda — e é o canto da sereia, à procura de recuperar o seu lar, que derruba os edifícios. A lenda antiga tornou-se assim, também, literatura contemporânea.",
      imagem: kiandaAsset.url,
    },
    quiz: [
      {
        pergunta: "Onde vive tradicionalmente A Kianda?",
        opcoes: [
          "No rio Kwanza",
          "Nas águas da Praia do Bispo e da Ilha de Luanda",
          "Nas cataratas de Kalandula",
          "No deserto do Namibe",
        ],
        correta: 1,
      },
      {
        pergunta: "O que ofereceu Kianda ao pescador triste?",
        opcoes: [
          "Uma canoa nova",
          "O caminho até um tesouro secreto",
          "Um filho",
          "A imortalidade",
        ],
        correta: 1,
      },
      {
        pergunta: "Porque é que Kianda retirou a fortuna ao pescador?",
        opcoes: [
          "Porque ele não pagava impostos",
          "Porque ele partilhou o ouro com outros",
          "Porque ele se tornou ganancioso e mesquinho",
          "Porque ele deixou a Ilha",
        ],
        correta: 2,
      },
      {
        pergunta: "Em Umbundu, o que significa \"Kalunga\"?",
        opcoes: ["Sereia", "Mar / oceano", "Peixe", "Chefe"],
        correta: 1,
      },
    ],
    recompensa: { xp: 80, diamantes: 20 },
    referencia:
      "Adaptado da tradição oral Axiluanda de Luanda; ver também Noémie Pereira Lopes, «A lenda da Kianda, mitologia angolana», Cultura em Língua Portuguesa (Nossa Avenida Blog, 2014), e Pepetela, «O Desejo de Kianda» (1995).",
  },
  {
    id: "sumbi",
    titulo: "Sumbé, o Cágado Sábio",
    subtitulo: "O cabo-de-guerra dos gigantes",
    regiao: "Sudoeste de Angola",
    epoca: "Tradição oral banta",
    duracaoMin: 6,
    nivel: "Iniciante",
    imagem: sumbiAsset.url,
    cor: "90 45% 38%",
    corEscura: "90 45% 25%",
    sinopse:
      "Nas florestas do sudoeste de Angola vive Sumbé, o cágado que os mais velhos dizem ser o mais astuto de todos os bichos. Cansado de ser troçado pelo Elefante e pelo Hipopótamo, decidiu provar que a inteligência vence a força — com uma simples corda de lianas.",
    desbloqueada: true,
    capitulos: [
      {
        id: "c1",
        titulo: "O cágado sábio",
        paragrafos: [
          "Nas fábulas bantas do sudoeste de Angola, o herói mais pequeno é também o mais esperto. Chama-se Sumbé — cágado da floresta, de casco duro e passo lento, mas com a cabeça a andar sempre depressa.",
          "Diziam os mais velhos que Sumbé não tinha presas, nem garras, nem tamanho. Tinha, porém, uma coisa que nenhum outro bicho tinha na mesma medida: a arte de pensar antes de agir.",
        ],
        vocabulario: [
          { umbundu: "Ocimbamba", pt: "Cágado, tartaruga" },
          { umbundu: "Uloño", pt: "Sabedoria, astúcia" },
          { umbundu: "Uteke", pt: "Floresta, mato" },
        ],
      },
      {
        id: "c2",
        titulo: "As gargalhadas dos gigantes",
        paragrafos: [
          "Um dia, junto ao rio, o Elefante e o Hipopótamo viram Sumbé passar devagarinho, e desataram a rir. «Olha o pequenino a caminhar! Se calhar só chega ao outro lado no ano que vem!» — troçava o Elefante. «E ainda por cima diz que é sábio!» — acrescentava o Hipopótamo, batendo com a cauda na água.",
          "Sumbé parou. Ergueu a cabecinha e olhou para os dois gigantes com muita calma. «Riam agora — mas eu, sozinho, sou capaz de vos vencer num cabo-de-guerra, aos dois ao mesmo tempo.»",
        ],
        vocabulario: [
          { umbundu: "Onjamba", pt: "Elefante" },
          { umbundu: "Ovava", pt: "Águas, rio" },
        ],
      },
      {
        id: "c3",
        titulo: "O desafio",
        paragrafos: [
          "O riso dos gigantes ficou ainda maior. Aquele bichinho de casco a puxá-los? Impossível! Mas Sumbé não se ria. Combinou tudo com toda a seriedade: cada um pegaria numa ponta da corda, e ao seu sinal, puxariam com toda a força. Se conseguissem arrastá-lo, ele calava-se para sempre.",
          "Elefante e Hipopótamo aceitaram, convencidos de que ia ser a coisa mais fácil do mundo. Combinaram sítio e hora. Sumbé apenas sorriu.",
        ],
        vocabulario: [
          { umbundu: "Olusenje", pt: "Força" },
          { umbundu: "Ovakuavo", pt: "Os outros, os companheiros" },
        ],
      },
      {
        id: "c4",
        titulo: "A corda das lianas",
        paragrafos: [
          "Sumbé partiu para a floresta e trançou uma corda longa e forte, feita das melhores lianas que encontrou. Depois entregou uma das pontas ao Elefante, na savana, e disse: «Quando ouvires o meu grito, puxa com toda a tua força!»",
          "Depois, sem que nenhum dos dois desse pela coisa, atravessou o mato e levou a outra ponta ao Hipopótamo, no rio. «Ao meu grito — puxa!» Sumbé escondeu-se no meio, à sombra, e gritou.",
        ],
        vocabulario: [
          { umbundu: "Onepa", pt: "Corda, liana" },
          { umbundu: "Okuvunga", pt: "Puxar" },
        ],
      },
      {
        id: "c5",
        titulo: "A vitória da mente",
        paragrafos: [
          "O Elefante puxou, convencido de que arrastava o cágado. Do outro lado, o Hipopótamo puxava com igual convicção. Sem se verem, os dois gigantes lutaram um contra o outro o dia inteiro, suando, bufando, sem perceber com quem estavam a medir forças.",
          "Ao cair da tarde, Sumbé cortou a corda. Elefante e Hipopótamo caíram ao chão exaustos, e só então compreenderam a partida. Baixaram a cabeça, envergonhados, e nunca mais troçaram do pequeno. Desde esse dia, os mais velhos ensinam às crianças: em Angola, a cabeça vale mais do que o tamanho.",
        ],
        vocabulario: [
          { umbundu: "Esanju", pt: "Alegria, vitória" },
          { umbundu: "Uloño wa velapo", pt: "A sabedoria é maior" },
        ],
      },
    ],
    curiosidade: {
      titulo: "Sumbé, Sumbe e Nzumbi",
      texto:
        "A cidade costeira do Sumbe, capital da província do Cuanza-Sul, deve o seu nome à mesma raiz banta que baptizou o cágado das fábulas. Já Nzumbi (em quimbundo, «espírito», «alma dos mortos») é uma palavra completamente diferente — e foi essa, e não o cágado sábio, que viajou até ao Caribe e deu origem à palavra ocidental «zombie». Duas ideias muito diferentes, ambas com raízes profundas nas línguas angolanas.",
      imagem: sumbiAsset.url,
    },
    quiz: [
      {
        pergunta: "Quem desafia Sumbé para um cabo-de-guerra?",
        opcoes: [
          "O Leão e o Leopardo",
          "O Elefante e o Hipopótamo",
          "O Jacaré e a Serpente",
          "A Palanca e a Girafa",
        ],
        correta: 1,
      },
      {
        pergunta: "De que material Sumbé fez a corda?",
        opcoes: ["Pele de cabra", "Fibra de palmeira", "Lianas da floresta", "Pêlo de leopardo"],
        correta: 2,
      },
      {
        pergunta: "Onde estava o Hipopótamo enquanto puxava?",
        opcoes: ["Na savana", "No rio", "Na montanha", "Na aldeia"],
        correta: 1,
      },
      {
        pergunta: "Qual é a moral da fábula?",
        opcoes: [
          "A força bruta vence sempre",
          "Não se deve confiar em ninguém",
          "A inteligência vence o tamanho",
          "Os grandes têm sempre razão",
        ],
        correta: 2,
      },
    ],
    recompensa: { xp: 70, diamantes: 18 },
    referencia:
      "Adaptado da tradição oral banta do sudoeste de Angola; ver «50 Contos do Sudoeste de Angola» e antologias de contos tradicionais angolanos disponíveis online (Scribd, Issuu).",
  },
];

export const getHistoria = (id: string) => HISTORIAS.find((h) => h.id === id);