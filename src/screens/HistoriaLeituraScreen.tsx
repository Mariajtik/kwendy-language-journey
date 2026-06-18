/**
 * HistoriaLeituraScreen.tsx — leitura paginada, capítulo a capítulo.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, X, Languages } from "lucide-react";
import { getHistoria } from "@/data/historias";

const HistoriaLeituraScreen = () => {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const h = getHistoria(id);
  const [idx, setIdx] = useState(0);
  const [showVocab, setShowVocab] = useState(false);

  if (!h || h.capitulos.length === 0) {
    return (
      <div className="app-shell p-8">
        <p>História indisponível.</p>
        <button onClick={() => nav("/historias")} className="underline mt-4">Voltar</button>
      </div>
    );
  }

  const cap = h.capitulos[idx];
  const total = h.capitulos.length;
  const progress = ((idx + 1) / total) * 100;

  const next = () => {
    if (idx < total - 1) setIdx(idx + 1);
    else nav(`/historias/${h.id}/fim`);
  };
  const prev = () => idx > 0 && setIdx(idx - 1);

  return (
    <motion.div
      className="app-shell relative bg-background flex flex-col"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Top bar */}
      <div className="px-4 pt-4 flex items-center gap-3">
        <button
          onClick={() => nav(`/historias/${h.id}`)}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
          aria-label="Sair"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `hsl(${h.cor})` }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
        {cap.vocabulario && cap.vocabulario.length > 0 && (
          <button
            onClick={() => setShowVocab((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white"
            style={{ background: `hsl(${h.cor})` }}
            aria-label="Vocabulário"
          >
            <Languages className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-6 pt-6 pb-32 flex-1">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: `hsl(${h.cor})` }}>
          Capítulo {idx + 1} de {total}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={cap.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-2xl font-extrabold text-foreground mt-1 mb-5 leading-tight">
              {cap.titulo}
            </h2>
            <div className="space-y-4">
              {cap.paragrafos.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-foreground/90">
                  {p}
                </p>
              ))}
            </div>

            {showVocab && cap.vocabulario && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-2xl border border-border bg-card"
              >
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: `hsl(${h.cor})` }}>
                  Palavras em Umbundu
                </p>
                <ul className="divide-y divide-border">
                  {cap.vocabulario.map((v) => (
                    <li key={v.umbundu} className="py-2 flex items-baseline justify-between gap-3">
                      <span className="font-extrabold text-foreground">{v.umbundu}</span>
                      <span className="text-sm text-muted-foreground text-right">{v.pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-4 bg-background/95 backdrop-blur border-t border-border flex gap-3">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold bg-muted text-foreground disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>
        <button
          onClick={next}
          className="flex-[1.6] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-extrabold text-white"
          style={{ background: `hsl(${h.cor})`, boxShadow: `0 4px 0 hsl(${h.corEscura})` }}
        >
          {idx === total - 1 ? "Concluir" : "Próximo"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default HistoriaLeituraScreen;