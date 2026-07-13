/**
 * useEstatisticas — agrega eventos de lição em séries úteis para o UI:
 * • dias com actividade na semana ISO actual (para faixa gratuita)
 * • XP da semana actual e da anterior
 * • tempo total (7 dias)
 * • precisão (7 dias)
 * • heatmap por dia (últimas 20 semanas)
 */
import { useCallback, useEffect, useState } from "react";
import { fetchEvents, type LessonEventRow } from "@/lib/stats/events";
import { useAuth } from "@/contexts/AuthContext";

export type DiaResumo = { data: string; xp: number; minutos: number; acertos: number; erros: number };

export type EstatisticasAggr = {
  carregado: boolean;
  diasAtivosSemana: string[]; // ISO date YYYY-MM-DD
  xpSemanaAtual: number;
  xpSemanaAnterior: number;
  tempoTotal7d: number; // segundos
  precisao7d: number; // 0..1
  heatmap: DiaResumo[]; // 20 semanas × 7
};

const INICIAL: EstatisticasAggr = {
  carregado: false,
  diasAtivosSemana: [],
  xpSemanaAtual: 0,
  xpSemanaAnterior: 0,
  tempoTotal7d: 0,
  precisao7d: 0,
  heatmap: [],
};

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Segunda-feira 00:00 da semana ISO que contém `ref`. */
function inicioSemana(ref: Date): Date {
  const d = new Date(ref);
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // 0 = Monday
  d.setDate(d.getDate() - dow);
  return d;
}

export function agregar(rows: LessonEventRow[], ref: Date = new Date()): EstatisticasAggr {
  const semanaAtualIni = inicioSemana(ref);
  const semanaAtualFim = new Date(semanaAtualIni);
  semanaAtualFim.setDate(semanaAtualFim.getDate() + 7);
  const semanaAntIni = new Date(semanaAtualIni);
  semanaAntIni.setDate(semanaAntIni.getDate() - 7);
  const seteDiasIni = new Date(ref);
  seteDiasIni.setDate(seteDiasIni.getDate() - 6);
  seteDiasIni.setHours(0, 0, 0, 0);
  const heatmapIni = new Date(semanaAtualIni);
  heatmapIni.setDate(heatmapIni.getDate() - 7 * 19);

  // Pré-mapa por dia.
  const porDia = new Map<string, DiaResumo>();
  const dias: string[] = [];
  for (let i = 0; i < 20 * 7; i++) {
    const d = new Date(heatmapIni);
    d.setDate(heatmapIni.getDate() + i);
    const iso = toISODate(d);
    dias.push(iso);
    porDia.set(iso, { data: iso, xp: 0, minutos: 0, acertos: 0, erros: 0 });
  }

  let xpAtual = 0;
  let xpAnt = 0;
  let tempo7 = 0;
  let acertos7 = 0;
  let erros7 = 0;
  const diasAtivosSemanaSet = new Set<string>();

  for (const r of rows) {
    const dt = new Date(r.finished_at);
    const iso = toISODate(dt);
    const alvo = porDia.get(iso);
    if (alvo) {
      alvo.xp += r.xp_ganho ?? 0;
      alvo.minutos += (r.duracao_seg ?? 0) / 60;
      alvo.acertos += r.acertos ?? 0;
      alvo.erros += r.erros ?? 0;
    }
    const t = dt.getTime();
    if (t >= semanaAtualIni.getTime() && t < semanaAtualFim.getTime()) {
      xpAtual += r.xp_ganho ?? 0;
      diasAtivosSemanaSet.add(iso);
    } else if (t >= semanaAntIni.getTime() && t < semanaAtualIni.getTime()) {
      xpAnt += r.xp_ganho ?? 0;
    }
    if (t >= seteDiasIni.getTime()) {
      tempo7 += r.duracao_seg ?? 0;
      acertos7 += r.acertos ?? 0;
      erros7 += r.erros ?? 0;
    }
  }

  const totalRespostas = acertos7 + erros7;
  const precisao = totalRespostas === 0 ? 0 : acertos7 / totalRespostas;

  return {
    carregado: true,
    diasAtivosSemana: Array.from(diasAtivosSemanaSet).sort(),
    xpSemanaAtual: xpAtual,
    xpSemanaAnterior: xpAnt,
    tempoTotal7d: tempo7,
    precisao7d: precisao,
    heatmap: dias.map((d) => porDia.get(d)!),
  };
}

export function useEstatisticas() {
  const { user } = useAuth();
  const [dados, setDados] = useState<EstatisticasAggr>(INICIAL);

  const recarregar = useCallback(async () => {
    if (!user) return;
    const ref = new Date();
    const ini = new Date(ref);
    ini.setDate(ini.getDate() - 7 * 20 - 7);
    const from = ini.toISOString();
    const to = new Date(ref.getTime() + 86400000).toISOString();
    const rows = await fetchEvents(from, to);
    setDados(agregar(rows, ref));
  }, [user]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { dados, recarregar };
}