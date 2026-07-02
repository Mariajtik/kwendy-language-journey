/**
 * Ficha de países de África usada no jogo "Para Além de Fronteiras".
 * As coordenadas (x, y) são normalizadas (0-1) sobre a imagem
 * `@/assets/africa.png.asset.json`, com origem no canto superior-esquerdo.
 * Aproximadas visualmente para posicionar o alfinete do país.
 *
 * As cores da bandeira estão em HSL (formato tailwind: "H S% L%") — usam-se
 * em `hsl(...)` para gradientes de fundo e para os confetes.
 */

export interface PaisAfrica {
  iso: string;               // ISO-2 (usamos "AFR" para perguntas continentais)
  nome: string;              // Nome em PT
  emoji: string;             // Bandeira em emoji
  x: number;                 // 0..1 sobre africa.png
  y: number;                 // 0..1 sobre africa.png
  bandeira: [string, string, string]; // 3 cores HSL
  palop?: boolean;           // Faz parte dos PALOP
}

export const PAISES: Record<string, PaisAfrica> = {
  AO: { iso: "AO", nome: "Angola",             emoji: "🇦🇴", x: 0.42, y: 0.70, bandeira: ["0 0% 0%",     "0 82% 45%",   "45 90% 55%"], palop: true },
  CV: { iso: "CV", nome: "Cabo Verde",         emoji: "🇨🇻", x: 0.08, y: 0.36, bandeira: ["215 60% 30%", "0 0% 100%",   "0 78% 50%"],  palop: true },
  GW: { iso: "GW", nome: "Guiné-Bissau",       emoji: "🇬🇼", x: 0.14, y: 0.44, bandeira: ["0 78% 50%",   "45 90% 55%",  "142 65% 35%"], palop: true },
  ST: { iso: "ST", nome: "São Tomé e Príncipe",emoji: "🇸🇹", x: 0.38, y: 0.58, bandeira: ["142 65% 35%", "45 90% 55%",  "0 78% 50%"],  palop: true },
  MZ: { iso: "MZ", nome: "Moçambique",         emoji: "🇲🇿", x: 0.72, y: 0.78, bandeira: ["142 65% 35%", "0 0% 0%",     "45 90% 55%"], palop: true },
  GQ: { iso: "GQ", nome: "Guiné Equatorial",   emoji: "🇬🇶", x: 0.40, y: 0.56, bandeira: ["142 65% 35%", "0 0% 100%",   "0 78% 50%"] },
  DZ: { iso: "DZ", nome: "Argélia",            emoji: "🇩🇿", x: 0.36, y: 0.20, bandeira: ["142 65% 35%", "0 0% 100%",   "0 78% 50%"] },
  MA: { iso: "MA", nome: "Marrocos",           emoji: "🇲🇦", x: 0.28, y: 0.14, bandeira: ["0 78% 45%",   "142 65% 32%", "0 0% 100%"] },
  EG: { iso: "EG", nome: "Egito",              emoji: "🇪🇬", x: 0.60, y: 0.20, bandeira: ["0 78% 50%",   "0 0% 100%",   "0 0% 0%"] },
  ET: { iso: "ET", nome: "Etiópia",            emoji: "🇪🇹", x: 0.74, y: 0.48, bandeira: ["142 65% 35%", "45 90% 55%",  "0 78% 50%"] },
  UG: { iso: "UG", nome: "Uganda",             emoji: "🇺🇬", x: 0.66, y: 0.55, bandeira: ["0 0% 0%",     "45 90% 55%",  "0 78% 50%"] },
  RW: { iso: "RW", nome: "Ruanda",             emoji: "🇷🇼", x: 0.64, y: 0.58, bandeira: ["215 60% 40%", "45 90% 55%",  "142 65% 40%"] },
  ZA: { iso: "ZA", nome: "África do Sul",      emoji: "🇿🇦", x: 0.56, y: 0.90, bandeira: ["142 65% 30%", "45 90% 55%",  "0 78% 50%"] },
  TZ: { iso: "TZ", nome: "Tanzânia",           emoji: "🇹🇿", x: 0.70, y: 0.62, bandeira: ["142 65% 30%", "45 90% 55%",  "215 60% 30%"] },
  NG: { iso: "NG", nome: "Nigéria",            emoji: "🇳🇬", x: 0.42, y: 0.48, bandeira: ["142 65% 35%", "0 0% 100%",   "142 65% 35%"] },
  CM: { iso: "CM", nome: "Camarões",           emoji: "🇨🇲", x: 0.46, y: 0.52, bandeira: ["142 65% 35%", "0 78% 50%",   "45 90% 55%"] },
  TN: { iso: "TN", nome: "Tunísia",            emoji: "🇹🇳", x: 0.45, y: 0.10, bandeira: ["0 78% 50%",   "0 0% 100%",   "0 78% 50%"] },
  KE: { iso: "KE", nome: "Quénia",             emoji: "🇰🇪", x: 0.72, y: 0.55, bandeira: ["0 0% 0%",     "0 78% 50%",   "142 65% 35%"] },
  AFR:{ iso: "AFR",nome: "África",             emoji: "🌍", x: 0.50, y: 0.50, bandeira: ["45 90% 55%",  "0 78% 45%",   "142 65% 35%"] },
};

