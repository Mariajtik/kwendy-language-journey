/**
 * ProfileScreen.tsx
 * -----------------
 * Full-screen profile with a curved red header, username, and three tabs:
 * Perfil, Comunidade, Definições. UI only — data is mocked.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Share2,
  Settings,
  Flame,
  Zap,
  Trophy,
  Calendar,
  Users,
  ChevronRight,
  Bell,
  Globe,
  Info,
  LogOut,
  User as UserIcon,
  Plus,
  Lock,
} from "lucide-react";
import avatar from "@/assets/avatar.jpg";
import BottomNav from "@/components/BottomNav";

/* ----- Mocked profile data ----- */
const profile = {
  username: "Angola",
  streak: 0,
  xp: 0,
  level: 1,
  diamonds: 1000,
  memberSince: "Junho 2026",
  following: 0,
  followers: 0,
  moduleProgress: { current: 1, total: 5, name: "Saúda a tua comunidade" },
  marcos: [false, false, false, false],
  conquistas: 4,
};

/* Small faceted diamond identical to the one in HomeScreen */
const Diamond = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <path d="M6 3h12l4 6-10 12L2 9l4-6z" fill="#5E5C5C" stroke="#3d3b3b" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M6 3l3 6h6l3-6M2 9h20M9 9l3 12M15 9l-3 12" stroke="#3d3b3b" strokeWidth="1" fill="none" />
    <path d="M9 9l1.5-4h2L14 9z" fill="#7a7878" />
  </svg>
);

