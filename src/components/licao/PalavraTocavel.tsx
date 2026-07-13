/**
 * PalavraTocavel — envolve palavras/expressões em Umbundu dentro dos textos
 * de uma lição. Ao tocar mostra um popover com tradução + botão de ouvir.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { encontrarNoVocab, type EntradaVocab } from "@/data/licoes/vocabulario";
import { falarKwendi } from "@/lib/kwendiVoice";

function falar(texto: string) {
  void falarKwendi(texto, { contexto: "vocab" });
}

interface Props {
  umbundu: string;
  texto?: string;
  ptFallback?: string;
  className?: string;
}

const PalavraTocavel = ({ umbundu, texto, ptFallback, className = "" }: Props) => {
  const [aberto, setAberto] = useState(false);
  const entrada: EntradaVocab | null =
    encontrarNoVocab(umbundu) ??
    (ptFallback ? { umbundu, pt: ptFallback } : null);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setAberto((v) => !v);
        }}
        className={`underline decoration-dotted underline-offset-4 decoration-primary/70 font-extrabold hover:decoration-primary transition ${className}`}
        style={{ color: "inherit" }}
      >
        {texto ?? umbundu}
      </button>

      <AnimatePresence>
        {aberto && (
          <>
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setAberto(false)}
              className="fixed inset-0 z-40 cursor-default"
              style={{ background: "transparent" }}
            />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 left-1/2 -translate-x-1/2 top-[calc(100%+6px)] w-64 rounded-2xl bg-card border-2 border-border p-3 text-left"
              style={{ boxShadow: "0 6px 0 hsl(var(--border))" }}
            >
              <p className="text-base font-extrabold text-foreground leading-tight">
                {entrada?.umbundu ?? umbundu}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {entrada?.pt ?? "Palavra em Umbundu"}
              </p>
              {entrada?.exemplo && (
                <p className="text-xs italic text-muted-foreground mt-1">
                  {entrada.exemplo}
                </p>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  falar(entrada?.umbundu ?? umbundu);
                }}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-extrabold"
                style={{ color: "hsl(202 80% 45%)" }}
              >
                <Volume2 className="w-3.5 h-3.5" /> Ouvir pronúncia
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </span>
  );
};

export default PalavraTocavel;