/**
 * FalaEscutaScreen — pratica de fala (gravar e comparar) + escuta (quiz).
 * Substitui as antigas telas separadas Fala e Escuta.
 */
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mic, Square, Play, Volume2, Check, X } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { DICIONARIO } from "@/data/dicionario";

type Tab = "fala" | "escuta";

const FRASES_FALA = [
  { umbundu: "Wakolelepo", pt: "Olá / Bom dia" },
  { umbundu: "Ndapandula calwa", pt: "Muito obrigado" },
  { umbundu: "Wakola?", pt: "Como estás?" },
  { umbundu: "Ndakola, ndapandula", pt: "Estou bem, obrigado" },
  { umbundu: "Kalapo ciwa", pt: "Adeus / Fica bem" },
];

function falar(texto: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "pt-PT";
  u.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

const FalaTab = () => {
  const [gravandoIdx, setGravandoIdx] = useState<number | null>(null);
  const [gravacoes, setGravacoes] = useState<Record<number, string>>({});
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const iniciarGravacao = async (idx: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType });
        const url = URL.createObjectURL(blob);
        setGravacoes((p) => ({ ...p, [idx]: url }));
        setGravandoIdx(null);
      };
      rec.start();
      recRef.current = rec;
      setGravandoIdx(idx);
    } catch {
      alert("Permite acesso ao microfone para praticar a fala.");
    }
  };

  const pararGravacao = () => recRef.current?.stop();

  return (
    <div className="space-y-3">
      {FRASES_FALA.map((f, idx) => {
        const ativo = gravandoIdx === idx;
        const grav = gravacoes[idx];
        return (
          <div
            key={idx}
            className="rounded-2xl border-2 border-border bg-card p-4"
            style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
          >
            <p className="font-extrabold text-foreground">{f.umbundu}</p>
            <p className="text-sm text-muted-foreground mb-3">{f.pt}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => falar(f.umbundu)}
                className="flex-1 rounded-xl py-2.5 font-extrabold text-sm flex items-center justify-center gap-2 text-white"
                style={{ background: "hsl(202 80% 50%)", boxShadow: "0 3px 0 hsl(202 80% 35%)" }}
              >
                <Volume2 className="w-4 h-4" /> Ouvir
              </button>
              <button
                onClick={ativo ? pararGravacao : () => iniciarGravacao(idx)}
                className="flex-1 rounded-xl py-2.5 font-extrabold text-sm flex items-center justify-center gap-2 text-white"
                style={{
                  background: ativo ? "hsl(var(--primary))" : "hsl(160 60% 35%)",
                  boxShadow: ativo
                    ? "0 3px 0 hsl(var(--kwendi-red-dark))"
                    : "0 3px 0 hsl(160 60% 25%)",
                }}
              >
                {ativo ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {ativo ? "Parar" : "Gravar"}
              </button>
              {grav && (
                <button
                  onClick={() => new Audio(grav).play()}
                  aria-label="Ouvir gravação"
                  className="w-11 h-11 rounded-xl grid place-items-center text-white"
                  style={{ background: "hsl(45 96% 53%)", boxShadow: "0 3px 0 hsl(40 90% 42%)" }}
                >
                  <Play className="w-4 h-4" fill="#fff" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const EscutaTab = () => {
  const itens = useMemo(() => DICIONARIO.slice(0, 30), []);
  const [idx, setIdx] = useState(0);
  const [escolhido, setEscolhido] = useState<string | null>(null);

  const certo = itens[idx];
  const opcoes = useMemo(() => {
    const outras = itens
      .filter((x) => x.id !== certo.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    return [certo, ...outras].sort(() => Math.random() - 0.5);
  }, [certo, itens]);

  const acertou = escolhido === certo.id;

  return (
    <div className="space-y-4">
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
          const isEsc = escolhido === o.id;
          const isCerto = escolhido && o.id === certo.id;
          return (
            <button
              key={o.id}
              disabled={!!escolhido}
              onClick={() => setEscolhido(o.id)}
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
            setIdx((idx + 1) % itens.length);
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

const FalaEscutaScreen = () => {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("fala");

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
          <div>
            <h1 className="text-xl font-extrabold text-foreground leading-none">
              Fala & Escuta
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1">
              Treina pronúncia e ouvido
            </p>
          </div>
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

      <div className="px-4 py-4 pb-28">
        {tab === "fala" ? <FalaTab /> : <EscutaTab />}
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default FalaEscutaScreen;