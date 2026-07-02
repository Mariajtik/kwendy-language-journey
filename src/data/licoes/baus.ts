/**
 * Lições especiais do Báu — mini‑cenas de conversação em que o utilizador
 * encarna uma personagem e escolhe as respostas apropriadas à outra.
 * Cada báu reutiliza vocabulário já introduzido na unidade correspondente.
 */
import type { Licao, Passo, Fala } from "./tipos";

const cena = (
  eu: Fala["personagem"],
  npc: Fala["personagem"],
  pergunta: { u: string; t: string },
  opcoes: { u: string; t: string; correta?: boolean }[],
  cenario: "dia" | "tarde" | "noite" = "dia",
): Passo => ({
  tipo: "conversa_escolha",
  eu,
  npc,
  pergunta: { personagem: npc, umbundu: pergunta.u, pt: pergunta.t },
  opcoes: opcoes.map((o) => ({ personagem: eu, umbundu: o.u, pt: o.t })),
  correta: opcoes.findIndex((o) => o.correta),
  cenario,
});

export const LICOES_BAU: Record<string, Licao> = {
  // ---------------- Unidade 1 · Identificação ----------------
  m1u1bau: {
    id: "m1u1bau",
    titulo: "Encontro na estrada",
    personagens: ["kwendi", "otchali"],
    passos: [
      cena(
        "kwendi",
        "otchali",
        { u: "Ove helye?", t: "Como te chamas?" },
        [
          { u: "Ame ndakolapo ciwa.", t: "Eu estou bem." },
          { u: "Ame Kwendi.", t: "Eu sou o Kwendi.", correta: true },
          { u: "Wakolele!", t: "Olá!" },
        ],
      ),
      cena(
        "kwendi",
        "otchali",
        { u: "Wakolapo?", t: "Como estás?" },
        [
          { u: "Ame Otchali.", t: "Eu sou a Otchali." },
          { u: "Ndakolapo ciwa. Ove wakolapovo?", t: "Estou bem. E tu?", correta: true },
          { u: "Ove helye?", t: "Como te chamas?" },
        ],
      ),
      cena(
        "kwendi",
        "otchali",
        { u: "Tualumba ciwa!", t: "Até já!" },
        [
          { u: "Ame Kwendi.", t: "Eu sou o Kwendi." },
          { u: "Tualumba ciwa!", t: "Até já!", correta: true },
          { u: "Hisepo kamwe.", t: "Mais ou menos." },
        ],
      ),
    ],
  },

  // ---------------- Unidade 2 · Família ----------------
  m1u2bau: {
    id: "m1u2bau",
    titulo: "Em casa com a família",
    personagens: ["yellen", "hossy"],
    passos: [
      cena(
        "yellen",
        "hossy",
        { u: "Ove opi tuli?", t: "De onde és?" },
        [
          { u: "Ame tuli ko Wambu.", t: "Eu sou do Huambo.", correta: true },
          { u: "Ame Kwendi.", t: "Eu sou o Kwendi." },
          { u: "Ndakolapo ciwa.", t: "Estou bem." },
        ],
      ),
      cena(
        "yellen",
        "hossy",
        { u: "Une helye?", t: "Quem é este?" },
        [
          { u: "Ove helye?", t: "Como te chamas?" },
          { u: "Une o tate.", t: "Este é o pai.", correta: true },
          { u: "Tualumba ciwa.", t: "Até já." },
        ],
      ),
      cena(
        "yellen",
        "hossy",
        { u: "Ove wa kwete akombe?", t: "Tens irmãos?" },
        [
          { u: "Ame nda kwete umanji.", t: "Eu tenho um irmão.", correta: true },
          { u: "Wakolele!", t: "Olá!" },
          { u: "Ndakolapo ciwa.", t: "Estou bem." },
        ],
      ),
    ],
  },

  // ---------------- Unidade 3 · Origem, tempo ----------------
  m1u3bau: {
    id: "m1u3bau",
    titulo: "Nascimento e origem",
    personagens: ["chac", "kapit"],
    passos: [
      cena(
        "chac",
        "kapit",
        { u: "Wa citiwila pi?", t: "Onde nasceste?" },
        [
          { u: "Ame nda citiwila ko Wambu.", t: "Eu nasci no Huambo.", correta: true },
          { u: "Ame Chac.", t: "Eu sou o Chac." },
          { u: "Tualumba ciwa.", t: "Até já." },
        ],
      ),
      cena(
        "chac",
        "kapit",
        { u: "Wa citiwila keteke lipi?", t: "Em que mês nasceste?" },
        [
          { u: "Ame nda citiwila kosãi ya Susu.", t: "Eu nasci em Janeiro.", correta: true },
          { u: "Ndakolapo ciwa.", t: "Estou bem." },
          { u: "Ame nda kwete umanji.", t: "Tenho um irmão." },
        ],
      ),
      cena(
        "chac",
        "kapit",
        { u: "Ove wa kola?", t: "Estás bem?" },
        [
          { u: "Ee, ndakolapo ciwa.", t: "Sim, estou bem.", correta: true },
          { u: "Ove helye?", t: "Como te chamas?" },
          { u: "Ame Kwendi.", t: "Eu sou o Kwendi." },
        ],
      ),
    ],
  },

  // ---------------- Unidade 4 · Mercado, comida ----------------
  m1u4bau: {
    id: "m1u4bau",
    titulo: "No mercado",
    personagens: ["kwendi", "otchali"],
    passos: [
      cena(
        "kwendi",
        "otchali",
        { u: "Osoma cikuete olombongo vingapi?", t: "Quanto custa a fruta?" },
        [
          { u: "Osema yeteke.", t: "Fubá do dia." },
          { u: "Olombongo vitanu.", t: "Cinco kwanzas.", correta: true },
          { u: "Ndakolapo ciwa.", t: "Estou bem." },
        ],
      ),
      cena(
        "kwendi",
        "otchali",
        { u: "Wa yongola cimwe?", t: "Queres alguma coisa?" },
        [
          { u: "Ame nda yongola osema.", t: "Eu quero fubá.", correta: true },
          { u: "Wakolele!", t: "Olá!" },
          { u: "Ove helye?", t: "Como te chamas?" },
        ],
      ),
      cena(
        "kwendi",
        "otchali",
        { u: "Cikoko cikale!", t: "Muito obrigado!" },
        [
          { u: "Ame Kwendi.", t: "Eu sou o Kwendi." },
          { u: "Kwenda ciwa!", t: "De nada!", correta: true },
          { u: "Wa citiwila pi?", t: "Onde nasceste?" },
        ],
      ),
    ],
  },

  // ---------------- Unidade 5 · Corpo, cidade ----------------
  m1u5bau: {
    id: "m1u5bau",
    titulo: "Um passeio na cidade",
    personagens: ["yellen", "hossy"],
    passos: [
      cena(
        "yellen",
        "hossy",
        { u: "Otyipepi ci kasi pi?", t: "Onde está a cabeça?" },
        [
          { u: "Utwe watu vokati.", t: "A cabeça está no meio.", correta: true },
          { u: "Ndakolapo ciwa.", t: "Estou bem." },
          { u: "Ame Yellen.", t: "Eu sou a Yellen." },
        ],
      ),
      cena(
        "yellen",
        "hossy",
        { u: "Ove ove nda o kwenda pi?", t: "Onde vais?" },
        [
          { u: "Ndenda kolupale.", t: "Vou à cidade.", correta: true },
          { u: "Ame nda kwete umanji.", t: "Tenho um irmão." },
          { u: "Wakolele!", t: "Olá!" },
        ],
      ),
      cena(
        "yellen",
        "hossy",
        { u: "Ombela yikasi. Wa kwete ombela?", t: "Está a chover. Tens chuva?" },
        [
          { u: "Ee, ombambi calwa!", t: "Sim, que frio!", correta: true },
          { u: "Ame Hossy.", t: "Eu sou a Hossy." },
          { u: "Ove helye?", t: "Como te chamas?" },
        ],
      ),
    ],
  },
};