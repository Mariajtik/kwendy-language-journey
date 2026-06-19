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
  | "vines"
  | "heartbeat"
  | "clock"
  | "smoke"
  | "coins"
  | "links"
  | "letters"
  | "leaves";

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

/* M6 — saúde: linha de batimento cardíaco */
const Heartbeat = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 100 60"
    preserveAspectRatio="none"
    aria-hidden
  >
    <motion.path
      d="M0 35 L20 35 L26 20 L32 50 L40 28 L48 42 L56 35 L100 35"
      fill="none"
      stroke="rgba(255,255,255,0.85)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);

/* M7 — tempo: relógio com ponteiros a girar */
const Clock = () => {
  const relogios = [
    { x: 18, y: 30, r: 10, dur: 6 },
    { x: 50, y: 22, r: 8, dur: 4.5 },
    { x: 82, y: 36, r: 11, dur: 7 },
  ];
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      aria-hidden
    >
      {relogios.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={c.r} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" />
          <motion.line
            x1={c.x}
            y1={c.y}
            x2={c.x}
            y2={c.y - c.r * 0.6}
            stroke="#fff"
            strokeWidth="1.2"
            strokeLinecap="round"
            style={{ transformOrigin: `${c.x}px ${c.y}px` }}
            animate={{ rotate: 360 }}
            transition={{ duration: c.dur, repeat: Infinity, ease: "linear" }}
          />
        </g>
      ))}
    </svg>
  );
};

/* M8 — em casa: baforadas de fumo (cozinha) */
const Smoke = () => {
  const puffs = Array.from({ length: 5 }).map((_, i) => ({
    x: 10 + i * 20,
    delay: i * 0.6,
    size: 10 + (i % 3) * 4,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {puffs.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/70"
          style={{ left: `${p.x}%`, bottom: "10%", width: p.size, height: p.size }}
          initial={{ y: 0, opacity: 0, scale: 0.6 }}
          animate={{ y: -55, opacity: [0, 0.7, 0], scale: [0.6, 1.4, 1.8] }}
          transition={{ duration: 3.4, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

/* M9 — trabalho e mercado: moedas a subir */
const Coins = () => {
  const moedas = Array.from({ length: 6 }).map((_, i) => ({
    x: 8 + i * 15,
    delay: i * 0.5,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {moedas.map((m, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full flex items-center justify-center text-[10px] font-extrabold"
          style={{
            left: `${m.x}%`,
            bottom: "5%",
            width: 16,
            height: 16,
            background: "#FBBD12",
            color: "#7a4a00",
            boxShadow: "0 1px 0 rgba(0,0,0,0.2)",
          }}
          initial={{ y: 0, opacity: 0, rotateY: 0 }}
          animate={{ y: -60, opacity: [0, 1, 0], rotateY: 360 }}
          transition={{ duration: 3, delay: m.delay, repeat: Infinity, ease: "easeOut" }}
        >
          $
        </motion.div>
      ))}
    </div>
  );
};

/* M10 — advérbios/ligações: elos a unirem-se */
const Links = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 100 60"
    preserveAspectRatio="none"
    aria-hidden
  >
    {[0, 1, 2, 3].map((i) => (
      <motion.circle
        key={i}
        cx={15 + i * 22}
        cy={30}
        r={6}
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.4"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1, 0.9], opacity: [0, 1, 0] }}
        transition={{ duration: 2.4, delay: i * 0.35, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: `${15 + i * 22}px 30px` }}
      />
    ))}
  </svg>
);

/* M11 — letras (pronomes/verbos) flutuantes */
const Letters = () => {
  const letras = [
    { ch: "A", x: 10, delay: 0 },
    { ch: "u", x: 28, delay: 0.6 },
    { ch: "O", x: 46, delay: 1.2 },
    { ch: "v", x: 64, delay: 1.8 },
    { ch: "e", x: 82, delay: 2.4 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {letras.map((l, i) => (
        <motion.span
          key={i}
          className="absolute font-extrabold text-white/85"
          style={{ left: `${l.x}%`, top: "70%", fontSize: 16 }}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: [10, -30, -50], opacity: [0, 1, 0] }}
          transition={{ duration: 3.2, delay: l.delay, repeat: Infinity, ease: "easeOut" }}
        >
          {l.ch}
        </motion.span>
      ))}
    </div>
  );
};

/* M12 — provérbios: folhas a cair (sabedoria/tradição) */
const Leaves = () => {
  const folhas = Array.from({ length: 6 }).map((_, i) => ({
    x: 8 + i * 15,
    delay: i * 0.7,
    rot: (i % 2 === 0 ? 1 : -1) * 30,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {folhas.map((f, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          width={14}
          height={14}
          className="absolute"
          style={{ left: `${f.x}%`, top: "-10%" }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{ y: 70, opacity: [0, 1, 0], rotate: f.rot }}
          transition={{ duration: 4, delay: f.delay, repeat: Infinity, ease: "easeIn" }}
        >
          <path
            d="M12 2C7 7 5 12 7 17c2 4 7 5 10 3-2-5-1-10-5-18z"
            fill="#FFD27A"
            stroke="#7a4a00"
            strokeWidth="0.8"
          />
        </motion.svg>
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
    case "heartbeat":
      return <Heartbeat />;
    case "clock":
      return <Clock />;
    case "smoke":
      return <Smoke />;
    case "coins":
      return <Coins />;
    case "links":
      return <Links />;
    case "letters":
      return <Letters />;
    case "leaves":
      return <Leaves />;
    default:
      return null;
  }
};

export default BannerAnimacao;