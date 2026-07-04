/**
 * AuthOtpScreen — Verificação OTP de 6 dígitos.
 * Suporta 4 propósitos, todos via reautenticação nativa do Supabase (email `reauthentication`):
 *  - `login`: validar novo dispositivo. Confia dispositivo e vai para `/home` (ou `next`).
 *  - `password_change`: chama `updateUser({ password, nonce })`.
 *  - `email_change`: chama `updateUser({ email, nonce })`.
 *  - `account_delete`: valida OTP via `verifyOtp` e chama `delete-account`.
 */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trustDevice } from "@/lib/deviceTrust";
import { useAuth } from "@/contexts/AuthContext";

type Purpose = "login" | "password_change" | "email_change" | "account_delete";

type LocationState = {
  purpose?: Purpose;
  next?: string;
  newPassword?: string;
  newEmail?: string;
};

const AuthOtpScreen = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, signOut } = useAuth();
  const state = (loc.state ?? {}) as LocationState;
  const purpose: Purpose = state.purpose ?? "login";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [sentOnce, setSentOnce] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const email = user?.email ?? "";

  const sendCode = async () => {
    setResending(true);
    const { error } = await supabase.auth.reauthenticate();
    setResending(false);
    if (error) {
      toast.error(error.message || "Não foi possível enviar o código.");
      return false;
    }
    toast.success("Enviámos um código para o teu e-mail.");
    setSentOnce(true);
    return true;
  };

  useEffect(() => {
    if (!user) {
      nav("/login", { replace: true });
      return;
    }
    if (!sentOnce) void sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const setDigit = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = clean;
    setCode(next);
    if (clean && i < 5) inputs.current[i + 1]?.focus();
  };

  const submit = async () => {
    const token = code.join("");
    if (token.length !== 6) return toast.error("Introduz os 6 dígitos.");
    if (!user?.email) return toast.error("Sessão inválida.");
    setBusy(true);
    try {
      if (purpose === "password_change" && state.newPassword) {
        const { error } = await supabase.auth.updateUser({ password: state.newPassword, nonce: token });
        if (error) throw error;
        toast.success("Senha alterada.");
        nav(state.next ?? "/profile/conta", { replace: true });
        return;
      }
      if (purpose === "email_change" && state.newEmail) {
        const { error } = await supabase.auth.updateUser({ email: state.newEmail, nonce: token });
        if (error) throw error;
        toast.success("Pedido de mudança de e-mail enviado.");
        nav(state.next ?? "/profile/conta", { replace: true });
        return;
      }
      // login e account_delete: verificar via verifyOtp
      const { error } = await supabase.auth.verifyOtp({
        type: "reauthentication",
        token,
        email: user.email,
      } as any);
      if (error) throw error;

      if (purpose === "account_delete") {
        const { error: delErr } = await supabase.functions.invoke("delete-account");
        if (delErr) throw delErr;
        await signOut().catch(() => {});
        toast.success("Conta eliminada.");
        nav("/apresentation", { replace: true });
        return;
      }

      // login
      await trustDevice(user.id);
      toast.success("Dispositivo confiado.");
      nav(state.next ?? "/home", { replace: true });
    } catch (e: any) {
      toast.error(e?.message || "Código inválido.");
    } finally {
      setBusy(false);
    }
  };

  const titles: Record<Purpose, string> = {
    login: "Verifica este dispositivo",
    password_change: "Confirma a mudança de senha",
    email_change: "Confirma o novo e-mail",
    account_delete: "Confirma a eliminação",
  };

  return (
    <motion.div
      className="app-shell flex flex-col px-6 py-6"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        onClick={() => nav(-1)}
        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4"
        aria-label="Voltar"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto w-full">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: "hsl(var(--primary) / 0.12)" }}
        >
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-extrabold mb-2">{titles[purpose]}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enviámos um código de 6 dígitos para{" "}
          <span className="font-semibold">{email}</span>.
        </p>

        <div className="flex gap-2 mb-6" onPaste={(e) => {
          const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
          if (text.length === 6) {
            e.preventDefault();
            setCode(text.split(""));
            inputs.current[5]?.focus();
          }
        }}>
          {code.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !code[i] && i > 0) inputs.current[i - 1]?.focus();
              }}
              className="w-11 h-14 text-center text-xl font-bold rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none"
            />
          ))}
        </div>

        <button
          onClick={submit}
          disabled={busy || code.join("").length !== 6}
          className="w-full h-12 rounded-xl font-bold text-white disabled:opacity-50 flex items-center justify-center"
          style={{ background: "hsl(var(--primary))" }}
        >
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar"}
        </button>

        <button
          onClick={() => void sendCode()}
          disabled={resending}
          className="mt-4 text-sm text-primary font-semibold disabled:opacity-50"
        >
          {resending ? "A enviar..." : "Reenviar código"}
        </button>
      </div>
    </motion.div>
  );
};

export default AuthOtpScreen;