/**
 * HomeScreen.tsx
 * ---------------
 * Main home/lesson-map screen (Duolingo-inspired) for Kwendi.
 * Background: grass photo. Header with avatar, decor square, campfire,
 * detailed diamond and hearts. Module banner, zig-zag lesson path,
 * floating scroll-to-top button, and colorful rounded bottom navigation.
 */

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Heart, Play, Lock } from "lucide-react";
import avatar from "@/assets/avatar.jpg";
import grass from "@/assets/grass.jpg.asset.json";
import africa from "@/assets/africa.png.asset.json";
import plane from "@/assets/plane.png.asset.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ---- Custom inline SVG icons ---- */

/** Africa map (with country borders + Madagascar) + plane departing from Angola */
const AfricaPlane = ({ className = "" }: { className?: string }) => (
  <div className={`${className} relative`}>
    <img src={africa.url} alt="Mapa de África" className="w-full h-full object-contain" />
    {/* Small plane departing from Angola (red dot annotation) */}
    <img
      src={plane.url}
      alt=""
      aria-hidden
      className="absolute object-contain pointer-events-none"
      style={{
        width: "32%",
        height: "32%",
        left: "18%",
        top: "55%",
        transform: "rotate(-25deg)",
      }}
    />
  </div>
);

/* legacy SVG removed — kept type-stable via component above */


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

