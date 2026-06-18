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
import { Flame, Heart, Play, Lock, BookOpen, Check } from "lucide-react";
import avatar from "@/assets/avatar.jpg";
import grass from "@/assets/grass.jpg.asset.json";
import africa from "@/assets/africa.png.asset.json";
import plane from "@/assets/plane.png.asset.json";
import BottomNav from "@/components/BottomNav";
import DiamanteNegro from "@/components/icons/DiamanteNegro";
import { useSaldo } from "@/hooks/useSaldo";
import { useProgresso } from "@/hooks/useProgresso";
import { CURRICULO, type Modulo, type Unidade } from "@/data/curriculo";
import TotemSeparador from "@/components/TotemSeparador";
import UnidadeCardFechado from "@/components/UnidadeCardFechado";
import BannerAnimacao, { type AnimacaoBanner } from "@/components/BannerAnimacao";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChevronUp } from "lucide-react";

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


const Diamond = DiamanteNegro;

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

const HomeScreen = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { saldo } = useSaldo();
  const { unidadeAtualInfo, statusSeccaoNa } = useProgresso();
  const atual = unidadeAtualInfo();

  type ActiveSec = { id: string; titulo: string; numero: number; isBau: boolean };
  const [lockedOpen, setLockedOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState<ActiveSec | null>(null);
  const [expandedUnidades, setExpandedUnidades] = useState<Set<string>>(new Set());

  const toggleExpandida = (id: string) =>
    setExpandedUnidades((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  /** Mapa: unidade -> animação temática do banner (uma por módulo). */
  const ANIMACOES_UNIDADE: Record<string, AnimacaoBanner> = {
    m1u1: "bubbles",
    m2u2: "sparkles",
    m3u1: "hearts",
    m4u2: "footprints",
    m5u3: "vines",
  };

  // Zig-zag horizontal offsets (in px) for the trail
  const offsets = [0, 60, -60, -40, 40, -30, 50];

  const scrollToTop = () =>
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  /** Renderiza o zig-zag de uma unidade. Se `visualizacao`, todas as
   *  lições aparecem bloqueadas (apenas para pré-visualizar). */
  const renderZigZag = (unidade: Unidade, visualizacao = false) => (
    <div className="relative mt-4 mx-auto" style={{ width: 220 }}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
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
        {unidade.seccoes.map((sec, idx) => {
          const status = visualizacao ? "bloqueada" : statusSeccaoNa(unidade, sec.id);
          const isActive = status === "ativa";
          const isDone = status === "concluida";
          const isChest = sec.tipo === "bau";
          const offset = offsets[idx % offsets.length];
          const numero = idx + 1;
          return (
            <div
              key={sec.id}
              className="relative"
              style={{ transform: `translateX(${offset}px)` }}
            >
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
                  <div
                    className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-3 h-3 bg-white rotate-45"
                    style={{ boxShadow: "2px 2px 0 #cfcfcf" }}
                  />
                </motion.div>
              )}
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
                onClick={() => {
                  if (visualizacao) return;
                  const item: ActiveSec = {
                    id: sec.id,
                    titulo: sec.titulo,
                    numero,
                    isBau: isChest,
                  };
                  setActiveLesson(item);
                  if (status === "bloqueada") setLockedOpen(true);
                  else setStartOpen(true);
                }}
                className="relative w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-extrabold transition-transform active:translate-y-0.5"
                style={
                  isActive || isDone
                    ? {
                        background: isDone ? "#86D05D" : "hsl(var(--primary))",
                        boxShadow: "0 6px 0 hsl(var(--kwendi-red-dark))",
                      }
                    : {
                        background: "#cfcfcf",
                        boxShadow: "0 6px 0 #a8a8a8",
                      }
                }
                aria-label={`Lição ${numero}: ${sec.titulo}`}
              >
                {isChest ? (
                  <Chest className="w-10 h-10" color="#fff" />
                ) : isDone ? (
                  <Check className="w-8 h-8" strokeWidth={4} />
                ) : isActive ? (
                  numero
                ) : (
                  <Lock className="w-7 h-7" strokeWidth={3} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  /** Banner cheio (crimson) da unidade activa. */
  const renderBannerAtual = (modulo: Modulo, unidade: Unidade) => (
    <div
      className="rounded-2xl px-5 py-4 mb-2 text-white"
      style={{
        background: `hsl(${modulo.cor})`,
        boxShadow: `0 5px 0 hsl(${modulo.corEscura})`,
      }}
    >
      <p className="text-xs font-bold tracking-widest opacity-90">
        MÓDULO {modulo.numero}, UNIDADE {unidade.numero}
      </p>
      <h1 className="text-xl font-extrabold leading-tight mt-1">
        {unidade.titulo}
      </h1>
    </div>
  );

  /** Banner de unidade expandida (modo visualização) com botão Fechar. */
  const renderBannerExpandida = (modulo: Modulo, unidade: Unidade) => (
    <div
      className="rounded-2xl px-5 py-4 mb-2 text-white flex items-start justify-between gap-3"
      style={{
        background: `hsl(${modulo.cor})`,
        boxShadow: `0 5px 0 hsl(${modulo.corEscura})`,
      }}
    >
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-widest opacity-90">
          MÓDULO {modulo.numero}, UNIDADE {unidade.numero}
        </p>
        <h2 className="text-lg font-extrabold leading-tight mt-1">
          {unidade.titulo}
        </h2>
        <p className="text-[11px] text-white/80 mt-0.5">
          Pré-visualização — conclua as anteriores para desbloquear.
        </p>
      </div>
      <button
        onClick={() => toggleExpandida(unidade.id)}
        aria-label="Fechar unidade"
        className="w-9 h-9 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:translate-y-0.5"
      >
        <ChevronUp className="w-5 h-5 text-white" strokeWidth={3} />
      </button>
    </div>
  );

  /** Cabeçalho de módulo (chip castanho). */
  const renderModuloHeader = (modulo: Modulo) => (
    <div className="mt-2 mb-3 flex items-center gap-3 px-2">
      <div className="flex-1 h-px" style={{ background: "rgba(107,63,29,0.55)" }} />
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{
            background: `hsl(${modulo.cor})`,
            boxShadow: `0 0 0 2px rgba(255,255,255,0.7)`,
          }}
        />
        <span
          className="text-xs font-extrabold tracking-wider uppercase"
          style={{ color: "#6B3F1D", textShadow: "0 1px 0 rgba(255,255,255,0.7)" }}
        >
          Módulo {modulo.numero} — {modulo.titulo}
        </span>
      </span>
      <div className="flex-1 h-px" style={{ background: "rgba(107,63,29,0.55)" }} />
    </div>
  );

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
            onClick={() => navigate("/profile")}
          >
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          </button>

          {/* Africa map with plane departing from Angola */}
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            aria-label="Mapa de África"
            onClick={() => {
              const seen = localStorage.getItem("kwendi_seen_fronteiras_intro");
              navigate(seen ? "/para-alem-fronteiras" : "/fronteiras-intro");
            }}
          >
            <AfricaPlane className="w-9 h-9" />
          </button>

          {/* Campfire + streak */}
          <div className="flex items-center gap-1">
            <Campfire />
            <span className="font-extrabold text-sm" style={{ color: "#5E5C5C" }}>
              {saldo.ofensiva}
            </span>
          </div>

          {/* Diamond + gems */}
          <div className="flex items-center gap-1">
            <Diamond className="w-6 h-6" />
            <span className="font-extrabold text-sm" style={{ color: "#5E5C5C" }}>
              {saldo.diamantes.toLocaleString()}
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
        {/* Sequência única: todos os módulos/unidades, em ordem.
            Só a unidade atual renderiza o zig-zag aberto. As demais
            aparecem como cards fechados (ícone de livro -> popover). */}
        {CURRICULO.map((mod, mi) => (
          <div key={mod.id} className="relative">
            {mi > 0 && (
              <TotemSeparador
                numeroProximoModulo={mod.numero}
                variante={mi % 2 === 1 ? "arco" : "pilha"}
              />
            )}
            {renderModuloHeader(mod)}
            {mod.unidades.map((u) => {
              const animacao = ANIMACOES_UNIDADE[u.id];
              if (u.id === atual.unidade.id) {
                return (
                  <div key={u.id} className="mb-6">
                    <div className="relative overflow-hidden rounded-2xl">
                      {renderBannerAtual(mod, u)}
                      {animacao && <BannerAnimacao tipo={animacao} />}
                    </div>
                    {renderZigZag(u)}
                  </div>
                );
              }
              if (expandedUnidades.has(u.id)) {
                return (
                  <div key={u.id} className="mb-6">
                    <div className="relative overflow-hidden rounded-2xl">
                      {renderBannerExpandida(mod, u)}
                      {animacao && <BannerAnimacao tipo={animacao} />}
                    </div>
                    {renderZigZag(u, true)}
                  </div>
                );
              }
              return (
                <UnidadeCardFechado
                  key={u.id}
                  modulo={mod}
                  unidade={u}
                  expandida={false}
                  onToggle={toggleExpandida}
                />
              );
            })}
          </div>
        ))}
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
      <BottomNav active="home" />

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
            LIÇÃO {activeLesson?.numero}
          </div>
          <div className="p-5 text-center">
            <h2 className="text-xl font-extrabold" style={{ color: "#5E5C5C" }}>
              {activeLesson?.titulo}
            </h2>
            <p className="mt-2 text-sm font-bold" style={{ color: "hsl(var(--primary))" }}>
              +10 XP
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => {
                  setStartOpen(false);
                  if (activeLesson) navigate(`/lesson/${activeLesson.id}`);
                }}
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