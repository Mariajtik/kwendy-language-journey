/**
 * SocialAuthButtons.tsx
 * Google + Apple buttons (UI only). Calls onProvider with the chosen provider.
 */

import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  /** Action verb shown in the toast — "Login" or "Cadastro" */
  mode?: "login" | "signup";
  onProvider?: (provider: "google" | "apple") => void;
}

const SocialAuthButtons = ({ mode = "login", onProvider }: Props) => {
  const handle = async (provider: "google" | "apple") => {
    if (onProvider) return onProvider(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/home` },
      });
      if (error) {
        toast.error(
          `Provedor não configurado. Ative ${provider} no Supabase → Authentication → Providers.`,
        );
      }
    } catch {
      toast.error("Não foi possível iniciar o login social.");
    }
    // silencioso após redirect
    void mode;
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        type="button"
        onClick={() => handle("google")}
        className="w-full h-12 rounded-2xl bg-white border-2 border-border flex items-center justify-center gap-3 font-bold text-foreground active:translate-y-1 transition-transform"
        style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
      >
        <GoogleIcon className="w-5 h-5" />
        Continuar com Google
      </button>

      <button
        type="button"
        onClick={() => handle("apple")}
        className="w-full h-12 rounded-2xl bg-black text-white flex items-center justify-center gap-3 font-bold active:translate-y-1 transition-transform"
        style={{ boxShadow: "0 3px 0 #000" }}
      >
        <AppleIcon className="w-5 h-5" />
        Continuar com Apple
      </button>
    </div>
  );
};

const GoogleIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.4-.4-3.5z"/>
  </svg>
);

const AppleIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M16.365 1.43c0 1.14-.41 2.22-1.23 3.05-.84.86-2.21 1.52-3.34 1.43-.13-1.1.43-2.27 1.2-3.08.85-.9 2.34-1.58 3.37-1.4zM20.5 17.4c-.55 1.28-.82 1.86-1.53 2.99-1 1.57-2.4 3.53-4.14 3.55-1.55.02-1.95-1.01-4.05-1-2.1.01-2.54 1.02-4.09.99-1.74-.03-3.07-1.79-4.07-3.36C-.36 16.96-.65 11.6 1.91 8.84c1.55-1.66 3.39-2.6 5.21-2.6 1.83 0 2.97 1 4.07 1 1.06 0 1.81-1 3.99-1 1.45 0 2.95.79 4.04 2.17-3.55 1.94-2.97 7.02 1.28 8.99z"/>
  </svg>
);

export default SocialAuthButtons;