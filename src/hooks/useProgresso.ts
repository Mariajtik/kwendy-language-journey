/**
 * useProgresso.ts
 * Hook de progresso do utilizador no currículo (Módulos → Unidades → Secções).
 * Persiste localmente em localStorage.
 */

import { useCallback, useEffect, useState } from "react";
import {
  CURRICULO,
  PRIMEIRA_UNIDADE,
  getSeccao,
  getUnidade,
  getProximaUnidade,
  type Modulo,
  type Unidade,
} from "@/data/curriculo";

const STORAGE_KEY = "kwendi:progresso";

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    } catch {
      /* noop */
    }
  }, [estado]);

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

  /** Status de uma secção dentro da unidade visível. ativa = primeira não-completa. */
  const statusSeccaoNa = useCallback(
    (unidade: Unidade, seccaoId: string): "concluida" | "ativa" | "bloqueada" => {
      if (isCompleta(seccaoId)) return "concluida";
      // Só a unidade atual tem secção "ativa"; outras unidades ficam bloqueadas.
      if (unidade.id !== estado.unidadeAtual) return "bloqueada";
      const proxima = unidade.seccoes.find((s) => !isCompleta(s.id));
      return proxima?.id === seccaoId ? "ativa" : "bloqueada";
    },
    [isCompleta, estado.unidadeAtual],
  );

  return {
    estado,
    isCompleta,
    concluirSeccao,
    unidadeAtualInfo,
    proximaUnidadeInfo,
    statusSeccaoNa,
  };
}