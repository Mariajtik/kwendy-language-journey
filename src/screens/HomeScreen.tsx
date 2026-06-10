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
import { Flame, Heart, Home, BookOpen, Search, User, Sofa, Play } from "lucide-react";
import avatar from "@/assets/avatar.jpg";
import grass from "@/assets/grass.jpg.asset.json";

/* ---- Custom inline SVG icons ---- */

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

          {/* Decoration / interior design square */}
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center border-2"
            style={{
              background: "#FFF6E8",
              borderColor: "#B87656",
              boxShadow: "0 2px 0 #8B5A40",
            }}
            aria-label="Decoração"
          >
            <Sofa className="w-5 h-5" color="#B87656" strokeWidth={2.4} />
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