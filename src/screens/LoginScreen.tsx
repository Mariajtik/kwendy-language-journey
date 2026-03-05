/**
 * LoginScreen.tsx
 * -----------------
 * Simple login screen with email + password fields.
 * On "Entrar" shows a success message.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import logo from "@/assets/logo.jpg";

const LoginScreen = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  /* ---- SUCCESS STATE ---- */
  if (success) {
    return (
      <motion.div
        className="app-shell flex flex-col items-center justify-center px-6"
        style={{ minHeight: "100dvh" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "hsl(var(--primary))" }}
        >
          <Check className="w-10 h-10" style={{ color: "hsl(var(--primary-foreground))" }} />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2">
          Login realizado com sucesso!
        </h1>
        <button
          className="btn-duo btn-duo-primary max-w-xs mt-8"
          onClick={() => navigate("/")}
        >
          Voltar ao início
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="app-shell flex flex-col px-6 py-6"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <button onClick={() => navigate(-1)} className="mb-6 self-start" aria-label="Voltar">
        <ArrowLeft className="w-6 h-6 text-muted-foreground" />
      </button>

      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Kwendi" className="w-24 rounded-xl shadow mb-4" />
        <h1 className="text-2xl font-extrabold text-foreground">Entrar na conta</h1>
      </div>

      {/* Form fields */}
      <input
        className="input-duo mb-4"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input-duo mb-8"
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Login button */}
      <button className="btn-duo btn-duo-primary" onClick={() => setSuccess(true)}>
        Entrar
      </button>
    </motion.div>
  );
};

export default LoginScreen;
