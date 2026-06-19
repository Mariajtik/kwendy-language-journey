/**
 * ContaScreen — gestão básica de conta. UI only; persistência local.
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Trash2, User as UserIcon } from "lucide-react";
import DefHeader from "@/screens/definicoes/_DefHeader";
import { toast } from "sonner";

const KEY = "kwendi.def.conta";

type Conta = { nome: string; email: string };

const ContaScreen = () => {
  const [conta, setConta] = useState<Conta>({ nome: "", email: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setConta(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  const guardar = () => {
    localStorage.setItem(KEY, JSON.stringify(conta));
    toast("Conta atualizada");
  };

  return (
    <motion.div
      className="app-shell bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <DefHeader titulo="Conta" subtitulo="Os teus dados pessoais" />
      <div className="px-4 py-5 pb-32 space-y-4">
        <Field
          icon={<UserIcon className="w-4 h-4" />}
          label="Nome"
          value={conta.nome}
          onChange={(v) => setConta({ ...conta, nome: v })}
          placeholder="O teu nome"
        />
        <Field
          icon={<Mail className="w-4 h-4" />}
          label="E-mail"
          value={conta.email}
          onChange={(v) => setConta({ ...conta, email: v })}
          placeholder="email@exemplo.com"
          type="email"
        />

        <button
          onClick={guardar}
          className="w-full rounded-2xl py-3 font-extrabold text-white"
          style={{ background: "hsl(var(--primary))", boxShadow: "0 4px 0 hsl(var(--kwendi-red-dark))" }}
        >
          Guardar alterações
        </button>

        <div className="rounded-2xl border-2 border-border bg-card divide-y divide-border">
          <RowButton
            icon={<Lock className="w-4 h-4 text-muted-foreground" />}
            label="Alterar palavra-passe"
            onClick={() => toast("Em breve.")}
          />
          <RowButton
            icon={<Trash2 className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />}
            label="Eliminar conta"
            destructive
            onClick={() => toast("Funcionalidade ainda em preparação.")}
          />
        </div>
      </div>
    </motion.div>
  );
};

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

export default ContaScreen;