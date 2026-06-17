/**
 * Banco de perguntas do jogo "Para Além de Fronteiras".
 * Cada pergunta tem 4 opções, índice da correta e uma explicação curta.
 * A ordem das perguntas e das opções é embaralhada em tempo de execução.
 */

export type CategoriaPergunta =
  | "Angola"
  | "PALOP"
  | "África Geral"
  | "Cultura"
  | "Curiosidades";

export interface Pergunta {
  id: string;
  categoria: CategoriaPergunta;
  enunciado: string;
  opcoes: string[];
  respostaCorreta: number;
  explicacao: string;
}

export const PERGUNTAS: Pergunta[] = [
  {
    id: "p1",
    categoria: "Angola",
    enunciado: "Qual ritmo angolano deu origem ao samba brasileiro?",
    opcoes: ["Kuduro", "Semba", "Kizomba", "Rebita"],
    respostaCorreta: 1,
    explicacao:
      "O Semba é um ritmo tradicional angolano e é considerado a raiz do samba brasileiro, levado pelos povos escravizados de Angola para o Brasil.",
  },
  {
    id: "p2",
    categoria: "Cultura",
    enunciado:
      'Como se chama o pedido de casamento tradicional angolano, em que a família do noivo entrega o "dote"?',
    opcoes: ["Kilapanga", "Calulu", "Alambamento", "Funje"],
    respostaCorreta: 2,
    explicacao:
      "O Alambamento é o pedido de casamento tradicional, em que a família do noivo entrega bens à família da noiva como sinal de respeito e união entre as famílias.",
  },
  {
    id: "p3",
    categoria: "Angola",
    enunciado:
      "Qual planta rara, com milhares de anos de vida, habita o deserto do Namibe?",
    opcoes: [
      "Imbondeiro",
      "Palanca-negra",
      "Mussivi",
      "Welwitschia mirabilis",
    ],
    respostaCorreta: 3,
    explicacao:
      "A Welwitschia mirabilis é uma planta única do deserto do Namibe (Angola e Namíbia) e pode viver mais de 1000 anos.",
  },
  {
    id: "p4",
    categoria: "África Geral",
    enunciado: "Qual é hoje o maior país africano em extensão territorial?",
    opcoes: ["Argélia", "RD Congo", "Sudão", "Líbia"],
    respostaCorreta: 0,
    explicacao:
      "Após a divisão do Sudão em 2011, a Argélia tornou-se o maior país de África em área, com cerca de 80% do território coberto pelo Saara.",
  },
  {
    id: "p5",
    categoria: "PALOP",
    enunciado: "Em que país africano o espanhol é língua oficial principal?",
    opcoes: [
      "Guiné-Bissau",
      "Guiné Equatorial",
      "Cabo Verde",
      "São Tomé e Príncipe",
    ],
    respostaCorreta: 1,
    explicacao:
      "A Guiné Equatorial é o único país africano onde o espanhol é a principal língua oficial.",
  },
  {
    id: "p6",
    categoria: "Angola",
    enunciado: "Qual é a moeda oficial de Angola?",
    opcoes: ["Metical", "Escudo", "Kwanza", "Dobra"],
    respostaCorreta: 2,
    explicacao:
      "O Kwanza é a moeda oficial de Angola, batizada em homenagem ao Rio Kwanza, uma das maiores vias fluviais do país.",
  },
  {
    id: "p7",
    categoria: "Cultura",
    enunciado:
      "Qual prato tradicional de Luanda combina peixe grelhado, feijão de óleo de palma, banana-pão e mandioca?",
    opcoes: ["Calulu", "Mufete", "Funje", "Cocada"],
    respostaCorreta: 1,
    explicacao:
      "O Mufete é um prato emblemático de Luanda, normalmente servido à beira-mar e composto por peixe grelhado, feijão de óleo de palma, banana-pão e mandioca.",
  },
  {
    id: "p8",
    categoria: "Cultura",
    enunciado:
      "Qual destes pratos é um ensopado de peixe ou carne seca com vegetais e óleo de palma?",
    opcoes: ["Calulu", "Funje", "Mufete", "Cocada"],
    respostaCorreta: 0,
    explicacao:
      "O Calulu é um ensopado tradicional de peixe seco ou carne com folhas, vegetais e óleo de palma, muito comum na culinária angolana.",
  },
  {
    id: "p9",
    categoria: "PALOP",
    enunciado: 'Que país é conhecido como "Ilha de Chocolate" pela alta qualidade do seu cacau?',
    opcoes: ["Cabo Verde", "São Tomé e Príncipe", "Guiné-Bissau", "Moçambique"],
    respostaCorreta: 1,
    explicacao:
      "São Tomé e Príncipe é apelidado de Ilha de Chocolate, famoso pelas antigas roças de cacau de altíssima qualidade.",
  },
  {
    id: "p10",
    categoria: "PALOP",
    enunciado: "Que país lusófono é mundialmente famoso pela morna?",
    opcoes: ["Angola", "Cabo Verde", "Moçambique", "Guiné-Bissau"],
    respostaCorreta: 1,
    explicacao:
      "A morna é o género musical mais emblemático de Cabo Verde, eternizado por Cesária Évora.",
  },
  {
    id: "p11",
    categoria: "África Geral",
    enunciado: "Quantos países africanos são reconhecidos pela ONU?",
    opcoes: ["48", "50", "54", "60"],
    respostaCorreta: 2,
    explicacao:
      "O continente africano tem 54 países reconhecidos pela ONU e abriga mais de 2000 línguas faladas.",
  },
  {
    id: "p12",
    categoria: "África Geral",
    enunciado: "Qual é o maior deserto quente do mundo, localizado no norte de África?",
    opcoes: ["Kalahari", "Namibe", "Saara", "Atacama"],
    respostaCorreta: 2,
    explicacao:
      "O Saara é o maior deserto quente do mundo, cobrindo cerca de 9 milhões de km² no norte de África.",
  },
  {
    id: "p13",
    categoria: "Curiosidades",
    enunciado: "Qual é a capital africana frequentemente citada como a cidade mais limpa do continente?",
    opcoes: ["Kigali", "Nairobi", "Luanda", "Acra"],
    respostaCorreta: 0,
    explicacao:
      "Kigali, capital do Ruanda, é reconhecida pela limpeza, organização urbana e segurança.",
  },
  {
    id: "p14",
    categoria: "Curiosidades",
    enunciado: "Qual país africano tem o seu próprio calendário, cerca de 7 anos atrasado em relação ao gregoriano?",
    opcoes: ["Egito", "Etiópia", "Quénia", "Marrocos"],
    respostaCorreta: 1,
    explicacao:
      "A Etiópia segue o calendário etíope, com cerca de 7 anos de diferença em relação ao gregoriano, e tem o seu próprio sistema horário.",
  },
  {
    id: "p15",
    categoria: "África Geral",
    enunciado: 'Qual país é apelidado de "Pérola da África"?',
    opcoes: ["Quénia", "Tanzânia", "Uganda", "Ruanda"],
    respostaCorreta: 2,
    explicacao:
      'Foi Winston Churchill quem chamou ao Uganda a "Pérola da África", devido à sua beleza natural e biodiversidade.',
  },
  {
    id: "p16",
    categoria: "Curiosidades",
    enunciado: "Quantas capitais oficiais tem a África do Sul?",
    opcoes: ["1", "2", "3", "4"],
    respostaCorreta: 2,
    explicacao:
      "A África do Sul tem três capitais: Pretória (administrativa), Bloemfontein (judicial) e Cidade do Cabo (legislativa).",
  },
  {
    id: "p17",
    categoria: "Curiosidades",
    enunciado: "Qual é a montanha mais alta de África?",
    opcoes: ["Monte Quénia", "Monte Kilimanjaro", "Monte Stanley", "Ras Dashen"],
    respostaCorreta: 1,
    explicacao:
      "O Kilimanjaro, na Tanzânia, atinge cerca de 5.895 metros e é a montanha mais alta do continente africano.",
  },
  {
    id: "p18",
    categoria: "África Geral",
    enunciado: "Qual é o rio que corta vários países e desagua no Mediterrâneo, considerado um dos maiores do mundo?",
    opcoes: ["Congo", "Zambeze", "Nilo", "Níger"],
    respostaCorreta: 2,
    explicacao:
      "O rio Nilo tem aproximadamente 6.650 km e atravessa 10 países antes de desaguar no Mediterrâneo.",
  },
  {
    id: "p19",
    categoria: "Angola",
    enunciado: "Quais são alguns dos principais grupos étnicos de Angola?",
    opcoes: [
      "Zulus e Xhosas",
      "Ovimbundos, Ambundos, Bakongos e Chócues",
      "Tuaregues e Berberes",
      "Hauçás e Iorubás",
    ],
    respostaCorreta: 1,
    explicacao:
      "Angola é formada por diversos povos bantos, com destaque para os Ovimbundos, Ambundos, Bakongos e Chócues, entre outros.",
  },
  {
    id: "p20",
    categoria: "Cultura",
    enunciado: "O que é o kimbanda na tradição angolana?",
    opcoes: [
      "Um tipo de dança",
      "Um instrumento musical",
      "Um curandeiro tradicional",
      "Um prato típico",
    ],
    respostaCorreta: 2,
    explicacao:
      "O kimbanda é o curandeiro tradicional, que utiliza saberes ancestrais e plantas medicinais — convive com a medicina moderna.",
  },
  {
    id: "p21",
    categoria: "Curiosidades",
    enunciado: "Qual continente é considerado o berço da humanidade?",
    opcoes: ["Europa", "Ásia", "África", "Oceania"],
    respostaCorreta: 2,
    explicacao:
      "África é o continente habitado há mais tempo e é considerado o berço da humanidade, com milhares de etnias e mais de mil línguas.",
  },
  {
    id: "p22",
    categoria: "Curiosidades",
    enunciado:
      "Qual a distância aproximada entre a Europa e a África pelo Estreito de Gibraltar?",
    opcoes: ["7 km", "14 km", "30 km", "60 km"],
    respostaCorreta: 1,
    explicacao:
      "Apenas cerca de 14 km separam África da Europa, entre Marrocos e a Península Ibérica.",
  },
  {
    id: "p23",
    categoria: "PALOP",
    enunciado: "Qual destes países é um dos maiores exportadores mundiais de castanha de caju?",
    opcoes: ["Guiné-Bissau", "Angola", "São Tomé e Príncipe", "Moçambique"],
    respostaCorreta: 0,
    explicacao:
      "A Guiné-Bissau é um dos maiores exportadores mundiais de castanha de caju, produto central na sua economia.",
  },
  {
    id: "p24",
    categoria: "África Geral",
    enunciado: 'Qual país é apelidado de "África em miniatura" por reunir quase todos os climas e paisagens do continente?',
    opcoes: ["Camarões", "Quénia", "Tanzânia", "Gabão"],
    respostaCorreta: 0,
    explicacao:
      "Camarões é conhecido como África em miniatura por concentrar quase todos os climas, vegetações e culturas do continente.",
  },
  {
    id: "p25",
    categoria: "Cultura",
    enunciado: "Qual destes ritmos é uma dança a par muito romântica nascida em Angola?",
    opcoes: ["Kuduro", "Kizomba", "Semba", "Funaná"],
    respostaCorreta: 1,
    explicacao:
      "A Kizomba nasceu em Angola nos anos 80 e é hoje um dos estilos de dança a par mais populares no mundo.",
  },
  {
    id: "p26",
    categoria: "Curiosidades",
    enunciado: "Em que país de África funciona a universidade em atividade mais antiga do mundo (Karueein, fundada em 859)?",
    opcoes: ["Egito", "Tunísia", "Marrocos", "Argélia"],
    respostaCorreta: 2,
    explicacao:
      "A Universidade Al Quaraouiyine, em Fez (Marrocos), foi fundada em 859 e é considerada a universidade em atividade mais antiga do mundo.",
  },
  {
    id: "p27",
    categoria: "Angola",
    enunciado: "Que tipo de cataratas, entre as maiores de África, ficam em Malanje, Angola?",
    opcoes: ["Cataratas Vitória", "Cataratas de Kalandula", "Cataratas do Tugela", "Cataratas do Boyoma"],
    respostaCorreta: 1,
    explicacao:
      "As Cataratas de Kalandula, em Malanje, são uma das maiores quedas de água de África, com cerca de 105 m de altura.",
  },
  {
    id: "p28",
    categoria: "África Geral",
    enunciado: "Que país africano é apelidado de Nação Arco-Íris e tem 11 idiomas oficiais?",
    opcoes: ["Nigéria", "África do Sul", "Quénia", "Etiópia"],
    respostaCorreta: 1,
    explicacao:
      "A África do Sul é conhecida como Nação Arco-Íris pela sua diversidade cultural e tem 11 idiomas oficiais.",
  },
];