type Tab = "perfil" | "comunidade" | "definicoes";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("perfil");

  const progressPct = (profile.moduleProgress.current / profile.moduleProgress.total) * 100;

  return (
    <motion.div
      className="app-shell relative bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* ---------- Curved red header ---------- */}
      <header
        className="relative w-full text-white px-6 pt-10 pb-16"
        style={{
          background: "hsl(var(--primary))",
          borderBottomLeftRadius: "55% 35%",
          borderBottomRightRadius: "0 0",
          minHeight: 220,
        }}
      >
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-extrabold drop-shadow-sm">
            {profile.username}
          </h1>
          <div className="flex items-center gap-3">
            <button aria-label="Partilhar" className="p-1.5">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              aria-label="Definições"
              onClick={() => setTab("definicoes")}
              className="p-1.5"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Avatar floating bottom-right of header */}
        <div className="absolute right-6 -bottom-10">
          <div className="w-20 h-20 rounded-full border-4 border-background overflow-hidden shadow-lg">
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* ---------- Tabs ---------- */}
      <div className="px-6 mt-14">
        <div className="flex items-center gap-6 border-b border-border">
          {([
            { id: "perfil", label: "Perfil" },
            { id: "comunidade", label: "Comunidade" },
            { id: "definicoes", label: "Definições" },
          ] as { id: Tab; label: string }[]).map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="relative pb-2 text-sm font-extrabold transition-colors"
                style={{ color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
              >
                {t.label}
                {active && (
                  <motion.span
                    layoutId="profile-tab-underline"
                    className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "hsl(var(--primary))" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- Tab content ---------- */}
      <div className="px-6 mt-6 pb-32">
        {tab === "perfil" && (
          <div className="space-y-7">
            {/* Visão geral */}
            <section>
              <h2 className="text-lg font-extrabold text-foreground mb-3">
                Visão geral
              </h2>
              <div className="grid grid-cols-3 gap-2">
                <StatCard icon={<Flame className="w-5 h-5" style={{ color: "#FF7A2E" }} fill="#FF7A2E" />} value={profile.streak} label="Sequência" />
                <StatCard icon={<Zap className="w-5 h-5" style={{ color: "#FBBD12" }} fill="#FBBD12" />} value={`${profile.xp} XP`} label="Experiência" />
                <StatCard icon={<Trophy className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />} value={`Nv ${profile.level}`} label="Nível" />
              </div>
            </section>

            {/* Info */}
            <section className="rounded-2xl border-2 border-border p-4 bg-card">
              <InfoRow icon={<UserIcon className="w-4 h-4 text-muted-foreground" />} label="Nome" value={profile.username} />
              <InfoRow icon={<Diamond className="w-4 h-4" />} label="Diamantes" value={profile.diamonds.toLocaleString()} />
              <InfoRow icon={<Calendar className="w-4 h-4 text-muted-foreground" />} label="Membro desde" value={profile.memberSince} last />
            </section>

            {/* Seguir / Seguindo */}
            <section className="rounded-2xl border-2 border-border p-4 bg-card flex items-center justify-between">
              <div className="flex gap-6">
                <Counter value={profile.followers} label="Seguidores" />
                <Counter value={profile.following} label="Seguindo" />
              </div>
              <button
                className="px-4 py-2 rounded-full text-sm font-extrabold text-white opacity-60 cursor-not-allowed"
                style={{ background: "hsl(var(--primary))" }}
                disabled
              >
                Seguir
              </button>
            </section>

            {/* Progresso */}
            <section>
              <h2 className="text-lg font-extrabold text-foreground mb-3">Progresso</h2>
              <div className="rounded-2xl border-2 border-border p-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-foreground">
                    {profile.moduleProgress.name}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    {profile.moduleProgress.current}/{profile.moduleProgress.total}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${progressPct}%`, background: "hsl(var(--primary))" }}
                  />
                </div>
              </div>
            </section>

            {/* Marcos */}
            <section>
              <h2 className="text-lg font-extrabold text-foreground mb-3">Marcos</h2>
              <div className="grid grid-cols-4 gap-3">
                {profile.marcos.map((unlocked, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: unlocked ? "hsl(var(--primary))" : "hsl(var(--border))",
                        background: unlocked ? "hsl(var(--primary) / 0.1)" : "transparent",
                      }}
                    >
                      {unlocked ? (
                        <Trophy className="w-7 h-7" style={{ color: "hsl(var(--primary))" }} />
                      ) : (
                        <Plus className="w-6 h-6 text-muted-foreground" strokeWidth={2.5} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Conquistas */}
            <section>
              <h2 className="text-lg font-extrabold text-foreground mb-3">Conquistas</h2>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: profile.conquistas }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] rounded-2xl bg-muted flex items-center justify-center"
                  >
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === "comunidade" && (
          <div className="space-y-5">
            {/* Seguir/Seguindo resumo */}
            <section className="rounded-2xl border-2 border-border p-4 bg-card flex items-center justify-around">
              <Counter value={profile.followers} label="Seguidores" />
              <div className="w-px h-8 bg-border" />
              <Counter value={profile.following} label="Seguindo" />
            </section>

            {/* Progresso compacto */}
            <section className="rounded-2xl border-2 border-border p-4 bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-foreground">Progresso</span>
                <span className="text-xs font-bold text-muted-foreground">
                  {profile.moduleProgress.current}/{profile.moduleProgress.total}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${progressPct}%`, background: "hsl(var(--primary))" }}
                />
              </div>
            </section>

            {/* Conquistas resumo */}
            <section>
              <h3 className="font-extrabold text-foreground mb-2">Conquistas</h3>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] rounded-2xl bg-muted flex items-center justify-center"
                  >
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </section>

            {/* Abrir Comunidade */}
            <button
              onClick={() => navigate("/comunidade")}
              className="w-full flex items-center justify-between rounded-2xl px-5 py-4 text-white font-extrabold"
              style={{
                background: "hsl(var(--primary))",
                boxShadow: "0 5px 0 hsl(var(--kwendi-red-dark))",
              }}
            >
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Abrir Comunidade
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {tab === "definicoes" && (
          <div className="rounded-2xl border-2 border-border bg-card overflow-hidden">
            {[
              { icon: UserIcon, label: "Conta" },
              { icon: Bell, label: "Notificações" },
              { icon: Globe, label: "Idioma" },
              { icon: Info, label: "Sobre o Kwendi" },
              { icon: LogOut, label: "Sair", destructive: true },
            ].map((item, i, arr) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between px-4 py-4 text-left"
                style={{
                  borderBottom: i < arr.length - 1 ? "1px solid hsl(var(--border))" : "none",
                }}
              >
                <span className="flex items-center gap-3 font-bold">
                  <item.icon
                    className="w-5 h-5"
                    style={{ color: item.destructive ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))" }}
                  />
                  <span style={{ color: item.destructive ? "hsl(var(--destructive))" : "hsl(var(--foreground))" }}>
                    {item.label}
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="user" />
    </motion.div>
  );
};

/* ----- Small helpers ----- */

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
}) => (
  <div className="rounded-2xl border-2 border-border bg-card p-3 flex flex-col items-center text-center">
    <div className="mb-1">{icon}</div>
    <span className="text-base font-extrabold text-foreground leading-none">{value}</span>
    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mt-1">
      {label}
    </span>
  </div>
);

const InfoRow = ({
  icon,
  label,
  value,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  last?: boolean;
}) => (
  <div
    className="flex items-center justify-between py-2.5"
    style={{ borderBottom: last ? "none" : "1px solid hsl(var(--border))" }}
  >
    <span className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
      {icon}
      {label}
    </span>
    <span className="text-sm font-extrabold text-foreground">{value}</span>
  </div>
);

const Counter = ({ value, label }: { value: number; label: string }) => (
  <div className="text-center">
    <div className="text-lg font-extrabold text-foreground leading-none">{value}</div>
    <div className="text-[11px] font-bold text-muted-foreground mt-1">{label}</div>
  </div>
);

export default ProfileScreen;