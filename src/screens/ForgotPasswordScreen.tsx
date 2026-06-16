/**
 * ForgotPasswordScreen.tsx
 * Front-end only flow:
 *  step 0: pede email + envia "código"
 *  step 1: 6 inputs OTP estilizados
 *  step 2: nova senha + confirmar
 *  step 3: sucesso
 */

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import PasswordInput, { getPasswordStrength } from "@/components/PasswordInput";

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendCode = () => {
    if (!email.includes("@")) {
      toast.error("Insira um email válido");
      return;
    }
    toast.success("Código enviado! (válido por 5 minutos)");
    setStep(1);
  };

  const handleOtpChange = (i: number, v: string) => {
    const next = [...otp];
    next[i] = v.replace(/\D/g, "").slice(-1);
    setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleVerify = () => {
    if (otp.some((d) => !d)) {
      toast.error("Insira os 6 dígitos");
      return;
    }
    setStep(2);
  };

  const handleReset = () => {
    if (getPasswordStrength(newPwd) < 2) {
      toast.error("A senha está fraca demais");
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.error("As senhas não coincidem");
      return;
    }
    setStep(3);
  };

  return (
    <motion.div
      className="app-shell flex flex-col px-6 py-6"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => (step === 0 ? navigate(-1) : setStep((s) => (s - 1) as 0 | 1 | 2))}
        className="mb-6 self-start"
        aria-label="Voltar"
      >
        <ArrowLeft className="w-6 h-6 text-muted-foreground" />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col"
        >
          {step === 0 && (
            <>
              <h1 className="text-2xl font-extrabold mb-2">Esqueceu a senha?</h1>
              <p className="text-muted-foreground mb-6">
                Enviaremos um código de 6 dígitos para o seu email. O código expira em 5 minutos.
              </p>
              <input
                className="input-duo mb-6"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="btn-duo btn-duo-primary mt-auto disabled:opacity-50"
                onClick={handleSendCode}
                disabled={!/\S+@\S+\.\S+/.test(email)}
              >
                Enviar código
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="text-2xl font-extrabold mb-2">Verificação</h1>
              <p className="text-muted-foreground mb-8">
                Insira o código de 6 dígitos enviado para <strong>{email}</strong>.
              </p>
              <div className="flex justify-between gap-2 mb-4">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) {
                        otpRefs.current[i - 1]?.focus();
                      }
                    }}
                    className="w-12 h-14 text-center text-2xl font-extrabold rounded-2xl border-2 border-border bg-card focus:border-primary outline-none"
                  />
                ))}
              </div>
              <button
                className="text-sm text-primary font-bold self-center mb-6"
                onClick={() => toast.success("Novo código enviado")}
              >
                Reenviar código
              </button>
              <button
                className="btn-duo btn-duo-primary mt-auto disabled:opacity-50"
                onClick={handleVerify}
                disabled={otp.some((d) => !d)}
              >
                Verificar
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-2xl font-extrabold mb-2">Nova senha</h1>
              <p className="text-muted-foreground mb-6">Escolha uma senha forte.</p>
              <PasswordInput
                value={newPwd}
                onChange={setNewPwd}
                placeholder="Nova senha"
                className="mb-4"
              />
              <PasswordInput
                value={confirmPwd}
                onChange={setConfirmPwd}
                placeholder="Confirmar senha"
                showStrength={false}
                className="mb-6"
              />
              <button
                className="btn-duo btn-duo-primary mt-auto disabled:opacity-50"
                onClick={handleReset}
                disabled={
                  getPasswordStrength(newPwd) < 2 ||
                  newPwd !== confirmPwd ||
                  confirmPwd.length === 0
                }
              >
                Redefinir senha
              </button>
            </>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: "hsl(var(--kwendi-green))" }}
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-2xl font-extrabold mb-2">
                Autenticação concluída com sucesso.
              </h1>
              <p className="text-muted-foreground mb-8">
                A sua senha foi atualizada. Já pode entrar.
              </p>
              <button
                className="btn-duo btn-duo-primary max-w-xs"
                onClick={() => navigate("/login")}
              >
                Voltar ao login
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ForgotPasswordScreen;