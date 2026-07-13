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
import { useTranslation } from "react-i18next";
import KwendiIcon, { type KwendiIconName } from "@/components/icons/KwendiIcon";

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
  icon: KwendiIconName;
  activeIcon?: KwendiIconName;
  color: string;
  route: string;
};

const buildNavItems = (t: (k: string, fb?: string) => string): NavItem[] => [
  { key: "home", label: t("nav.inicio", "Início"), icon: "home", color: "#FBBD12", route: "/home" },
  { key: "chest", label: t("nav.missoes", "Missões"), icon: "bau", color: "#B87656", route: "/missoes" },
  { key: "book", label: t("nav.historias", "Histórias"), icon: "livro", color: "#FFA767", route: "/historias" },
  { key: "search", label: t("nav.curiosidades", "Curiosidades"), icon: "lupa", color: "#78D0FF", route: "/curiosidades" },
  { key: "user", label: t("nav.perfil", "Perfil"), icon: "perfilSemCoroa", activeIcon: "perfilComCoroa", color: "#FF7BBF", route: "/profile" },
];

const buildMoreOptions = (t: (k: string, fb?: string) => string) => [
  { label: t("nav.dicionario", "Dicionário"), route: "/dicionario" },
  { label: t("nav.caderno", "Caderno"), route: "/secao/caderno" },
  { label: t("nav.alfabeto", "Alfabeto"), route: "/secao/alfabeto" },
];

interface BottomNavProps {
  active?: BottomNavKey;
}

const BottomNav = ({ active }: BottomNavProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const navItems = buildNavItems(t as any);
  const moreOptions = buildMoreOptions(t as any);
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
                    className="w-full px-4 py-2.5 rounded-full bg-white shadow-sm text-sm font-extrabold text-neutral-900 hover:bg-secondary hover:text-secondary-foreground transition-colors"
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
          style={{ borderTop: "1px solid hsl(var(--border))" }}
        >
          {navItems.map((item) => {
            const isActive = active === item.key;
            const iconName = isActive && item.activeIcon ? item.activeIcon : item.icon;
            const isUser = item.key === "user";
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.route)}
                className="relative p-1 flex flex-col items-center justify-end"
                style={{ height: 40 }}
                aria-label={item.label}
              >
                <KwendiIcon
                  name={iconName}
                  style={{
                    height: isUser ? (isActive ? 40 : 32) : 28,
                    width: "auto",
                    marginTop: isUser && isActive ? -8 : 0,
                  }}
                />
                {isActive && item.key !== "user" && (
                  <span
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
                    style={{ background: item.color }}
                  />
                )}
              </button>
            );
          })}

          {/* "..." */}
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className="w-11 h-9 rounded-xl flex items-center justify-center"
            style={{ background: moreOpen ? "#E5A60E" : "#FBBD12" }}
            aria-label="Mais opções"
            aria-expanded={moreOpen}
          >
            <KwendiIcon name="maisop" style={{ height: 20, width: "auto" }} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;