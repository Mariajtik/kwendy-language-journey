/**
 * useMissoes — hook central de progresso de missões/conquistas.
 * Persiste em localStorage. API estável: ao migrar para Supabase
 * substitui-se apenas a implementação interna.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
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

interface Saldo {
  xp: number;
  kindeles: number;
  baus: Record<Raridade, number>;
  fragmentos: number;
  cosmeticos: string[];
}

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
  saldo: Saldo;
  missoes: Record<string, ProgressoMissao>;
  conquistas: Record<string, ProgressoConquista>;
  ultimoReset: { diaria: string; semanal: string };
}

const SALDO_INICIAL: Saldo = {
  xp: 0,
  kindeles: 0,
  baus: { comum: 0, raro: 0, lendario: 0 },
  fragmentos: 0,
  cosmeticos: [],
};

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
    saldo: SALDO_INICIAL,
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
    const parsed = JSON.parse(raw) as State;
    const base = estadoInicial();
    // merge para suportar novas missões adicionadas depois
    return {
      saldo: { ...base.saldo, ...parsed.saldo, baus: { ...base.saldo.baus, ...(parsed.saldo?.baus ?? {}) } },
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
  }, []);

  const resgatarRecompensa = useCallback((id: string): Recompensa | null => {
    let entregue: Recompensa | null = null;
    setState((s) => {
      const def = TODAS_MISSOES.find((m) => m.id === id);
      if (!def) return s;
      const mp = s.missoes[id];
      if (!mp || mp.progresso < def.meta || mp.resgatada) return s;
      const baus = { ...s.saldo.baus };
      if (def.recompensa.bau) baus[def.recompensa.bau] += 1;
      entregue = def.recompensa;
      return {
        ...s,
        saldo: {
          ...s.saldo,
          xp: s.saldo.xp + def.recompensa.xp,
          kindeles: s.saldo.kindeles + def.recompensa.kindeles,
          baus,
        },
        missoes: { ...s.missoes, [id]: { ...mp, resgatada: true } },
      };
    });
    return entregue;
  }, []);

  const abrirBau = useCallback((raridade: Raridade): DropItem[] | null => {
    const drops = BAUS[raridade].drops;
    let entregue: DropItem[] | null = null;
    setState((s) => {
      if (s.saldo.baus[raridade] <= 0) return s;
      let xp = s.saldo.xp;
      let kindeles = s.saldo.kindeles;
      let fragmentos = s.saldo.fragmentos;
      const cosmeticos = [...s.saldo.cosmeticos];
      drops.forEach((d) => {
        if (d.tipo === "kindeles") kindeles += d.qtd;
        else if (d.tipo === "xp") xp += d.qtd;
        else if (d.tipo === "fragmento") fragmentos += d.qtd;
        else if (d.tipo === "cosmetico") cosmeticos.push(d.nome);
      });
      entregue = drops;
      return {
        ...s,
        saldo: {
          ...s.saldo,
          xp,
          kindeles,
          fragmentos,
          cosmeticos,
          baus: { ...s.saldo.baus, [raridade]: s.saldo.baus[raridade] - 1 },
        },
      };
    });
    return entregue;
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
    setState((s) => {
      const def = CONQUISTAS.find((c) => c.id === id);
      if (!def) return s;
      const cp = s.conquistas[id];
      if (!cp.desbloqueadaEm || cp.resgatada) return s;
      const baus = { ...s.saldo.baus };
      if (def.recompensa.bau) baus[def.recompensa.bau] += 1;
      return {
        ...s,
        saldo: {
          ...s.saldo,
          xp: s.saldo.xp + def.recompensa.xp,
          kindeles: s.saldo.kindeles + def.recompensa.kindeles,
          baus,
        },
        conquistas: { ...s.conquistas, [id]: { ...cp, resgatada: true } },
      };
    });
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
    saldo: state.saldo,
    ...view,
    registrarAcao,
    resgatarRecompensa,
    abrirBau,
    desbloquearConquista,
    resgatarConquista,
  };
}

type Recompensa = import("@/data/missoes").Recompensa;