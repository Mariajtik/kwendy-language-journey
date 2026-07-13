/**
 * ProfileScreen.tsx
 * -----------------
 * Full-screen profile with a curved red header, username, and three tabs:
 * Perfil, Comunidade, Definições. UI only — data is mocked.
 */

import { useEffect, useMemo, useState } from "react";
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
import { useTranslation } from "react-i18next";
import defaultAvatar from "@/assets/avatar.jpg";
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
import trofeu30dias from "@/assets/missoes/trofeu.png";
import { getStat, STATS } from "@/lib/stats";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TOTAL_LETRAS = 23;

/* ----- Base defaults (overridden by real profile data below) ----- */
const profileBase = {
  level: 1,
  following: 0,
  followers: 0,
  moduleProgress: { current: 1, total: 5, name: "Saúda a tua comunidade" },
};

const Diamond = DiamanteNegro;

type Tab = "perfil" | "comunidade";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("perfil");
  const [conquistaAberta, setConquistaAberta] = useState<ConquistaView | null>(null);
  const [dbProfile, setDbProfile] = useState<{
    nome: string | null;
    avatar_url: string | null;
    created_at: string | null;
  }>({ nome: null, avatar_url: null, created_at: null });
  const [counts, setCounts] = useState({ seguidores: 0, seguindo: 0 });
  const [amigos, setAmigos] = useState<
    { id: string; nome: string | null; avatar_url: string | null; xp: number }[]
  >([]);
  const [amigosOpen, setAmigosOpen] = useState<null | "seguidores" | "seguindo">(null);
  const { saldo } = useSaldo();
  const { ativo: premium } = usePremium();
  const { conquistas, resgatarConquista } = useMissoes();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("nome, avatar_url, created_at")
        .eq("id", user.id)
        .maybeSingle();
      if (!cancelled && data) {
        setDbProfile({
          nome: data.nome ?? null,
          avatar_url: data.avatar_url ?? null,
          created_at: data.created_at ?? null,
        });
      }
      const { data: c } = await supabase.rpc("contar_amizades", { _uid: user.id });
      if (!cancelled && c && c.length > 0) {
        setCounts({
          seguidores: (c[0] as any).seguidores ?? 0,
          seguindo: (c[0] as any).seguindo ?? 0,
        });
      }
      const { data: lst } = await supabase.rpc("listar_amigos", { _uid: user.id });
      if (!cancelled) setAmigos((lst ?? []) as any);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

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
      { label: `${t("profile.nvPrefix", "Nv")} 5`,  unlocked: saldo.xp >= 2000, trophy: undefined as string | undefined },
      { label: `${t("profile.nvPrefix", "Nv")} 10`, unlocked: saldo.xp >= 5000, trophy: undefined as string | undefined },
      { label: t("profile.modulo1", "Módulo 1"),    unlocked: completo,         trophy: undefined as string | undefined },
      { label: `30 ${t("profile.diasSuf", "dias")}`,unlocked: saldo.ofensiva >= 30, trophy: trofeu30dias },
      { label: t("profile.caderno50", "Caderno 50"),unlocked: guardadas >= 50,    trophy: undefined },
      { label: t("profile.alfabetoMarco", "Alfabeto"), unlocked: alfabeto >= TOTAL_LETRAS, trophy: undefined },
    ];
  }, [saldo.xp, saldo.ofensiva, t]);

  const meta = (user?.user_metadata ?? {}) as Record<string, any>;
  const username =
    dbProfile.nome ??
    meta.nome ??
    meta.full_name ??
    meta.name ??
    user?.email?.split("@")[0] ??
    "Convidado";
  const avatarSrc = dbProfile.avatar_url || meta.avatar_url || meta.picture || defaultAvatar;
  const memberSince = (() => {
    const iso = dbProfile.created_at ?? user?.created_at ?? null;
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString(undefined, { month: "long", year: "numeric" });
    } catch {
      return "—";
    }
  })();
  const profile = {
    ...profileBase,
    following: counts.seguindo,
    followers: counts.seguidores,
    username,
    memberSinceKey: memberSince,
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
                title={t("profile.membroPremiumTitle", "Membro Premium (degustação)")}
              >
                <span aria-hidden>👑</span>
                {t("profile.premium", "Premium")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button aria-label={t("profile.partilhar", "Partilhar")} className="p-1.5">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              aria-label={t("profile.definicoes", "Definições")}
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
            <img src={avatarSrc} alt={t("profile.avatar", "Avatar")} className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* ---------- Tabs ---------- */}
      <div className="px-6 mt-14">
        <div className="flex items-center gap-6 border-b border-border">
          {([
            { id: "perfil", label: t("profile.tabPerfil", "Perfil") },
            { id: "comunidade", label: t("profile.tabComunidade", "Comunidade") },
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
                {t("profile.visaoGeral", "Visão geral")}
              </h2>
              <div className="grid grid-cols-3 gap-2">
                <StatCard
                  icon={
                    <KwendiIcon
                      name={premium || profile.streak > 0 ? "chamaAcesa" : "chamaApagada"}
                      className="w-6 h-6"
                    />
                  }
                  value={premium ? "∞" : profile.streak}
                  label={premium ? t("profile.chamaEterna", "Chama eterna") : t("profile.sequencia", "Sequência")}
                />
                <StatCard icon={<KwendiIcon name="raioxp" className="w-6 h-6" />} value={`${profile.xp} XP`} label={t("profile.experiencia", "Experiência")} />
                <StatCard icon={<Trophy className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />} value={`${t("profile.nvPrefix", "Nv")} ${profile.level}`} label={t("profile.nivelLabel", "Nível")} />
              </div>
            </section>

            {/* Info */}
            <section className="rounded-2xl border-2 border-border p-4 bg-card">
              <InfoRow icon={<UserIcon className="w-4 h-4 text-muted-foreground" />} label={t("profile.nome", "Nome")} value={profile.username} />
              <InfoRow icon={<Diamond className="w-4 h-4" />} label={t("profile.diamantes", "Diamantes")} value={profile.diamonds.toLocaleString()} />
              <InfoRow icon={<Calendar className="w-4 h-4 text-muted-foreground" />} label={t("profile.membroDesde", "Membro desde")} value={profile.memberSinceKey} last />
            </section>

            {/* Seguir / Seguindo */}
            <section className="rounded-2xl border-2 border-border p-4 bg-card flex items-center justify-between">
              <div className="flex gap-6">
                <button onClick={() => setAmigosOpen("seguidores")} className="text-left">
                  <Counter value={profile.followers} label={t("profile.seguidores", "Seguidores")} />
                </button>
                <button onClick={() => setAmigosOpen("seguindo")} className="text-left">
                  <Counter value={profile.following} label={t("profile.seguindo", "Seguindo")} />
                </button>
              </div>
              <button
                onClick={() => setTab("comunidade")}
                className="px-4 py-2 rounded-full text-sm font-extrabold text-white"
                style={{ background: "hsl(var(--primary))" }}
              >
                {t("profile.encontrar", "Encontrar amigos")}
              </button>
            </section>

            {/* Progresso */}
            <section>
              <h2 className="text-lg font-extrabold text-foreground mb-3">{t("profile.progresso", "Progresso")}</h2>
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
              <h2 className="text-lg font-extrabold text-foreground mb-1">{t("profile.marcos", "Marcos")}</h2>
              <p className="text-xs text-muted-foreground mb-3">
                {t("profile.marcosSub", "Patamares da tua jornada.")}
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
                  <h2 className="text-lg font-extrabold text-foreground leading-tight">{t("profile.conquistas", "Conquistas")}</h2>
                  <p className="text-xs text-muted-foreground">
                    {desbloqueadas.length} {t("profile.de", "de")} {totalConquistas} {t("profile.desbloqueadas", "desbloqueadas")}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/missoes")}
                  className="text-xs font-extrabold flex items-center gap-0.5"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {t("profile.verTodas", "Ver todas")} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {desbloqueadas.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center">
                  <Lock className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-bold text-foreground">
                    {t("profile.semConquistas", "Ainda sem conquistas")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("profile.semConquistasSub", "Desbloqueia a tua primeira em Missões → Conquistas.")}
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

      <Dialog open={!!amigosOpen} onOpenChange={(o) => { if (!o) setAmigosOpen(null); }}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              {amigosOpen === "seguidores"
                ? t("profile.seguidores", "Seguidores")
                : t("profile.seguindo", "Seguindo")}
            </DialogTitle>
          </DialogHeader>
          {amigos.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              {t("profile.semAmigos", "Ainda sem amigos. Encontra pessoas na aba Comunidade → Ranking.")}
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {amigos.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-xl border-2 border-border px-3 py-2"
                >
                  {a.avatar_url ? (
                    <img src={a.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full grid place-items-center text-white font-extrabold text-sm"
                      style={{ background: "hsl(var(--primary))" }}
                    >
                      {(a.nome ?? "K")[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-sm text-foreground truncate">
                      {a.nome ?? "Kwendian"}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{a.xp} XP</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

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