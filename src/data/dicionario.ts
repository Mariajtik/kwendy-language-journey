/**
 * dicionario.ts — Base inicial bilingue PT ⇄ Umbundu.
 * Cobre saudações, família, números, dias, meses, estações, corpo,
 * natureza, animais e termos culturais do livro de referência.
 */

export type CategoriaDic =
  | "saudacoes"
  | "familia"
  | "numeros"
  | "tempo"
  | "corpo"
  | "natureza"
  | "cultura"
  | "verbos"
  | "objetos";

export interface EntradaDic {
  id: string;
  pt: string;
  umbundu: string;
  categoria: CategoriaDic;
  exemplo?: string;
}

export const DICIONARIO: EntradaDic[] = [
  // Saudações
  { id: "d1", pt: "olá", umbundu: "wakolelepo", categoria: "saudacoes" },
  { id: "d2", pt: "bom dia", umbundu: "uteke uwa", categoria: "saudacoes" },
  { id: "d3", pt: "boa tarde", umbundu: "ekumbi liwa", categoria: "saudacoes" },
  { id: "d4", pt: "boa noite", umbundu: "uteke uwa", categoria: "saudacoes" },
  { id: "d5", pt: "obrigado", umbundu: "ndapandula", categoria: "saudacoes" },
  { id: "d6", pt: "muito obrigado", umbundu: "ndapandula calwa", categoria: "saudacoes" },
  { id: "d7", pt: "como estás?", umbundu: "wakola?", categoria: "saudacoes" },
  { id: "d8", pt: "estou bem", umbundu: "ndakola", categoria: "saudacoes" },
  { id: "d9", pt: "adeus", umbundu: "kalapo ciwa", categoria: "saudacoes" },
  { id: "d10", pt: "sim", umbundu: "ee", categoria: "saudacoes" },
  { id: "d11", pt: "não", umbundu: "sili", categoria: "saudacoes" },

  // Família
  { id: "d20", pt: "pai", umbundu: "tate", categoria: "familia" },
  { id: "d21", pt: "mãe", umbundu: "mama", categoria: "familia" },
  { id: "d22", pt: "irmão", umbundu: "manu", categoria: "familia" },
  { id: "d23", pt: "irmã", umbundu: "manjange", categoria: "familia" },
  { id: "d24", pt: "filho", umbundu: "omõla", categoria: "familia" },
  { id: "d25", pt: "avô", umbundu: "kuku", categoria: "familia" },
  { id: "d26", pt: "avó", umbundu: "kuku ukãi", categoria: "familia" },
  { id: "d27", pt: "amigo", umbundu: "ekamba", categoria: "familia" },
  { id: "d28", pt: "pessoa", umbundu: "omunu", categoria: "familia" },

  // Números
  { id: "d40", pt: "um", umbundu: "mosi", categoria: "numeros" },
  { id: "d41", pt: "dois", umbundu: "vali", categoria: "numeros" },
  { id: "d42", pt: "três", umbundu: "tatu", categoria: "numeros" },
  { id: "d43", pt: "quatro", umbundu: "kwala", categoria: "numeros" },
  { id: "d44", pt: "cinco", umbundu: "tãlo", categoria: "numeros" },
  { id: "d45", pt: "seis", umbundu: "epandu", categoria: "numeros" },
  { id: "d46", pt: "sete", umbundu: "epandu-vali", categoria: "numeros" },
  { id: "d47", pt: "oito", umbundu: "ecelãlã", categoria: "numeros" },
  { id: "d48", pt: "nove", umbundu: "ecea", categoria: "numeros" },
  { id: "d49", pt: "dez", umbundu: "ekwi", categoria: "numeros" },

  // Tempo
  { id: "d60", pt: "dia", umbundu: "eteke", categoria: "tempo" },
  { id: "d61", pt: "noite", umbundu: "uteke", categoria: "tempo" },
  { id: "d62", pt: "hoje", umbundu: "etekeli", categoria: "tempo" },
  { id: "d63", pt: "amanhã", umbundu: "hela", categoria: "tempo" },
  { id: "d64", pt: "ontem", umbundu: "eteke liaeya", categoria: "tempo" },
  { id: "d65", pt: "ano", umbundu: "unyamo", categoria: "tempo" },
  { id: "d66", pt: "mês", umbundu: "osãi", categoria: "tempo" },
  { id: "d67", pt: "semana", umbundu: "sumanu", categoria: "tempo" },

  // Corpo
  { id: "d80", pt: "cabeça", umbundu: "utwe", categoria: "corpo" },
  { id: "d81", pt: "olho", umbundu: "iso", categoria: "corpo" },
  { id: "d82", pt: "boca", umbundu: "omẽla", categoria: "corpo" },
  { id: "d83", pt: "mão", umbundu: "eka", categoria: "corpo" },
  { id: "d84", pt: "pé", umbundu: "ompindi", categoria: "corpo" },
  { id: "d85", pt: "coração", umbundu: "utima", categoria: "corpo" },

  // Natureza
  { id: "d100", pt: "sol", umbundu: "ekumbi", categoria: "natureza" },
  { id: "d101", pt: "lua", umbundu: "osãi", categoria: "natureza" },
  { id: "d102", pt: "água", umbundu: "ovava", categoria: "natureza" },
  { id: "d103", pt: "fogo", umbundu: "ondalu", categoria: "natureza" },
  { id: "d104", pt: "árvore", umbundu: "uti", categoria: "natureza" },
  { id: "d105", pt: "chuva", umbundu: "ombela", categoria: "natureza" },
  { id: "d106", pt: "vento", umbundu: "ofela", categoria: "natureza" },
  { id: "d107", pt: "mel", umbundu: "owiki", categoria: "natureza" },

  // Cultura (livro de referência)
  { id: "d120", pt: "palavra", umbundu: "ondaka", categoria: "cultura" },
  { id: "d121", pt: "gesto", umbundu: "ondimbu", categoria: "cultura" },
  { id: "d122", pt: "som", umbundu: "ocileñgi", categoria: "cultura" },
  { id: "d123", pt: "sentimento", umbundu: "ovisimilo", categoria: "cultura" },
  { id: "d124", pt: "palhaços", umbundu: "ovinganji", categoria: "cultura" },
  { id: "d125", pt: "soba (chefe)", umbundu: "soba", categoria: "cultura" },

  // Verbos
  { id: "d140", pt: "ser / estar", umbundu: "okukala", categoria: "verbos" },
  { id: "d141", pt: "agarrar", umbundu: "okukwata", categoria: "verbos" },
  { id: "d142", pt: "comer", umbundu: "okulia", categoria: "verbos" },
  { id: "d143", pt: "beber", umbundu: "okunua", categoria: "verbos" },
  { id: "d144", pt: "ir", umbundu: "okuenda", categoria: "verbos" },
  { id: "d145", pt: "ver", umbundu: "okumõla", categoria: "verbos" },
  { id: "d146", pt: "ouvir", umbundu: "okuyeva", categoria: "verbos" },
  { id: "d147", pt: "falar", umbundu: "okupopia", categoria: "verbos" },
];

/** Pesquisa fuzzy bidirecional. Devolve até `limite` resultados. */
export function pesquisar(q: string, limite = 12): EntradaDic[] {
  const termo = q.trim().toLowerCase();
  if (!termo) return [];
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const t = norm(termo);
  const exatos: EntradaDic[] = [];
  const parciais: EntradaDic[] = [];
  for (const e of DICIONARIO) {
    const pt = norm(e.pt);
    const um = norm(e.umbundu);
    if (pt === t || um === t) exatos.push(e);
    else if (pt.includes(t) || um.includes(t)) parciais.push(e);
  }
  return [...exatos, ...parciais].slice(0, limite);
}