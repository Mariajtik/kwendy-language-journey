/**
 * ProfileScreen.tsx
 * -----------------
 * Full-screen profile with a curved red header, username, and three tabs:
 * Perfil, Comunidade, Definições. UI only — data is mocked.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Settings,
  Flame,
  Zap,
  Trophy,
  Calendar,
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
import CommunityFeed from "@/components/CommunityFeed";
import DiamanteNegro from "@/components/icons/DiamanteNegro";
import { useSaldo } from "@/hooks/useSaldo";
import { useMissoes } from "@/hooks/useMissoes";

/* ----- Mocked profile data ----- */
const profileBase = {
  username: "Angola",
  level: 1,
  memberSince: "Junho 2026",
  following: 0,
  followers: 0,
  moduleProgress: { current: 1, total: 5, name: "Saúda a tua comunidade" },
  marcos: [false, false, false, false],
};

const Diamond = DiamanteNegro;

type Tab = "perfil" | "comunidade" | "definicoes";

const ProfileScreen = () => {
  const [tab, setTab] = useState<Tab>("perfil");
  const { saldo } = useSaldo();
  const { conquistas } = useMissoes();
  const profile = {
    ...profileBase,
    streak: saldo.ofensiva,
    xp: saldo.xp,
    diamonds: saldo.diamantes,
    conquistas: conquistas.filter((c) => c.desbloqueada).length || 4,
  };

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

            {/* Cosméticos */}
            <section>
              <h2 className="text-lg font-extrabold text-foreground mb-3">Cosméticos</h2>
              <div className="grid grid-cols-3 gap-3">
                <ChapeuPalhaCard unlocked={saldo.cosmeticos.includes("chapeu-palha")} />
              </div>
            </section>
          </div>
        )}

        {tab === "comunidade" && <CommunityFeed />}

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

const ChapeuPalhaCard = ({ unlocked }: { unlocked: boolean }) => (
  <div
    className="aspect-square rounded-2xl border-2 border-border bg-card flex flex-col items-center justify-center p-2 text-center"
    style={{ opacity: unlocked ? 1 : 0.55 }}
  >
    <div className="text-3xl mb-1" style={{ filter: unlocked ? "none" : "grayscale(1)" }}>
      👒
    </div>
    <div className="text-[10px] font-extrabold text-foreground leading-tight">
      Chapéu de palha
    </div>
    <div className="text-[9px] font-bold text-muted-foreground leading-tight mt-0.5">
      {unlocked ? "Desbloqueado" : "Lê Pensador + Agostinho"}
    </div>
  </div>
);

export default ProfileScreen;