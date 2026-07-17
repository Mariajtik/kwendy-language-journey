/**
 * CommunityFeed.tsx — Comunidade real, ligada ao backend.
 *
 * Substitui a versão mock. Todas as publicações, reacções, comentários e
 * ranking vêm do Supabase e são actualizados em tempo real. Publicar cria
 * um post em `pending` e chama a edge function `moderate-post` que decide
 * se o conteúdo é aprovado/rejeitado com a IA.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Crown,
  Flame,
  ImagePlus,
  MessageCircle,
  Send,
  ShieldCheck,
  Trophy,
  UserPlus,
  Check,
  Clock,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import avatarFallback from "@/assets/avatar.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/contexts/PremiumContext";

const LANGUAGES = [
  { key: "pt", label: "Português", flag: "🇵🇹", hint: "Falantes de português" },
  { key: "en", label: "English", flag: "🇬🇧", hint: "English speakers" },
  { key: "fr", label: "Français", flag: "🇫🇷", hint: "Francophones" },
] as const;
type LangKey = (typeof LANGUAGES)[number]["key"];

const PLACEHOLDERS: Record<LangKey, string> = {
  pt: "Partilha algo sobre África, Angola, Umbundu ou o Kwendi…",
  en: "Share something about Africa, Angola, Umbundu or Kwendi…",
  fr: "Partage quelque chose sur l'Afrique, l'Angola, l'Umbundu ou Kwendi…",
};

const MOD_BANNER: Record<LangKey, { body: string; strong: string }> = {
  pt: {
    strong: "África, Angola, língua Umbundu e o Kwendi",
    body: "é permitido. A IA Kwendi revê cada publicação antes de aparecer aqui.",
  },
  en: {
    strong: "Africa, Angola, the Umbundu language and Kwendi",
    body: "is allowed. The Kwendi AI reviews every post before it appears here.",
  },
  fr: {
    strong: "l'Afrique, l'Angola, la langue Umbundu et Kwendi",
    body: "est autorisé. L'IA Kwendi vérifie chaque publication avant sa parution.",
  },
};

const ONLY_LABEL: Record<LangKey, string> = {
  pt: "Só conteúdo sobre",
  en: "Only content about",
  fr: "Seul le contenu sur",
};
const PUBLISH_LABEL: Record<LangKey, string> = { pt: "Publicar", en: "Post", fr: "Publier" };

const REACTIONS = [
  { key: "malaik", label: "Okô", emoji: "😕" },
  { key: "mambo", label: "Granda mambo!", emoji: "❤️" },
  { key: "concordo", label: "Tamo juntos", emoji: "✅" },
  { key: "discordo", label: "Não me parece", emoji: "❌" },
  { key: "erreh", label: "Erreh!", emoji: "😂" },
] as const;
type ReactionKey = (typeof REACTIONS)[number]["key"];

type Profile = { id: string; nome: string | null; avatar_url: string | null };
type Post = {
  id: string;
  user_id: string;
  lang: LangKey;
  text: string;
  image_url: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  author?: Profile;
};
type Comment = { id: string; post_id: string; user_id: string; text: string; author?: Profile };
type Reactions = Record<string, Record<ReactionKey, number>>;
type MyReactions = Record<string, ReactionKey | null>;

type SubTab = "feed" | "tribo" | "ranking";

const CommunityFeed = () => {
  const { user } = useAuth();
  const { ativo: premium } = usePremium();
  const [tab, setTab] = useState<SubTab>("feed");
  const [lang, setLang] = useState<LangKey>("pt");
  const [draft, setDraft] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Reactions>({});
  const [myReactions, setMyReactions] = useState<MyReactions>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [ranking, setRanking] = useState<
    { user_id: string; nome: string | null; avatar_url: string | null; xp: number }[]
  >([]);
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());
  const [pendingOutIds, setPendingOutIds] = useState<Set<string>>(new Set());
  const [pendingInIds, setPendingInIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadProfiles = useCallback(async (ids: string[]): Promise<Record<string, Profile>> => {
    if (ids.length === 0) return {};
    const { data } = await supabase.rpc("get_public_profiles", { _ids: ids });
    const map: Record<string, Profile> = {};
    (data ?? []).forEach((p: any) => (map[p.id] = p));
    return map;
  }, []);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase
      .from("community_posts")
      .select("*")
      .eq("lang", lang)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(50);
    const list = (rows ?? []) as Post[];
    const authors = await loadProfiles(Array.from(new Set(list.map((p) => p.user_id))));
    setPosts(list.map((p) => ({ ...p, author: authors[p.user_id] })));

    const ids = list.map((p) => p.id);
    if (ids.length) {
      const { data: rx } = await supabase
        .from("community_reactions")
        .select("post_id, user_id, reaction")
        .in("post_id", ids);
      const agg: Reactions = {};
      const mine: MyReactions = {};
      (rx ?? []).forEach((r: any) => {
        const bucket = (agg[r.post_id] ??= {
          malaik: 0, mambo: 0, concordo: 0, discordo: 0, erreh: 0,
        });
        bucket[r.reaction as ReactionKey] += 1;
        if (user && r.user_id === user.id) mine[r.post_id] = r.reaction;
      });
      setReactions(agg);
      setMyReactions(mine);

      const { data: cs } = await supabase
        .from("community_comments")
        .select("*")
        .in("post_id", ids)
        .eq("status", "approved")
        .order("created_at", { ascending: true });
      const authorsC = await loadProfiles(
        Array.from(new Set((cs ?? []).map((c: any) => c.user_id))),
      );
      const byPost: Record<string, Comment[]> = {};
      (cs ?? []).forEach((c: any) => {
        (byPost[c.post_id] ??= []).push({ ...c, author: authorsC[c.user_id] });
      });
      setComments(byPost);
    } else {
      setReactions({});
      setMyReactions({});
      setComments({});
    }
    setLoading(false);
  }, [lang, loadProfiles, user]);

  const loadRanking = useCallback(async () => {
    const { data } = await supabase.rpc("listar_ranking", { _limit: 20 });
    setRanking((data ?? []) as any);
  }, []);

  const loadFriends = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("friendships")
      .select("requester_id, addressee_id, status");
    const accepted = new Set<string>();
    const pendingOut = new Set<string>();
    const pendingIn = new Set<string>();
    (data ?? []).forEach((f: any) => {
      const other = f.requester_id === user.id ? f.addressee_id : f.requester_id;
      if (f.status === "accepted") accepted.add(other);
      else if (f.status === "pending") {
        if (f.requester_id === user.id) pendingOut.add(other);
        else pendingIn.add(other);
      }
    });
    setFriendIds(accepted);
    setPendingOutIds(pendingOut);
    setPendingInIds(pendingIn);
  }, [user]);

  const seguir = async (alvo: string) => {
    if (!user || alvo === user.id) return;
    // Optimistic
    setPendingOutIds((s) => new Set(s).add(alvo));
    const { error } = await supabase.rpc("enviar_pedido_amizade", { _alvo: alvo });
    if (error) {
      setPendingOutIds((s) => {
        const n = new Set(s); n.delete(alvo); return n;
      });
      toast({ title: "Erro ao seguir", description: error.message });
      return;
    }
    toast({ title: "Pedido enviado", description: "Aguarda a confirmação." });
    loadFriends();
  };

  const aceitar = async (uidOutro: string) => {
    if (!user) return;
    const { data } = await supabase
      .from("friendships")
      .select("id")
      .eq("requester_id", uidOutro)
      .eq("addressee_id", user.id)
      .eq("status", "pending")
      .maybeSingle();
    if (!data?.id) return;
    const { error } = await supabase.rpc("aceitar_pedido_amizade", { _id: data.id });
    if (error) { toast({ title: "Erro", description: error.message }); return; }
    toast({ title: "Amizade aceite" });
    loadFriends();
  };

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);
  useEffect(() => {
    loadRanking();
    loadFriends();
  }, [loadRanking, loadFriends]);

  // Realtime
  useEffect(() => {
    const ch = supabase
      .channel("community")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_posts" },
        () => loadPosts(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_reactions" },
        () => loadPosts(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_comments" },
        () => loadPosts(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [loadPosts]);

  const handlePublish = async () => {
    const text = draft.trim();
    if (!text || !user) {
      toast({ title: "Sessão necessária", description: "Inicia sessão para publicar." });
      return;
    }
    const { data, error } = await supabase
      .from("community_posts")
      .insert({ user_id: user.id, lang, text, image_url: foto, status: "pending" })
      .select()
      .single();
    if (error) {
      toast({ title: "Erro ao publicar", description: error.message });
      return;
    }
    setDraft("");
    setFoto(null);
    toast({
      title: "Publicação enviada para revisão",
      description: "A IA Kwendi irá rever antes de aparecer na comunidade.",
    });
    supabase.functions.invoke("moderate-post", { body: { postId: data.id, kind: "post" } });
  };

  const toggleReaction = async (postId: string, key: ReactionKey) => {
    if (!user) return;
    const mine = myReactions[postId];
    // Optimistic
    setMyReactions((m) => ({ ...m, [postId]: mine === key ? null : key }));
    setReactions((r) => {
      const bucket = { ...(r[postId] ?? { malaik: 0, mambo: 0, concordo: 0, discordo: 0, erreh: 0 }) };
      if (mine && mine !== key) bucket[mine] = Math.max(0, bucket[mine] - 1);
      if (mine === key) bucket[key] = Math.max(0, bucket[key] - 1);
      else bucket[key] += 1;
      return { ...r, [postId]: bucket };
    });
    if (mine === key) {
      await supabase.from("community_reactions").delete().match({ post_id: postId, user_id: user.id });
    } else {
      await supabase
        .from("community_reactions")
        .upsert({ post_id: postId, user_id: user.id, reaction: key }, { onConflict: "post_id,user_id" });
    }
  };

  const submitComment = async (postId: string) => {
    if (!user) return;
    const text = (commentDraft[postId] ?? "").trim();
    if (!text) return;
    const { data, error } = await supabase
      .from("community_comments")
      .insert({ post_id: postId, user_id: user.id, text, status: "pending" })
      .select()
      .single();
    if (error) {
      toast({ title: "Erro", description: error.message });
      return;
    }
    setCommentDraft((d) => ({ ...d, [postId]: "" }));
    toast({
      title: "Comentário enviado para revisão",
      description: "A IA Kwendi irá rever antes de publicar.",
    });
    supabase.functions.invoke("moderate-post", { body: { postId: data.id, kind: "comment" } });
  };

  const handleFotoEscolhida = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    // Upload básico para bucket público 'community' (Premium).
    // (Bucket criado sob demanda — se não existir, guardamos como data URL.)
    const reader = new FileReader();
    reader.onload = () => setFoto(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const tabs = useMemo(
    () => [
      { id: "feed" as const, label: "Comunidade" },
      { id: "tribo" as const, label: "Minha Tribo" },
      { id: "ranking" as const, label: "Ranking" },
    ],
    [],
  );

  const visiblePosts = useMemo(() => {
    if (tab === "tribo") return posts.filter((p) => friendIds.has(p.user_id));
    return posts;
  }, [tab, posts, friendIds]);

  return (
    <div>
      {/* Language selector */}
      <div className="flex items-center gap-2 overflow-x-auto mb-3 -mx-1 px-1 pb-1">
        {LANGUAGES.map((l) => {
          const active = lang === l.key;
          return (
            <button
              key={l.key}
              onClick={() => setLang(l.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap border-2 transition-colors"
              style={{
                background: active ? "hsl(var(--primary))" : "hsl(var(--card))",
                color: active ? "#fff" : "hsl(var(--foreground))",
                borderColor: active ? "hsl(var(--primary))" : "hsl(var(--border))",
              }}
              title={l.hint}
            >
              <span className="text-sm leading-none">{l.flag}</span>
              {l.label}
            </button>
          );
        })}
      </div>

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
          <div className="flex items-start gap-2 rounded-2xl border border-border bg-secondary/60 p-3 mb-4">
            <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              {ONLY_LABEL[lang]} <strong>{MOD_BANNER[lang].strong}</strong> {MOD_BANNER[lang].body}
            </p>
          </div>

          {/* Composer */}
          <div className="rounded-2xl border-2 border-border bg-card p-3 mb-5">
            <div className="flex items-start gap-3">
              <img src={avatarFallback} alt="" className="w-9 h-9 rounded-full object-cover" />
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                maxLength={280}
                placeholder={PLACEHOLDERS[lang]}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
              />
            </div>
            {foto && (
              <div className="relative mt-2 ml-12 rounded-xl overflow-hidden border border-border">
                <img src={foto} alt="" className="w-full max-h-56 object-cover" />
                <button
                  type="button"
                  onClick={() => setFoto(null)}
                  aria-label="Remover foto"
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white grid place-items-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mt-2 pl-12">
              <span className="text-[11px] text-muted-foreground">{draft.length}/280</span>
              <div className="flex items-center gap-2">
                {premium && (
                  <>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFotoEscolhida}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border-2 border-border bg-card text-muted-foreground hover:text-foreground"
                    >
                      <ImagePlus className="w-3.5 h-3.5" />
                      Foto
                    </button>
                  </>
                )}
                <button
                  onClick={handlePublish}
                  disabled={!draft.trim() || !user}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold text-white disabled:opacity-50"
                  style={{ background: "hsl(var(--primary))" }}
                >
                  <Send className="w-3.5 h-3.5" />
                  {PUBLISH_LABEL[lang]}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">A carregar…</div>
            ) : visiblePosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="font-bold">
                  {tab === "tribo" ? "Ainda não segues ninguém." : "Ainda não há publicações."}
                </p>
                <p className="text-sm mt-1">
                  {tab === "tribo"
                    ? "Adiciona amigos no Ranking para veres o que partilham."
                    : "Sê o primeiro a partilhar algo com a comunidade."}
                </p>
              </div>
            ) : (
              visiblePosts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  reactions={reactions[p.id] ?? { malaik: 0, mambo: 0, concordo: 0, discordo: 0, erreh: 0 }}
                  myReaction={myReactions[p.id] ?? null}
                  comments={comments[p.id] ?? []}
                  showComments={!!openComments[p.id]}
                  draft={commentDraft[p.id] ?? ""}
                  onReact={(k) => toggleReaction(p.id, k)}
                  onToggleComments={() =>
                    setOpenComments((o) => ({ ...o, [p.id]: !o[p.id] }))
                  }
                  onDraft={(v) => setCommentDraft((d) => ({ ...d, [p.id]: v }))}
                  onSubmitComment={() => submitComment(p.id)}
                />
              ))
            )}
          </div>
        </>
      )}

      {tab === "ranking" && (
        <div className="space-y-2">
          {ranking.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              O ranking aparece assim que os utilizadores ganharem XP.
            </div>
          ) : (
            ranking.map((r, i) => {
              const isMe = user && r.user_id === user.id;
              const isFriend = friendIds.has(r.user_id);
              const isPending = pendingOutIds.has(r.user_id);
              const wantsMe = pendingInIds.has(r.user_id);
              return (
                <div
                  key={r.user_id}
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
                  {r.avatar_url ? (
                    <img src={r.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full grid place-items-center text-white font-extrabold text-xs"
                      style={{ background: "hsl(var(--primary))" }}
                    >
                      {(r.nome ?? "K")[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="flex-1 min-w-0 font-extrabold text-foreground flex items-center gap-1.5 truncate">
                    <span className="truncate">{r.nome ?? "Kwendian"}</span>
                    {i === 0 && <Crown className="w-4 h-4 flex-shrink-0" style={{ color: "#FBBD12" }} fill="#FBBD12" />}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">{r.xp} XP</span>
                  {!isMe && (
                    isFriend ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-primary">
                        <Check className="w-3.5 h-3.5" /> Amigo
                      </span>
                    ) : wantsMe ? (
                      <button
                        onClick={() => aceitar(r.user_id)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-extrabold text-white"
                        style={{ background: "hsl(var(--primary))" }}
                      >
                        Aceitar
                      </button>
                    ) : isPending ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" /> Enviado
                      </span>
                    ) : (
                      <button
                        onClick={() => seguir(r.user_id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold border-2"
                        style={{ borderColor: "hsl(var(--primary))", color: "hsl(var(--primary))" }}
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Seguir
                      </button>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

const PostCard = ({
  post,
  reactions,
  myReaction,
  comments,
  showComments,
  draft,
  onReact,
  onToggleComments,
  onDraft,
  onSubmitComment,
}: {
  post: Post;
  reactions: Record<ReactionKey, number>;
  myReaction: ReactionKey | null;
  comments: Comment[];
  showComments: boolean;
  draft: string;
  onReact: (k: ReactionKey) => void;
  onToggleComments: () => void;
  onDraft: (v: string) => void;
  onSubmitComment: () => void;
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const total = Object.values(reactions).reduce((a, b) => a + b, 0);
  const active = myReaction ? REACTIONS.find((r) => r.key === myReaction)!.emoji : null;
  const nome = post.author?.nome ?? "Kwendian";

  return (
    <article className="rounded-2xl border-2 border-border bg-card p-4">
      <header className="flex items-center gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm overflow-hidden"
          style={{ background: "hsl(var(--primary))" }}
        >
          {post.author?.avatar_url ? (
            <img src={post.author.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            nome[0]?.toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-foreground text-sm">{nome}</div>
          <div
            className="inline-flex items-center gap-1 text-[11px] font-bold mt-0.5"
            style={{ color: "hsl(var(--primary))" }}
          >
            <Trophy className="w-3 h-3" />
            Kwendi
          </div>
        </div>
      </header>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{post.text}</p>
      {post.image_url && (
        <img src={post.image_url} alt="" className="w-full mt-3 rounded-xl object-cover max-h-80" />
      )}
      <footer className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
        <div className="relative">
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className="flex items-center gap-1.5 px-2 py-1 -ml-2 rounded-full text-xs font-bold transition-colors"
            style={{
              background: myReaction ? "hsl(var(--primary) / 0.1)" : "transparent",
              color: myReaction ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
            }}
          >
            {active ? <span className="text-base leading-none">{active}</span> : <Flame className="w-4 h-4" />}
            {total}
          </button>
          <AnimatePresence>
            {pickerOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setPickerOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7, y: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="absolute bottom-full left-0 mb-2 z-20 flex items-center gap-1 rounded-full border-2 border-border bg-card shadow-lg px-2 py-1.5"
                >
                  {REACTIONS.map((r) => {
                    const isActive = myReaction === r.key;
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
                          background: isActive ? "hsl(var(--primary) / 0.15)" : "transparent",
                          transform: isActive ? "scale(1.1)" : undefined,
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
          style={{ color: showComments ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
        >
          <MessageCircle className="w-4 h-4" />
          {comments.length}
        </button>
      </footer>
      <AnimatePresence initial={false}>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              {comments.map((c) => {
                const cn = c.author?.nome ?? "Kwendian";
                return (
                  <div key={c.id} className="flex items-start gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white font-extrabold text-[11px] flex-shrink-0 overflow-hidden"
                      style={{ background: "hsl(var(--primary))" }}
                    >
                      {c.author?.avatar_url ? (
                        <img src={c.author.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        cn[0]?.toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0 bg-secondary/60 rounded-2xl px-3 py-1.5">
                      <div className="text-[11px] font-extrabold text-foreground">{cn}</div>
                      <p className="text-xs text-foreground leading-snug break-words">{c.text}</p>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center gap-2 pt-1">
                <img src={avatarFallback} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                <input
                  value={draft}
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
                  disabled={!draft.trim()}
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
