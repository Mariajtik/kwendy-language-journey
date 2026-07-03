/**
 * useBackendSync.ts
 * -----------------
 * Quando há utilizador autenticado (não admin em modo teste), sincroniza o
 * estado local (progresso, saldo, streak, nivelamento, premium) para a
 * tabela `progresso` no backend. Debounce leve, escreve via upsert.
 */

import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminTesting } from "@/lib/adminTesting";

const KEYS = [
  "kwendi:progresso",
  "kwendi_saldo_v1",
  "kwendi:nivelamento",
  "kwendi.premium.ativo",
];

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function collectProgress(userId: string) {
  const progresso = readJSON<any>("kwendi:progresso", { seccoesCompletas: [], unidadeAtual: null });
  const saldo = readJSON<any>("kwendi_saldo_v1", {});
  const niv = readJSON<any>("kwendi:nivelamento", {});
  const premium = localStorage.getItem("kwendi.premium.ativo") === "1";
  return {
    user_id: userId,
    xp: Number(saldo.xp ?? 0),
    diamantes: Number(saldo.diamantes ?? 0),
    streak: Number(saldo.ofensiva ?? saldo.streak ?? 0),
    seccoes_completas: Array.isArray(progresso.seccoesCompletas) ? progresso.seccoesCompletas : [],
    unidade_atual: progresso.unidadeAtual ?? null,
    premium,
    nivelamento_percentagem: typeof niv.percentagem === "number" ? niv.percentagem : null,
    ancao: !!niv.ancao,
    atualizado_em: new Date().toISOString(),
  };
}

export function useBackendSync() {
  const { user } = useAuth();
  const uid = user?.id;

  useEffect(() => {
    if (!uid) return;
    if (isAdminTesting()) return;

    let timer: number | null = null;
    const push = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(async () => {
        try {
          await supabase.from("progresso").upsert(collectProgress(uid), { onConflict: "user_id" });
        } catch {
          /* offline / RLS falha silenciosamente */
        }
      }, 800);
    };

    // Push inicial + em cada storage change relevante.
    push();

    const onStorage = (e: StorageEvent) => {
      if (!e.key || !KEYS.includes(e.key)) return;
      push();
    };
    const onCustom = () => push();
    window.addEventListener("storage", onStorage);
    window.addEventListener("kwendi:progresso-changed", onCustom);
    window.addEventListener("kwendi:saldo-changed", onCustom);
    window.addEventListener("kwendi:nivelamento-changed", onCustom);

    // Fallback: sync a cada 30s enquanto a app estiver aberta.
    const interval = window.setInterval(push, 30000);

    return () => {
      if (timer) window.clearTimeout(timer);
      window.clearInterval(interval);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("kwendi:progresso-changed", onCustom);
      window.removeEventListener("kwendi:saldo-changed", onCustom);
      window.removeEventListener("kwendi:nivelamento-changed", onCustom);
    };
  }, [uid]);
}