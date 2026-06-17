/**
 * BadgeStar — SVG badge circular com estrela central.
 * Substitui PNGs externos (sem corte) e dá variantes coloridas + bloqueada.
 */
import type { BadgeCor } from "@/data/conquistas";

interface Props {
  cor?: BadgeCor;
  locked?: boolean;
  className?: string;
}

const PALETTES: Record<BadgeCor, { top: string; bottom: string; ring: string }> = {
  vermelha:          { top: "#FF8B8B", bottom: "#FF4D4D", ring: "#D33A3A" },
  laranja:           { top: "#FFB87A", bottom: "#FF8A3D", ring: "#D86A1F" },
  "laranja-escuro": { top: "#FF8A4F", bottom: "#E85A1A", ring: "#B44310" },
  verde:             { top: "#A8F0C3", bottom: "#5FE08B", ring: "#33B362" },
  azul:              { top: "#A8D7FF", bottom: "#5CB3FF", ring: "#2E84D9" },
  rosa:              { top: "#FFC8DD", bottom: "#FF9CC3", ring: "#D96AA0" },
  roxa:              { top: "#D6B6FF", bottom: "#B287F7", ring: "#7E55C9" },
  branca:            { top: "#FFFFFF", bottom: "#E8E2EF", ring: "#B7B0C0" },
};

const BadgeStar = ({ cor = "vermelha", locked = false, className = "" }: Props) => {
  const p = locked
    ? { top: "#9A9A9A", bottom: "#7B7B7B", ring: "#5E5E5E" }
    : PALETTES[cor];
  const id = `bg-${cor}-${locked ? "lock" : "on"}`;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.top} />
          <stop offset="100%" stopColor={p.bottom} />
        </linearGradient>
      </defs>
      {/* sombra base */}
      <ellipse cx="50" cy="93" rx="32" ry="4" fill="rgba(0,0,0,0.12)" />
      {/* anel externo */}
      <circle cx="50" cy="48" r="42" fill={p.ring} />
      {/* corpo do badge */}
      <circle cx="50" cy="46" r="40" fill={`url(#${id})`} />
      {/* highlight superior */}
      <ellipse cx="50" cy="28" rx="26" ry="10" fill="rgba(255,255,255,0.35)" />
      {/* estrela 5 pontas branca */}
      <path
        d="M50 26 L57.6 41.4 L74.6 43.9 L62.3 55.9 L65.2 72.9 L50 64.9 L34.8 72.9 L37.7 55.9 L25.4 43.9 L42.4 41.4 Z"
        fill={locked ? "rgba(255,255,255,0.55)" : "#FFFFFF"}
        stroke={locked ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.06)"}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BadgeStar;