/**
 * HomeScreen.tsx
 * ---------------
 * Main home/lesson-map screen (Duolingo-inspired) for Kwendi.
 * Background: grass photo. Header with avatar, decor square, campfire,
 * detailed diamond and hearts. Module banner, zig-zag lesson path,
 * floating scroll-to-top button, and colorful rounded bottom navigation.
 */

import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Heart, Home, BookOpen, Search, User, Play } from "lucide-react";
import avatar from "@/assets/avatar.jpg";
import grass from "@/assets/grass.jpg.asset.json";
import africa from "@/assets/africa.png.asset.json";

/* ---- Custom inline SVG icons ---- */

/** Africa map (with country borders + Madagascar) + plane departing from Angola */
const AfricaPlane = ({ className = "" }: { className?: string }) => (
  <img src={africa.url} alt="Mapa de África" className={`${className} object-contain`} />
);

/* legacy SVG removed — kept type-stable via component above */
const _UnusedAfricaSvg = () => (
  <svg viewBox="0 0 100 100" fill="none" aria-hidden>
    {/* Africa continent — silhouette inspired by reference image */}
    <path
      d="M28 10
         Q 40 6, 55 8
         Q 68 9, 74 13
         L 80 14
         Q 83 17, 80 22
         Q 78 28, 82 32
         Q 87 35, 88 39
         L 85 43
         Q 80 45, 75 42
         Q 71 46, 70 52
         Q 66 60, 62 68
         Q 58 76, 52 84
         Q 48 91, 43 88
         Q 39 85, 38 79
         Q 36 71, 34 64
         Q 36 58, 38 52
         Q 36 48, 33 46
         Q 29 46, 27 47
         Q 22 49, 19 46
         Q 15 44, 13 40
         Q 11 36, 13 32
         Q 10 28, 12 24
         Q 14 18, 20 14
         Q 24 12, 28 10 Z"
      fill="#E8B27A"
      stroke="#3d3b3b"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />

    {/* Country borders — stylized to match reference grid of divisions */}
    <g stroke="#3d3b3b" strokeWidth="0.7" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* North band (Morocco / Algeria / Tunisia / Libya / Egypt) */}
      <path d="M18 22 L 32 24" />
      <path d="M32 24 L 32 14" />
      <path d="M32 24 L 50 24" />
      <path d="M50 24 L 50 12" />
      <path d="M50 24 L 68 26" />
      <path d="M68 26 L 68 14" />
      <path d="M68 26 L 82 28" />
      <path d="M82 28 L 80 18" />

      {/* Sahel band (Mauritania / Mali / Niger / Chad / Sudan) */}
      <path d="M16 34 L 28 36" />
      <path d="M28 36 L 28 24" />
      <path d="M28 36 L 46 38" />
      <path d="M46 38 L 46 24" />
      <path d="M46 38 L 64 40" />
      <path d="M64 40 L 64 26" />
      <path d="M64 40 L 82 40" />
      <path d="M82 40 L 84 32" />

      {/* Horn of Africa (Ethiopia / Somalia / Eritrea) */}
      <path d="M70 42 L 80 44 L 84 42" />
      <path d="M74 44 L 76 50" />

      {/* Gulf of Guinea coastal countries */}
      <path d="M20 42 L 22 50" />
      <path d="M28 42 L 30 50" />
      <path d="M36 42 L 38 50" />
      <path d="M44 42 L 46 50" />

      {/* Equatorial central (Cameroon / CAR / DRC) */}
      <path d="M22 50 L 40 52 L 58 52 L 72 52" />
      <path d="M40 52 L 42 64" />
      <path d="M58 52 L 58 64" />

      {/* Great Lakes / East Africa (Kenya / Tanzania / Uganda) */}
      <path d="M66 52 L 68 64" />
      <path d="M58 60 L 70 62" />

      {/* Southern band — Angola highlighted separately */}
      <path d="M26 60 L 44 62" />
      <path d="M44 62 L 60 64" />
      <path d="M28 70 L 46 72 L 62 72" />
      <path d="M46 72 L 46 80" />
      <path d="M62 72 L 62 80" />
      <path d="M34 80 L 56 82" />
    </g>

    {/* Madagascar */}
    <path
      d="M82 68 C 84 70, 85 74, 84 80 C 83 84, 81 86, 79 84 C 78 80, 78 74, 80 70 Z"
      fill="#E8B27A"
      stroke="#3d3b3b"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />

    {/* Angola highlight (south-west) */}
    <path
      d="M26 60 L 44 62 L 44 70 L 28 70 Z"
      fill="#FBBD12"
      stroke="#3d3b3b"
      strokeWidth="1"
      strokeLinejoin="round"
    />

    {/* Dashed flight trail from Angola up to top-left */}
    <path
      d="M34 64 Q 20 42, 8 16"
      stroke="#3d3b3b"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeDasharray="2 3"
      fill="none"
    />

    {/* Airplane */}
    <g transform="translate(8 16) rotate(-55)">
      <ellipse cx="0" cy="0" rx="9" ry="2.2" fill="#ffffff" stroke="#1f1f1f" strokeWidth="1.2" />
      <path d="M-1 0 L -5 -7 L 1 -1 Z M-1 0 L -5 7 L 1 1 Z"
        fill="#ffffff" stroke="#1f1f1f" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M-7 0 L -10 -3 L -8 0 L -10 3 Z"
        fill="#ffffff" stroke="#1f1f1f" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="5" cy="0" r="1" fill="#78D0FF" stroke="#1f1f1f" strokeWidth="0.6" />
    </g>
  </svg>
);

