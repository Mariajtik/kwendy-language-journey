/**
 * AvaliadorPronuncia — botão de gravação + cartão de resultado.
 * Usa `useAvaliacaoPronuncia` (que chama a edge function `kwendi-stt`).
 */
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Square, Loader2, RotateCcw } from "lucide-react";
import { useAvaliacaoPronuncia } from "@/hooks/useAvaliacaoPronuncia";

interface Props {
  alvo: string;
  compact?: boolean;
}

const AvaliadorPronuncia = ({ alvo, compact = false }: Props) => {
  const { t } = useTranslation();
  const { estado, resultado, iniciar, parar, limpar } = useAvaliacaoPronuncia();

  const aOuvir = estado === "a-ouvir";
  const aAvaliar = estado === "a-avaliar";

  const cor = (score: number) =>
    score >= 80 ? "hsl(140 60% 40%)" : score >= 50 ? "hsl(40 90% 45%)" : "hsl(0 70% 50%)";
  const feedback = (score: number) =>
    score >= 80
      ? t("pronuncia.boa", "Boa pronúncia!")
      : score >= 50
        ? t("pronuncia.quase", "Quase lá — tenta outra vez.")
        : t("pronuncia.tenta", "Tenta outra vez.");

  const clique = () => {
    if (aOuvir) void parar();
    else if (estado === "idle" || estado === "pronto" || estado === "erro") void iniciar(alvo);
  };

  return (
    <div className={compact ? "" : "space-y-2"}>
      <button
        onClick={clique}
        disabled={aAvaliar}
        aria-label={aOuvir ? t("pronuncia.parar", "Parar") : t("pronuncia.praticar", "Praticar pronúncia")}
        className={`${compact ? "w-10 h-10" : "w-12 h-12"} rounded-xl grid place-items-center text-white transition-transform disabled:opacity-50 active:translate-y-0.5`}
        style={{
          background: aOuvir ? "hsl(var(--primary))" : "hsl(280 70% 55%)",
          boxShadow: aOuvir ? "0 3px 0 hsl(var(--kwendi-red-dark))" : "0 3px 0 hsl(280 70% 40%)",
        }}
      >
        {aAvaliar ? <Loader2 className="w-5 h-5 animate-spin" /> : aOuvir ? <Square className="w-5 h-5" fill="currentColor" /> : <Mic className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {resultado && estado === "pronto" && !compact && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border-2 border-border bg-card p-3"
            style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold" style={{ color: cor(resultado.score) }}>
                {resultado.score}%
              </span>
              <button
                onClick={limpar}
                aria-label={t("pronuncia.reset", "Recomeçar")}
                className="w-8 h-8 rounded-lg grid place-items-center text-muted-foreground"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-bold mt-1" style={{ color: cor(resultado.score) }}>
              {feedback(resultado.score)}
            </p>
            {resultado.transcricao && (
              <p className="text-xs text-muted-foreground mt-2 italic">
                {t("pronuncia.ouvi", "Ouvi")}: “{resultado.transcricao}”
              </p>
            )}
            {resultado.erros.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {t("pronuncia.rever", "Rever")}:{" "}
                <span className="font-bold text-foreground">{resultado.erros.join(", ")}</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvaliadorPronuncia;