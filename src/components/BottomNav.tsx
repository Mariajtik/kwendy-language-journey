/**
 * BottomNav.tsx
 * -------------
 * Reusable Duolingo-style bottom navigation for Kwendi.
 * 6 items: Home, Missões (chest), Histórias (book), Curiosidades (lupa),
 * Perfil (user), and "..." which opens a floating popover above the nav
 * with quick links to Fala / Escuta / Palavras / Alfabeto.
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Crown } from "lucide-react";

/* ---------- Inline icons (copied/shared with HomeScreen) ---------- */

const HouseIcon = ({ className = "", color = "#FBBD12" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <path d="M3 11l9-7 9 7v1H3z" fill={color} stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    <rect x="5" y="11" width="14" height="9" rx="1.2" fill={color} stroke={color} strokeWidth="1.4" />
    <rect x="10.5" y="14" width="3" height="6" rx="0.4" fill="#fff" />
    <rect x="6.5" y="13" width="2.5" height="2.5" rx="0.3" fill="#fff" />
  </svg>
);

const Chest = ({ className = "", color = "#B87656" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <path d="M3 10c0-3 4-5 9-5s9 2 9 5v1H3v-1z" fill={color} stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    <rect x="3" y="11" width="18" height="9" rx="1.5" fill={color} stroke={color} strokeWidth="1.4" />
    <rect x="3" y="13.5" width="18" height="1.2" fill="#FBBD12" />
    <rect x="10.5" y="10.5" width="3" height="4" rx="0.4" fill="#FBBD12" />
    <circle cx="12" cy="12.5" r="0.6" fill={color} />
  </svg>
);

const BookIcon = ({ className = "", color = "#FFA767" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <path d="M4 4h13a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" fill={color} stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    <rect x="6" y="6" width="11" height="10" rx="0.6" fill="#fff" />
    <rect x="7.5" y="8" width="8" height="1" rx="0.3" fill={color} />
    <rect x="7.5" y="10.2" width="6" height="1" rx="0.3" fill={color} />
    <rect x="7.5" y="12.4" width="7" height="1" rx="0.3" fill={color} />
  </svg>
);

const SearchIcon = ({ className = "", color = "#78D0FF" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <rect x="14.5" y="14.5" width="7" height="2.6" rx="1.3" fill={color} transform="rotate(45 14.5 14.5)" />
    <circle cx="10.5" cy="10.5" r="6.5" fill={color} stroke={color} strokeWidth="1.4" />
    <circle cx="10.5" cy="10.5" r="4" fill="#fff" />
  </svg>
);

const UserIcon = ({ className = "", color = "#FF7BBF" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <circle cx="12" cy="8" r="4.2" fill={color} stroke={color} strokeWidth="1.4" />
    <path d="M3.5 21c0-4.5 3.8-8 8.5-8s8.5 3.5 8.5 8z" fill={color} stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="12" cy="8" r="1.6" fill="#fff" opacity="0.35" />
  </svg>
);

export type BottomNavKey =
  | "home"
  | "chest"
  | "book"
  | "search"
  | "user"
  | "more";

type NavItem = {
  key: BottomNavKey;
  label: string;
  Comp: (props: { className?: string; color?: string }) => JSX.Element;
  color: string;
  route: string;
};

const navItems: NavItem[] = [
  { key: "home", label: "Início", Comp: HouseIcon, color: "#FBBD12", route: "/home" },
  { key: "chest", label: "Missões", Comp: Chest, color: "#B87656", route: "/missoes" },
  { key: "book", label: "Histórias", Comp: BookIcon, color: "#FFA767", route: "/historias" },
  { key: "search", label: "Curiosidades", Comp: SearchIcon, color: "#78D0FF", route: "/curiosidades" },
  { key: "user", label: "Perfil", Comp: UserIcon, color: "#FF7BBF", route: "/profile" },
];

const moreOptions = [
  { label: "Fala", route: "/secao/fala" },
  { label: "Escuta", route: "/secao/escuta" },
  { label: "Palavras", route: "/secao/palavras" },
  { label: "Alfabeto/pronúncia", route: "/secao/alfabeto" },
];

interface BottomNavProps {
  active?: BottomNavKey;
}

const BottomNav = ({ active }: BottomNavProps) => {
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [moreOpen]);

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 w-full"
      style={{ maxWidth: "480px" }}
    >
      <div className="relative" ref={wrapperRef}>
        {/* Popover */}
        <AnimatePresence>
          {moreOpen && (
            <motion.div
              key="more-popover"
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute right-4 bottom-[72px] w-56 origin-bottom-right"
              style={{ transformOrigin: "85% 100%" }}
            >
              <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/95 backdrop-blur shadow-xl border border-black/5">
                {moreOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setMoreOpen(false);
                      navigate(opt.route);
                    }}
                    className="w-full px-4 py-2.5 rounded-full bg-white shadow-sm text-sm font-extrabold text-foreground hover:bg-secondary transition-colors"
                    style={{ boxShadow: "0 2px 0 rgba(0,0,0,0.06)" }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {/* Arrow */}
              <div
                className="absolute right-7 -bottom-1.5 w-3 h-3 rotate-45 bg-white/95"
                aria-hidden
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav bar */}
        <div
          className="bg-white rounded-t-3xl px-3 pt-3 pb-2 flex items-center justify-around shadow-lg"
          style={{ borderTop: "3px solid #86D05D" }}
        >
          {navItems.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.route)}
                className="relative p-1 flex flex-col items-center"
                aria-label={item.label}
              >
                <item.Comp className="w-7 h-7" color={item.color} />
                {isActive && item.key === "user" && (
                  <motion.span
                    layoutId="bottom-nav-active-crown"
                    className="absolute -top-3"
                  >
                    <Crown
                      className="w-4 h-4"
                      style={{ color: "#FBBD12" }}
                      fill="#FBBD12"
                    />
                  </motion.span>
                )}
              </button>
            );
          })}

          {/* "..." */}
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className="w-11 h-9 rounded-xl flex items-center justify-center gap-0.5"
            style={{ background: moreOpen ? "#E5A60E" : "#FBBD12" }}
            aria-label="Mais opções"
            aria-expanded={moreOpen}
          >
            <span className="w-1 h-1 rounded-full bg-white" />
            <span className="w-1 h-1 rounded-full bg-white" />
            <span className="w-1 h-1 rounded-full bg-white" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;