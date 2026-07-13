/**
 * useOfensiva — fonte única para chama (sequência) e chamas congeladas.
 * Chama a RPC `hidratar_recursos` na montagem e expõe `registrarLicaoConcluida`
 * que executa `aplicar_ofensiva_diaria` no servidor.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { agendarLembreteOfensiva } from "@/lib/notifications";

export type OfensivaEstado = {
  ofensiva: number;
  chamasCongeladas: number;
  ofensivaHoje: boolean;
  chamaAcesa: boolean;
  vidas: number;
  vidasRecargaEm: string | null;
  carregado: boolean;
};

const INICIAL: OfensivaEstado = {
  ofensiva: 0,
  chamasCongeladas: 0,
  ofensivaHoje: false,
  chamaAcesa: false,
  vidas: 5,
  vidasRecargaEm: null,
  carregado: false,
};

const EVT = "kwendi:ofensiva-changed";

function dispatch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVT));
  }
}

function fromRow(r: any): OfensivaEstado {
  return {
    ofensiva: Number(r?.ofensiva ?? 0),
    chamasCongeladas: Number(r?.chamas_congeladas ?? 0),
    ofensivaHoje: !!r?.ofensiva_hoje,
    chamaAcesa: !!r?.chama_acesa || (Number(r?.ofensiva ?? 0) > 0 && !!r?.ofensiva_hoje),
    vidas: Number(r?.vidas ?? 5),
    vidasRecargaEm: r?.vidas_recarga_em ?? null,
    carregado: true,
  };
}

export function useOfensiva() {
  const { user } = useAuth();
  const [estado, setEstado] = useState<OfensivaEstado>(INICIAL);
  const inflight = useRef(false);

  const recarregar = useCallback(async () => {
    if (!user) return;
    if (inflight.current) return;
    inflight.current = true;
    try {
      const { data, error } = await supabase.rpc("hidratar_recursos");
      if (error) return;
      const row = Array.isArray(data) ? data[0] : data;
      if (row) setEstado(fromRow(row));
    } finally {
      inflight.current = false;
    }
  }, [user]);

  useEffect(() => {
    recarregar();
    const sync = () => recarregar();
    window.addEventListener(EVT, sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [recarregar]);

  // Depois de hidratar, se a ofensiva do dia estiver em risco, agenda lembrete
  // local (respeita permissão de notificações e a hora local do device).
  useEffect(() => {
    if (!estado.carregado) return;
    agendarLembreteOfensiva({
      ofensiva: estado.ofensiva,
      ofensivaHoje: estado.ofensivaHoje,
    });
  }, [estado.carregado, estado.ofensiva, estado.ofensivaHoje]);

  const registrarLicaoConcluida = useCallback(async (): Promise<{
    ofensivaAnterior: number;
    ofensivaNova: number;
    chamasAnterior: number;
    chamasNova: number;
    quebrada: boolean;
    incrementou: boolean;
  } | null> => {
    if (!user) return null;
    const anterior = estado.ofensiva;
    const chamasAnt = estado.chamasCongeladas;
    const { data, error } = await supabase.rpc("aplicar_ofensiva_diaria");
    if (error) return null;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return null;
    setEstado((s) => ({
      ...s,
      ofensiva: Number(row.ofensiva ?? 0),
      chamasCongeladas: Number(row.chamas_congeladas ?? 0),
      ofensivaHoje: !!row.ofensiva_hoje,
      chamaAcesa: Number(row.ofensiva ?? 0) > 0 && !!row.ofensiva_hoje,
      carregado: true,
    }));
    dispatch();
    return {
      ofensivaAnterior: anterior,
      ofensivaNova: Number(row.ofensiva ?? 0),
      chamasAnterior: chamasAnt,
      chamasNova: Number(row.chamas_congeladas ?? 0),
      quebrada: !!row.quebrada,
      incrementou: !!row.incrementou,
    };
  }, [user, estado.ofensiva]);

  const perderVidaBackend = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.rpc("perder_vida_progresso");
    if (error) return;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return;
    setEstado((s) => ({
      ...s,
      vidas: Number(row.vidas ?? s.vidas),
      vidasRecargaEm: row.vidas_recarga_em ?? null,
    }));
    dispatch();
  }, [user]);

  return { estado, recarregar, registrarLicaoConcluida, perderVidaBackend };
}

export const OFENSIVA_EVENT = EVT;