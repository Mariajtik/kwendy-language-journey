/**
 * CommunityFeed.tsx
 * -----------------
 * Embeddable community UI (subtabs + moderation banner + composer + feed +
 * ranking + conquistas). No own header / BottomNav — meant to be dropped
 * inside another screen (e.g. ProfileScreen's "Comunidade" tab).
 * UI only — backend later.
 */

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Crown,
  Flame,
  MessageCircle,
  Send,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import avatar from "@/assets/avatar.jpg";

/* ----- Mocked data ----- */
const FOLLOWING_COUNT = 0; // toggle >0 to reveal "Minha Tribo"

const REACTIONS = [
  { key: "malaik", label: "Tá malaik", emoji: "🔥" },
  { key: "mambo", label: "Granda mambo!", emoji: "❤️" },
  { key: "concordo", label: "Concordo", emoji: "✅" },
  { key: "discordo", label: "Discordo", emoji: "❌" },
  { key: "erreh", label: "Erreh!", emoji: "😂" },
] as const;
type ReactionKey = (typeof REACTIONS)[number]["key"];

type Comment = { id: number; user: string; text: string };

type Post = {
  id: number;
  user: string;
  badge: { icon: typeof Flame; label: string; color: string };
  text: string;
  reactions: Record<ReactionKey, number>;
  comments: Comment[];
  tribe?: boolean;
};

