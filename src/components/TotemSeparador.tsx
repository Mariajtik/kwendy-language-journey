/**
 * TotemSeparador.tsx
 * Separador visual entre módulos: cerca de madeira com portão
 * fechado e cadeado dourado. O número do próximo módulo aparece
 * sobre o cadeado.
 */

import cercaAsset from "@/assets/separadores/cerca-portao.png.asset.json";
import { motion } from "framer-motion";

type Variante = "arco" | "pilha";

type Props = {
  numeroProximoModulo?: number;
  variante?: Variante;
};

const TotemSeparador = ({ numeroProximoModulo }: Props) => {
  // Imagem da cerca: padlock approx. centrado horizontalmente em 46%,
  // verticalmente em 55% (ver illustration). O número vai por cima.
  return (
    <div className="my-8 flex justify-center" aria-hidden>
      <motion.div
        className="relative"
        style={{ height: 160 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={cercaAsset.url}
          alt=""
          loading="lazy"
          className="h-full w-auto object-contain select-none"
          style={{ filter: "drop-shadow(0 8px 6px rgba(0,0,0,0.35))" }}
          draggable={false}
        />
        {/* Número sobre o cadeado do portão */}
        {numeroProximoModulo !== undefined && (
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              left: "46%",
              top: "55%",
              transform: "translate(-50%, -50%)",
              width: 44,
              height: 44,
              color: "#6B3F1D",
              fontWeight: 900,
              fontFamily: "Nunito, system-ui, sans-serif",
              fontSize: 28,
              lineHeight: 1,
              textShadow:
                "0 2px 0 rgba(255,255,255,0.85), 0 0 6px rgba(255,255,255,0.6)",
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