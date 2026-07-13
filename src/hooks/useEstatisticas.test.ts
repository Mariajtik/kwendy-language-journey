/**
 * Testes básicos da função `agregar` — validam agrupamento diário,
 * detecção de semana actual e cálculo de precisão.
 */
import { describe, it, expect } from "vitest";
import { agregar } from "./useEstatisticas";

function iso(y: number, m: number, d: number, h = 12) {
  return new Date(Date.UTC(y, m - 1, d, h)).toISOString();
}

describe("agregar", () => {
  it("agrupa XP e precisão nos últimos 7 dias", () => {
    const ref = new Date(Date.UTC(2026, 6, 15, 12)); // 2026-07-15 (quarta)
    const rows = [
      { finished_at: iso(2026, 7, 15), duracao_seg: 300, xp_ganho: 40, acertos: 8, erros: 2 },
      { finished_at: iso(2026, 7, 14), duracao_seg: 600, xp_ganho: 60, acertos: 10, erros: 0 },
      { finished_at: iso(2026, 7, 1), duracao_seg: 200, xp_ganho: 20, acertos: 5, erros: 5 }, // fora dos 7d
    ];
    const a = agregar(rows as any, ref);
    expect(a.tempoTotal7d).toBe(900);
    expect(Math.round(a.precisao7d * 100)).toBe(90); // 18/20
    expect(a.xpSemanaAtual).toBe(100);
    expect(a.diasAtivosSemana.length).toBe(2);
  });

  it("compara com semana anterior", () => {
    const ref = new Date(Date.UTC(2026, 6, 15, 12));
    const rows = [
      { finished_at: iso(2026, 7, 10), duracao_seg: 60, xp_ganho: 50, acertos: 5, erros: 0 }, // sexta -> semana anterior? 10/7/2026 sexta, mesma semana
      { finished_at: iso(2026, 7, 5), duracao_seg: 60, xp_ganho: 30, acertos: 3, erros: 0 }, // domingo semana anterior
    ];
    const a = agregar(rows as any, ref);
    // 2026-07-15 quarta → semana começa 13-jul. 10-jul = semana anterior; 5-jul = duas semanas atrás.
    expect(a.xpSemanaAtual).toBe(0);
    expect(a.xpSemanaAnterior).toBe(50);
  });
});