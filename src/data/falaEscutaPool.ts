/**
 * falaEscutaPool — frases agrupadas por unidade do currículo
 * para alimentar o ecrã Fala & Escuta (Duo-like).
 * Quando uma unidade não tem entrada própria usa o fallback BASE.
 */
export type Frase = { umbundu: string; pt: string };

const BASE: Frase[] = [
  { umbundu: "Wakolelepo", pt: "Olá / Bom dia" },
  { umbundu: "Wakola?", pt: "Como estás?" },
  { umbundu: "Ndakola, ndapandula", pt: "Estou bem, obrigado" },
  { umbundu: "Ndapandula calwa", pt: "Muito obrigado" },
  { umbundu: "Kalapo ciwa", pt: "Adeus / Fica bem" },
];

const POOL: Record<string, Frase[]> = {
  m1u1: [
    { umbundu: "Wakolelepo", pt: "Olá" },
    { umbundu: "Utukulu", pt: "Bom dia" },
    { umbundu: "Wakola?", pt: "Como estás?" },
    { umbundu: "Kalapo ciwa", pt: "Fica bem" },
    { umbundu: "Tuende", pt: "Vamos" },
  ],
  m1u2: [
    { umbundu: "Ame", pt: "Eu" },
    { umbundu: "Ove", pt: "Tu" },
    { umbundu: "Ame ndi…", pt: "Eu sou…" },
    { umbundu: "Ove o…", pt: "Tu és…" },
  ],
  m1u3: [
    { umbundu: "Ee", pt: "Sim" },
    { umbundu: "Tate", pt: "Não" },
    { umbundu: "Ndapandula", pt: "Obrigado" },
    { umbundu: "Cikole", pt: "Por favor" },
  ],
  m1u4: [
    { umbundu: "Mosi", pt: "Um" },
    { umbundu: "Vali", pt: "Dois" },
    { umbundu: "Vatatu", pt: "Três" },
    { umbundu: "Vakwala", pt: "Quatro" },
    { umbundu: "Vatãlu", pt: "Cinco" },
  ],
  m2u1: [
    { umbundu: "Onduko yange…", pt: "O meu nome é…" },
    { umbundu: "Ndi na anyamo…", pt: "Tenho … anos" },
  ],
  m2u2: [
    { umbundu: "Tate", pt: "Pai" },
    { umbundu: "Mai", pt: "Mãe" },
    { umbundu: "Mwanãle", pt: "Irmão" },
  ],
};

export function getFrasesParaUnidade(unidadeId: string): Frase[] {
  return POOL[unidadeId] ?? BASE;
}

export { BASE as FRASES_BASE };