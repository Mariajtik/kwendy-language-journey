/**
 * LessonScreen.tsx
 * Tela de execução de lição estilo Duolingo (front-end apenas).
 * Barra de progresso, perguntas de múltipla escolha em Umbundu,
 * feedback verde/vermelho, tela de conclusão com XP.
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, X as XIcon, Lightbulb } from "lucide-react";
import { MicOff, VolumeX } from "lucide-react";
import KwendiIcon from "@/components/icons/KwendiIcon";
import { useMissoes } from "@/hooks/useMissoes";
import { setSaldo, useSaldo, perderVida } from "@/hooks/useSaldo";
import { useProgresso } from "@/hooks/useProgresso";
import { useInventario, dobradorXpAtivo } from "@/hooks/useInventario";
import { toast } from "@/hooks/use-toast";
import { getLicao as getLicaoM1 } from "@/data/licoes/m1";
import { LICOES_BAU } from "@/data/licoes/baus";
import {
  AprenderPasso,
  DialogoPasso,
  EscutaPasso,
  TraduzirPUPasso,
  TraduzirUPPasso,
  MontarFrasePasso,
  EscreverPasso,
  FalarPasso,
  ConversaEscolhaPasso,
  EmparelharPasso,
  PreencherLacunaPasso,
  EscutaEscreverPasso,
  EscutaMontarPasso,
  PreencherLetrasPasso,
} from "@/components/licao/PassoComponents";
import type { Passo } from "@/data/licoes/tipos";

/**
 * Após cada passo "aprender" elegível, injeta um mini-exercício
 * "preencher_letras" para reforçar a grafia da palavra recém-aprendida.
 * Regras: 3–24 chars, ≤3 palavras, esconde 1 vogal interior (fallback: letra interior).
 */
function expandirComEscrita(passos: Passo[]): Passo[] {
  const out: Passo[] = [];
  for (const p of passos) {
    out.push(p);
    if (p.tipo !== "aprender") continue;
    const gerado = gerarPreencherLetras(p.umbundu, p.pt);
    if (gerado) out.push(gerado);
  }
  return out;
}

