import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ShieldCheck, Loader2 } from "lucide-react";

const AdminLoginScreen = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setBusy(true);
    try {
      const ok = await login(email.trim(), pass);
      if (ok) navigate("/grupo16Kwendi/dashboard", { replace: true });
      else setErro("Credenciais inválidas.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(220_20%_10%)] text-white flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ background: "hsl(5 84% 42%)" }}
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-white/40">Kwendi</div>
            <div className="font-semibold">Acesso restrito</div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-white/50">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/30"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-white/50">Senha</span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/30"
            />
          </label>
        </div>

        {erro && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {erro}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg py-2.5 text-sm font-semibold transition-transform active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: "hsl(5 84% 42%)" }}
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {busy ? "A validar..." : "Entrar"}
        </button>

        <p className="text-[11px] text-white/30 leading-relaxed">
          Área interna. Fora de qualquer fluxo do app.
        </p>
      </form>
    </div>
  );
};

export default AdminLoginScreen;