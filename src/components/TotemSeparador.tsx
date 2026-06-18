/**
 * TotemSeparador.tsx
 * Separador visual em forma de totem/pedra empilhada para
 * dividir módulos diferentes na trilha da HomeScreen.
 */

type Props = {
  numeroProximoModulo?: number;
};

const TotemSeparador = ({ numeroProximoModulo }: Props) => {
  return (
    <div className="my-8 flex justify-center" aria-hidden>
      <svg width="120" height="150" viewBox="0 0 120 150">
        {/* sombra base */}
        <ellipse cx="60" cy="140" rx="42" ry="6" fill="rgba(0,0,0,0.25)" />

        {/* pedra inferior */}
        <path
          d="M22 138 L18 108 Q18 102 24 100 L96 100 Q102 102 102 108 L98 138 Z"
          fill="#6E6259"
          stroke="#3F3832"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M30 100 L34 108 M70 100 L66 110 M88 100 L92 112" stroke="#3F3832" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

        {/* pedra do meio */}
        <path
          d="M30 100 L28 70 Q28 64 34 62 L86 62 Q92 64 92 70 L90 100 Z"
          fill="#8A7C70"
          stroke="#3F3832"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* gravação do número do próximo módulo */}
        {numeroProximoModulo !== undefined && (
          <text
            x="60"
            y="86"
            textAnchor="middle"
            fontSize="20"
            fontWeight="900"
            fill="#3F3832"
            style={{ fontFamily: "Nunito, system-ui, sans-serif" }}
          >
            {numeroProximoModulo}
          </text>
        )}

        {/* pedra topo */}
        <path
          d="M40 62 L38 38 Q38 30 46 28 L74 28 Q82 30 82 38 L80 62 Z"
          fill="#A1907F"
          stroke="#3F3832"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* brilho */}
        <path d="M46 34 L52 34" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

        {/* grama na base */}
        <path d="M12 138 q4 -6 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0" fill="none" stroke="#3F8E3F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default TotemSeparador;