function gerarPreencherLetras(u: string, pt: string): Passo | null {
  const raw = u.trim();
  if (raw.length < 3 || raw.length > 24) return null;
  const words = raw.split(/\s+/);
  if (words.length > 3) return null;
  // Escolhe a última palavra "alfabética" com ≥3 letras (excluindo pontuação).
  const clean = (w: string) => w.replace(/[.,!?;:'"()]/g, "");
  let targetIdx = -1;
  for (let i = words.length - 1; i >= 0; i--) {
    if (clean(words[i]).length >= 3) {
      targetIdx = i;
      break;
    }
  }
  if (targetIdx === -1) return null;
  const target = words[targetIdx];
  const chars = [...target];
  const isLetter = (c: string) => /[a-zA-ZãõÃÕáéíóúâêîôû]/.test(c);
  const isVowel = (c: string) => /[aeiouAEIOUãõÃÕáéíóúâêîôû]/.test(c);
  // Posições internas (não primeira, não última) que sejam letras.
  const interiores: number[] = [];
  for (let i = 1; i < chars.length - 1; i++) {
    if (isLetter(chars[i])) interiores.push(i);
  }
  if (interiores.length === 0) return null;
  // Preferir vogais internas; caso contrário qualquer letra interna.
  const vogaisInternas = interiores.filter((i) => isVowel(chars[i]));
  const candidatas = vogaisInternas.length > 0 ? vogaisInternas : interiores;
  const pick = candidatas[Math.floor(candidatas.length / 2)];
  const hidden = chars[pick];
  const newWordChars = [...chars];
  newWordChars[pick] = "_";
  const newWords = [...words];
  newWords[targetIdx] = newWordChars.join("");
  return {
    tipo: "preencher_letras",
    palavra: raw,
    pt,
    mascara: newWords.join(" "),
    letras: [hidden],
  };
}

/**
 * Se `semFala`/`semEscuta` estiverem ativas nesta sessão da lição, converte
 * passos de fala/escuta em equivalentes de escrita já existentes. Puramente
 * efêmero — vive só no estado local de `LessonScreen`.
 */
function transformarPasso(
  p: Passo,
  semFala: boolean,
  semEscuta: boolean,
): Passo {
  if (semFala && p.tipo === "falar") {
    return {
      tipo: "escrever",
      pergunta: `Escreve em Umbundu: "${p.pt}"`,
      resposta: p.frase,
    };
  }
  if (semEscuta && p.tipo === "escuta_escolha") {
    return {
      tipo: "traduzir_umbundu_pt",
      umbundu: p.audio,
      opcoes: p.opcoes,
      correta: p.correta,
    };
  }
  if (semEscuta && p.tipo === "escuta_escrever") {
    return {
      tipo: "escrever",
      pergunta: `Escreve em Umbundu: "${p.pt}"`,
      resposta: p.audio,
    };
  }
  if (semEscuta && p.tipo === "escuta_montar") {
    return {
      tipo: "montar_frase",
      pergunta: `Traduz para Umbundu: "${p.pt}"`,
      alvo: p.alvo,
      distratores: p.distratores,
    };
  }
  return p;
}

/** Controlo de dicas grátis diárias (5/dia). Persiste em localStorage. */
const DICAS_KEY = "kwendi_dicas_diarias_v1";
const DICAS_GRATIS_DIA = 5;
const DICA_CUSTO_DIAMANTES = 15;

function lerDicasHoje(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(DICAS_KEY);
    if (!raw) return 0;
    const p = JSON.parse(raw) as { dia: string; usadas: number };
    const hoje = new Date().toDateString();
    return p.dia === hoje ? p.usadas : 0;
  } catch {
    return 0;
  }
}

function gravarDicaUsada(n: number) {
  const hoje = new Date().toDateString();
  localStorage.setItem(DICAS_KEY, JSON.stringify({ dia: hoje, usadas: n }));
}

type Question = {
  prompt: string;
  pt: string;
  options: string[];
  correct: number;
};

const QUESTIONS: Question[] = [
  {
    prompt: 'Como se diz "Olá" em Umbundu?',
    pt: "Olá",
    options: ["Wakolele", "Tualumba", "Cikoko", "Mola"],
    correct: 0,
  },
  {
    prompt: 'O que significa "Tualumba ciwa"?',
    pt: "",
    options: ["Boa noite", "Bom dia", "Obrigado", "Como estás?"],
    correct: 1,
  },
  {
    prompt: 'Selecione a tradução de "Obrigado"',
    pt: "Obrigado",
    options: ["Cikoko", "Mola", "Akuenje", "Wakolele"],
    correct: 0,
  },
];

const LessonScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { registrarAcao } = useMissoes();
  const { concluirSeccao } = useProgresso();
  const { tempoRestante } = useInventario();

  const licao = useMemo(
    () => (id ? LICOES_BAU[id] ?? getLicaoM1(id) : undefined),
    [id],
  );
  const passosExpandidos = useMemo<Passo[]>(
    () => (licao ? expandirComEscrita(licao.passos) : []),
    [licao],
  );
  const usaScript = !!licao;
  const totalScript = passosExpandidos.length;
  const total = usaScript ? totalScript : QUESTIONS.length;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [dicaAtiva, setDicaAtiva] = useState(false);
  const [dicasHoje, setDicasHoje] = useState<number>(() => lerDicasHoje());
  /**
   * Flags de acessibilidade específicas desta sessão da lição.
   * Não são persistidas: ao sair da lição (unmount) ou fechar a app
   * voltam ao padrão false, restaurando o fluxo normal de fala/escuta.
   */
  const [semFala, setSemFala] = useState(false);
  const [semEscuta, setSemEscuta] = useState(false);
  const { saldo } = useSaldo();
  const hearts = saldo.vidas + saldo.vidasExtra;

  // Bloqueia a entrada na lição se já não houver vidas.
  useEffect(() => {
    if (hearts <= 0 && !done) {
      toast({
        title: "Sem vidas",
        description: "Recupera vidas para continuar as lições.",
        variant: "destructive",
      });
      navigate("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dobradorMin = tempoRestante("dobrador-xp");
  const dobradorOn = dobradorMin !== null && dobradorMin > 0;

  const passoOriginal = usaScript ? passosExpandidos[index] : null;
  const passo = passoOriginal
    ? transformarPasso(passoOriginal, semFala, semEscuta)
    : null;
  const passoEhFala = passoOriginal?.tipo === "falar";
  const passoEhEscuta =
    passoOriginal?.tipo === "escuta_escolha" ||
    passoOriginal?.tipo === "escuta_escrever" ||
    passoOriginal?.tipo === "escuta_montar";

  const ativarSemFala = () => {
    setSemFala(true);
    toast({
      title: "Modo escrita ativado",
      description:
        "Exercícios de fala viram escrita só nesta lição. Sair volta ao normal.",
    });
  };
  const ativarSemEscuta = () => {
    setSemEscuta(true);
    toast({
      title: "Modo escrita ativado",
      description:
        "Exercícios de escuta viram escrita só nesta lição. Sair volta ao normal.",
    });
  };
  const q = usaScript ? null : QUESTIONS[index];
  const isCorrect = selected === q?.correct;
  const progress = ((index + (checked ? 1 : 0)) / total) * 100;

  const dicasRestantesGratis = Math.max(0, DICAS_GRATIS_DIA - dicasHoje);
  const podePagarDica = saldo.diamantes >= DICA_CUSTO_DIAMANTES;

  const usarDica = () => {
    if (dicaAtiva || checked) return;
    if (dicasRestantesGratis > 0) {
      const n = dicasHoje + 1;
      setDicasHoje(n);
      gravarDicaUsada(n);
      setDicaAtiva(true);
      toast({
        title: "Dica usada",
        description: `Restam ${DICAS_GRATIS_DIA - n} dicas grátis hoje.`,
      });
      return;
    }
    if (podePagarDica) {
      setSaldo((s) => ({ ...s, diamantes: s.diamantes - DICA_CUSTO_DIAMANTES }));
      setDicaAtiva(true);
      toast({
        title: "Dica desbloqueada",
        description: `−${DICA_CUSTO_DIAMANTES} diamantes.`,
      });
      return;
    }
    toast({
      title: "Sem dicas disponíveis",
      description: `Já usaste as ${DICAS_GRATIS_DIA} dicas grátis de hoje e não tens diamantes suficientes (${DICA_CUSTO_DIAMANTES}).`,
      variant: "destructive",
    });
  };

  const handleCheck = () => {
    if (selected === null) return;
    setChecked(true);
    setDicaAtiva(false);
    if (selected === q.correct) {
      setCorrectCount((c) => c + 1);
      registrarAcao("resposta_correta_seguida", 1);
      registrarAcao("palavra_traduzida", 1);
    } else {
      // Vidas globais: consome 1 (do pool extra primeiro, depois normal).
      perderVida();
    }
  };

  // Ao concluir lição: registra ações e credita XP + diamantes
  useEffect(() => {
    if (!done) return;
    const dobrador = dobradorXpAtivo();
    const xp = correctCount * 4 * (dobrador ? 2 : 1);
    registrarAcao("licao_completa", 1);
    registrarAcao("minuto_pratica", 3);
    setSaldo((s) => ({
      ...s,
      xp: s.xp + xp,
      diamantes: s.diamantes + correctCount * 2,
    }));
    if (id) concluirSeccao(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  /* Avança para o próximo passo do script (usa Script). */
  const avancarScript = (certo: boolean, contaComoAcerto: boolean) => {
    if (contaComoAcerto) {
      if (certo) {
        setCorrectCount((c) => c + 1);
        registrarAcao("resposta_correta_seguida", 1);
        registrarAcao("palavra_traduzida", 1);
      } else {
        perderVida();
      }
    }
    if (index + 1 >= totalScript) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
  };

  const handleContinue = () => {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setChecked(false);
  };

  if (done) {
    const dobrador = dobradorXpAtivo();
    const xp = correctCount * 4 * (dobrador ? 2 : 1);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="app-shell flex flex-col items-center justify-center px-6 text-center"
        style={{ minHeight: "100dvh", background: "#fff" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: "hsl(var(--primary))" }}
        >
          <Check className="w-14 h-14 text-white" strokeWidth={4} />
        </motion.div>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: "#5E5C5C" }}>
          Lição completa!
        </h1>
        <p className="text-base text-muted-foreground mb-8">
          Acertaste {correctCount} de {total} perguntas.
        </p>

        <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-8">
          <div
            className="rounded-2xl border-2 p-4 text-center"
            style={{ borderColor: "#FBBD12" }}
          >
            <p className="text-xs font-extrabold tracking-wider" style={{ color: "#FBBD12" }}>
              XP GANHO{dobrador ? " ×2" : ""}
            </p>
            <p className="text-2xl font-extrabold mt-1" style={{ color: "#5E5C5C" }}>
              {xp}
            </p>
          </div>
          <div
            className="rounded-2xl border-2 p-4 text-center"
            style={{ borderColor: "hsl(var(--primary))" }}
          >
            <p
              className="text-xs font-extrabold tracking-wider"
              style={{ color: "hsl(var(--primary))" }}
            >
              PRECISÃO
            </p>
            <p className="text-2xl font-extrabold mt-1" style={{ color: "#5E5C5C" }}>
              {Math.round((correctCount / total) * 100)}%
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="btn-duo btn-duo-primary w-full max-w-xs"
        >
          Continuar
        </button>
      </motion.div>
    );
  }

  // ------------------ Render (modo script) ------------------
  if (usaScript && passo) {
    const contaComoAcerto =
      passo.tipo !== "aprender" &&
      passo.tipo !== "dialogo" &&
      passo.tipo !== "preencher_letras";
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="app-shell flex flex-col px-5 py-4"
        style={{ minHeight: "100dvh", background: "#fff" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/home")}
            aria-label="Sair da lição"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" strokeWidth={3} />
          </button>
          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#86D05D" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex items-center gap-1">
            <KwendiIcon name="coracao" className="w-5 h-5" />
            <span className="font-extrabold text-sm" style={{ color: "hsl(var(--primary))" }}>
              {hearts}
            </span>
          </div>
        </div>

        {/* Chips de acessibilidade da sessão (fala/escuta) */}
        {(passoEhFala || passoEhEscuta || semFala || semEscuta) && (
          <div className="flex flex-wrap gap-2 mb-3 -mt-1">
            {passoEhFala && !semFala && (
              <button
                type="button"
                onClick={ativarSemFala}
                className="flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-full border-2 border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
              >
                <MicOff className="w-3.5 h-3.5" />
                Não posso falar agora
              </button>
            )}
            {passoEhEscuta && !semEscuta && (
              <button
                type="button"
                onClick={ativarSemEscuta}
                className="flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-full border-2 border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
              >
                <VolumeX className="w-3.5 h-3.5" />
                Não posso ouvir agora
              </button>
            )}
            {semFala && (
              <button
                type="button"
                onClick={() => setSemFala(false)}
                className="flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-full text-white"
                style={{ background: "hsl(var(--primary))" }}
                title="Voltar aos exercícios de fala"
              >
                <MicOff className="w-3.5 h-3.5" />
                Modo escrita: fala · desligar
              </button>
            )}
            {semEscuta && (
              <button
                type="button"
                onClick={() => setSemEscuta(false)}
                className="flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-full text-white"
                style={{ background: "hsl(var(--primary))" }}
                title="Voltar aos exercícios de escuta"
              >
                <VolumeX className="w-3.5 h-3.5" />
                Modo escrita: escuta · desligar
              </button>
            )}
          </div>
        )}

        {passo.tipo === "aprender" && (
          <AprenderPasso passo={passo} onContinuar={() => avancarScript(true, false)} />
        )}
        {passo.tipo === "dialogo" && (
          <DialogoPasso passo={passo} onContinuar={() => avancarScript(true, false)} />
        )}
        {passo.tipo === "escuta_escolha" && (
          <EscutaPasso passo={passo} onResolved={(c) => avancarScript(c, contaComoAcerto)} />
        )}
        {passo.tipo === "traduzir_pt_umbundu" && (
          <TraduzirPUPasso passo={passo} onResolved={(c) => avancarScript(c, contaComoAcerto)} />
        )}
        {passo.tipo === "traduzir_umbundu_pt" && (
          <TraduzirUPPasso passo={passo} onResolved={(c) => avancarScript(c, contaComoAcerto)} />
        )}
        {passo.tipo === "montar_frase" && (
          <MontarFrasePasso passo={passo} onResolved={(c) => avancarScript(c, contaComoAcerto)} />
        )}
        {passo.tipo === "escrever" && (
          <EscreverPasso passo={passo} onResolved={(c) => avancarScript(c, contaComoAcerto)} />
        )}
        {passo.tipo === "falar" && (
          <FalarPasso passo={passo} onResolved={(c) => avancarScript(c, contaComoAcerto)} />
        )}
        {passo.tipo === "conversa_escolha" && (
          <ConversaEscolhaPasso key={`conv-${index}`} passo={passo} onResolved={(c) => avancarScript(c, contaComoAcerto)} />
        )}
        {passo.tipo === "emparelhar" && (
          <EmparelharPasso passo={passo} onResolved={(c) => avancarScript(c, contaComoAcerto)} />
        )}
        {passo.tipo === "preencher_lacuna" && (
          <PreencherLacunaPasso passo={passo} onResolved={(c) => avancarScript(c, contaComoAcerto)} />
        )}
        {passo.tipo === "escuta_escrever" && (
          <EscutaEscreverPasso passo={passo} onResolved={(c) => avancarScript(c, contaComoAcerto)} />
        )}
        {passo.tipo === "escuta_montar" && (
          <EscutaMontarPasso passo={passo} onResolved={(c) => avancarScript(c, contaComoAcerto)} />
        )}
        {passo.tipo === "preencher_letras" && (
          <PreencherLetrasPasso
            passo={passo}
            onResolved={(c) => avancarScript(c, contaComoAcerto)}
          />
        )}
      </motion.div>
    );
  }

  // ------------------ Render (modo antigo, fallback) ------------------
  if (!q) {
    // Segurança: nenhum script e nenhuma pergunta legada.
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-shell flex flex-col px-5 py-4"
      style={{ minHeight: "100dvh", background: "#fff" }}
    >
      {/* Header: close + progress + hearts */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/home")}
          aria-label="Sair da lição"
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" strokeWidth={3} />
        </button>
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#86D05D" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex items-center gap-1">
          <KwendiIcon name="coracao" className="w-5 h-5" />
          <span className="font-extrabold text-sm" style={{ color: "hsl(var(--primary))" }}>
            {hearts}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col mt-8">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p
            className="text-xs font-extrabold tracking-widest"
            style={{ color: "#5E5C5C" }}
          >
            PERGUNTA {index + 1}/{total}
          </p>
          <div className="flex items-center gap-1.5">
            {dobradorOn && (
              <span
                className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white"
                style={{ background: "hsl(45 95% 50%)" }}
              >
                <KwendiIcon name="raioxp" className="w-3 h-3" />
                XP×2 · {dobradorMin}min
              </span>
            )}
            {!checked && (
              <button
                type="button"
                onClick={usarDica}
                disabled={dicaAtiva}
                className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full disabled:opacity-60"
                style={{
                  background: "hsl(50 95% 60% / 0.18)",
                  color: "hsl(40 90% 35%)",
                  border: "1px solid hsl(50 95% 60%)",
                }}
                title={
                  dicasRestantesGratis > 0
                    ? `${dicasRestantesGratis} dicas grátis hoje`
                    : `Custa ${DICA_CUSTO_DIAMANTES} diamantes`
                }
              >
                <Lightbulb className="w-3 h-3 fill-current" />
                {dicaAtiva
                  ? "Dica activa"
                  : dicasRestantesGratis > 0
                  ? `Ver dica · ${dicasRestantesGratis} grátis`
                  : `Ver dica · ${DICA_CUSTO_DIAMANTES}💎`}
              </button>
            )}
          </div>
        </div>
        <h2 className="text-2xl font-extrabold mb-6" style={{ color: "#5E5C5C" }}>
          {q.prompt}
        </h2>

        <div className="flex flex-col gap-3">
          {q.options.map((opt, i) => {
            const isSel = selected === i;
            const showCorrect = checked && i === q.correct;
            const showWrong = checked && isSel && i !== q.correct;
            const hint = dicaAtiva && !checked && i === q.correct;
            return (
              <button
                key={i}
                disabled={checked}
                onClick={() => setSelected(i)}
                className="rounded-2xl border-2 px-4 py-4 text-left font-bold text-base transition-colors"
                style={{
                  borderColor: showCorrect
                    ? "#86D05D"
                    : showWrong
                    ? "hsl(var(--primary))"
                    : hint
                    ? "#FBBD12"
                    : isSel
                    ? "hsl(var(--primary))"
                    : "#e5e5e5",
                  background: showCorrect
                    ? "#eaf7e0"
                    : showWrong
                    ? "#fdecec"
                    : hint
                    ? "#fff8e0"
                    : isSel
                    ? "#fff5f5"
                    : "#fff",
                  color: "#5E5C5C",
                  boxShadow: `0 3px 0 ${
                    showCorrect
                      ? "#5fae3a"
                      : showWrong
                      ? "hsl(var(--kwendi-red-dark))"
                      : hint
                      ? "#d99d00"
                      : isSel
                      ? "hsl(var(--kwendi-red-dark))"
                      : "#d4d4d4"
                  }`,
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback + footer button */}
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="rounded-t-2xl px-4 py-3 -mx-5 mb-3"
            style={{
              background: isCorrect ? "#eaf7e0" : "#fdecec",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: isCorrect ? "#86D05D" : "hsl(var(--primary))",
                }}
              >
                {isCorrect ? (
                  <Check className="w-5 h-5 text-white" strokeWidth={4} />
                ) : (
                  <XIcon className="w-5 h-5 text-white" strokeWidth={4} />
                )}
              </div>
              <p
                className="font-extrabold"
                style={{
                  color: isCorrect ? "#5fae3a" : "hsl(var(--kwendi-red-dark))",
                }}
              >
                {isCorrect
                  ? "Boa! Resposta certa."
                  : `Resposta correta: ${q.options[q.correct]}`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        disabled={selected === null}
        onClick={checked ? handleContinue : handleCheck}
        className="btn-duo btn-duo-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {checked ? "Continuar" : "Verificar"}
      </button>
    </motion.div>
  );
};

export default LessonScreen;