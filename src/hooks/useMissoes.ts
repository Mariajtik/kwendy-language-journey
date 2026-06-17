/**
 * useMissoes — hook central de progresso de missões/conquistas.
 * Saldo (diamantes/xp/baús) vive em `useSaldo` (compartilhado com Home/Perfil).
 * Aqui guardamos só o progresso/resgate de missões e conquistas.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSaldo, setSaldo, useSaldo } from "@/hooks/useSaldo";
import {
  TODAS_MISSOES,
  MISSOES_DIARIAS,
  MISSOES_SEMANAIS,
  MISSOES_ESPECIAIS,
  type AcaoTipo,
  type Raridade,
  type MissaoDef,
} from "@/data/missoes";
import { CONQUISTAS, type ConquistaDef } from "@/data/conquistas";
import { BAUS, type DropItem } from "@/data/recompensas";

const STORAGE_KEY = "kwendi_missoes_v1";

interface ProgressoMissao {
  progresso: number;
  resgatada: boolean;
}

interface ProgressoConquista {
  progresso: number;
  desbloqueadaEm?: string;
  resgatada: boolean;
}

interface State {
  missoes: Record<string, ProgressoMissao>;
  conquistas: Record<string, ProgressoConquista>;
  ultimoReset: { diaria: string; semanal: string };
}

function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function inicioSemanaISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().slice(0, 10);
}

function estadoInicial(): State {
  const missoes: Record<string, ProgressoMissao> = {};
  TODAS_MISSOES.forEach((m) => {
    missoes[m.id] = { progresso: 0, resgatada: false };
  });
  const conquistas: Record<string, ProgressoConquista> = {};
  CONQUISTAS.forEach((c) => {
    conquistas[c.id] = { progresso: 0, resgatada: false };
  });
  return {
    missoes,
    conquistas,
    ultimoReset: { diaria: hojeISO(), semanal: inicioSemanaISO() },
  };
}

function carregar(): State {
  if (typeof window === "undefined") return estadoInicial();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return estadoInicial();
    const parsed = JSON.parse(raw) as Partial<State>;
    const base = estadoInicial();
    // merge para suportar novas missões adicionadas depois
    return {
      missoes: { ...base.missoes, ...parsed.missoes },
      conquistas: { ...base.conquistas, ...parsed.conquistas },
      ultimoReset: parsed.ultimoReset ?? base.ultimoReset,
    };
  } catch {
    return estadoInicial();
  }
}

function aplicarResets(s: State): State {
  const hoje = hojeISO();
  const sem = inicioSemanaISO();
  let next = s;
  if (s.ultimoReset.diaria !== hoje) {
    const missoes = { ...next.missoes };
    MISSOES_DIARIAS.forEach((m) => {
      missoes[m.id] = { progresso: 0, resgatada: false };
    });
    next = { ...next, missoes, ultimoReset: { ...next.ultimoReset, diaria: hoje } };
  }
  if (s.ultimoReset.semanal !== sem) {
    const missoes = { ...next.missoes };
    MISSOES_SEMANAIS.forEach((m) => {
      missoes[m.id] = { progresso: 0, resgatada: false };
    });
    next = { ...next, missoes, ultimoReset: { ...next.ultimoReset, semanal: sem } };
  }
  return next;
}

export interface MissaoView extends MissaoDef {
  progresso: number;
  concluida: boolean;
  resgatada: boolean;
}

export interface ConquistaView extends ConquistaDef {
  progresso: number;
  desbloqueada: boolean;
  resgatada: boolean;
  desbloqueadaEm?: string;
}

export function useMissoes() {
  const [state, setState] = useState<State>(() => aplicarResets(carregar()));
  const { saldo } = useSaldo();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // recheca resets ao montar
  useEffect(() => {
    setState((s) => aplicarResets(s));
  }, []);

  const registrarAcao = useCallback((acao: AcaoTipo, qtd = 1) => {
    setState((s) => {
      const missoes = { ...s.missoes };
      TODAS_MISSOES.forEach((m) => {
        if (m.acao === acao) {
          const atual = missoes[m.id];
          if (atual.resgatada) return;
          missoes[m.id] = {
            ...atual,
            progresso: Math.min(m.meta, atual.progresso + qtd),
          };
        }
      });
      return { ...s, missoes };
    });
    // propaga para conquistas relacionadas
    setState((s) => {
      const conquistas = { ...s.conquistas };
      const incCon = (id: string, n: number) => {
        const def = CONQUISTAS.find((c) => c.id === id);
        const atual = conquistas[id];
        if (!def || !atual) return;
        const novoProg = Math.min(def.meta, atual.progresso + n);
        const ja = !!atual.desbloqueadaEm;
        conquistas[id] = {
          ...atual,
          progresso: novoProg,
          desbloqueadaEm: !ja && novoProg >= def.meta ? new Date().toISOString() : atual.desbloqueadaEm,
        };
      };
      switch (acao) {
        case "licao_completa":
          incCon("c2", qtd);
          if (new Date().getHours() < 8) incCon("c18", qtd);
          break;
        case "audio_ouvido":
          incCon("c3", qtd);
          incCon("c8", qtd);
          break;
        case "palavra_traduzida":
          incCon("c1", qtd);
          incCon("c5", qtd);
          incCon("c6", qtd);
          incCon("c7", qtd);
          incCon("c9", qtd);
          break;
        case "historia_concluida":
          incCon("c11", qtd);
          break;
        case "curiosidade_lida":
          incCon("c10", qtd);
          break;
      }
      return { ...s, conquistas };
    });
  }, []);

  const resgatarRecompensa = useCallback((id: string): Recompensa | null => {
    const def = TODAS_MISSOES.find((m) => m.id === id);
    if (!def) return null;
    let entregue: Recompensa | null = null;
    setState((s) => {
      const mp = s.missoes[id];
      if (!mp || mp.progresso < def.meta || mp.resgatada) return s;
      entregue = def.recompensa;
      return { ...s, missoes: { ...s.missoes, [id]: { ...mp, resgatada: true } } };
    });
    if (entregue) {
      const r = entregue;
      setSaldo((sal) => ({
        ...sal,
        xp: sal.xp + r.xp,
        diamantes: sal.diamantes + r.diamantes,
        baus: r.bau ? { ...sal.baus, [r.bau]: sal.baus[r.bau] + 1 } : sal.baus,
      }));
    }
    return entregue;
  }, []);

  const abrirBau = useCallback((raridade: Raridade): DropItem[] | null => {
    const drops = BAUS[raridade].drops;
    const atual = getSaldo();
    if (atual.baus[raridade] <= 0) return null;
    setSaldo((sal) => {
      let xp = sal.xp;
      let diamantes = sal.diamantes;
      let fragmentos = sal.fragmentos;
      drops.forEach((d) => {
        if (d.tipo === "diamantes") diamantes += d.qtd;
        else if (d.tipo === "xp") xp += d.qtd;
        else if (d.tipo === "fragmento") fragmentos += d.qtd;
      });
      return {
        ...sal,
        xp,
        diamantes,
        fragmentos,
        baus: { ...sal.baus, [raridade]: sal.baus[raridade] - 1 },
      };
    });
    return drops;
  }, []);

  const desbloquearConquista = useCallback((id: string, progresso?: number) => {
    setState((s) => {
      const def = CONQUISTAS.find((c) => c.id === id);
      if (!def) return s;
      const atual = s.conquistas[id];
      const novoProg = progresso ?? def.meta;
      const desbloqueada = novoProg >= def.meta && !atual.desbloqueadaEm;
      return {
        ...s,
        conquistas: {
          ...s.conquistas,
          [id]: {
            ...atual,
            progresso: novoProg,
            desbloqueadaEm: desbloqueada ? new Date().toISOString() : atual.desbloqueadaEm,
          },
        },
      };
    });
  }, []);

  const resgatarConquista = useCallback((id: string) => {
    const def = CONQUISTAS.find((c) => c.id === id);
    if (!def) return;
    let entregue = false;
    setState((s) => {
      const cp = s.conquistas[id];
      if (!cp.desbloqueadaEm || cp.resgatada) return s;
      entregue = true;
      return { ...s, conquistas: { ...s.conquistas, [id]: { ...cp, resgatada: true } } };
    });
    if (entregue) {
      const r = def.recompensa;
      setSaldo((sal) => ({
        ...sal,
        xp: sal.xp + r.xp,
        diamantes: sal.diamantes + r.diamantes,
        baus: r.bau ? { ...sal.baus, [r.bau]: sal.baus[r.bau] + 1 } : sal.baus,
      }));
    }
  }, []);

  const view = useMemo(() => {
    const mapMissao = (m: MissaoDef): MissaoView => {
      const p = state.missoes[m.id] ?? { progresso: 0, resgatada: false };
      return { ...m, progresso: p.progresso, concluida: p.progresso >= m.meta, resgatada: p.resgatada };
    };
    return {
      diarias: MISSOES_DIARIAS.map(mapMissao),
      semanais: MISSOES_SEMANAIS.map(mapMissao),
      especiais: MISSOES_ESPECIAIS.map(mapMissao),
      conquistas: CONQUISTAS.map<ConquistaView>((c) => {
        const p = state.conquistas[c.id] ?? { progresso: 0, resgatada: false };
        return {
          ...c,
          progresso: p.progresso,
          desbloqueada: !!p.desbloqueadaEm,
          desbloqueadaEm: p.desbloqueadaEm,
          resgatada: p.resgatada,
        };
      }),
    };
  }, [state]);

  return {
    saldo,
    ...view,
    registrarAcao,
    resgatarRecompensa,
    abrirBau,
    desbloquearConquista,
    resgatarConquista,
  };
}

type Recompensa = import("@/data/missoes").Recompensa;