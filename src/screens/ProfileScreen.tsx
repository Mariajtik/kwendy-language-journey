/**
 * ProfileScreen.tsx
 * -----------------
 * Full-screen profile with a curved red header, username, and three tabs:
 * Perfil, Comunidade, Definições. UI only — data is mocked.
 */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Settings,
  Flame,
  Zap,
  Trophy,
  Calendar,
  ChevronRight,
  User as UserIcon,
  Plus,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import avatar from "@/assets/avatar.jpg";
import BottomNav from "@/components/BottomNav";
import CommunityFeed from "@/components/CommunityFeed";
import DiamanteNegro from "@/components/icons/DiamanteNegro";
import KwendiIcon from "@/components/icons/KwendiIcon";
import { useSaldo } from "@/hooks/useSaldo";
import { usePremium } from "@/contexts/PremiumContext";
import { useMissoes } from "@/hooks/useMissoes";
import BadgeStar from "@/components/missoes/BadgeStar";
import ConquistaModal from "@/components/missoes/ConquistaModal";
import type { ConquistaView } from "@/hooks/useMissoes";
import { CONQUISTAS } from "@/data/conquistas";
import trofeu30dias from "@/assets/missoes/trofeu.png.asset.json";
import { getStat, STATS } from "@/lib/stats";

const TOTAL_LETRAS = 23;

/* ----- Mocked profile data ----- */
const profileBase = {
  username: "Angola",
  level: 1,
  memberSince: "Junho 2026",
  following: 0,
  followers: 0,
  moduleProgress: { current: 1, total: 5, name: "Saúda a tua comunidade" },
};

const Diamond = DiamanteNegro;

type Tab = "perfil" | "comunidade";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("perfil");
  const [conquistaAberta, setConquistaAberta] = useState<ConquistaView | null>(null);
  const { saldo } = useSaldo();
  const { ativo: premium } = usePremium();
  const { conquistas, resgatarConquista } = useMissoes();
  const desbloqueadas = useMemo(
    () => conquistas.filter((c) => c.desbloqueada),
    [conquistas]
  );
  const totalConquistas = CONQUISTAS.length;

  // Marcos: 4 patamares lineares de progresso pessoal
  const marcos = useMemo(() => {
    const completo = profileBase.moduleProgress.current >= profileBase.moduleProgress.total;
    const guardadas = (() => {
      try {
        return JSON.parse(localStorage.getItem(STATS.cadernoGuardadas) ?? "[]").length as number;
      } catch {
        return 0;
      }
    })();
    const alfabeto = getStat(STATS.alfabetoEscutas);
    return [
      { label: "Nv 5",       unlocked: saldo.xp >= 2000, trophy: undefined as string | undefined },
      { label: "Nv 10",      unlocked: saldo.xp >= 5000, trophy: undefined as string | undefined },
      { label: "Módulo 1",   unlocked: completo,         trophy: undefined as string | undefined },
      { label: "30 dias",    unlocked: saldo.ofensiva >= 30, trophy: trofeu30dias.url },
      { label: "Caderno 50", unlocked: guardadas >= 50,    trophy: undefined },
      { label: "Alfabeto",   unlocked: alfabeto >= TOTAL_LETRAS, trophy: undefined },
    ];
  }, [saldo.xp, saldo.ofensiva]);

  const profile = {
    ...profileBase,
    streak: premium ? Math.max(saldo.ofensiva, 1) : saldo.ofensiva,
    xp: saldo.xp,
    diamonds: saldo.diamantes,
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
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-3xl font-extrabold drop-shadow-sm">
              {profile.username}
            </h1>
            {premium && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-white/25 backdrop-blur px-2 py-0.5 text-[10px] font-extrabold tracking-widest uppercase"
                title="Membro Premium (degustação)"
              >
                <span aria-hidden>👑</span>
                Premium
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button aria-label="Partilhar" className="p-1.5">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              aria-label="Definições"
              onClick={() => navigate("/profile/definicoes")}
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
                <StatCard icon={<KwendiIcon name={profile.streak > 0 ? "chamaAcesa" : "chamaApagada"} className="w-6 h-6" />} value={profile.streak} label="Sequência" />
                <StatCard icon={<KwendiIcon name="raioxp" className="w-6 h-6" />} value={`${profile.xp} XP`} label="Experiência" />
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
              <h2 className="text-lg font-extrabold text-foreground mb-1">Marcos</h2>
              <p className="text-xs text-muted-foreground mb-3">
                Patamares da tua jornada.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {marcos.map((mk, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: mk.unlocked ? "hsl(var(--primary))" : "hsl(var(--border))",
                        background: mk.unlocked ? "hsl(var(--primary) / 0.1)" : "transparent",
                      }}
                    >
                      {mk.unlocked ? (
                        mk.trophy ? (
                          <img
                            src={mk.trophy}
                            alt={mk.label}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <Trophy className="w-7 h-7" style={{ color: "hsl(var(--primary))" }} />
                        )
                      ) : mk.trophy ? (
                        <img
                          src={mk.trophy}
                          alt={mk.label}
                          className="w-12 h-12 object-contain opacity-30 grayscale"
                        />
                      ) : (
                        <Plus className="w-6 h-6 text-muted-foreground" strokeWidth={2.5} />
                      )}
                    </div>
                    <span
                      className="text-[10px] font-extrabold leading-none"
                      style={{ color: mk.unlocked ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
                    >
                      {mk.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Conquistas */}
            <section>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-foreground leading-tight">Conquistas</h2>
                  <p className="text-xs text-muted-foreground">
                    {desbloqueadas.length} de {totalConquistas} desbloqueadas
                  </p>
                </div>
                <button
                  onClick={() => navigate("/missoes")}
                  className="text-xs font-extrabold flex items-center gap-0.5"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  Ver todas <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {desbloqueadas.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center">
                  <Lock className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-bold text-foreground">
                    Ainda sem conquistas
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Desbloqueia a tua primeira em Missões → Conquistas.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {desbloqueadas.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setConquistaAberta(c)}
                      className="flex flex-col items-center gap-1"
                    >
                      <BadgeStar cor={c.badge} className="w-14 h-14" />
                      <span className="text-[10px] font-extrabold leading-tight text-center text-foreground line-clamp-2">
                        {c.titulo}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>

          </div>
        )}

        {tab === "comunidade" && <CommunityFeed />}
      </div>

      <BottomNav active="user" />

      <ConquistaModal
        conquista={conquistaAberta}
        onClose={() => setConquistaAberta(null)}
        onResgatar={(id) => {
          resgatarConquista(id);
          setConquistaAberta(null);
        }}
      />

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