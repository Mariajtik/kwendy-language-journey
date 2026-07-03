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
  | "chac"
  | "kapit"
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
    }
  | {
      // Cena de conversa "face a face" (usada nos báus).
      // O utilizador encarna `eu`; a NPC diz `pergunta` e o utilizador
      // escolhe 1 de N respostas (Fala) para prosseguir. Apenas `correta`
      // faz sentido no contexto.
      tipo: "conversa_escolha";
      eu: Personagem;
      npc: Personagem;
      pergunta: Fala;
      opcoes: Fala[];
      correta: number;
      cenario?: "dia" | "tarde" | "noite";
    }
  | {
      // Emparelhar pares Umbundu ↔ PT (grelha 2×N).
      tipo: "emparelhar";
      pares: { umbundu: string; pt: string }[];
    }
  | {
      // Preencher a lacuna numa frase Umbundu.
      // A frase contém "___" no lugar da palavra em falta.
      tipo: "preencher_lacuna";
      frase: string;
      pt: string;
      opcoes: string[];
      correta: number;
    }
  | {
      // Ouvir e escrever livremente em Umbundu.
      tipo: "escuta_escrever";
      audio: string;   // frase Umbundu a ser lida
      pt: string;
    }
  | {
      // Ouvir e montar com banco de palavras (tap what you hear).
      tipo: "escuta_montar";
      audio: string;   // frase Umbundu
      pt: string;
      alvo: string;    // igual ao audio, mas separado por espaços
      distratores?: string[];
    }
  | {
      // Preencher letra(s) em falta numa palavra que acabou de ser aprendida.
      // Gerado automaticamente pelo motor após cada passo "aprender" elegível.
      // Estilo "muito fácil": normalmente esconde apenas 1 vogal interior.
      tipo: "preencher_letras";
      palavra: string;    // Umbundu completo (resposta modelo)
      pt: string;         // dica em PT
      mascara: string;    // Igual a `palavra` com letras ocultas por "_"
      letras: string[];   // Letras ocultas por ordem de aparição
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