/** Faceted diamond (gem) in #5E5C5C with internal facet lines */
const Diamond = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <path
      d="M6 3h12l4 6-10 12L2 9l4-6z"
      fill="#5E5C5C"
      stroke="#3d3b3b"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Top facet divisions */}
    <path
      d="M6 3l3 6h6l3-6M2 9h20M9 9l3 12M15 9l-3 12"
      stroke="#3d3b3b"
      strokeWidth="1"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Highlight */}
    <path d="M9 9l1.5-4h2L14 9z" fill="#7a7878" />
  </svg>
);

/** Treasure chest (báu) icon */
const Chest = ({ className = "", color = "#B87656" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    {/* Lid */}
    <path
      d="M3 10c0-3 4-5 9-5s9 2 9 5v1H3v-1z"
      fill={color}
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* Body */}
    <rect x="3" y="11" width="18" height="9" rx="1.5" fill={color} stroke={color} strokeWidth="1.4" />
    {/* Metal bands */}
    <rect x="3" y="13.5" width="18" height="1.2" fill="#FBBD12" />
    {/* Lock */}
    <rect x="10.5" y="10.5" width="3" height="4" rx="0.4" fill="#FBBD12" />
    <circle cx="12" cy="12.5" r="0.6" fill={color} />
  </svg>
);

/** Campfire = lucide Flame + two crossed logs underneath */
const Campfire = () => (
  <div className="relative w-7 h-7 flex items-end justify-center">
    <Flame
      className="w-5 h-5 absolute top-0 left-1/2 -translate-x-1/2"
      fill="#FF7A2E"
      color="#FF4D4D"
      strokeWidth={1.5}
    />
    {/* Logs */}
    <div className="absolute bottom-0 w-7 h-1.5">
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: "#B87656", transform: "rotate(20deg)" }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: "#8B5A40", transform: "rotate(-20deg)" }}
      />
    </div>
  </div>
);

/* ---- Bottom nav config ---- */
const navItems = [
  { key: "home", icon: Home, color: "#FBBD12", active: true, kind: "icon" as const },
  { key: "chest", color: "#B87656", kind: "chest" as const },
  { key: "book", icon: BookOpen, color: "#FFA767", kind: "icon" as const },
  { key: "search", icon: Search, color: "#78D0FF", kind: "icon" as const },
  { key: "user", icon: User, color: "#FF7BBF", kind: "icon" as const },
  { key: "more", kind: "more" as const },
];

