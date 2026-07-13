/**
 * StealthContaPanel — variante do ecrã Conta para utilizadores em Modo Furtivo.
 * Permite guardar o progresso (converter para conta permanente) ou eliminá-lo.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Camera, Lock, Mail, ShieldAlert, Trash2, User as UserIcon, X } from "lucide-react";
import DefHeader from "@/screens/definicoes/_DefHeader";
import defaultAvatar from "@/assets/avatar.jpg";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SocialAuthButtons from "@/components/SocialAuthButtons";

const KEY = "kwendi.def.conta";

type Conta = { nome: string; foto?: string };

function tempoRestante(iso: string | null): string {
  if (!iso) return "";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "expirado";
  const h = Math.floor(ms / 3_600_000);
  const d = Math.floor(h / 24);
  const hRest = h % 24;
  if (d > 0) return `${d}d ${hRest}h`;
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

const StealthContaPanel = () => {
  const nav = useNavigate();
  const { user, stealthExpiraEm, signOut } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [conta, setConta] = useState<Conta>({ nome: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aConverter, setAConverter] = useState(false);
  const [eliminarAberto, setEliminarAberto] = useState(false);
  const [aEliminar, setAEliminar] = useState(false);

  const restante = useMemo(() => tempoRestante(stealthExpiraEm), [stealthExpiraEm]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setConta((c) => ({ ...c, ...JSON.parse(raw) }));
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (!user) return;
    const meta = (user.user_metadata ?? {}) as Record<string, any>;
    setConta((c) => ({ ...c, nome: c.nome || meta.nome || "Angola" }));
  }, [user]);

  const persist = (next: Conta) => {
    setConta(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* noop */ }
  };

  const onPickFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      persist({ ...conta, foto: String(reader.result) });
      toast("Foto atualizada");
    };
    reader.readAsDataURL(f);
  };

  const guardarNome = async () => {
    persist(conta);
    if (user) {
      await supabase.auth.updateUser({ data: { nome: conta.nome } });
      try {
        await supabase.from("profiles").update({ nome: conta.nome }).eq("id", user.id);
      } catch { /* noop */ }
    }
    toast.success("Nome guardado");
  };

  const converter = async () => {
    if (aConverter) return;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) return toast.error("Introduz um e-mail válido.");
    if (password.length < 8) return toast.error("A palavra-passe deve ter pelo menos 8 caracteres.");
    setAConverter(true);
    try {
      const { data, error } = await supabase.functions.invoke("stealth-convert", {
        body: { email: email.trim(), password },
      });
      if (error) throw error;
      const errCode = (data as any)?.error as string | undefined;
      if (errCode === "email_in_use") {
        toast.error("Este e-mail já está registado. Usa outro ou faz login.");
        return;
      }
      if (errCode === "weak_password") {
        toast.error("Palavra-passe fraca — usa pelo menos 8 caracteres com variedade.");
        return;
      }
      if (errCode) {
        toast.error("Não foi possível criar a conta. Tenta de novo.");
        return;
      }
      await supabase.auth.refreshSession();
      toast.success("Conta criada — o teu progresso foi guardado.");
      setPassword("");
    } catch (e: any) {
      toast.error(e?.message || "Falha ao guardar progresso.");
    } finally {
      setAConverter(false);
    }
  };

  const converterComProvider = async (provider: "google" | "apple") => {
    try {
      // linkIdentity associa o provider à conta anónima atual, preservando o UUID.
      const anySb = supabase.auth as any;
      if (typeof anySb.linkIdentity !== "function") {
        toast.error("O login com este provedor ainda não está disponível aqui. Usa e-mail + palavra-passe para guardar o progresso.");
        return;
      }
      const { error } = await anySb.linkIdentity({
        provider,
        options: { redirectTo: window.location.origin + "/auth/callback" },
      });
      if (error) throw error;
    } catch (e: any) {
      toast.error(e?.message || "Não foi possível associar a conta social.");
    }
  };

  const eliminarProgresso = async () => {
    if (aEliminar) return;
    setAEliminar(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      await signOut().catch(() => {});
      try { localStorage.removeItem(KEY); } catch { /* noop */ }
      toast.success("Progresso eliminado.");
      nav("/", { replace: true });
    } catch (e: any) {
      toast.error(e?.message || "Não foi possível eliminar o progresso.");
    } finally {
      setAEliminar(false);
      setEliminarAberto(false);
    }
  };

  return (
    <motion.div
      className="app-shell bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <DefHeader titulo="Conta" subtitulo="Modo furtivo — sem e-mail" />

      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-4 shadow-lg"
              style={{ borderColor: "hsl(var(--primary))" }}
            >
              <img src={conta.foto || defaultAvatar} alt="A tua foto" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              aria-label="Mudar foto"
              className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full grid place-items-center text-white border-4 border-background"
              style={{ background: "hsl(var(--primary))", boxShadow: "0 3px 0 hsl(var(--kwendi-red-dark))" }}
            >
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFoto} />
          </div>

          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider"
            style={{ background: "hsl(45 96% 53%)", color: "hsl(20 90% 22%)" }}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            MODO FURTIVO · EXPIRA EM {restante.toUpperCase()}
          </div>
        </div>

        {/* Nome */}
        <div className="space-y-2">
          <Field
            icon={<UserIcon className="w-4 h-4" />}
            label="Nome"
            value={conta.nome}
            onChange={(v) => setConta({ ...conta, nome: v })}
            placeholder="O teu nome"
          />
          <button
            onClick={guardarNome}
            className="w-full rounded-2xl py-3 font-extrabold text-white"
            style={{ background: "hsl(var(--primary))", boxShadow: "0 4px 0 hsl(var(--kwendi-red-dark))" }}
          >
            Guardar nome
          </button>
        </div>

        {/* Bloco: guardar progresso */}
        <section className="rounded-3xl border-2 border-border bg-card p-4 space-y-3" style={{ boxShadow: "0 4px 0 hsl(var(--border))" }}>
          <div>
            <h2 className="text-base font-extrabold text-foreground">Guardar o meu progresso</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Cria uma conta agora e não perdes nada quando o modo furtivo expirar.
              O teu XP, itens e missões ficam associados à nova conta.
            </p>
          </div>

          <Field
            icon={<Mail className="w-4 h-4" />}
            label="E-mail"
            value={email}
            onChange={setEmail}
            placeholder="teu@email.com"
            type="email"
          />
          <Field
            icon={<Lock className="w-4 h-4" />}
            label="Palavra-passe (mín. 8)"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            type="password"
          />

          <button
            onClick={converter}
            disabled={aConverter}
            className="w-full rounded-2xl py-3 font-extrabold text-white disabled:opacity-60"
            style={{ background: "hsl(var(--primary))", boxShadow: "0 4px 0 hsl(var(--kwendi-red-dark))" }}
          >
            {aConverter ? "A guardar…" : "Criar conta e manter progresso"}
          </button>

          <div className="relative py-1">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            <span className="relative bg-card px-2 text-[10px] font-extrabold tracking-wider text-muted-foreground left-1/2 -translate-x-1/2 inline-block">
              OU
            </span>
          </div>

          <SocialAuthButtons mode="signup" onProvider={converterComProvider} />
        </section>

        {/* Bloco: eliminar progresso */}
        <section className="rounded-3xl border-2 border-destructive/30 bg-destructive/5 p-4 space-y-3">
          <div>
            <h2 className="text-base font-extrabold" style={{ color: "hsl(var(--destructive))" }}>
              Eliminar progresso agora
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Se decidiste que já não tens nada para ver, podes apagar tudo antes dos 7 dias.
              Esta ação é permanente.
            </p>
          </div>
          <button
            onClick={() => setEliminarAberto(true)}
            className="w-full rounded-2xl py-3 font-extrabold text-white flex items-center justify-center gap-2"
            style={{ background: "hsl(var(--destructive))", boxShadow: "0 4px 0 hsl(var(--destructive) / 0.6)" }}
          >
            <Trash2 className="w-4 h-4" />
            Eliminar progresso
          </button>
        </section>
      </div>

      <AnimatePresence>
        {eliminarAberto && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setEliminarAberto(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-3xl p-5 border-t-2 sm:border-2 border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-extrabold" style={{ color: "hsl(var(--destructive))" }}>
                  Eliminar progresso
                </h3>
                <button onClick={() => setEliminarAberto(false)} aria-label="Fechar" className="p-1.5">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Vais perder tudo: XP, itens, conquistas e histórico. Tens a certeza?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEliminarAberto(false)}
                  className="flex-1 rounded-2xl py-3 font-extrabold border-2 border-border bg-card text-foreground"
                >
                  Cancelar
                </button>
                <button
                  onClick={eliminarProgresso}
                  disabled={aEliminar}
                  className="flex-1 rounded-2xl py-3 font-extrabold text-white"
                  style={{ background: "hsl(var(--destructive))", boxShadow: "0 4px 0 hsl(var(--destructive) / 0.6)" }}
                >
                  {aEliminar ? "A eliminar…" : "Eliminar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Field = ({
  icon, label, value, onChange, placeholder, type = "text",
}: {
  icon: React.ReactNode; label: string; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string;
}) => (
  <label className="block">
    <span className="text-[11px] font-extrabold tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1.5">
      {icon}
      {label.toUpperCase()}
    </span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className="w-full rounded-2xl border-2 border-border bg-card px-3 py-2.5 font-bold text-foreground outline-none focus:border-foreground/40"
      style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
    />
  </label>
);

export default StealthContaPanel;