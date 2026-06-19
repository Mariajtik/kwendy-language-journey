/**
 * SecaoScreen.tsx — generic placeholder for Fala / Escuta / Palavras / Alfabeto.
 * Reached from the bottom-nav "..." popover.
 */
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, Ear, Type, AudioLines, Volume2, Puzzle, Music2, Link2, HandHelping, Quote, Languages } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { DICIONARIO } from "@/data/dicionario";
import { bumpStat, STATS } from "@/lib/stats";

const config: Record<
  string,
  { title: string; subtitle: string; color: string; Icon: typeof Mic }
> = {
  fala: {
    title: "Fala",
    subtitle: "Pratica a tua pronúncia em Umbundu.",
    color: "hsl(var(--kwendi-pink))",
    Icon: Mic,
  },
  escuta: {
    title: "Escuta",
    subtitle: "Treina o ouvido com áudios de falantes nativos.",
    color: "hsl(var(--kwendi-blue))",
    Icon: Ear,
  },
  palavras: {
    title: "Palavras",
    subtitle: "Aprende e revê o teu vocabulário.",
    color: "hsl(var(--kwendi-peach))",
    Icon: Type,
  },
  alfabeto: {
    title: "Alfabeto / Pronúncia",
    subtitle: "Sons, sílabas e regras do Umbundu.",
    color: "hsl(var(--kwendi-yellow))",
    Icon: AudioLines,
  },
};

