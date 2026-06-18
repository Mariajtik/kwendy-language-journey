/**
 * CenaPiscina.tsx
 * Cena decorativa (não interativa) com a piscina + Yellen e Otchali
 * a brincar à beira da água. Usada como ornamento lateral no zig-zag
 * de um módulo específico.
 */

import piscina from "@/assets/cenas/piscina.jpg.asset.json";
import yellen from "@/assets/characters/yellen.jpg.asset.json";
import otchali from "@/assets/characters/otchali.jpg.asset.json";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const CenaPiscina = ({ className = "", style }: Props) => {
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      style={{ width: 180, ...style }}
    >
      <div className="relative">
        {/* Piscina (fundo branco misturado com a relva) */}
        <img
          src={piscina.url}
          alt=""
          className="w-full h-auto"
          style={{
            mixBlendMode: "multiply",
            filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.3))",
          }}
        />
        {/* Yellen à esquerda */}
        <img
          src={yellen.url}
          alt=""
          className="absolute rounded-full border-2 border-white object-cover"
          style={{
            width: 44,
            height: 44,
            left: "8%",
            top: "10%",
            boxShadow: "0 3px 0 rgba(0,0,0,0.25)",
          }}
        />
        {/* Otchali à direita */}
        <img
          src={otchali.url}
          alt=""
          className="absolute rounded-full border-2 border-white object-cover"
          style={{
            width: 44,
            height: 44,
            right: "16%",
            top: "4%",
            boxShadow: "0 3px 0 rgba(0,0,0,0.25)",
          }}
        />
      </div>
    </div>
  );
};

export default CenaPiscina;