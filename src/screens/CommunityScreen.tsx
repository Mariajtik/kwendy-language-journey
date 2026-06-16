/**
 * CommunityScreen.tsx
 * -------------------
 * Full-screen Comunidade with subtabs: Comunidade / Minha Tribo (conditional) /
 * Ranking / Conquistas. Composer with AI moderation notice. UI only — backend later.
 */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Flame,
  MessageCircle,
  Send,
  ShieldCheck,
  Trophy,
  Zap,
  Crown,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import avatar from "@/assets/avatar.jpg";

/* ----- Mocked data ----- */
const FOLLOWING_COUNT = 0; // toggle >0 to reveal "Minha Tribo"

type Post = {
  id: number;
  user: string;
  badge: { icon: typeof Flame; label: string; color: string };
  text: string;
  reactions: number;
  comments: number;
  tribe?: boolean;
};

const posts: Post[] = [
  {
    id: 1,
    user: "Nzinga",
    badge: { icon: Flame, label: "Sequência 7 dias", color: "#FF7A2E" },
    text: "Acabei de aprender a saudação 'Wakolelepo!' — significa 'Olá, como estás?' em Umbundu. 🇦🇴",
    reactions: 24,
    comments: 3,
  },
  {
    id: 2,
    user: "Kiame",
    badge: { icon: Trophy, label: "Marco desbloqueado", color: "hsl(var(--primary))" },
    text: "Completei o Módulo 1: Saúda a tua comunidade! Próximo passo: família. 💪",
    reactions: 41,
    comments: 7,
  },
  {
    id: 3,
    user: "Suzana",
    badge: { icon: Zap, label: "+250 XP esta semana", color: "#FBBD12" },
    text: "Curiosidade: o povo Ovimbundu vive principalmente no planalto central de Angola. 🌍",
    reactions: 18,
    comments: 2,
  },
];

const ranking = [
  { name: "Kiame", xp: 1240 },
  { name: "Nzinga", xp: 980 },
  { name: "Hossy", xp: 870 },
  { name: "Yellen", xp: 720 },
  { name: "Suzana", xp: 615 },
  { name: "Otchali", xp: 540 },
  { name: "Keke Han", xp: 410 },
  { name: "Tu", xp: 0 },
];

type Tab = "feed" | "tribo" | "ranking" | "conquistas";

const CommunityScreen = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("feed");
  const [draft, setDraft] = useState("");

  const tabs = useMemo(
    () => [
      { id: "feed" as const, label: "Comunidade" },
      ...(FOLLOWING_COUNT > 0 ? [{ id: "tribo" as const, label: "Minha Tribo" }] : []),
      { id: "ranking" as const, label: "Ranking" },
      { id: "conquistas" as const, label: "Conquistas" },
    ],
    [],
  );

  const handlePublish = () => {
    if (!draft.trim()) return;
    toast({
      title: "Publicação enviada para revisão",
      description:
        "A IA Kwendi irá rever a tua publicação antes de aparecer na comunidade.",
    });
    setDraft("");
  };

  return (
    <motion.div
      className="app-shell relative bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <header className="px-6 pt-6 pb-3 flex items-center gap-3 sticky top-0 bg-background z-10">
        <button onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft className="w-6 h-6 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-extrabold text-foreground">Comunidade</h1>
      </header>

      {/* Tabs */}
      <div className="px-6 sticky top-[60px] bg-background z-10">
        <div className="flex items-center gap-4 overflow-x-auto border-b border-border">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="relative pb-2 text-sm font-extrabold whitespace-nowrap transition-colors"
                style={{ color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
              >
                {t.label}
                {active && (
                  <motion.span
                    layoutId="community-tab-underline"
                    className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "hsl(var(--primary))" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-4 pb-32">
        {(tab === "feed" || tab === "tribo") && (
          <>
            {/* Moderation banner */}
            <div className="flex items-start gap-2 rounded-2xl border border-border bg-secondary/60 p-3 mb-4">
              <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                Só conteúdo sobre <strong>África, Angola, língua Umbundu e o Kwendi</strong> é permitido.
                A IA Kwendi revê cada publicação antes de aparecer aqui.
              </p>
            </div>

            {/* Composer */}
            <div className="rounded-2xl border-2 border-border bg-card p-3 mb-5">
              <div className="flex items-start gap-3">
                <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={2}
                  maxLength={280}
                  placeholder="Partilha algo sobre África, Angola, Umbundu ou o Kwendi…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
                />
              </div>
              <div className="flex items-center justify-between mt-2 pl-12">
                <span className="text-[11px] text-muted-foreground">{draft.length}/280</span>
                <button
                  onClick={handlePublish}
                  disabled={!draft.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold text-white disabled:opacity-50"
                  style={{ background: "hsl(var(--primary))" }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Publicar
                </button>
              </div>
            </div>

            {/* Feed */}
            <div className="space-y-3">
              {(tab === "tribo" ? posts.filter((p) => p.tribe) : posts).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="font-bold">Nada por aqui ainda.</p>
                  <p className="text-sm mt-1">Segue alguém para veres as suas publicações.</p>
                </div>
              ) : (
                (tab === "tribo" ? posts.filter((p) => p.tribe) : posts).map((p) => (
                  <PostCard key={p.id} post={p} />
                ))
              )}
            </div>
          </>
        )}

        {tab === "ranking" && (
          <div className="space-y-2">
            {ranking.map((r, i) => {
              const isMe = r.name === "Tu";
              return (
                <div
                  key={r.name}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{
                    background: isMe ? "hsl(var(--primary) / 0.08)" : "hsl(var(--card))",
                    border: `2px solid ${isMe ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))"}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm"
                    style={{
                      background:
                        i === 0 ? "#FBBD12" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "hsl(var(--muted))",
                      color: i < 3 ? "#fff" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className="flex-1 font-extrabold text-foreground flex items-center gap-1.5">
                    {r.name}
                    {i === 0 && <Crown className="w-4 h-4" style={{ color: "#FBBD12" }} fill="#FBBD12" />}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">{r.xp} XP</span>
                </div>
              );
            })}
          </div>
        )}

        {tab === "conquistas" && (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-muted flex flex-col items-center justify-center gap-1 border-2 border-border"
              >
                <Trophy className="w-7 h-7 text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground">Bloqueada</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="user" />
    </motion.div>
  );
};

/* ----- Post card ----- */
const PostCard = ({ post }: { post: Post }) => {
  const BadgeIcon = post.badge.icon;
  return (
    <article className="rounded-2xl border-2 border-border bg-card p-4">
      <header className="flex items-center gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm"
          style={{ background: "hsl(var(--primary))" }}
        >
          {post.user[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-foreground text-sm">{post.user}</div>
          <div
            className="inline-flex items-center gap-1 text-[11px] font-bold mt-0.5"
            style={{ color: post.badge.color }}
          >
            <BadgeIcon className="w-3 h-3" />
            {post.badge.label}
          </div>
        </div>
      </header>
      <p className="text-sm text-foreground leading-relaxed">{post.text}</p>
      <footer className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
        <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
          <Flame className="w-4 h-4" />
          {post.reactions}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
          <MessageCircle className="w-4 h-4" />
          {post.comments}
        </button>
      </footer>
    </article>
  );
};

export default CommunityScreen;