/** Mapeia cada pergunta ao país principal a que se refere. */
export const PERGUNTA_PARA_PAIS: Record<string, string> = {
  p1: "AO", p2: "AO", p3: "AO", p4: "DZ", p5: "GQ", p6: "AO",
  p7: "AO", p8: "AO", p9: "ST", p10: "CV", p11: "AFR", p12: "DZ",
  p13: "RW", p14: "ET", p15: "UG", p16: "ZA", p17: "TZ", p18: "EG",
  p19: "AO", p20: "AO", p21: "AFR", p22: "MA", p23: "GW", p24: "CM",
  p25: "AO", p26: "MA", p27: "AO", p28: "ZA",
};

export const paisPorId = (perguntaId: string): PaisAfrica =>
  PAISES[PERGUNTA_PARA_PAIS[perguntaId] ?? "AFR"] ?? PAISES.AFR;

export const PAISES_PALOP = Object.values(PAISES).filter((p) => p.palop);

export const CURIOSIDADES: Record<string, string> = {
  AO: "Angola tem a Welwitschia mirabilis, planta que vive mais de 1000 anos no deserto do Namibe.",
  CV: "As dez ilhas de Cabo Verde deram ao mundo Cesária Évora e a morna, agora Património da UNESCO.",
  GW: "A Guiné-Bissau produz caju suficiente para figurar entre os maiores exportadores do planeta.",
  ST: "As roças de cacau de São Tomé produziram, em tempos, mais chocolate do que qualquer outro sítio do mundo.",
  MZ: "Moçambique tem quase 2 500 km de costa banhada pelo Índico e a Ilha de Moçambique é Património da UNESCO.",
  GQ: "A Guiné Equatorial é o único país africano onde o espanhol é a principal língua oficial.",
  DZ: "A Argélia é o maior país de África em área — cerca de 80% do seu território é deserto do Saara.",
  MA: "A Universidade Al Quaraouiyine, em Fez, funciona desde 859 — é a mais antiga do mundo em atividade.",
  EG: "O Nilo tem cerca de 6 650 km e atravessa dez países antes de desaguar no Mediterrâneo.",
  ET: "A Etiópia usa o seu próprio calendário, com 13 meses e cerca de 7 anos de diferença face ao gregoriano.",
  UG: "Winston Churchill chamou ao Uganda a 'Pérola da África' pela sua exuberante biodiversidade.",
  RW: "Kigali, capital do Ruanda, é frequentemente citada como a cidade mais limpa e organizada de África.",
  ZA: "A África do Sul tem três capitais: Pretória, Bloemfontein e Cidade do Cabo — e onze línguas oficiais.",
  TZ: "O Kilimanjaro, na Tanzânia, sobe até aos 5 895 m e é o ponto mais alto do continente.",
  NG: "A Nigéria tem mais de 200 milhões de habitantes — um em cada seis africanos é nigeriano.",
  CM: "Camarões é chamado 'África em miniatura' por reunir quase todos os climas e paisagens do continente.",
  TN: "A antiga Cartago, hoje Tunísia, foi durante séculos rival de Roma no Mediterrâneo.",
  KE: "O Quénia é a terra da Grande Migração — mais de 1,5 milhão de gnus atravessa o Mara todos os anos.",
  AFR: "África tem 54 países reconhecidos pela ONU e mais de 2 000 línguas faladas — é o berço da humanidade.",
};