/**
 * Cartão 3D com flip que revela a curiosidade sobre o país da pergunta.
 * Face frontal: resultado (certo/errado + resposta correta).
 * Face traseira: gradiente da bandeira + curiosidade + emoji.
 */
import { motion } from "framer-motion";
import type { PaisAfrica } from "@/data/paisesAfrica";

interface Props {
  pais: PaisAfrica;
  acertou: boolean;
  respostaCorreta: string;
  curiosidade: string;
}

const CartaoCuriosidade = ({ pais, acertou, respostaCorreta, curiosidade }: Props) => {
  return (
    <div
      className="relative w-full"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 180 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Frente */}
        <div
          className="rounded-2xl bg-muted px-4 py-4"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-1">
            {acertou ? "Boa! Resposta certa" : "Quase! Resposta correta"}
          </p>
          <p className="font-bold text-foreground">{respostaCorreta}</p>
        </div>

        {/* Trás */}
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-2xl px-4 py-4 text-white"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(135deg, hsl(${pais.bandeira[0]}), hsl(${pais.bandeira[1]}) 55%, hsl(${pais.bandeira[2]}))`,
            boxShadow: "0 6px 0 hsl(0 0% 0% / 0.15)",
          }}
        >
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest opacity-90">
              Curiosidade · {pais.emoji} {pais.nome}
            </p>
            <p className="mt-1 font-bold text-sm leading-relaxed drop-shadow">
              {curiosidade}
            </p>
          </div>
          <p className="mt-3 text-[10px] font-extrabold uppercase tracking-widest opacity-80">
            {acertou ? "✓ Acertaste" : `Resposta correta: ${respostaCorreta}`}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CartaoCuriosidade;