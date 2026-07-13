/**
 * AuthOtpScreen — Verificação OTP de 6 dígitos.
 * Suporta 4 propósitos:
 *  - `login`            → edge functions `otp-issue`/`otp-verify` + `trustDevice`.
 *  - `password_change`  → Supabase native `reauthenticate()` + `updateUser({ password, nonce })`.
 *  - `email_change`     → Supabase native `reauthenticate()` + `updateUser({ email, nonce })`.
 *  - `account_delete`   → `otp-issue`/`otp-verify` + edge function `delete-account`.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, RefreshCw } from "lucide-react";
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

const RESEND_COOLDOWN = 30;

function usesNativeReauth(p: Purpose) {
  return p === "password_change" || p === "email_change";
}

function translateError(code: string): string {
  switch (code) {
    case "invalid_code":
      return "Código inválido.";
    case "expired":
      return "Este código expirou. Pede um novo.";
    case "no_active_code":
      return "Não há código ativo. Pede um novo.";
    case "too_many_attempts":
      return "Demasiadas tentativas. Pede um novo código.";
    case "rate_limited":
      return "Pediste códigos a mais. Aguarda alguns minutos.";
    case "invalid_session":
      return "Sessão expirada. Entra de novo.";
    default:
      return "Não foi possível verificar o código.";
  }
}

const AuthOtpScreen = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, signOut } = useAuth();
  const state = (loc.state ?? {}) as LocationState;
  const purpose: Purpose = state.purpose ?? "login";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [initialSendState, setInitialSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [initialError, setInitialError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const email = user?.email ?? "";

  const sendCode = async (isInitial = false): Promise<boolean> => {
    if (isInitial) {
      setInitialSendState("sending");
      setInitialError(null);
    } else {
      setResending(true);
    }
    try {
      if (usesNativeReauth(purpose)) {
        const { error } = await supabase.auth.reauthenticate();
        if (error) throw new Error(error.message || "send_failed");
      } else {
        const { data, error } = await supabase.functions.invoke("otp-issue", {
          body: { purpose },
        });
        if (error) throw new Error(error.message || "send_failed");
        if (data?.error) throw new Error(translateError(data.error));
      }
      if (isInitial) setInitialSendState("sent");
      else toast.success("Enviámos um novo código para o teu e-mail.");
      setCooldown(RESEND_COOLDOWN);
      return true;
    } catch (e: any) {
      const msg = e?.message || "Não foi possível enviar o código.";
      if (isInitial) {
        setInitialSendState("error");
        setInitialError(msg);
      } else {
        toast.error(msg);
      }
      return false;
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (!user) {
      nav("/login", { replace: true });
      return;
    }
    if (initialSendState === "idle") void sendCode(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const setDigit = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = clean;
    setCode(next);
    if (clean && i < 5) inputs.current[i + 1]?.focus();
  };

  const codeStr = useMemo(() => code.join(""), [code]);

  const submit = async () => {
    const token = codeStr;
    if (token.length !== 6) {
      toast.error("Introduz os 6 dígitos.");
      return;
    }
    if (!user?.email) {
      toast.error("Sessão inválida.");
      return;
    }
    setBusy(true);
    try {
      if (purpose === "password_change" && state.newPassword) {
        const { error } = await supabase.auth.updateUser({ password: state.newPassword, nonce: token });
        if (error) throw new Error(error.message || "Não foi possível alterar a senha.");
        toast.success("Senha alterada.");
        nav(state.next ?? "/profile/conta", { replace: true });
        return;
      }
      if (purpose === "email_change" && state.newEmail) {
        const { error } = await supabase.auth.updateUser({ email: state.newEmail, nonce: token });
        if (error) throw new Error(error.message || "Não foi possível mudar o e-mail.");
        toast.success("Pedido de mudança de e-mail enviado.");
        nav(state.next ?? "/profile/conta", { replace: true });
        return;
      }
      // login e account_delete → edge function otp-verify
      const { data, error } = await supabase.functions.invoke("otp-verify", {
        body: { purpose, code: token },
      });
      if (error) throw new Error(error.message || "Não foi possível verificar o código.");
      if (data?.error) throw new Error(translateError(data.error));
      if (!data?.ok) throw new Error("Resposta inesperada do servidor.");

      if (purpose === "account_delete") {
        const { error: delErr } = await supabase.functions.invoke("delete-account");
        if (delErr) throw new Error(delErr.message || "Não foi possível eliminar a conta.");
        await signOut().catch(() => {});
        toast.success("Conta eliminada.");
        nav("/apresentation", { replace: true });
        return;
      }

      // login
      await trustDevice(user.id);
      toast.success("Dispositivo confirmado.");
      nav(state.next ?? "/home", { replace: true });
    } catch (e: any) {
      toast.error(e?.message || "Código inválido.");
      // Limpa código para nova tentativa
      setCode(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
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
        {initialSendState === "sending" && (
          <p className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> A enviar código para{" "}
            <span className="font-semibold">{email}</span>…
          </p>
        )}
        {initialSendState === "sent" && (
          <p className="text-sm text-muted-foreground mb-6">
            Enviámos um código de 6 dígitos para{" "}
            <span className="font-semibold">{email}</span>.
          </p>
        )}
        {initialSendState === "error" && (
          <div className="w-full mb-6 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-left">
            <p className="text-sm text-destructive font-semibold mb-2">Falha ao enviar o código</p>
            <p className="text-xs text-muted-foreground mb-3">{initialError}</p>
            <button
              onClick={() => void sendCode(true)}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary"
            >
              <RefreshCw className="w-4 h-4" /> Tentar novamente
            </button>
          </div>
        )}

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
              disabled={busy || initialSendState !== "sent"}
              className="w-11 h-14 text-center text-xl font-bold rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none disabled:opacity-60"
            />
          ))}
        </div>

        <button
          onClick={submit}
          disabled={busy || codeStr.length !== 6 || initialSendState !== "sent"}
          className="w-full h-12 rounded-xl font-bold text-white disabled:opacity-50 flex items-center justify-center"
          style={{ background: "hsl(var(--primary))" }}
        >
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar"}
        </button>

        <button
          onClick={() => void sendCode(false)}
          disabled={resending || cooldown > 0 || initialSendState === "sending"}
          className="mt-4 text-sm text-primary font-semibold disabled:opacity-50"
        >
          {resending
            ? "A enviar..."
            : cooldown > 0
              ? `Reenviar código (${cooldown}s)`
              : "Reenviar código"}
        </button>
      </div>
    </motion.div>
  );
};

export default AuthOtpScreen;