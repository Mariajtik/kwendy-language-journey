/**
 * curiosidades.ts — conteúdo estático da secção Curiosidades.
 * Cada categoria reusa um token da paleta Kwendi (`--kwendi-*`).
 */

export type Categoria =
  | "natureza"
  | "historia"
  | "cultura"
  | "gastronomia"
  | "linguas"
  | "monumentos";

export type Section = { heading: string; body: string };

export type Curiosidade = {
  id: string;
  categoria: Categoria;
  titulo: string;
  subtitulo: string;
  resumo: string;
  imagem?: string;
  sections: Section[];
  destaque?: string;
};

import imbondeiroImg from "@/assets/curiosidades/imbondeiro.jpg.asset.json";
import nzingaImg from "@/assets/curiosidades/nzinga.jpg.asset.json";
import palancaImg from "@/assets/curiosidades/palanca.jpg.asset.json";
import welwitschiaImg from "@/assets/curiosidades/welwitschia.jpg.asset.json";
import agostinhoImg from "@/assets/curiosidades/agostinho-neto.jpg.asset.json";
import nontombiImg from "@/assets/curiosidades/nontombi.jpg.asset.json";
import tundavalaImg from "@/assets/curiosidades/tundavala.jpg.asset.json";
import kalandulaImg from "@/assets/curiosidades/kalandula.jpg.asset.json";
import pensadorImg from "@/assets/curiosidades/pensador.jpg.asset.json";
import mufeteImg from "@/assets/curiosidades/mufete.jpg.asset.json";
import umbunduImg from "@/assets/curiosidades/umbundu.png.asset.json";
import maiombeImg from "@/assets/curiosidades/maiombe.jpg.asset.json";
import mussiviImg from "@/assets/curiosidades/mussivi.jpg.asset.json";

export const CATEGORIAS: Record<
  Categoria,
  { label: string; token: string }
> = {
  natureza: { label: "Natureza", token: "--kwendi-green" },
  historia: { label: "História", token: "--kwendi-red" },
  cultura: { label: "Cultura", token: "--kwendi-yellow" },
  gastronomia: { label: "Gastronomia", token: "--kwendi-peach" },
  linguas: { label: "Línguas", token: "--kwendi-purple" },
  monumentos: { label: "Monumentos", token: "--kwendi-blue" },
};

