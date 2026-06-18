/**
 * BannerAnimacao.tsx
 * Overlay decorativo animado por cima do banner da unidade.
 * Cada módulo tem a sua animação temática numa unidade.
 *
 * Variantes:
 *  - "bubbles"     M1 — balões de saudação (Olá, Ndi po, ...)
 *  - "sparkles"    M2 — estrelinhas brilhantes de identidade
 *  - "hearts"      M3 — corações pulsando (família)
 *  - "footprints"  M4 — pegadas a aparecerem em sequência (acções)
 *  - "vines"       M5 — trepadeiras com flores a florescerem
 */

import { motion } from "framer-motion";
import BannerVines from "./BannerVines";

export type AnimacaoBanner =
  | "bubbles"
  | "sparkles"
  | "hearts"
  | "footprints"
  | "vines";

const Bubbles = () => {
  const balões = [
    { x: 8, y: 60, delay: 0, txt: "Olá" },
    { x: 30, y: 30, delay: 0.8, txt: "Wapanduka" },
    { x: 58, y: 55, delay: 1.6, txt: "Kalunga" },
    { x: 82, y: 28, delay: 2.4, txt: "Ndi po" },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {balões.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-extrabold"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            color: "hsl(0 70% 50%)",
            boxShadow: "0 2px 0 rgba(0,0,0,0.15)",
          }}
          initial={{ scale: 0, y: 10, opacity: 0 }}
          animate={{
            scale: [0, 1, 1, 0.9, 0],
            y: [10, 0, -4, -10, -18],
            opacity: [0, 1, 1, 0.8, 0],
          }}
          transition={{
            duration: 4,
            times: [0, 0.2, 0.6, 0.85, 1],
            delay: b.delay,
            repeat: Infinity,
            repeatDelay: 1.2,
          }}
        >
          {b.txt}
        </motion.div>
      ))}
    </div>
  );
};

const Sparkles = () => {
  const estrelas = Array.from({ length: 9 }).map((_, i) => ({
    x: (i * 11 + 6) % 96,
    y: 15 + ((i * 37) % 60),
    delay: (i * 0.35) % 3,
    size: 6 + (i % 3) * 3,
  }));
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      aria-hidden
    >
      {estrelas.map((s, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: [0, 90] }}
          transition={{
            duration: 2.4,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: 1.2,
            ease: "easeOut",
          }}
          style={{ transformOrigin: `${s.x}px ${s.y}px` }}
        >
          <path
            d={`M ${s.x} ${s.y - s.size / 6} L ${s.x + 0.6} ${s.y - 0.6} L ${s.x + s.size / 6} ${s.y} L ${s.x + 0.6} ${s.y + 0.6} L ${s.x} ${s.y + s.size / 6} L ${s.x - 0.6} ${s.y + 0.6} L ${s.x - s.size / 6} ${s.y} L ${s.x - 0.6} ${s.y - 0.6} Z`}
            fill="#FFE27A"
          />
        </motion.g>
      ))}
    </svg>
  );
};

const Hearts = () => {
  const coracoes = [
    { x: 12, delay: 0 },
    { x: 32, delay: 0.7 },
    { x: 52, delay: 1.4 },
    { x: 72, delay: 2.1 },
    { x: 88, delay: 2.8 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {coracoes.map((c, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute"
          style={{ left: `${c.x}%`, top: "80%", width: 18, height: 18 }}
          initial={{ y: 0, opacity: 0, scale: 0.6 }}
          animate={{
            y: [0, -60, -90],
            opacity: [0, 1, 0],
            scale: [0.6, 1.1, 0.9],
          }}
          transition={{
            duration: 3.4,
            delay: c.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          <path
            d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z"
            fill="#FF7BBF"
            stroke="#fff"
            strokeWidth="1.2"
          />
        </motion.svg>
      ))}
    </div>
  );
};

const Footprints = () => {
  const pegadas = Array.from({ length: 6 }).map((_, i) => ({
    x: 6 + i * 16,
    y: i % 2 === 0 ? 30 : 55,
    delay: i * 0.45,
    rot: i % 2 === 0 ? -12 : 12,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pegadas.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `rotate(${p.rot}deg)`,
          }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.85, 0.85, 0], scale: [0.4, 1, 1, 0.9] }}
          transition={{
            duration: 3.6,
            times: [0, 0.2, 0.85, 1],
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
        >
          <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden>
            <ellipse cx="12" cy="14" rx="5" ry="6" fill="#fff" opacity="0.9" />
            <circle cx="6" cy="8" r="1.6" fill="#fff" opacity="0.9" />
            <circle cx="10" cy="5.5" r="1.5" fill="#fff" opacity="0.9" />
            <circle cx="14" cy="5.5" r="1.5" fill="#fff" opacity="0.9" />
            <circle cx="18" cy="8" r="1.6" fill="#fff" opacity="0.9" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

const BannerAnimacao = ({ tipo }: { tipo: AnimacaoBanner }) => {
  switch (tipo) {
    case "vines":
      return <BannerVines />;
    case "bubbles":
      return <Bubbles />;
    case "sparkles":
      return <Sparkles />;
    case "hearts":
      return <Hearts />;
    case "footprints":
      return <Footprints />;
    default:
      return null;
  }
};

export default BannerAnimacao;