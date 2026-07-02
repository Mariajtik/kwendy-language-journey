/**
 * Cartão único (sem flip) com as cores da bandeira do país.
 * Mostra o estado (acerto/erro), a resposta correta, a explicação
 * e a curiosidade — tudo coerente numa hierarquia clara.
 */
import { motion } from "framer-motion";
import type { PaisAfrica } from "@/data/paisesAfrica";

interface Props {
  pais: PaisAfrica;
  acertou: boolean;
  respostaCorreta: string;
  curiosidade: string;
  explicacao?: string;
}

const CartaoCuriosidade = ({
  pais,
  acertou,
  respostaCorreta,
  curiosidade,
  explicacao,
}: Props) => {
  const chipBg = acertou ? "hsl(142 70% 42% / 0.9)" : "hsl(0 0% 100% / 0.18)";
  const chipLabel = acertou ? "✓ Acertaste" : "Resposta correta";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden rounded-3xl px-5 py-4 text-white"
      style={{
        background: `linear-gradient(135deg, hsl(${pais.bandeira[0]}), hsl(${pais.bandeira[1]}) 55%, hsl(${pais.bandeira[2]}))`,
        boxShadow: "0 6px 0 hsl(0 0% 0% / 0.18)",
      }}
    >
      {/* Brilho decorativo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-2xl"
        style={{ background: "hsl(0 0% 100% / 0.18)" }}
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white"
            style={{ background: chipBg }}
          >
            {chipLabel}
          </span>
          <span className="text-lg drop-shadow" aria-hidden>
            {pais.emoji}
          </span>
        </div>

        <p className="mt-2 text-base font-black leading-snug drop-shadow">
          {respostaCorreta}
        </p>

        {explicacao && (
          <p className="mt-2 text-[13px] font-semibold leading-relaxed opacity-95 drop-shadow-sm">
            {explicacao}
          </p>
        )}

        <div className="mt-3 border-t border-white/25 pt-2">
          <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-90">
            Curiosidade · {pais.nome}
          </p>
          <p className="mt-1 text-[13px] font-semibold leading-relaxed drop-shadow-sm">
            {curiosidade}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CartaoCuriosidade;