/**
 * StreakOverlay — modal celebrativo pós-lição.
 * Mostra a chama a acender/subir/manter/apagar com animação e som.
 * Auto-fecha em ~2.4s ou por tap.
 */
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KwendiIcon from "@/components/icons/KwendiIcon";
import { Snowflake } from "lucide-react";
import {
  playStreakIgnite,
  playStreakLost,
  playStreakShield,
  playStreakUp,
} from "@/lib/streakFx";
import { haptics } from "@/lib/haptics";

type Modo = "acender" | "incrementar" | "manter-por-chama" | "quebrada" | "ja-hoje";

interface Props {
  aberto: boolean;
  modo: Modo;
  ofensivaNova: number;
  ofensivaAnterior: number;
  onFechar: () => void;
}

const titulos: Record<Modo, string> = {
  acender: "Chama acesa!",
  incrementar: "Sequência aumentou!",
  "manter-por-chama": "Chama congelada usada",
  quebrada: "A sequência quebrou",
  "ja-hoje": "Já feito hoje",
};

const descricoes: Record<Modo, string> = {
  acender: "Voltas amanhã para manter a chama viva.",
  incrementar: "Continua — cada dia conta.",
  "manter-por-chama": "Consumiste uma chama congelada para salvar a sequência.",
  quebrada: "Amanhã começa uma nova sequência.",
  "ja-hoje": "Já validaste a sequência de hoje. Bom trabalho.",
};

const StreakOverlay = ({ aberto, modo, ofensivaNova, ofensivaAnterior, onFechar }: Props) => {
  useEffect(() => {
    if (!aberto) return;
    if (modo === "acender") { playStreakIgnite(); haptics.celebrate(); }
    else if (modo === "incrementar") { playStreakUp(); haptics.success(); }
    else if (modo === "manter-por-chama") { playStreakShield(); haptics.tap(); }
    else if (modo === "quebrada") { playStreakLost(); haptics.error(); }
    const t = window.setTimeout(onFechar, 2400);
    return () => window.clearTimeout(t);
  }, [aberto, modo, onFechar]);

  const chamaAcesa = modo !== "quebrada";

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onFechar}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.6, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-[86%] max-w-sm rounded-3xl bg-card border-4 border-border p-6 text-center"
            style={{ boxShadow: "0 8px 0 hsl(var(--border))" }}
          >
            <motion.div
              className="relative w-28 h-28 mx-auto mb-4"
              animate={
                modo === "incrementar" || modo === "acender"
                  ? { scale: [0.6, 1.15, 1] }
                  : { scale: [1, 0.9, 1] }
              }
              transition={{ duration: 0.9, times: [0, 0.5, 1] }}
            >
              <KwendiIcon
                name={chamaAcesa ? "chamaAcesa" : "chamaApagada"}
                className="w-28 h-28"
              />
              {modo === "manter-por-chama" && (
                <div
                  className="absolute -top-1 -right-1 w-10 h-10 rounded-full grid place-items-center border-4 border-card"
                  style={{ background: "hsl(200 90% 55%)" }}
                >
                  <Snowflake className="w-5 h-5 text-white" />
                </div>
              )}
            </motion.div>

            <div className="flex items-center justify-center gap-2 mb-1">
              <motion.span
                key={ofensivaNova}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-extrabold tabular-nums"
                style={{ color: chamaAcesa ? "hsl(var(--kwendi-red))" : "hsl(var(--muted-foreground))" }}
              >
                {ofensivaNova}
              </motion.span>
              {ofensivaNova !== ofensivaAnterior && (
                <span className="text-sm font-extrabold text-muted-foreground">
                  ({ofensivaAnterior} → {ofensivaNova})
                </span>
              )}
            </div>

            <h2 className="text-xl font-extrabold text-foreground mb-1">{titulos[modo]}</h2>
            <p className="text-sm text-muted-foreground">{descricoes[modo]}</p>

            <button
              onClick={onFechar}
              className="mt-5 w-full rounded-2xl py-3 font-extrabold text-white"
              style={{
                background: "hsl(var(--primary))",
                boxShadow: "0 4px 0 hsl(var(--kwendi-red-dark))",
              }}
            >
              Continuar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StreakOverlay;