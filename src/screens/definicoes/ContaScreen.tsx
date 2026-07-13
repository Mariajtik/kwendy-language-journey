/**
 * ContaScreen — gestão de conta: foto, nome, e-mail (leitura), palavra-passe e eliminar conta.
 * Persistência local (a integrar com backend mais tarde).
 */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Camera, Lock, Mail, Trash2, User as UserIcon, X } from "lucide-react";
import DefHeader from "@/screens/definicoes/_DefHeader";
import defaultAvatar from "@/assets/avatar.jpg";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StealthContaPanel from "@/screens/definicoes/StealthContaPanel";

const KEY = "kwendi.def.conta";

type Conta = { nome: string; email: string; foto?: string };

/**
 * Downscale + JPEG-compress an uploaded image and return a small data URL.
 * Keeps avatars under ~40KB so we can safely store them in profiles.avatar_url.
 */
async function compressAvatar(file: File, size = 256, quality = 0.82): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    // cover-crop to square
    const s = Math.min(img.width, img.height);
    const sx = (img.width - s) / 2;
    const sy = (img.height - s) / 2;
    ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

const ContaScreen = () => {
  const { isStealth } = useAuth();
  return isStealth ? <StealthContaPanel /> : <SignupContaScreen />;
};

const SignupContaScreen = () => {
  const nav = useNavigate();
  const { user, signOut } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [conta, setConta] = useState<Conta>({ nome: "", email: "" });
  const [pwdAberto, setPwdAberto] = useState(false);
  const [eliminarAberto, setEliminarAberto] = useState(false);
  const [aEliminar, setAEliminar] = useState(false);
  const [aGuardarFoto, setAGuardarFoto] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setConta((c) => ({ ...c, ...JSON.parse(raw) }));
    } catch {
      /* noop */
    }
  }, []);

  // Sincronizar com o utilizador autenticado e com o perfil na base de dados.
  useEffect(() => {
    if (!user) return;
    const meta = (user.user_metadata ?? {}) as Record<string, any>;
    setConta((c) => ({
      ...c,
      email: user.email ?? c.email,
      nome: c.nome || meta.nome || user.email?.split("@")[0] || "",
      foto: c.foto || meta.avatar_url || meta.picture || undefined,
    }));
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("nome, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled || !data) return;
      setConta((c) => ({
        ...c,
        nome: data.nome ?? c.nome,
        foto: data.avatar_url ?? c.foto,
      }));
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const persist = (next: Conta) => {
    setConta(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* noop */
    }
  };

  const onPickFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (aGuardarFoto) return;
    setAGuardarFoto(true);
    try {
      const dataUrl = await compressAvatar(f);
      persist({ ...conta, foto: dataUrl });
      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ avatar_url: dataUrl })
          .eq("id", user.id);
        if (error) {
          toast.error("Não foi possível guardar a foto: " + error.message);
          return;
        }
        await supabase.auth.updateUser({ data: { avatar_url: dataUrl } });
      }
      toast.success("Foto atualizada");
    } catch (err: any) {
      toast.error(err?.message || "Falha ao processar a imagem.");
    } finally {
      setAGuardarFoto(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const guardarNome = async () => {
    persist(conta);
    if (user) {
      const { error } = await supabase.auth.updateUser({ data: { nome: conta.nome } });
      if (error) return toast.error(error.message);
      try {
        await supabase.from("profiles").update({ nome: conta.nome }).eq("id", user.id);
      } catch { /* noop */ }
    }
    toast.success("Nome guardado");
  };

  const eliminarConta = async () => {
    if (aEliminar) return;
    setAEliminar(true);
    try {
      if (!user) {
        nav("/", { replace: true });
        return;
      }
      // Exige verificação OTP antes de eliminar.
      nav("/auth/otp", { state: { purpose: "account_delete" } });
    } finally {
      setAEliminar(false);
    }
  };

  return (
    <motion.div
      className="app-shell bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <DefHeader titulo="Conta" subtitulo="Os teus dados pessoais" />

      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-4 shadow-lg"
              style={{ borderColor: "hsl(var(--primary))" }}
            >
              <img
                src={conta.foto || defaultAvatar}
                alt="A tua foto"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              aria-label="Mudar foto"
              className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full grid place-items-center text-white border-4 border-background"
              style={{
                background: "hsl(var(--primary))",
                boxShadow: "0 3px 0 hsl(var(--kwendi-red-dark))",
              }}
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickFoto}
            />
          </div>
          <p className="text-xs font-bold text-muted-foreground">
            Toca no ícone para mudar a foto
          </p>
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
            style={{
              background: "hsl(var(--primary))",
              boxShadow: "0 4px 0 hsl(var(--kwendi-red-dark))",
            }}
          >
            Guardar nome
          </button>
        </div>

        {/* E-mail (leitura) */}
        <div>
          <span className="text-[11px] font-extrabold tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1.5">
            <Mail className="w-4 h-4" />
            E-MAIL
          </span>
          <div
            className="w-full rounded-2xl border-2 border-border bg-muted/30 px-3 py-2.5 font-bold text-foreground flex items-center justify-between"
            style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
          >
            <span className="truncate">{conta.email}</span>
            <span className="text-[10px] font-extrabold tracking-wider text-muted-foreground">
              FIXO
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Para mudar o e-mail, contacta o suporte.
          </p>
        </div>

        {/* Ações */}
        <div className="rounded-2xl border-2 border-border bg-card divide-y divide-border overflow-hidden">
          <RowButton
            icon={<Lock className="w-4 h-4 text-muted-foreground" />}
            label="Alterar palavra-passe"
            onClick={() => setPwdAberto(true)}
          />
          <RowButton
            icon={<Trash2 className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />}
            label="Eliminar conta"
            destructive
            onClick={() => setEliminarAberto(true)}
          />
        </div>
      </div>

      {/* Modal palavra-passe */}
      <SimpleModal aberto={pwdAberto} onFechar={() => setPwdAberto(false)} titulo="Alterar palavra-passe">
        <AlterarPasswordForm onPronto={() => setPwdAberto(false)} />
      </SimpleModal>

      {/* Modal eliminar */}
      <SimpleModal
        aberto={eliminarAberto}
        onFechar={() => setEliminarAberto(false)}
        titulo="Eliminar conta"
        destrutivo
      >
        <p className="text-sm text-muted-foreground mb-4">
          Esta ação é permanente. Vais perder progresso, conquistas e itens. Tens a certeza?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setEliminarAberto(false)}
            className="flex-1 rounded-2xl py-3 font-extrabold border-2 border-border bg-card text-foreground"
          >
            Cancelar
          </button>
          <button
            onClick={eliminarConta}
            disabled={aEliminar}
            className="flex-1 rounded-2xl py-3 font-extrabold text-white"
            style={{
              background: "hsl(var(--destructive))",
              boxShadow: "0 4px 0 hsl(var(--destructive) / 0.6)",
            }}
          >
            {aEliminar ? "A eliminar…" : "Eliminar"}
          </button>
        </div>
      </SimpleModal>
    </motion.div>
  );
};