const posts: Post[] = [
  {
    id: 1,
    user: "Nzinga",
    badge: { icon: Flame, label: "Sequência 7 dias", color: "#FF7A2E" },
    text: "Acabei de aprender a saudação 'Wakolelepo!' — significa 'Olá, como estás?' em Umbundu. 🇦🇴",
    reactions: { malaik: 14, mambo: 6, concordo: 4, discordo: 0, erreh: 0 },
    comments: [
      { id: 1, user: "Kiame", text: "Boa! Vou usar amanhã com a minha avó." },
      { id: 2, user: "Suzana", text: "Wakolelepo, mana! 🙌" },
    ],
  },
  {
    id: 2,
    user: "Kiame",
    badge: { icon: Trophy, label: "Marco desbloqueado", color: "hsl(var(--primary))" },
    text: "Completei o Módulo 1: Saúda a tua comunidade! Próximo passo: família. 💪",
    reactions: { malaik: 20, mambo: 15, concordo: 6, discordo: 0, erreh: 0 },
    comments: [
      { id: 1, user: "Hossy", text: "Granda mambo, parabéns!" },
    ],
  },
  {
    id: 3,
    user: "Suzana",
    badge: { icon: Zap, label: "+250 XP esta semana", color: "#FBBD12" },
    text: "Curiosidade: o povo Ovimbundu vive principalmente no planalto central de Angola. 🌍",
    reactions: { malaik: 8, mambo: 4, concordo: 6, discordo: 0, erreh: 0 },
    comments: [
      { id: 1, user: "Yellen", text: "Adoro estas curiosidades 🙏" },
    ],
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

type SubTab = "feed" | "tribo" | "ranking";

type PostState = {
  reactions: Record<ReactionKey, number>;
  myReaction: ReactionKey | null;
  comments: Comment[];
  showComments: boolean;
  draft: string;
};

const CommunityFeed = () => {
  const [tab, setTab] = useState<SubTab>("feed");
  const [draft, setDraft] = useState("");
  const [state, setState] = useState<Record<number, PostState>>(() =>
    Object.fromEntries(
      posts.map((p) => [
        p.id,
        {
          reactions: { ...p.reactions },
          myReaction: null,
          comments: p.comments,
          showComments: false,
          draft: "",
        } as PostState,
      ]),
    ),
  );

  const updatePost = (id: number, patch: Partial<PostState>) =>
    setState((s) => ({ ...s, [id]: { ...s[id], ...patch } }));

  const toggleReaction = (id: number, key: ReactionKey) => {
    const ps = state[id];
    const next = { ...ps.reactions };
    if (ps.myReaction === key) {
      next[key] = Math.max(0, next[key] - 1);
      updatePost(id, { reactions: next, myReaction: null });
    } else {
      if (ps.myReaction) next[ps.myReaction] = Math.max(0, next[ps.myReaction] - 1);
      next[key] = next[key] + 1;
      updatePost(id, { reactions: next, myReaction: key });
    }
  };

  const submitComment = (id: number) => {
    const ps = state[id];
    const text = ps.draft.trim();
    if (!text) return;
    const newComment: Comment = {
      id: Date.now(),
      user: "Tu",
      text,
    };
    updatePost(id, { comments: [...ps.comments, newComment], draft: "" });
    toast({
      title: "Comentário enviado para revisão",
      description: "A IA Kwendi irá rever antes de aparecer publicamente.",
    });
  };

  const tabs = useMemo(
    () => [
      { id: "feed" as const, label: "Comunidade" },
      ...(FOLLOWING_COUNT > 0 ? [{ id: "tribo" as const, label: "Minha Tribo" }] : []),
      { id: "ranking" as const, label: "Ranking" },
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
    <div>
      {/* Subtabs */}
      <div className="flex items-center gap-4 overflow-x-auto border-b border-border mb-4">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative pb-2 text-xs font-extrabold whitespace-nowrap transition-colors"
              style={{ color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
            >
              {t.label}
              {active && (
                <motion.span
                  layoutId="profile-community-subtab"
                  className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full"
                  style={{ background: "hsl(var(--primary))" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {(tab === "feed" || tab === "tribo") && (
        <>
          {/* Moderation banner */}
          <div className="flex items-start gap-2 rounded-2xl border border-border bg-secondary/60 p-3 mb-4">
            <ShieldCheck
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: "hsl(var(--primary))" }}
            />
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
                <PostCard
                  key={p.id}
                  post={p}
                  state={state[p.id]}
                  onReact={(k) => toggleReaction(p.id, k)}
                  onToggleComments={() =>
                    updatePost(p.id, { showComments: !state[p.id].showComments })
                  }
                  onDraft={(v) => updatePost(p.id, { draft: v })}
                  onSubmitComment={() => submitComment(p.id)}
                />
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
    </div>
  );
};

/* ----- Post card ----- */
const PostCard = ({
  post,
  state,
  onReact,
  onToggleComments,
  onDraft,
  onSubmitComment,
}: {
  post: Post;
  state: PostState;
  onReact: (k: ReactionKey) => void;
  onToggleComments: () => void;
  onDraft: (v: string) => void;
  onSubmitComment: () => void;
}) => {
  const BadgeIcon = post.badge.icon;
  const [pickerOpen, setPickerOpen] = useState(false);
  const totalReactions = Object.values(state.reactions).reduce((a, b) => a + b, 0);
  const activeEmoji = state.myReaction
    ? REACTIONS.find((r) => r.key === state.myReaction)!.emoji
    : null;

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
        <div className="relative">
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className="flex items-center gap-1.5 px-2 py-1 -ml-2 rounded-full text-xs font-bold transition-colors"
            style={{
              background: state.myReaction ? "hsl(var(--primary) / 0.1)" : "transparent",
              color: state.myReaction ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
            }}
          >
            {activeEmoji ? (
              <span className="text-base leading-none">{activeEmoji}</span>
            ) : (
              <Flame className="w-4 h-4" />
            )}
            {totalReactions}
          </button>
          <AnimatePresence>
            {pickerOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setPickerOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7, y: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="absolute bottom-full left-0 mb-2 z-20 flex items-center gap-1 rounded-full border-2 border-border bg-card shadow-lg px-2 py-1.5"
                >
                  {REACTIONS.map((r) => {
                    const active = state.myReaction === r.key;
                    return (
                      <button
                        key={r.key}
                        title={r.label}
                        onClick={() => {
                          onReact(r.key);
                          setPickerOpen(false);
                        }}
                        className="text-xl leading-none p-1 rounded-full transition-transform hover:scale-125"
                        style={{
                          background: active ? "hsl(var(--primary) / 0.15)" : "transparent",
                          transform: active ? "scale(1.1)" : undefined,
                        }}
                      >
                        {r.emoji}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={onToggleComments}
          className="flex items-center gap-1.5 text-xs font-bold transition-colors"
          style={{
            color: state.showComments ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
          }}
        >
          <MessageCircle className="w-4 h-4" />
          {state.comments.length}
        </button>
      </footer>

      <AnimatePresence initial={false}>
        {state.showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              {state.comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white font-extrabold text-[11px] flex-shrink-0"
                    style={{ background: "hsl(var(--primary))" }}
                  >
                    {c.user[0]}
                  </div>
                  <div className="flex-1 min-w-0 bg-secondary/60 rounded-2xl px-3 py-1.5">
                    <div className="text-[11px] font-extrabold text-foreground">
                      {c.user}
                    </div>
                    <p className="text-xs text-foreground leading-snug break-words">
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <img src={avatar} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                <input
                  value={state.draft}
                  onChange={(e) => onDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onSubmitComment();
                    }
                  }}
                  maxLength={200}
                  placeholder="Escreve um comentário…"
                  className="flex-1 min-w-0 bg-secondary/60 rounded-full px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button
                  onClick={onSubmitComment}
                  disabled={!state.draft.trim()}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-40 flex-shrink-0"
                  style={{ background: "hsl(var(--primary))" }}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground pl-9">
                A IA Kwendi revê comentários antes de publicar.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};

export default CommunityFeed;