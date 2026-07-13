/**
 * SemanaOfensiva — faixa horizontal S T Q Q S S D. Marca com chama os
 * dias em que houve pelo menos uma lição concluída na semana ISO actual.
 * Toque num dia dispara som+haptic.
 */
import { motion } from "framer-motion";
import KwendiIcon from "@/components/icons/KwendiIcon";
import { useEstatisticas } from "@/hooks/useEstatisticas";

const DIAS_ISO_ORDEM = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"] as const;
const ROTULOS: Record<(typeof DIAS_ISO_ORDEM)[number], string> = {
  seg: "S",
  ter: "T",
  qua: "Q",
  qui: "Q",
  sex: "S",
  sab: "S",
  dom: "D",
};

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function inicioSemana(ref: Date): Date {
  const d = new Date(ref);
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - dow);
  return d;
}

function vibrarSuave() {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(15);
  } catch {
    /* noop */
  }
}

const SemanaOfensiva = ({ titulo = "Esta semana" }: { titulo?: string }) => {
  const { dados } = useEstatisticas();
  const hoje = new Date();
  const ini = inicioSemana(hoje);
  const ativos = new Set(dados.diasAtivosSemana);
  const hojeIso = toISODate(hoje);

  return (
    <div className="rounded-2xl bg-white/95 backdrop-blur px-4 py-3 mb-3 shadow-sm border border-black/5">
      <p className="text-[11px] font-extrabold tracking-widest uppercase text-muted-foreground mb-2">
        {titulo}
      </p>
      <div className="flex items-center justify-between gap-2">
        {DIAS_ISO_ORDEM.map((chave, idx) => {
          const d = new Date(ini);
          d.setDate(ini.getDate() + idx);
          const iso = toISODate(d);
          const aceso = ativos.has(iso);
          const isHoje = iso === hojeIso;
          return (
            <button
              key={chave}
              onClick={vibrarSuave}
              aria-label={`${ROTULOS[chave]} ${aceso ? "com chama" : "sem chama"}`}
              className="flex flex-col items-center gap-1 min-w-0"
            >
              <span
                className="text-[10px] font-bold"
                style={{ color: isHoje ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
              >
                {ROTULOS[chave]}
              </span>
              <motion.span
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: aceso ? "hsl(var(--primary) / 0.12)" : "hsl(var(--muted) / 0.6)",
                  outline: isHoje ? "2px solid hsl(var(--primary))" : undefined,
                }}
              >
                <KwendiIcon
                  name={aceso ? "chamaAcesa" : "chamaApagada"}
                  className="w-5 h-5"
                />
              </motion.span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SemanaOfensiva;