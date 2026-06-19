/**
 * FalaEscutaScreen — versão "Duo-like".
 * Liga-se às unidades desbloqueadas via useProgresso e usa o
 * pool de frases (`falaEscutaPool`) para alimentar Fala e Escuta.
 *
 * Fala: frase grande, microfone gigante, barra de "match" simulada e
 *   contagem 1/N por sessão.
 * Escuta: 5 perguntas com áudio + 3 opções, progresso superior e ecrã final.
 */
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mic, Square, Volume2, Check, X, ChevronDown } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { DICIONARIO } from "@/data/dicionario";
import { useProgresso } from "@/hooks/useProgresso";
import { CURRICULO, type Unidade } from "@/data/curriculo";
import { getFrasesParaUnidade, type Frase } from "@/data/falaEscutaPool";
import { bumpStat, STATS } from "@/lib/stats";
import { useSaldo } from "@/hooks/useSaldo";

type Tab = "fala" | "escuta";

function falar(texto: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "pt-PT";
  u.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/** Devolve todas as unidades até (e incluindo) a unidade atual. */
function unidadesDesbloqueadas(atualId: string): Unidade[] {
  const out: Unidade[] = [];
  for (const m of CURRICULO) {
    for (const u of m.unidades) {
      out.push(u);
      if (u.id === atualId) return out;
    }
  }
  return out;
}

/* ---------------- FALA ---------------- */

const FalaTab = ({ frases }: { frases: Frase[] }) => {
  const { adicionarXP } = useSaldo();
  const [idx, setIdx] = useState(0);
  const [gravando, setGravando] = useState(false);
  const [match, setMatch] = useState<number | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const frase = frases[idx];

  const iniciar = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        // "match" simulado entre 70–95%
        setMatch(Math.floor(70 + Math.random() * 26));
        bumpStat(STATS.falaGravacoes);
        adicionarXP(5);
        setGravando(false);
      };
      rec.start();
      recRef.current = rec;
      setMatch(null);
      setGravando(true);
    } catch {
      alert("Permite acesso ao microfone para praticar a fala.");
    }
  };

  const parar = () => recRef.current?.stop();

  const proxima = () => {
    setMatch(null);
    setIdx((i) => (i + 1) % frases.length);
  };

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-[11px] font-extrabold tracking-widest text-muted-foreground mb-2">
        FRASE {idx + 1} / {frases.length}
      </p>
      <div
        className="w-full rounded-2xl p-5 bg-card border-2 border-border mb-6"
        style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
      >
        <p className="text-2xl font-extrabold text-foreground leading-tight">
          {frase.umbundu}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{frase.pt}</p>
        <button
          onClick={() => falar(frase.umbundu)}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-extrabold"
          style={{ color: "hsl(202 80% 45%)" }}
        >
          <Volume2 className="w-4 h-4" /> Ouvir
        </button>
      </div>

      <motion.button
        onClick={gravando ? parar : iniciar}
        whileTap={{ scale: 0.94 }}
        animate={gravando ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={gravando ? { duration: 1.2, repeat: Infinity } : undefined}
        aria-label={gravando ? "Parar" : "Gravar"}
        className="w-28 h-28 rounded-full grid place-items-center text-white"
        style={{
          background: gravando ? "hsl(var(--primary))" : "hsl(160 60% 35%)",
          boxShadow: gravando
            ? "0 8px 0 hsl(var(--kwendi-red-dark))"
            : "0 8px 0 hsl(160 60% 25%)",
        }}
      >
        {gravando ? <Square className="w-10 h-10" /> : <Mic className="w-12 h-12" />}
      </motion.button>
      <p className="text-xs font-bold text-muted-foreground mt-3">
        {gravando ? "A ouvir-te…" : "Toca para gravares a tua pronúncia"}
      </p>

      {match !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mt-6 rounded-2xl p-4 bg-card border-2 border-border"
          style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold tracking-wider text-muted-foreground">
              SEMELHANÇA
            </span>
            <span
              className="text-sm font-extrabold"
              style={{ color: match >= 85 ? "hsl(101 45% 35%)" : "hsl(var(--primary))" }}
            >
              {match}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${match}%` }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-full"
              style={{
                background:
                  match >= 85 ? "hsl(101 45% 45%)" : "hsl(var(--primary))",
              }}
            />
          </div>
          <button
            onClick={proxima}
            className="mt-4 w-full rounded-2xl py-3 font-extrabold text-white"
            style={{
              background: "hsl(var(--primary))",
              boxShadow: "0 4px 0 hsl(var(--kwendi-red-dark))",
            }}
          >
            Próxima →
          </button>
        </motion.div>
      )}
    </div>
  );
};

/* ---------------- ESCUTA ---------------- */

const TOTAL_PERG = 5;

const EscutaTab = ({ frases }: { frases: Frase[] }) => {
  const { adicionarXP } = useSaldo();
  const pool = useMemo(
    () => (frases.length >= 3 ? frases : [...frases, ...DICIONARIO.slice(0, 6)]),
    [frases]
  );
  const [q, setQ] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [escolhido, setEscolhido] = useState<string | null>(null);

  const certo = pool[q % pool.length];
  const opcoes = useMemo(() => {
    const outras = pool
      .filter((x) => x.pt !== certo.pt)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    return [certo, ...outras].sort(() => Math.random() - 0.5);
  }, [certo, pool]);

  const acertou = escolhido === certo.pt;
  const acabou = q >= TOTAL_PERG;

  if (acabou) {
    return (
      <div className="text-center py-10">
        <div
          className="w-24 h-24 mx-auto rounded-full grid place-items-center text-white mb-4"
          style={{ background: "hsl(101 45% 45%)", boxShadow: "0 6px 0 hsl(101 45% 30%)" }}
        >
          <Check className="w-12 h-12" strokeWidth={4} />
        </div>
        <h3 className="text-xl font-extrabold text-foreground">Boa sessão!</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Acertaste {acertos} de {TOTAL_PERG}.
        </p>
        <button
          onClick={() => {
            setQ(0);
            setAcertos(0);
            setEscolhido(null);
          }}
          className="mt-6 rounded-2xl px-6 py-3 font-extrabold text-white"
          style={{ background: "hsl(var(--primary))", boxShadow: "0 4px 0 hsl(var(--kwendi-red-dark))" }}
        >
          Treinar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de progresso estilo lição */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-extrabold tracking-wider text-muted-foreground">
          {q + 1}/{TOTAL_PERG}
        </span>
        <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            animate={{ width: `${((q) / TOTAL_PERG) * 100}%` }}
            className="h-full rounded-full"
            style={{ background: "hsl(101 45% 45%)" }}
          />
        </div>
      </div>

      <div
        className="rounded-2xl p-5 text-center bg-card border-2 border-border"
        style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
      >
        <p className="text-xs font-extrabold tracking-widest text-muted-foreground mb-2">
          OUVE E ESCOLHE
        </p>
        <button
          onClick={() => falar(certo.umbundu)}
          aria-label="Reproduzir"
          className="w-20 h-20 mx-auto rounded-full grid place-items-center text-white"
          style={{
            background: "hsl(202 80% 50%)",
            boxShadow: "0 5px 0 hsl(202 80% 35%)",
          }}
        >
          <Volume2 className="w-10 h-10" />
        </button>
      </div>

      <div className="space-y-2">
        {opcoes.map((o) => {
          const isEsc = escolhido === o.pt;
          const isCerto = escolhido && o.pt === certo.pt;
          return (
            <button
              key={o.pt}
              disabled={!!escolhido}
              onClick={() => {
                setEscolhido(o.pt);
                if (o.pt === certo.pt) {
                  setAcertos((a) => a + 1);
                  adicionarXP(3);
                }
              }}
              className="w-full rounded-2xl border-2 px-4 py-3 text-left font-extrabold transition flex items-center justify-between"
              style={{
                background: isCerto
                  ? "hsl(101 55% 59% / 0.2)"
                  : isEsc
                  ? "hsl(var(--primary) / 0.15)"
                  : "hsl(var(--card))",
                borderColor: isCerto
                  ? "hsl(101 45% 45%)"
                  : isEsc
                  ? "hsl(var(--primary))"
                  : "hsl(var(--border))",
                color: "hsl(var(--foreground))",
              }}
            >
              {o.pt}
              {isCerto && <Check className="w-5 h-5" style={{ color: "hsl(101 45% 45%)" }} />}
              {isEsc && !isCerto && (
                <X className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
              )}
            </button>
          );
        })}
      </div>

      {escolhido && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            setEscolhido(null);
            setQ((n) => n + 1);
          }}
          className="w-full rounded-2xl py-3 font-extrabold text-white"
          style={{
            background: acertou ? "hsl(101 45% 45%)" : "hsl(var(--primary))",
            boxShadow: acertou
              ? "0 4px 0 hsl(101 45% 30%)"
              : "0 4px 0 hsl(var(--kwendi-red-dark))",
          }}
        >
          {acertou ? "Boa! Continuar →" : "Continuar →"}
        </motion.button>
      )}
    </div>
  );
};

/* ---------------- SHELL ---------------- */

const FalaEscutaScreen = () => {
  const nav = useNavigate();
  const { estado } = useProgresso();
  const desbloqueadas = useMemo(
    () => unidadesDesbloqueadas(estado.unidadeAtual),
    [estado.unidadeAtual]
  );
  const [unidadeId, setUnidadeId] = useState<string>(
    desbloqueadas[desbloqueadas.length - 1]?.id ?? estado.unidadeAtual
  );
  const [tab, setTab] = useState<Tab>("fala");

  const frases = useMemo(() => getFrasesParaUnidade(unidadeId), [unidadeId]);
  const unidadeAtual = desbloqueadas.find((u) => u.id === unidadeId);

  return (
    <motion.div
      className="app-shell relative bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => nav(-1)}
            aria-label="Voltar"
            className="w-10 h-10 rounded-xl border-2 border-border bg-card grid place-items-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold text-foreground leading-none">
              Fala & Escuta
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1">
              Treina a unidade desbloqueada
            </p>
          </div>
        </div>

        {/* Seletor de unidade */}
        <div className="relative mb-3">
          <select
            value={unidadeId}
            onChange={(e) => setUnidadeId(e.target.value)}
            className="w-full appearance-none rounded-2xl border-2 border-border bg-card px-3 py-2.5 pr-9 font-extrabold text-sm text-foreground"
            style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
          >
            {desbloqueadas.map((u) => (
              <option key={u.id} value={u.id}>
                {u.titulo}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
        </div>

        <div className="flex gap-2">
          {(["fala", "escuta"] as Tab[]).map((t) => {
            const ativo = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 rounded-full py-2 text-xs font-extrabold transition"
                style={{
                  background: ativo ? "hsl(var(--primary))" : "hsl(var(--card))",
                  color: ativo ? "#fff" : "hsl(var(--muted-foreground))",
                  border: `2px solid ${ativo ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
                  boxShadow: ativo ? "0 3px 0 hsl(var(--kwendi-red-dark))" : undefined,
                }}
              >
                {t === "fala" ? "Fala" : "Escuta"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-5 pb-28">
        {unidadeAtual && (
          <p className="text-[11px] font-extrabold tracking-wider text-muted-foreground mb-3">
            UNIDADE · {unidadeAtual.titulo.toUpperCase()}
          </p>
        )}
        {tab === "fala" ? <FalaTab frases={frases} /> : <EscutaTab frases={frases} />}
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default FalaEscutaScreen;