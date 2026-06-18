/**
 * TotemSeparador.tsx
 * Separador visual entre módulos: alterna entre um arco de pedra
 * (portal) e uma pilha de pedras (cairn). Usa imagens reais
 * servidas via CDN, com mix-blend-mode para integrar o fundo
 * branco na textura da relva.
 */

import arcoAsset from "@/assets/separadores/arco-pedra.jpg.asset.json";
import pilhaAsset from "@/assets/separadores/pilha-pedras.jpg.asset.json";

type Variante = "arco" | "pilha";

type Props = {
  numeroProximoModulo?: number;
  variante?: Variante;
};

const TotemSeparador = ({ numeroProximoModulo, variante = "arco" }: Props) => {
  const isArco = variante === "arco";
  const src = isArco ? arcoAsset.url : pilhaAsset.url;
  const altura = isArco ? 150 : 170;

  return (
    <div className="my-6 flex justify-center" aria-hidden>
      <div className="relative" style={{ height: altura }}>
        <img
          src={src}
          alt=""
          className="h-full w-auto object-contain"
          style={{
            mixBlendMode: "multiply",
            filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.35))",
          }}
        />
        {/* sombra ao chão */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-1 rounded-full"
          style={{
            width: "70%",
            height: 10,
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.35), rgba(0,0,0,0) 70%)",
          }}
        />
        {/* chip com número do próximo módulo */}
        {numeroProximoModulo !== undefined && (
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
            style={{
              top: isArco ? "38%" : "18%",
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#FFF8EC",
              border: "3px solid #6B3F1D",
              color: "#6B3F1D",
              fontWeight: 900,
              fontFamily: "Nunito, system-ui, sans-serif",
              fontSize: 20,
              boxShadow: "0 3px 0 rgba(0,0,0,0.25)",
            }}
          >
            {numeroProximoModulo}
          </div>
        )}
      </div>
    </div>
  );
};

export default TotemSeparador;