/**
 * TotemSeparador.tsx
 * Separador visual entre módulos: alterna entre um arco de pedra
 * (portal) e uma pilha de pedras (cairn). Usa imagens reais
 * servidas via CDN, com mix-blend-mode para integrar o fundo
 * branco na textura da relva.
 */

import portalAsset from "@/assets/separadores/portal-pedra.png.asset.json";
import cairnAsset from "@/assets/separadores/cairn-pedra.png.asset.json";
import { motion } from "framer-motion";

type Variante = "arco" | "pilha";

type Props = {
  numeroProximoModulo?: number;
  variante?: Variante;
};

const TotemSeparador = ({ numeroProximoModulo, variante = "arco" }: Props) => {
  const isArco = variante === "arco";
  const src = isArco ? portalAsset.url : cairnAsset.url;
  const altura = isArco ? 170 : 160;
  // Posição do medalhão: centro do arco vs topo do cairn
  const medalhaoTop = isArco ? "32%" : "-6%";

  return (
    <div className="my-8 flex justify-center" aria-hidden>
      <motion.div
        className="relative"
        style={{ height: altura }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={src}
          alt=""
          loading="lazy"
          className="h-full w-auto object-contain select-none"
          style={{ filter: "drop-shadow(0 8px 6px rgba(0,0,0,0.35))" }}
          draggable={false}
        />
        {/* Medalhão dourado com número do próximo módulo */}
        {numeroProximoModulo !== undefined && (
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
            style={{
              top: medalhaoTop,
              width: 52,
              height: 52,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #FFE48A, #F2C84B 55%, #C69118 100%)",
              border: "3px solid #6B3F1D",
              color: "hsl(var(--primary))",
              fontWeight: 900,
              fontFamily: "Nunito, system-ui, sans-serif",
              fontSize: 24,
              lineHeight: 1,
              textShadow: "0 1px 0 rgba(255,255,255,0.55)",
              boxShadow:
                "0 4px 0 #6B3F1D, inset 0 -3px 0 rgba(0,0,0,0.18), inset 0 3px 0 rgba(255,255,255,0.45)",
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