export const curiosidades: Curiosidade[] = [
  {
    id: "imbondeiro",
    imagem: imbondeiroImg.url,
    categoria: "natureza",
    titulo: "O Imbondeiro",
    subtitulo: "A árvore que cresce ao contrário",
    resumo:
      "Símbolo de resistência e espiritualidade, o imbondeiro é uma das árvores mais emblemáticas de Angola.",
    sections: [
      {
        heading: "Introdução",
        body: "Imponente, ancestral, inconfundível. O imbondeiro — também conhecido como baobá — atravessa o céu angolano com uma silhueta que parece desafiar a própria gravidade.",
      },
      {
        heading: "Lenda e simbolismo",
        body: "Diz-se que Deus o plantou ao contrário, com as raízes apontadas para o céu. A lenda nasce e renasce em cada região do país, lembrando-nos da ligação profunda entre o povo angolano e a terra.",
      },
      {
        heading: "Usos tradicionais",
        body: "Os seus frutos alimentam comunidades inteiras e dão origem a bebidas tradicionais. Os troncos servem por vezes de abrigo, e folhas e cascas entram em rituais e práticas medicinais que atravessam gerações.",
      },
      {
        heading: "Importância cultural",
        body: "Mais do que árvore, é guardião. À sua sombra contam-se histórias, juntam-se famílias e celebra-se a vida — uma presença viva da espiritualidade angolana.",
      },
    ],
    destaque: "O baobá pode viver milhares de anos.",
  },
  {
    id: "nzinga",
    imagem: nzingaImg.url,
    categoria: "historia",
    titulo: "Rainha Nzinga",
    subtitulo: "A guerreira que enfrentou impérios",
    resumo:
      "Uma das figuras mais poderosas da história africana e símbolo eterno da resistência angolana.",
    sections: [
      {
        heading: "Quem foi Nzinga",
        body: "Nascida por volta de 1582, Nzinga Mbandi reinou sobre Ndongo e Matamba no século XVII. Líder destemida e estratega militar, tornou-se a voz da soberania angolana num tempo de impérios.",
      },
      {
        heading: "Diplomacia",
        body: "Em 1623, foi enviada como embaixadora para negociar com os portugueses. A sua presença, firme e elegante, redesenhou o que se esperava de uma mulher africana numa mesa de poder.",
      },
      {
        heading: "Resistência",
        body: "Quando a diplomacia falhou, escolheu a guerrilha. Forjou alianças, comandou exércitos e manteve viva a chama da independência durante décadas.",
      },
      {
        heading: "Legado cultural",
        body: "O seu nome atravessou o Atlântico: na capoeira, em festas afro-brasileiras, nas memórias de quem resiste. Nzinga é orgulho que não se ensina — herda-se.",
      },
      {
        heading: "Reconhecimento",
        body: "Em 2014, o Banco Nacional de Angola emitiu uma moeda de 20 kwanzas em sua homenagem. Documentários, ruas e monumentos continuam a contar a sua história.",
      },
    ],
  },
  {
    id: "pensador",
    imagem: pensadorImg.url,
    categoria: "cultura",
    titulo: "O Pensador",
    subtitulo: "O símbolo da sabedoria angolana",
    resumo:
      "Uma das esculturas mais importantes da identidade cultural de Angola.",
    sections: [
      {
        heading: "Origem Chokwe",
        body: "Nascido das mãos dos artistas Chokwe, no leste de Angola, O Pensador é talhado em madeira com a precisão de quem esculpe não uma figura, mas uma ideia.",
      },
      {
        heading: "Significado da postura",
        body: "Curvado, de pernas cruzadas e mãos apoiadas na cabeça, representa o ancião — aquele cuja experiência guia a comunidade. Em Angola, ouvir os mais velhos é uma forma de oração.",
      },
      {
        heading: "História da descoberta",
        body: "Em 1932, o etnólogo suíço Théodore Delachaux encontrou uma destas estatuetas durante uma expedição e batizou-a 'O Pensador', em homenagem à obra de Rodin.",
      },
      {
        heading: "Reconhecimento nacional",
        body: "Em 1984, o governo angolano consagrou-o símbolo nacional da cultura. Em 2000, foi oferecido às Nações Unidas como gesto de partilha do espírito angolano com o mundo.",
      },
      {
        heading: "Museu do Dundo",
        body: "A estatueta original repousa no Museu do Dundo, na Lunda Norte — um santuário do património Chokwe e da memória do leste angolano.",
      },
    ],
  },
  {
    id: "palanca",
    imagem: palancaImg.url,
    categoria: "natureza",
    titulo: "Palanca Negra Gigante",
    subtitulo: "O símbolo vivo de Angola",
    resumo:
      "Um dos animais mais raros do mundo e orgulho nacional angolano.",
    sections: [
      {
        heading: "Habitat",
        body: "Endémica de Angola, a Palanca Negra Gigante vive sobretudo no Parque Nacional de Cangandala e na Reserva do Luando, em Malanje. Os seus cornos curvos podem chegar a 1,65 m.",
      },
      {
        heading: "Estado de conservação",
        body: "Anos de guerra empurraram-na quase para o silêncio. Foi dada como extinta — até que o tempo provou que continuava lá, paciente.",
      },
      {
        heading: "Redescoberta",
        body: "Em 2004, uma expedição liderada por Pedro Vaz Pinto captou as primeiras imagens em décadas. Foi como reencontrar um pedaço perdido da alma do país.",
      },
      {
        heading: "Símbolo nacional",
        body: "Hoje dá nome à selecção nacional de futebol — as Palancas Negras — e atravessa moedas, brasões e bairros. É Angola em forma de animal.",
      },
      {
        heading: "Conservação",
        body: "A Fundação Kissama e parceiros internacionais trabalham para proteger os cerca de 300 exemplares que restam. Cada cria que nasce é uma vitória colectiva.",
      },
    ],
  },
  {
    id: "welwitschia",
    imagem: welwitschiaImg.url,
    categoria: "natureza",
    titulo: "Welwitschia Mirabilis",
    subtitulo: "A planta que desafia o tempo",
    resumo:
      "Uma das plantas mais antigas e resistentes do planeta, nascida no deserto angolano.",
    sections: [
      {
        heading: "Características únicas",
        body: "Tem apenas duas folhas em toda a vida — e elas crescem para sempre. Podem atingir quatro metros, retorcidas pelo vento e pelo tempo, como filamentos de uma memória antiga.",
      },
      {
        heading: "Adaptação ao deserto",
        body: "Bebe da neblina matinal que sobe do Atlântico. As suas raízes profundas guardam cada gota como se fosse a última.",
      },
      {
        heading: "Longevidade",
        body: "Considerada um fóssil vivo, atravessa séculos enquanto impérios sobem e caem. Há exemplares que viram nascer o reino do Kongo.",
      },
      {
        heading: "Importância científica",
        body: "Botânicos do mundo inteiro estudam-na para entender como a vida persiste onde quase tudo seca. É a aula de resistência que Angola dá ao planeta.",
      },
    ],
    destaque: "Pode viver mais de mil anos.",
  },
  {
    id: "mufete",
    imagem: mufeteImg.url,
    categoria: "gastronomia",
    titulo: "Mufete",
    subtitulo: "O sabor tradicional de Luanda",
    resumo:
      "Um dos pratos mais celebrados da culinária angolana, alma das mesas de sábado.",
    sections: [
      {
        heading: "O que é o mufete",
        body: "Originário da ilha de Luanda, o mufete é prato de celebração. Aniversários, noivados, casamentos — tudo cabe à volta de uma travessa generosa partilhada entre famílias.",
      },
      {
        heading: "Ingredientes",
        body: "Peixe grelhado (carapau, peixe-galo ou cacusso), feijão de óleo de palma alaranjado, banana-pão, batata-doce, mandioca cozida e farinha musseque torrada.",
      },
      {
        heading: "Como preparar",
        body: "Tempera-se o peixe com sal, alho e limão e grelha-se em brasas. Coze-se o feijão com óleo de palma, cebola e sal. Rega-se tudo com molho de cebola, vinagre, azeite e gindungo.",
      },
      {
        heading: "Origem do nome",
        body: "Diz-se que vem de 'kufeta' em kimbundu — 'segredar' — talvez pelo som suave do peixe a estalar nas brasas, como uma confidência.",
      },
      {
        heading: "Importância cultural",
        body: "Mais do que refeição, é ritual. Comer mufete é juntar-se à mesa de Angola.",
      },
    ],
  },
  {
    id: "agostinho-neto",
    imagem: agostinhoImg.url,
    categoria: "historia",
    titulo: "Agostinho Neto",
    subtitulo: "Manguxi Kilamba",
    resumo:
      "Poeta, líder revolucionário e primeiro presidente de Angola.",
    sections: [
      {
        heading: "Pseudónimo de guerra",
        body: "Manguxi — 'guia imortal', 'o mais sábio entre os homens'. Kilamba — 'aquele que comanda com coragem'. Dois nomes em kimbundu para uma só missão.",
      },
      {
        heading: "Literatura",
        body: "Antes do poder, a palavra. 'Sagrada Esperança' continua a ser bandeira de identidade e resistência, lida em escolas, recitada em comícios.",
      },
      {
        heading: "Independência",
        body: "A 11 de Novembro de 1975, lê a proclamação que muda para sempre o destino do país. Angola passa a pertencer aos angolanos.",
      },
      {
        heading: "Reconhecimentos",
        body: "Recebeu o Prémio Lenin da Paz em 1975-76, em reconhecimento internacional do seu papel na luta pela independência.",
      },
      {
        heading: "Legado nacional",
        body: "A Universidade Agostinho Neto e a centralidade do Kilamba mantêm o seu nome vivo no quotidiano do país que ajudou a libertar.",
      },
    ],
  },
  {
    id: "nontombi",
    imagem: nontombiImg.url,
    categoria: "cultura",
    titulo: "Nontombi",
    subtitulo: "O penteado ancestral africano",
    resumo:
      "Uma tradição cultural dos povos Mwila e Mucubal que atravessa gerações.",
    sections: [
      {
        heading: "Povos Mwila e Mucubal",
        body: "No sul de Angola, entre paisagens secas e horizontes vermelhos, vivem os Mwila e os Mucubal. As suas mulheres trazem na cabeça uma das mais belas formas de arte viva do continente.",
      },
      {
        heading: "Como é feito",
        body: "O nontombi é modelado com uma mistura tradicional de ocre, ervas, manteiga, óleo e estrume de vaca seco, que actua como selante natural. Cada fio é gesto, cada gesto é memória.",
      },
      {
        heading: "Significado social",
        body: "Funciona como um cartão de identidade visível: revela idade, papel social e, por vezes, o estado civil. Um penteado que fala antes da boca.",
      },
      {
        heading: "Relação com dreadlocks",
        body: "Muitos historiadores apontam-no como uma das raízes ancestrais dos dreadlocks contemporâneos — uma travessia estética com origem em África.",
      },
      {
        heading: "Importância cultural",
        body: "É beleza, é pertença, é resistência. Cada nontombi é uma forma de dizer: estamos aqui, somos nós, e a nossa história continua.",
      },
    ],
  },
  {
    id: "umbundu",
    imagem: umbunduImg.url,
    categoria: "linguas",
    titulo: "Umbundu",
    subtitulo: "A língua mais falada de Angola",
    resumo:
      "Uma língua bantu carregada de história, ancestralidade e identidade cultural.",
    sections: [
      {
        heading: "O que é o umbundu",
        body: "Língua bantu falada por mais de sete milhões de pessoas, é a língua nacional mais difundida em Angola. Sem ser oficial, é oficialmente da família — falada em casa, no mercado, na lavra.",
      },
      {
        heading: "Povos Ovimbundu",
        body: "Os Ovimbundu, seus falantes naturais, representam cerca de um terço da população angolana e mantêm vivas tradições, provérbios e cantigas que nasceram no planalto.",
      },
      {
        heading: "Regiões falantes",
        body: "Nasce e respira no Planalto Central — Huambo, Bié, Benguela — e estende-se pela faixa costeira ocidental, em cidades como Lobito e Benguela.",
      },
      {
        heading: "Influência cultural",
        body: "O umbundu moldou o português falado em Angola e até no Brasil, deixando palavras que cruzaram o Atlântico carregadas de história.",
      },
      {
        heading: "Palavras influentes",
        body: "Termos como 'quilombo' e 'fubá' têm raízes que ecoam no umbundu. Cada palavra é uma pequena rota da diáspora.",
      },
    ],
  },
  {
    id: "tundavala",
    imagem: tundavalaImg.url,
    categoria: "monumentos",
    titulo: "Fenda da Tundavala",
    subtitulo: "O abismo natural da Huíla",
    resumo:
      "Uma das paisagens mais impressionantes de Angola.",
    sections: [
      {
        heading: "Introdução",
        body: "Imagine olhar para baixo e ver o mundo abrir-se. A Fenda da Tundavala, no planalto da Huíla, é uma falha geológica que mergulha mais de mil metros e devolve o silêncio em ecos.",
      },
      {
        heading: "A paisagem",
        body: "Penhascos vertiginosos, vento que carrega histórias e um horizonte sem fim. Dizem que daqui se vê metade de Angola — talvez seja verdade.",
      },
      {
        heading: "Importância cultural",
        body: "Lugar de contemplação e de respeito. Para o povo Nyaneka-Humbi, é território sagrado, presente em rituais e na memória colectiva.",
      },
      {
        heading: "Curiosidade",
        body: "Nos dias claros, é possível ver da borda até o Lubango lá em baixo. A neblina, quando sobe, transforma a fenda num mar de nuvens.",
      },
    ],
  },
  {
    id: "maiombe",
    imagem: maiombeImg.url,
    categoria: "natureza",
    titulo: "Floresta do Maiombe",
    subtitulo: "O pulmão verde de Cabinda",
    resumo:
      "Uma das florestas tropicais mais ricas em biodiversidade de África.",
    sections: [
      {
        heading: "Biodiversidade",
        body: "Considerada um dos pulmões verdes do continente, abriga milhares de espécies de plantas e animais — muitas ainda por inventariar. Cada hectare é uma biblioteca viva.",
      },
      {
        heading: "Animais",
        body: "Gorilas, chimpanzés, elefantes-da-floresta, búfalos e dezenas de espécies de aves cruzam as suas copas densas, longe do olhar humano.",
      },
      {
        heading: "Clima",
        body: "Quente, húmido, fechado. A floresta cria o seu próprio microclima, com chuvas frequentes e nevoeiros que dançam entre os troncos.",
      },
      {
        heading: "Povos locais",
        body: "Os povos de Cabinda mantêm com o Maiombe uma relação ancestral, marcada por respeito, conhecimento tradicional e uma profunda espiritualidade.",
      },
      {
        heading: "Conservação",
        body: "Ameaçada pela exploração madeireira, é hoje área prioritária para projectos de conservação transnacionais que unem Angola, Congo e RDC.",
      },
    ],
  },
  {
    id: "kalandula",
    imagem: kalandulaImg.url,
    categoria: "monumentos",
    titulo: "Quedas de Kalandula",
    subtitulo: "A força das águas angolanas",
    resumo:
      "Uma das maiores quedas de água de África em volume.",
    sections: [
      {
        heading: "Altura e dimensão",
        body: "Com cerca de 105 metros de altura e 400 metros de largura, as quedas do Lucala desabam num espectáculo que se sente no peito antes de se ver.",
      },
      {
        heading: "História",
        body: "Já foram conhecidas como Quedas Duque de Bragança. Em 1975 voltaram ao nome original, Kalandula — devolvendo à terra aquilo que lhe pertencia.",
      },
      {
        heading: "Turismo",
        body: "Em Malanje, são um dos destinos mais procurados do país. O melhor miradouro é o do lado oposto, onde o arco-íris aparece quase em silêncio.",
      },
      {
        heading: "Ecossistema",
        body: "À volta, mata densa, aves raras e uma humidade constante que faz crescer musgos antigos em cada pedra.",
      },
      {
        heading: "Curiosidades",
        body: "Na estação das chuvas, o estrondo é tão grande que pode ser ouvido a quilómetros de distância. É como se a terra cantasse.",
      },
    ],
  },
  {
    id: "mussivi",
    imagem: mussiviImg.url,
    categoria: "natureza",
    titulo: "Mussivi",
    subtitulo: "A jóia das florestas de Angola",
    resumo:
      "Madeira nobre e preciosa, nativa do Cuando Cubango e do Moxico, símbolo de riqueza natural e de responsabilidade.",
    sections: [
      {
        heading: "O que é o mussivi",
        body: "Cientificamente Guibourtia coleosperma, também conhecida como pau-ferro ou pau-rosa, é uma das madeiras mais preciosas das florestas angolanas — densa, perfumada, com tonalidades quentes.",
      },
      {
        heading: "Valor e procura",
        body: "É chamada 'jóia das florestas' do Cuando Cubango. Procurada no mercado internacional pela sua durabilidade, alimenta uma indústria que precisa de equilíbrio entre uso e respeito.",
      },
      {
        heading: "Crescimento lento",
        body: "Demora entre 80 e 100 anos a atingir a maturidade. Cada árvore cortada é quase um século de paciência da terra.",
      },
      {
        heading: "Ameaça de extinção",
        body: "A exploração desordenada empurrou-a para o risco. O governo angolano interdita periodicamente a sua exploração para travar o avanço da desflorestação.",
      },
      {
        heading: "Importância cultural",
        body: "Usada em carpintaria e marcenaria de alta qualidade, o mussivi atravessa casas, instrumentos e objectos rituais — uma herança que merece ser preservada.",
      },
    ],
    destaque: "Quase um século para crescer. Apenas alguns minutos para cair.",
  },
];