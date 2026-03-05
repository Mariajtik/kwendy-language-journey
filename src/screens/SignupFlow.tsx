/**
 * SignupFlow.tsx
 * ---------------
 * Multi-step sign-up inspired by Duolingo's onboarding.
 * Steps:
 *  1. Username
 *  2. Email
 *  3. Password
 *  4. Learning motivation (optional)
 *  5. Level selection
 * After step 5 → success message.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";

/** Slide-in animation variants for each step */
const slideVariants = {
  enter: { x: 80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -80, opacity: 0 },
};

const SignupFlow = () => {
  const navigate = useNavigate();

  /* Current step index (0-based) */
  const [step, setStep] = useState(0);

  /* Form data stored across all steps */
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [motivation, setMotivation] = useState("");
  const [level, setLevel] = useState("");

  /* Whether the flow is complete */
  const [done, setDone] = useState(false);

  /** Move to next step, or finish */
  const next = () => {
    if (step < 4) setStep(step + 1);
    else setDone(true);
  };

  /** Move back one step */
  const back = () => {
    if (step > 0) setStep(step - 1);
    else navigate(-1);
  };

  /* Total number of steps for the progress bar */
  const totalSteps = 5;

  /* ---- SUCCESS SCREEN ---- */
  if (done) {
    return (
      <motion.div
        className="app-shell flex flex-col items-center justify-center px-6"
        style={{ minHeight: "100dvh" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "hsl(var(--primary))" }}
        >
          <Check className="w-10 h-10" style={{ color: "hsl(var(--primary-foreground))" }} />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2 text-center">
          Conta criada com sucesso!
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Bem-vindo ao Kwendi, {username}!
        </p>
        <button className="btn-duo btn-duo-primary max-w-xs" onClick={() => navigate("/")}>
          Voltar ao início
        </button>
      </motion.div>
    );
  }

  return (
    <div
      className="app-shell flex flex-col px-6 py-6"
      style={{ minHeight: "100dvh" }}
    >
      {/* ---- HEADER: Back button + progress bar ---- */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={back} className="p-1" aria-label="Voltar">
          <ArrowLeft className="w-6 h-6 text-muted-foreground" />
        </button>
        {/* Progress bar */}
        <div className="flex-1 h-3 rounded-full" style={{ background: "hsl(var(--muted))" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "hsl(var(--primary))" }}
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* ---- STEP CONTENT (animated) ---- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {/* Step 0: Username */}
          {step === 0 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Como podemos te chamar?
              </h2>
              <p className="text-muted-foreground mb-6">Escolha um nome de usuário.</p>
              <input
                className="input-duo mb-6"
                placeholder="Nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Qual é o seu email?
              </h2>
              <p className="text-muted-foreground mb-6">Usaremos para recuperar sua conta.</p>
              <input
                className="input-duo mb-6"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Crie uma senha
              </h2>
              <p className="text-muted-foreground mb-6">Mínimo 6 caracteres.</p>
              <input
                className="input-duo mb-6"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}

          {/* Step 3: Motivation (optional) */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                O que te motiva a aprender?
              </h2>
              <p className="text-muted-foreground mb-6">(Opcional — pode pular)</p>
              <div className="flex flex-col gap-3">
                {[
                  "Conectar com as minhas raízes",
                  "Curiosidade cultural",
                  "Comunicar com a família",
                  "Viagem a Angola",
                ].map((opt) => (
                  <button
                    key={opt}
                    className={`btn-duo ${motivation === opt ? "btn-duo-primary" : "btn-duo-outline"}`}
                    onClick={() => setMotivation(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 4: Level */}
          {step === 4 && (
            <>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Qual é o seu nível?
              </h2>
              <p className="text-muted-foreground mb-6">Selecione o que melhor te descreve.</p>
              <div className="flex flex-col gap-3">
                {["Iniciante", "Intermediário", "Avançado"].map((opt) => (
                  <button
                    key={opt}
                    className={`btn-duo ${level === opt ? "btn-duo-primary" : "btn-duo-outline"}`}
                    onClick={() => setLevel(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ---- CONTINUE BUTTON ---- */}
      <div className="pt-4 pb-2">
        <button className="btn-duo btn-duo-primary" onClick={next}>
          {step === 4 ? "Finalizar" : step === 3 ? "Continuar" : "Continuar"}
        </button>
      </div>
    </div>
  );
};

export default SignupFlow;