const HomeScreen = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () =>
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <motion.div
      className="app-shell relative"
      style={{
        minHeight: "100dvh",
        backgroundImage: `url(${grass.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Soft overlay for legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(255,255,255,0.18)" }}
      />

      {/* ---- HEADER ---- */}
      <div className="relative z-10 px-4 pt-4">
        <div
          className="flex items-center justify-between gap-2 rounded-2xl px-3 py-2 shadow-sm backdrop-blur"
          style={{ background: "rgba(255,255,255,0.7)" }}
        >
          {/* Avatar */}
          <button
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow flex-shrink-0"
            aria-label="Perfil"
          >
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          </button>

          {/* Africa map with plane departing from Angola */}
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            aria-label="Mapa de África"
          >
            <AfricaPlane className="w-9 h-9" />
          </button>

          {/* Campfire + streak */}
          <div className="flex items-center gap-1">
            <Campfire />
            <span className="font-extrabold text-sm" style={{ color: "#5E5C5C" }}>
              0
            </span>
          </div>

          {/* Diamond + gems */}
          <div className="flex items-center gap-1">
            <Diamond className="w-6 h-6" />
            <span className="font-extrabold text-sm" style={{ color: "#5E5C5C" }}>
              1000
            </span>
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1">
            <Heart
              className="w-5 h-5"
              fill="hsl(var(--primary))"
              color="hsl(var(--primary))"
            />
            <span className="font-extrabold text-sm" style={{ color: "hsl(var(--primary))" }}>
              5
            </span>
          </div>
        </div>
      </div>

      {/* ---- SCROLLABLE CONTENT ---- */}
      <div
        ref={scrollRef}
        className="relative z-10 overflow-y-auto px-4 pt-4 pb-32"
        style={{ height: "calc(100dvh - 80px)" }}
      >
        {/* Module banner */}
        <div
          className="rounded-2xl px-5 py-4 mb-8 text-white"
          style={{
            background: "hsl(var(--primary))",
            boxShadow: "0 5px 0 hsl(var(--kwendi-red-dark))",
          }}
        >
          <p className="text-xs font-bold tracking-widest opacity-90">
            MÓDULO 1, UNIDADE 1
          </p>
          <h1 className="text-xl font-extrabold leading-tight mt-1">
            Saúda a tua comunidade
          </h1>
        </div>

        {/* Lesson path (zig-zag) */}
        <div className="flex flex-col items-center gap-10 mt-4">
          {/* Lesson 1 — active */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full -m-2 border-4 border-white"
              style={{ background: "rgba(255,255,255,0.4)" }}
            />
            <button
              className="relative w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-extrabold"
              style={{
                background: "hsl(var(--primary))",
                boxShadow: "0 6px 0 hsl(var(--kwendi-red-dark))",
              }}
              aria-label="Lição 1"
            >
              1
            </button>
          </div>

          {/* Lesson 2 — locked, offset right */}
          <div className="self-end mr-6">
            <button
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-extrabold"
              style={{
                background: "#cfcfcf",
                boxShadow: "0 6px 0 #a8a8a8",
              }}
              aria-label="Lição 2"
            >
              2
            </button>
          </div>

          {/* Lesson 3 — locked, offset left */}
          <div className="self-start ml-6">
            <button
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-extrabold"
              style={{
                background: "#cfcfcf",
                boxShadow: "0 6px 0 #a8a8a8",
              }}
              aria-label="Lição 3"
            >
              3
            </button>
          </div>
        </div>
      </div>

      {/* ---- FLOATING SCROLL-TO-TOP ---- */}
      <button
        onClick={scrollToTop}
        className="absolute right-5 bottom-28 w-12 h-12 rounded-full bg-white flex items-center justify-center z-20"
        style={{ boxShadow: "0 4px 0 #cfcfcf" }}
        aria-label="Ir ao topo"
      >
        <Play
          className="w-5 h-5"
          fill="hsl(var(--primary))"
          color="hsl(var(--primary))"
          style={{ transform: "rotate(-90deg)" }}
        />
      </button>

      {/* ---- BOTTOM NAV ---- */}
      <nav
        className="absolute bottom-0 left-0 right-0 z-20 mx-auto"
        style={{ maxWidth: "480px" }}
      >
        <div
          className="bg-white rounded-t-3xl px-3 pt-3 pb-2 flex items-center justify-around shadow-lg relative"
          style={{ borderTop: "3px solid #86D05D" }}
        >
          {navItems.map((item) => {
            if (item.kind === "more") {
              return (
                <button
                  key={item.key}
                  className="w-11 h-9 rounded-xl flex items-center justify-center gap-0.5"
                  style={{ background: "#FBBD12" }}
                  aria-label="Mais"
                >
                  <span className="w-1 h-1 rounded-full bg-white" />
                  <span className="w-1 h-1 rounded-full bg-white" />
                  <span className="w-1 h-1 rounded-full bg-white" />
                </button>
              );
            }
            if (item.kind === "chest") {
              return (
                <button key={item.key} className="p-1" aria-label="Báu">
                  <Chest className="w-7 h-7" color={item.color} />
                </button>
              );
            }
            const Icon = item.icon!;
            return (
              <button
                key={item.key}
                className="relative p-1 flex flex-col items-center"
                aria-label={item.key}
              >
                <Icon
                  className="w-7 h-7"
                  color={item.color}
                  strokeWidth={2.4}
                />
                {item.active && (
                  <span
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
                    style={{ background: item.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Hidden navigate to silence unused warning when needed */}
      <span style={{ display: "none" }}>{navigate.length}</span>
    </motion.div>
  );
};

export default HomeScreen;