/** Filled house with door + window detail, matches chest style */
const HouseIcon = ({ className = "", color = "#FBBD12" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    {/* Roof */}
    <path d="M3 11l9-7 9 7v1H3z" fill={color} stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    {/* Body */}
    <rect x="5" y="11" width="14" height="9" rx="1.2" fill={color} stroke={color} strokeWidth="1.4" />
    {/* Door */}
    <rect x="10.5" y="14" width="3" height="6" rx="0.4" fill="#fff" />
    {/* Window accent */}
    <rect x="6.5" y="13" width="2.5" height="2.5" rx="0.3" fill="#fff" />
  </svg>
);

/** Filled book with page detail, matches chest style */
const BookIcon = ({ className = "", color = "#FFA767" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    {/* Cover */}
    <path d="M4 4h13a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" fill={color} stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    {/* Page */}
    <rect x="6" y="6" width="11" height="10" rx="0.6" fill="#fff" />
    {/* Lines */}
    <rect x="7.5" y="8" width="8" height="1" rx="0.3" fill={color} />
    <rect x="7.5" y="10.2" width="6" height="1" rx="0.3" fill={color} />
    <rect x="7.5" y="12.4" width="7" height="1" rx="0.3" fill={color} />
  </svg>
);

/** Filled magnifier, matches chest style */
const SearchIcon = ({ className = "", color = "#78D0FF" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    {/* Handle */}
    <rect x="14.5" y="14.5" width="7" height="2.6" rx="1.3" fill={color} transform="rotate(45 14.5 14.5)" />
    {/* Lens */}
    <circle cx="10.5" cy="10.5" r="6.5" fill={color} stroke={color} strokeWidth="1.4" />
    <circle cx="10.5" cy="10.5" r="4" fill="#fff" />
  </svg>
);

/** Filled person bust, matches chest style */
const UserIcon = ({ className = "", color = "#FF7BBF" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    {/* Head */}
    <circle cx="12" cy="8" r="4.2" fill={color} stroke={color} strokeWidth="1.4" />
    {/* Body */}
    <path d="M3.5 21c0-4.5 3.8-8 8.5-8s8.5 3.5 8.5 8z" fill={color} stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    {/* Accent */}
    <circle cx="12" cy="8" r="1.6" fill="#fff" opacity="0.35" />
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
  { key: "home", Comp: HouseIcon, color: "#FBBD12", active: true, kind: "svg" as const },
  { key: "chest", Comp: Chest, color: "#B87656", kind: "svg" as const },
  { key: "book", Comp: BookIcon, color: "#FFA767", kind: "svg" as const },
  { key: "search", Comp: SearchIcon, color: "#78D0FF", kind: "svg" as const },
  { key: "user", Comp: UserIcon, color: "#FF7BBF", kind: "svg" as const },
  { key: "more", kind: "more" as const },
];

const HomeScreen = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  type Lesson = {
    id: number;
    title: string;
    status: "active" | "locked";
    kind?: "chest";
  };
  const lessons: Lesson[] = [
    { id: 1, title: "Olá, mundo", status: "active" },
    { id: 2, title: "Saudações", status: "locked" },
    { id: 3, title: "Apresentar-se", status: "locked" },
    { id: 4, title: "Família", status: "locked" },
    { id: 5, title: "Báu de tesouro", status: "locked", kind: "chest" },
  ];

  const [lockedOpen, setLockedOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const handleLessonClick = (lesson: Lesson) => {
    setActiveLesson(lesson);
    if (lesson.status === "locked") setLockedOpen(true);
    else setStartOpen(true);
  };

  // Zig-zag horizontal offsets (in px) for the trail
  const offsets = [0, 60, -60, -40, 40];

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
        <div className="relative mt-4 mx-auto" style={{ width: 220 }}>
          {/* Dashed connecting line behind buttons */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden
          >
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="3"
              strokeDasharray="6 8"
              strokeLinecap="round"
            />
          </svg>

          <div className="relative flex flex-col items-center gap-14 py-4">
            {lessons.map((lesson, idx) => {
              const isActive = lesson.status === "active";
              const isChest = lesson.kind === "chest";
              const offset = offsets[idx % offsets.length];
              return (
                <div
                  key={lesson.id}
                  className="relative"
                  style={{ transform: `translateX(${offset}px)` }}
                >
                  {/* COMEÇAR speech bubble for active lesson */}
                  {isActive && (
                    <motion.div
                      initial={{ y: -4, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="absolute left-1/2 -translate-x-1/2 -top-12 bg-white rounded-xl px-3 py-1.5 shadow-md"
                      style={{ boxShadow: "0 3px 0 #cfcfcf" }}
                    >
                      <span
                        className="text-xs font-extrabold tracking-wider"
                        style={{ color: "hsl(var(--primary))" }}
                      >
                        COMEÇAR
                      </span>
                      {/* Arrow */}
                      <div
                        className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-3 h-3 bg-white rotate-45"
                        style={{ boxShadow: "2px 2px 0 #cfcfcf" }}
                      />
                    </motion.div>
                  )}

                  {/* Pulsing white halo for active */}
                  {isActive && (
                    <motion.div
                      aria-hidden
                      className="absolute inset-0 rounded-full -m-2 border-4 border-white"
                      style={{ background: "rgba(255,255,255,0.35)" }}
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  <button
                    onClick={() => handleLessonClick(lesson)}
                    className="relative w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-extrabold transition-transform active:translate-y-0.5"
                    style={
                      isActive
                        ? {
                            background: "hsl(var(--primary))",
                            boxShadow: "0 6px 0 hsl(var(--kwendi-red-dark))",
                          }
                        : {
                            background: "#cfcfcf",
                            boxShadow: "0 6px 0 #a8a8a8",
                          }
                    }
                    aria-label={`Lição ${lesson.id}: ${lesson.title}`}
                  >
                    {isChest ? (
                      <Chest className="w-10 h-10" color="#fff" />
                    ) : isActive ? (
                      lesson.id
                    ) : (
                      <Lock className="w-7 h-7" strokeWidth={3} />
                    )}
                  </button>
                </div>
              );
            })}
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
            const Comp = item.Comp!;
            return (
              <button
                key={item.key}
                className="relative p-1 flex flex-col items-center"
                aria-label={item.key}
              >
                <Comp className="w-7 h-7" color={item.color} />
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

      {/* ---- Locked lesson dialog ---- */}
      <Dialog open={lockedOpen} onOpenChange={setLockedOpen}>
        <DialogContent className="max-w-xs rounded-3xl text-center">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <Lock className="w-8 h-8 text-gray-500" strokeWidth={3} />
            </div>
            <DialogTitle className="text-center text-xl font-extrabold">
              Lição bloqueada
            </DialogTitle>
            <DialogDescription className="text-center">
              Conclua a lição anterior para desbloquear esta.
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={() => setLockedOpen(false)}
            className="btn-duo btn-duo-secondary w-full mt-2"
          >
            Entendi
          </button>
        </DialogContent>
      </Dialog>

      {/* ---- Start lesson dialog ---- */}
      <Dialog open={startOpen} onOpenChange={setStartOpen}>
        <DialogContent className="max-w-xs rounded-3xl p-0 overflow-hidden">
          <div
            className="px-5 py-3 text-white text-xs font-extrabold tracking-widest"
            style={{ background: "hsl(var(--primary))" }}
          >
            LIÇÃO {activeLesson?.id}
          </div>
          <div className="p-5 text-center">
            <h2 className="text-xl font-extrabold" style={{ color: "#5E5C5C" }}>
              {activeLesson?.title}
            </h2>
            <p className="mt-2 text-sm font-bold" style={{ color: "hsl(var(--primary))" }}>
              +10 XP
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => setStartOpen(false)}
                className="btn-duo btn-duo-primary w-full"
              >
                Começar +10 XP
              </button>
              <button
                disabled
                className="btn-duo btn-duo-secondary w-full opacity-50 cursor-not-allowed"
              >
                Ver dica
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default HomeScreen;