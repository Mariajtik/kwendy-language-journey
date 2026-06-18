/**
 * BannerVines.tsx
 * Overlay decorativo de trepadeiras com flores a crescerem
 * por cima de um banner. Animação contínua: caule cresce,
 * folhas aparecem e flores florescem em loop.
 */

import { motion } from "framer-motion";

type Flor = { cx: number; cy: number; delay: number; cor: string };

const FLORES: Flor[] = [
  { cx: 18, cy: 22, delay: 1.2, cor: "#FFD166" },
  { cx: 36, cy: 12, delay: 1.8, cor: "#FF6B9D" },
  { cx: 58, cy: 18, delay: 2.4, cor: "#FFFFFF" },
  { cx: 78, cy: 10, delay: 3.0, cor: "#FFD166" },
  { cx: 92, cy: 28, delay: 3.6, cor: "#FF6B9D" },
];

const BannerVines = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Caule principal a serpentear ao longo do topo do banner */}
      <motion.path
        d="M -2 50 Q 10 30, 20 36 T 40 20 T 60 28 T 82 14 T 102 22"
        fill="none"
        stroke="#2E7D4F"
        strokeWidth="0.9"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 4, ease: "easeOut", repeat: Infinity, repeatType: "loop", repeatDelay: 2 }}
      />
      {/* Folhas ao longo do caule */}
      {[
        { cx: 14, cy: 38, r: 1.8, delay: 0.8, rot: -20 },
        { cx: 28, cy: 26, r: 2.1, delay: 1.4, rot: 15 },
        { cx: 46, cy: 22, r: 1.9, delay: 2.0, rot: -10 },
        { cx: 68, cy: 20, r: 2.0, delay: 2.6, rot: 20 },
        { cx: 86, cy: 16, r: 1.8, delay: 3.2, rot: -15 },
      ].map((f, i) => (
        <motion.ellipse
          key={`leaf-${i}`}
          cx={f.cx}
          cy={f.cy}
          rx={f.r}
          ry={f.r * 0.55}
          fill="#3FA86A"
          transform={`rotate(${f.rot} ${f.cx} ${f.cy})`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 6,
            times: [0, 0.18, 0.85, 1],
            ease: "easeOut",
            delay: f.delay,
            repeat: Infinity,
            repeatDelay: 0,
          }}
          style={{ transformOrigin: `${f.cx}px ${f.cy}px` }}
        />
      ))}
      {/* Flores florescendo */}
      {FLORES.map((f, i) => (
        <motion.g
          key={`flor-${i}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.1, 1, 1, 0], opacity: [0, 1, 1, 1, 0] }}
          transition={{
            duration: 6,
            times: [0, 0.2, 0.35, 0.85, 1],
            ease: "easeOut",
            delay: f.delay,
            repeat: Infinity,
          }}
          style={{ transformOrigin: `${f.cx}px ${f.cy}px` }}
        >
          {/* 5 pétalas */}
          {[0, 72, 144, 216, 288].map((ang) => (
            <ellipse
              key={ang}
              cx={f.cx}
              cy={f.cy - 1.4}
              rx={0.95}
              ry={1.5}
              fill={f.cor}
              transform={`rotate(${ang} ${f.cx} ${f.cy})`}
              opacity={0.95}
            />
          ))}
          <circle cx={f.cx} cy={f.cy} r={0.7} fill="#F2A93B" />
        </motion.g>
      ))}
    </svg>
  );
};

export default BannerVines;