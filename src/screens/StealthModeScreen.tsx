/**
 * StealthModeScreen.tsx
 * -----------------------
 * Explains the "Modo Furtivo" (stealth mode) feature.
 * Shows avatar, editable username, explanation, and an "Avançar" button
 * that activates stealth mode for 7 days.
 */

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Camera, Loader2 } from "lucide-react";
import avatar from "@/assets/avatar.jpg";
import { supabase } from "@/integrations/supabase/client";
import { registerLocalUser, setStealthActive } from "@/lib/adminRegistry";

const StealthModeScreen = () => {
  const navigate = useNavigate();

  /* Editable username — defaults to "Angola" */
  const [username, setUsername] = useState("Angola");
  const [usernameError, setUsernameError] = useState<string | null>(null);

  /* Editable avatar photo */
  const [photo, setPhoto] = useState<string>(avatar);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* Moderation state */
  const [submitting, setSubmitting] = useState(false);
  const [policyError, setPolicyError] = useState<string | null>(null);

  /* Whether stealth mode has been activated */
  const [activated, setActivated] = useState(false);

  /* Username validation: no punctuation, max 24 chars */
  const PUNCT_REGEX = /[\p{P}\p{S}]/u;
  const validateUsername = (value: string): string | null => {
    if (!value.trim()) return "Insira um nome de usuário.";
    if (value.length > 24) return "O nome não pode exceder 24 caracteres.";
    if (PUNCT_REGEX.test(value)) return "Não são permitidos sinais de pontuação.";
    return null;
  };

  const onUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameError(validateUsername(value));
    setPolicyError(null);
  };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setPolicyError("A imagem deve ter no máximo 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
    setPolicyError(null);
  };

  const handleAdvance = async () => {
    const err = validateUsername(username);
    if (err) {
      setUsernameError(err);
      return;
    }
    setSubmitting(true);
    setPolicyError(null);
    try {
      const isCustomPhoto = photo.startsWith("data:");
      const ativadoEm = new Date().toISOString();
      const expiraEm = new Date(Date.now() + 7 * 86400000).toISOString();

      // 1) Cria utilizador anónimo real (Supabase Anonymous Sign-in). O trigger
      //    handle_new_user marca o profile como stealth com expiração 7d.
      const { data: anonData, error: signUpError } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            nome: username,
            pais: "Angola",
          },
        },
      });
      if (signUpError) throw signUpError;
      const uid = anonData.user?.id;
      if (uid) {
        // Garante que o nome escolhido fica no perfil (o trigger usou default).
        await supabase.from("profiles").update({ nome: username, pais: "Angola" }).eq("id", uid);
      }

      // 2) Agora, com sessão activa, chama a moderação (função requer JWT).
      const { data, error } = await supabase.functions.invoke("moderate-profile", {
        body: {
          username,
          imageBase64: isCustomPhoto ? photo : undefined,
        },
      });
      if (error) {
        // Rejeição do lado do servidor — encerra a sessão para não deixar conta órfã activa.
        await supabase.auth.signOut().catch(() => {});
        throw error;
      }
      if (data?.allowed) {
        // 2) Mantém também o estado local para back-compat.
        try {
          setStealthActive(ativadoEm, expiraEm);
          registerLocalUser({
            tipo: "stealth",
            nome: username,
            ativadoEm,
            expiraEm,
          });
        } catch {
          /* silencioso */
        }
        setActivated(true);
      } else {
        // Conteúdo rejeitado — termina a sessão furtiva recém-criada.
        await supabase.auth.signOut().catch(() => {});
        setPolicyError(
          data?.reason ||
            "A equipa Kwendi considerou este conteúdo ofensivo segundo a política da comunidade.",
        );
      }
    } catch (e) {
      setPolicyError("Não foi possível validar o perfil. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- ACTIVATED STATE ---- */
  if (activated) {
    return (
      <motion.div
        className="app-shell flex flex-col items-center justify-center px-6"
        style={{ minHeight: "100dvh" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "hsl(var(--kwendy-gold))" }}
        >
          <Check className="w-10 h-10" style={{ color: "hsl(var(--primary-foreground))" }} />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2 text-center">
          Modo furtivo ativado por 7 dias.
        </h1>
        <button
          className="btn-duo btn-duo-primary max-w-xs mt-8"
          onClick={() => navigate("/home")}
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
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="mb-6 self-start" aria-label="Voltar">
        <ArrowLeft className="w-6 h-6 text-muted-foreground" />
      </button>

      <div className="flex flex-col items-center">
        {/* Editable avatar */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative mb-4 group"
          aria-label="Alterar foto"
        >
          <img
            src={photo}
            alt="Avatar"
            className="w-28 h-28 rounded-full shadow-lg object-cover"
          />
          <span
            className="absolute bottom-0 right-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md border-2 border-background"
            style={{ background: "hsl(var(--primary))" }}
          >
            <Camera className="w-4 h-4" style={{ color: "hsl(var(--primary-foreground))" }} />
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPhotoChange}
          />
        </button>

        {/* Editable username */}
        <label className="text-sm text-muted-foreground font-semibold mb-1">
          Nome de usuário
        </label>
        <input
          className="input-duo text-center max-w-[220px]"
          value={username}
          maxLength={24}
          onChange={(e) => onUsernameChange(e.target.value)}
        />
        {usernameError && (
          <p className="text-xs text-destructive mt-2 text-center max-w-[260px]">
            {usernameError}
          </p>
        )}
        <p className="text-[11px] text-muted-foreground mt-1 mb-6">
          {username.length}/24
        </p>

        {/* Explanation text */}
        <div className="text-center mb-8 px-2">
          <p className="text-foreground font-semibold leading-relaxed">
            O modo furtivo permite usar o Kwendi por 7 dias
            <br />
            sem criar conta.
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Explore o aplicativo, aprenda algumas palavras
            <br />
            e descubra a cultura antes de se comprometer.
          </p>
        </div>

        {/* Policy feedback */}
        {policyError && (
          <div className="w-full max-w-xs mb-4 p-3 rounded-2xl border-2 border-destructive/40 bg-destructive/10">
            <p className="text-sm text-destructive font-semibold text-center">
              {policyError}
            </p>
          </div>
        )}

        {/* Avançar button */}
        <button
          className="btn-duo btn-duo-gold w-full max-w-xs disabled:opacity-60 flex items-center justify-center gap-2"
          onClick={handleAdvance}
          disabled={submitting || !!usernameError}
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              A verificar...
            </>
          ) : (
            "Avançar"
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default StealthModeScreen;
