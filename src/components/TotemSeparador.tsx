/**
 * TotemSeparador.tsx
 * Separador visual entre módulos: cerca de madeira com portão
 * fechado e cadeado dourado. O número do próximo módulo aparece
 * sobre o cadeado.
 */

import cercaUrl from "@/assets/separadores/cerca-portao.png";
import { motion } from "framer-motion";

type Props = {
  numeroProximoModulo?: number;
  variante?: string;
};

const TotemSeparador = ({ numeroProximoModulo }: Props) => {
  return (
    <div className="my-8 w-full flex justify-center px-2" aria-hidden>
      <motion.div
        className="relative w-full"
        style={{ maxWidth: 420 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={cercaUrl}
          alt=""
          loading="lazy"
          className="block w-full h-auto object-contain select-none"
          style={{ filter: "drop-shadow(0 8px 6px rgba(0,0,0,0.35))" }}
          draggable={false}
        />
        {/* Número centralizado no cadeado do portão */}
        {numeroProximoModulo !== undefined && (
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "14%",
              aspectRatio: "1 / 1",
              color: "#6B3F1D",
              fontWeight: 900,
              fontFamily: "Nunito, system-ui, sans-serif",
              fontSize: "clamp(20px, 5.5vw, 34px)",
              lineHeight: 1,
              textShadow:
                "0 2px 0 rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.7)",
            }}
          >
            {numeroProximoModulo}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TotemSeparador;