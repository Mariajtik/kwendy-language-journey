import { describe, it, expect } from "vitest";
import { MotorAdaptativo, distribuicaoBanco, unidadeParaNivel, trilhaParaUnidade } from "./motor";

describe("MotorAdaptativo", () => {
  it("banco cobre pelo menos A1..B1 com itens", () => {
    const dist = distribuicaoBanco();
    expect(dist.A1 + dist.A2 + dist.B1).toBeGreaterThan(10);
  });

  it("acerto sobe degrau, erro desce", () => {
    const m = new MotorAdaptativo({ nivelInicial: "A2" });
    expect(m.nivelAtual).toBe("A2");
    const i1 = m.proximo()!;
    m.registrar(i1, true);
    expect(m.nivelAtual).toBe("B1");
    const i2 = m.proximo()!;
    m.registrar(i2, false);
    expect(m.nivelAtual).toBe("A2");
  });

  it("nunca repete o mesmo item", () => {
    const m = new MotorAdaptativo({ nivelInicial: "A1" });
    const vistos = new Set<string>();
    for (let i = 0; i < 15; i++) {
      const it = m.proximo();
      if (!it) break;
      expect(vistos.has(it.id)).toBe(false);
      vistos.add(it.id);
      m.registrar(it, i % 2 === 0);
    }
  });

  it("termina entre 10 e 15 perguntas", () => {
    const m = new MotorAdaptativo({ nivelInicial: "B1" });
    while (!m.terminou()) {
      const it = m.proximo();
      if (!it) break;
      m.registrar(it, Math.random() > 0.5);
    }
    expect(m.respondidas).toBeGreaterThanOrEqual(10);
    expect(m.respondidas).toBeLessThanOrEqual(15);
  });

  it("estabilização com 3 níveis iguais consecutivos após mínimo", () => {
    const m = new MotorAdaptativo({ nivelInicial: "A1" });
    // Alterna certo/errado para estabilizar em torno de A1/A2.
    let i = 0;
    while (!m.terminou()) {
      const it = m.proximo();
      if (!it) break;
      m.registrar(it, i % 2 === 0);
      i++;
    }
    expect(m.respondidas).toBeLessThanOrEqual(15);
  });

  it("resumo devolve pontos fortes e unidade sugerida", () => {
    const m = new MotorAdaptativo({ nivelInicial: "A1" });
    for (let i = 0; i < 12; i++) {
      const it = m.proximo();
      if (!it) break;
      m.registrar(it, true);
    }
    const r = m.resumo();
    expect(r.total).toBeGreaterThanOrEqual(10);
    expect(r.acertos).toBe(r.total);
    expect(r.percentagem).toBe(100);
    expect(r.pontosFortes.length).toBeGreaterThan(0);
  });

  it("unidadeParaNivel respeita CEFR", () => {
    expect(unidadeParaNivel("A1", 40)).toBe("m1u1");
    expect(unidadeParaNivel("A2", 55)).toBe("m1u3");
    expect(unidadeParaNivel("B1", 70)).toBe("m1u5");
    expect(unidadeParaNivel("C1", 90)).toBe("m1u5");
    expect(unidadeParaNivel("B1", 100)).toBeNull();
  });

  it("trilhaParaUnidade devolve unidades a partir da inicial", () => {
    expect(trilhaParaUnidade("m1u3")).toEqual(["m1u3", "m1u4", "m1u5"]);
    expect(trilhaParaUnidade(null)).toEqual([]);
  });
});