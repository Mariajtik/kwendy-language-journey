/**
 * Tipos partilhados por todos os scripts de lições (módulo 1 em diante).
 * Cada lição é uma sequência ordenada de passos que o utilizador percorre
 * na LessonScreen. Aprendizado -> Diálogo -> Escuta -> Escrita -> Fala.
 */

export type Personagem =
  | "kwendi"
  | "otchali"
  | "yellen"
  | "hossy"
  | "suzana"
  | "kiame"
  | "kekehan"
  | "kapt"
  | "kapo"
  | "laura"
  | "cile"
  | "narrador";

export type Fala = {
  personagem: Personagem;
  umbundu: string;
  pt: string;
};

export type Passo =
  | {
      tipo: "aprender";
      umbundu: string;
      pt: string;
      exemplo?: string;
      nota?: string;
    }
  | {
      tipo: "dialogo";
      titulo?: string;
      falas: Fala[];
    }
  | {
      tipo: "escuta_escolha";
      audio: string;        // frase em Umbundu a ser pronunciada
      pt: string;           // tradução correta
      opcoes: string[];     // 3 opções PT, uma é a certa
      correta: number;
    }
  | {
      tipo: "traduzir_pt_umbundu";
      pt: string;
      opcoes: string[];
      correta: number;
    }
  | {
      tipo: "traduzir_umbundu_pt";
      umbundu: string;
      opcoes: string[];
      correta: number;
    }
  | {
      tipo: "montar_frase";
      pergunta: string;     // instrução em PT (ex: "Traduz: Estou bem")
      alvo: string;         // frase correta em Umbundu (palavras separadas por espaço)
      distratores?: string[]; // palavras extra que não pertencem
    }
  | {
      tipo: "escrever";
      pergunta: string;     // instrução em PT
      resposta: string;     // resposta esperada em Umbundu
    }
  | {
      tipo: "falar";
      frase: string;        // Umbundu
      pt: string;
    };

export type Licao = {
  id: string;               // ex: "m1u1s1"
  titulo: string;
  personagens?: Personagem[];
  passos: Passo[];
};

/** Normaliza texto para comparação em exercícios de escrita livre. */
export function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?;:'"]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}