/* ---------- helpers ---------- */

const Field = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
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

const RowButton = ({
  icon,
  label,
  onClick,
  destructive,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3.5 text-left font-bold"
    style={{ color: destructive ? "hsl(var(--destructive))" : "hsl(var(--foreground))" }}
  >
    {icon}
    {label}
  </button>
);

const SimpleModal = ({
  aberto,
  onFechar,
  titulo,
  destrutivo,
  children,
}: {
  aberto: boolean;
  onFechar: () => void;
  titulo: string;
  destrutivo?: boolean;
  children: React.ReactNode;
}) => (
  <AnimatePresence>
    {aberto && (
      <motion.div
        className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onFechar}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-3xl p-5 border-t-2 sm:border-2 border-border"
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-lg font-extrabold"
              style={{ color: destrutivo ? "hsl(var(--destructive))" : "hsl(var(--foreground))" }}
            >
              {titulo}
            </h3>
            <button onClick={onFechar} aria-label="Fechar" className="p-1.5">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const AlterarPasswordForm = ({ onPronto }: { onPronto: () => void }) => {
  const nav = useNavigate();
  const [nova, setNova] = useState("");
  const [conf, setConf] = useState("");

  const submeter = () => {
    if (nova.length < 8) return toast.error("A nova palavra-passe deve ter pelo menos 8 caracteres.");
    if (nova !== conf) return toast.error("A confirmação não coincide.");
    onPronto();
    nav("/auth/otp", { state: { purpose: "password_change", newPassword: nova, next: "/profile/conta" } });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Vais receber um código de 6 dígitos no e-mail para confirmar.
      </p>
      <Field icon={<Lock className="w-4 h-4" />} label="Nova" value={nova} onChange={setNova} type="password" />
      <Field icon={<Lock className="w-4 h-4" />} label="Confirmar nova" value={conf} onChange={setConf} type="password" />
      <button
        onClick={submeter}
        className="w-full rounded-2xl py-3 font-extrabold text-white"
        style={{ background: "hsl(var(--primary))", boxShadow: "0 4px 0 hsl(var(--kwendi-red-dark))" }}
      >
        Continuar
      </button>
    </div>
  );
};

export default ContaScreen;