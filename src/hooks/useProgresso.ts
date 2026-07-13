/**
 * useProgresso.ts
 * Hook de progresso do utilizador no currículo (Módulos → Unidades → Secções).
 * Persiste localmente em localStorage.
 */

import { useCallback, useEffect, useState } from "react";
import { pushKey } from "@/lib/backend/mirror";
import {
  CURRICULO,
  PRIMEIRA_UNIDADE,
  getSeccao,
  getUnidade,
  getProximaUnidade,
  type Modulo,
  type Unidade,
} from "@/data/curriculo";
import { todosDesbloqueadosStatic } from "@/hooks/useNivelamento";

const STORAGE_KEY = "kwendi:progresso";
const EVT = "kwendi:progresso-changed";

type Estado = {
  seccoesCompletas: string[];
  unidadeAtual: string;
};

const estadoInicial = (): Estado => ({
  seccoesCompletas: [],
  unidadeAtual: PRIMEIRA_UNIDADE.id,
});

function carregar(): Estado {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return estadoInicial();
    const parsed = JSON.parse(raw);
    const unidadeId = typeof parsed.unidadeAtual === "string" ? parsed.unidadeAtual : PRIMEIRA_UNIDADE.id;
    // Valida que a unidade ainda existe no currículo (pode ter sido reestruturado)
    const existe = !!getUnidade(unidadeId);
    return {
      seccoesCompletas: Array.isArray(parsed.seccoesCompletas) ? parsed.seccoesCompletas : [],
      unidadeAtual: existe ? unidadeId : PRIMEIRA_UNIDADE.id,
    };
  } catch {
    return estadoInicial();
  }
}

export function useProgresso() {
  const [estado, setEstado] = useState<Estado>(() => carregar());
  const [todosDesbloqueados, setTodosDesbloqueados] = useState<boolean>(() => todosDesbloqueadosStatic());

  useEffect(() => {
    const sync = () => setTodosDesbloqueados(todosDesbloqueadosStatic());
    window.addEventListener("kwendi:nivelamento-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("kwendi:nivelamento-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    pushKey(STORAGE_KEY, estado);
    window.dispatchEvent(new CustomEvent(EVT));
  }, [estado]);

  useEffect(() => {
    const sync = () => setEstado(carregar());
    window.addEventListener(EVT, sync as EventListener);
    return () => window.removeEventListener(EVT, sync as EventListener);
  }, []);

  const isCompleta = useCallback(
    (seccaoId: string) => estado.seccoesCompletas.includes(seccaoId),
    [estado.seccoesCompletas],
  );

  const concluirSeccao = useCallback((seccaoId: string) => {
    setEstado((s) => {
      if (s.seccoesCompletas.includes(seccaoId)) return s;
      const novas = [...s.seccoesCompletas, seccaoId];

      // Se concluiu a última secção da unidade atual, avança unidade.
      const info = getSeccao(seccaoId);
      let novaUnidade = s.unidadeAtual;
      if (info) {
        const todasCompletas = info.unidade.seccoes.every((sec) =>
          novas.includes(sec.id),
        );
        if (todasCompletas && info.unidade.id === s.unidadeAtual) {
          const prox = getProximaUnidade(info.unidade.id);
          if (prox) novaUnidade = prox.unidade.id;
        }
      }
      return { seccoesCompletas: novas, unidadeAtual: novaUnidade };
    });
  }, []);

  const unidadeAtualInfo = useCallback((): { modulo: Modulo; unidade: Unidade } => {
    return getUnidade(estado.unidadeAtual) ?? { modulo: CURRICULO[0], unidade: PRIMEIRA_UNIDADE };
  }, [estado.unidadeAtual]);

  const proximaUnidadeInfo = useCallback(() => getProximaUnidade(estado.unidadeAtual), [estado.unidadeAtual]);

  /** Define a unidade atual manualmente (usado após teste de nivelamento). */
  const setUnidadeAtual = useCallback((unidadeId: string) => {
    setEstado((s) => (s.unidadeAtual === unidadeId ? s : { ...s, unidadeAtual: unidadeId }));
  }, []);

  /**
   * Marca todas as secções das unidades ANTERIORES à `unidadeId` como
   * concluídas (posicionamento pós-nivelamento).
   */
  const completarAteUnidade = useCallback((unidadeId: string) => {
    setEstado((s) => {
      const secsCompletas = new Set(s.seccoesCompletas);
      for (const m of CURRICULO) {
        for (const u of m.unidades) {
          if (u.id === unidadeId) {
            return { seccoesCompletas: Array.from(secsCompletas), unidadeAtual: unidadeId };
          }
          for (const sec of u.seccoes) secsCompletas.add(sec.id);
        }
      }
      return { seccoesCompletas: Array.from(secsCompletas), unidadeAtual: unidadeId };
    });
  }, []);

  /** Status de uma secção dentro da unidade visível. ativa = primeira não-completa. */
  const statusSeccaoNa = useCallback(
    (unidade: Unidade, seccaoId: string): "concluida" | "ativa" | "bloqueada" => {
      if (isCompleta(seccaoId)) return "concluida";
      // Só a unidade atual tem secção "ativa"; outras unidades ficam bloqueadas.
      // Exceção: se o nivelamento marcou "todosDesbloqueados" (ancião), a
      // primeira secção não-concluída de qualquer unidade fica "ativa".
      if (unidade.id !== estado.unidadeAtual) {
        if (todosDesbloqueados) {
          const proxima = unidade.seccoes.find((s) => !isCompleta(s.id));
          return proxima?.id === seccaoId ? "ativa" : "bloqueada";
        }
        return "bloqueada";
      }
      const proxima = unidade.seccoes.find((s) => !isCompleta(s.id));
      return proxima?.id === seccaoId ? "ativa" : "bloqueada";
    },
    [isCompleta, estado.unidadeAtual, todosDesbloqueados],
  );

  return {
    estado,
    isCompleta,
    concluirSeccao,
    unidadeAtualInfo,
    proximaUnidadeInfo,
    statusSeccaoNa,
    setUnidadeAtual,
    completarAteUnidade,
    todosDesbloqueados,
  };
}