const SecaoScreen = () => {
  const { tipo } = useParams<{ tipo: string }>();
  const navigate = useNavigate();

  if (tipo === "alfabeto") return <AlfabetoView onVoltar={() => navigate(-1)} />;

  const data = (tipo && config[tipo]) || {
    title: "Secção",
    subtitle: "",
    color: "hsl(var(--primary))",
    Icon: Mic,
  };
  const { Icon } = data;

  return (
    <motion.div
      className="app-shell relative bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 pt-6 pb-32">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 self-start"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-muted-foreground" />
        </button>

        <h1 className="text-2xl font-extrabold text-foreground">{data.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{data.subtitle}</p>

        <div className="mt-12 flex flex-col items-center text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
            style={{ background: `${data.color.replace(")", " / 0.18)")}` }}
          >
            <Icon className="w-12 h-12" style={{ color: data.color }} />
          </div>
          <p className="font-bold text-foreground">Em breve</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Estamos a preparar exercícios específicos para esta secção.
          </p>
        </div>
      </div>
      <BottomNav />
    </motion.div>
  );
};

export default SecaoScreen;

/* =====================================================================
   Alfabeto / Fonética / Fonologia do Umbundu
   Reaproveita conhecimento do livro de referência (Wambu Kalunga, etc.)
   ===================================================================== */

const LETRAS = [
  "a","e","i","o","u",
  "b","c","d","f","h","j","k","l","m","n","ng","ñ","p","s","t","v","w","y",
];

const CARDS: { titulo: string; texto: string; cor: string; Icon: LucideIcon }[] = [
  {
    titulo: "Estrutura C-V-C",
    texto:
      "Os radicais umbundu são tipicamente consoante-vogal-consoante: kala (ser), kwata (agarrar). K = inicial, a = vogal, l = final.",
    cor: "5 84% 42%",
    Icon: Puzzle,
  },
  {
    titulo: 'Prefixo "ku" / "oku"',
    texto:
      "Prefixo nominal da classe 15 que marca o infinitivo verbal. Ex.: kukala / okukala = ser/estar. A vogal (o,u) entre prefixo e radical é a vogal de extensão.",
    cor: "25 90% 55%",
    Icon: Languages,
  },
  {
    titulo: "A tonalidade muda o sentido",
    texto:
      "Umbundu é língua musical: a mesma palavra muda de significado conforme a tonalidade, o movimento dos lábios e os pontos de articulação.",
    cor: "265 60% 55%",
    Icon: Music2,
  },
  {
    titulo: "Aglutinação",
    texto:
      "As palavras formam-se por aglutinação: a um radical antepõe-se um prefixo que muda o significado, e pospõem-se sufixos para tempos verbais.",
    cor: "150 55% 38%",
    Icon: Link2,
  },
  {
    titulo: "Palavra · Gesto · Som · Sentimento",
    texto:
      "Na cultura umbundu, comunicar usa ondaka (palavra), ondimbu (gesto), ocileñgi (som) e ovisimilo (sentimentos). Tudo conta.",
    cor: "330 75% 55%",
    Icon: HandHelping,
  },
  {
    titulo: "Provérbio: a voz mais condensada",
    texto:
      "Na sabedoria ovimbundu o provérbio é a forma mais densa da linguagem — atinge o ouvinte em profundidade e provoca resposta.",
    cor: "28 55% 45%",
    Icon: Quote,
  },
];

const AlfabetoView = ({ onVoltar }: { onVoltar: () => void }) => {
  const [letraAtiva, setLetraAtiva] = useState<string | null>(null);
  const [escutadas, setEscutadas] = useState<Set<string>>(new Set());

  const falar = (txt: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = "pt-PT";
    u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const exemploDe = (letra: string) =>
    DICIONARIO.find((d) => d.umbundu.toLowerCase().startsWith(letra.toLowerCase()));

  const tocarLetra = (l: string) => {
    falar(l);
    setLetraAtiva((cur) => (cur === l ? null : l));
    if (!escutadas.has(l)) {
      bumpStat(STATS.alfabetoEscutas);
      setEscutadas((p) => new Set(p).add(l));
    }
  };

  return (
    <motion.div
      className="app-shell relative bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="px-5 pt-6 pb-32">
        <button onClick={onVoltar} aria-label="Voltar" className="mb-4">
          <ArrowLeft className="w-6 h-6 text-muted-foreground" />
        </button>
        <h1 className="text-2xl font-extrabold text-foreground">Alfabeto Umbundu</h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-muted-foreground">
            Toca em cada letra para ouvir o som.
          </p>
          <span
            className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
            style={{ background: "hsl(160 60% 35% / 0.15)", color: "hsl(160 60% 30%)" }}
          >
            {escutadas.size}/{LETRAS.length}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 mt-5">
          {LETRAS.map((l) => (
            <button
              key={l}
              onClick={() => tocarLetra(l)}
              className="aspect-square rounded-2xl border-2 font-extrabold text-xl active:translate-y-0.5 transition"
              style={{
                background: letraAtiva === l ? "hsl(202 80% 50%)" : "hsl(var(--card))",
                color: letraAtiva === l ? "#fff" : "hsl(var(--foreground))",
                borderColor: letraAtiva === l ? "hsl(202 80% 50%)" : "hsl(var(--border))",
                boxShadow: letraAtiva === l
                  ? "0 3px 0 hsl(202 80% 35%)"
                  : escutadas.has(l)
                  ? "0 3px 0 hsl(160 60% 30% / 0.5)"
                  : "0 3px 0 hsl(var(--border))",
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {letraAtiva && (() => {
          const ex = exemploDe(letraAtiva);
          return (
            <div
              className="mt-4 rounded-2xl border-2 border-border bg-card p-3 flex items-center gap-3"
              style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
            >
              <div
                className="w-12 h-12 rounded-xl grid place-items-center text-white text-xl font-extrabold"
                style={{ background: "hsl(202 80% 50%)" }}
              >
                {letraAtiva}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-extrabold tracking-wider text-muted-foreground">
                  EXEMPLO
                </p>
                {ex ? (
                  <>
                    <p className="font-extrabold text-foreground leading-tight">{ex.umbundu}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{ex.pt}</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Sem exemplo disponível ainda para esta letra.
                  </p>
                )}
              </div>
              {ex && (
                <button
                  onClick={() => falar(ex.umbundu)}
                  aria-label="Ouvir exemplo"
                  className="w-10 h-10 rounded-xl grid place-items-center text-white"
                  style={{ background: "hsl(202 80% 50%)", boxShadow: "0 3px 0 hsl(202 80% 35%)" }}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
            </div>
          );
        })()}

        <h2 className="text-lg font-extrabold text-foreground mt-8 mb-3">
          Fonética & Fonologia
        </h2>
        <div className="space-y-3">
          {CARDS.map((c) => (
            <div
              key={c.titulo}
              className="rounded-2xl p-4 bg-card border-2 border-border"
              style={{ boxShadow: `0 3px 0 hsl(${c.cor} / 0.45)` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-9 h-9 rounded-xl grid place-items-center"
                  style={{ background: `hsl(${c.cor} / 0.15)`, color: `hsl(${c.cor})` }}
                >
                  <c.Icon className="w-5 h-5" />
                </span>
                <h3
                  className="font-extrabold text-foreground"
                  style={{ color: `hsl(${c.cor})` }}
                >
                  {c.titulo}
                </h3>
              </div>
              <p className="text-sm text-foreground leading-snug">{c.texto}</p>
            </div>
          ))}
        </div>

        <div
          className="mt-6 rounded-2xl p-4 text-white"
          style={{
            background:
              "linear-gradient(135deg, hsl(15 70% 35%), hsl(28 55% 45%))",
            boxShadow: "0 4px 0 hsl(15 70% 20%)",
          }}
        >
          <p className="text-sm italic leading-snug">
            "Na ciência não há via magna, e só aquele que não temer o cansaço e
            escalar caminhos espinhosos poderá alcançar cumes resplandecentes."
          </p>
          <p className="text-[11px] font-extrabold tracking-wider mt-2 opacity-90">
            — Karl Marx (citado por Dr. Mbala Vita)
          </p>
        </div>
      </div>
      <BottomNav />
    </motion.div>
  );
};