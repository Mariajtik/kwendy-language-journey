/**
 * registry.ts — Registo dos espelhos localStorage ⇄ Supabase.
 * Importado uma única vez a partir do AuthProvider para garantir que o mirror
 * conhece todas as chaves antes de fazer hydrateAll.
 */
import { registerMirror } from "./mirror";

// Saldo (xp, diamantes, vidas, ofensiva, baus, fragmentos, curiosidades lidas)
// mora todo em `progresso`. `vidasExtra` fica só local — sem coluna dedicada.
registerMirror({
  key: "kwendi_saldo_v1",
  table: "progresso",
  event: "kwendi:saldo-changed",
  encode: (s: any) => ({
    xp: Number(s?.xp ?? 0),
    diamantes: Number(s?.diamantes ?? 0),
    vidas: Number(s?.vidas ?? 5),
    fragmentos: Number(s?.fragmentos ?? 0),
    ofensiva: Number(s?.ofensiva ?? 0),
    baus: s?.baus ?? { comum: 0, raro: 0, lendario: 0 },
    curiosidades_lidas: Array.isArray(s?.curiosidadesLidas) ? s.curiosidadesLidas : [],
  }),
  decode: (r: any) => ({
    xp: r.xp ?? 0,
    diamantes: r.diamantes ?? 0,
    vidas: r.vidas ?? 5,
    vidasExtra: 0,
    fragmentos: r.fragmentos ?? 0,
    ofensiva: r.ofensiva ?? 0,
    ultimoDiaAtivo: r.ofensiva_ultimo_dia ?? "",
    curiosidadesLidas: r.curiosidades_lidas ?? [],
    baus: r.baus ?? { comum: 0, raro: 0, lendario: 0 },
  }),
});

// Progresso do currículo (secoes_completas + unidade_atual)
registerMirror({
  key: "kwendi:progresso",
  table: "progresso",
  event: "kwendi:progresso-changed",
  encode: (s: any) => ({
    secoes_completas: Array.isArray(s?.seccoesCompletas) ? s.seccoesCompletas : [],
    unidade_atual: Number(
      typeof s?.unidadeAtual === "string" ? parseInt(s.unidadeAtual, 10) || 1 : s?.unidadeAtual ?? 1,
    ),
  }),
  decode: (r: any) => ({
    seccoesCompletas: Array.isArray(r.secoes_completas) ? r.secoes_completas : [],
    unidadeAtual: r.unidade_atual ? String(r.unidade_atual) : undefined,
  }),
});

// user_inventario — chave "kwendi.inventario"
registerMirror({
  key: "kwendi.inventario",
  table: "user_inventario",
  event: "kwendi:inventario-changed",
  encode: (s: any) => ({ itens: s ?? {} }),
  decode: (r: any) => (r.itens && Object.keys(r.itens).length ? r.itens : null),
});

// user_missoes — chave "kwendi_missoes_v1"
registerMirror({
  key: "kwendi_missoes_v1",
  table: "user_missoes",
  encode: (s: any) => ({
    diarias: s?.diarias ?? s?.missoes?.diarias ?? {},
    semanais: s?.semanais ?? s?.missoes?.semanais ?? {},
    conquistas: s?.conquistas ?? {},
  }),
  decode: (r: any) => ({
    diarias: r.diarias ?? {},
    semanais: r.semanais ?? {},
    conquistas: r.conquistas ?? {},
  }),
});

// user_nivelamento — chave "kwendi:nivelamento"
registerMirror({
  key: "kwendi:nivelamento",
  table: "user_nivelamento",
  event: "kwendi:nivelamento-changed",
  encode: (s: any) => ({
    feito: !!s?.fez,
    ancião: s?.ancao ? String(s.ancao) : null,
    percentagem: Number(s?.percentagem ?? 0),
    unidade_sugerida: Number(s?.unidadeSugerida ?? 0) || null,
    respostas: s?.respostas ?? {},
    cefr: s?.cefr ?? null,
    pontos_fortes: Array.isArray(s?.pontosFortes) ? s.pontosFortes : [],
    pontos_fracos: Array.isArray(s?.pontosFracos) ? s.pontosFracos : [],
    trilha_sugerida: Array.isArray(s?.trilhaSugerida) ? s.trilhaSugerida : [],
  }),
  decode: (r: any) => ({
    fez: !!r.feito,
    ancao: r["ancião"] ?? null,
    percentagem: r.percentagem ?? 0,
    unidadeSugerida: r.unidade_sugerida ?? null,
    respostas: r.respostas ?? {},
    cefr: r.cefr ?? null,
    pontosFortes: Array.isArray(r.pontos_fortes) ? r.pontos_fortes : [],
    pontosFracos: Array.isArray(r.pontos_fracos) ? r.pontos_fracos : [],
    trilhaSugerida: Array.isArray(r.trilha_sugerida) ? r.trilha_sugerida : [],
  }),
});

// user_passaporte — chave "kwendi:fronteiras:passaporte"
registerMirror({
  key: "kwendi:fronteiras:passaporte",
  table: "user_passaporte",
  encode: (s: any) => ({ provincias_visitadas: s ?? {} }),
  decode: (r: any) => r.provincias_visitadas ?? {},
});

// user_preferencias — várias chaves compostas num único registo `flags`.
// Aqui espelhamos as flags de tour numa entrada dedicada, sob a chave
// meta `kwendi.prefs.flags`.
registerMirror({
  key: "kwendi.prefs.flags",
  table: "user_preferencias",
  encode: (s: any) => ({ extras: { flags: s ?? {} } }),
  decode: (r: any) =>
    r.extras?.flags && Object.keys(r.extras.flags).length ? r.extras.flags : null,
});

// Notificações — chave "kwendi.def.notif"
registerMirror({
  key: "kwendi.def.notif",
  table: "user_preferencias",
  encode: (s: any) => ({ extras: { notificacoes: s ?? {} } }),
  decode: (r: any) =>
    r.extras?.notificacoes && Object.keys(r.extras.notificacoes).length
      ? r.extras.notificacoes
      : null,
});

// Acessibilidade — chave "kwendi:acessibilidade"
registerMirror({
  key: "kwendi:acessibilidade",
  table: "user_preferencias",
  encode: (s: any) => ({
    reduzir_movimento: !!s?.reduzirMovimento,
    alto_contraste: !!s?.altoContraste,
    fonte: s?.fonte ?? null,
  }),
  decode: (r: any) => {
    if (r.reduzir_movimento == null && r.alto_contraste == null && r.fonte == null) return null;
    return {
      reduzirMovimento: !!r.reduzir_movimento,
      altoContraste: !!r.alto_contraste,
      fonte: r.fonte ?? undefined,
    };
  },
});

// Idioma do App — chave "kwendi.idioma"
registerMirror({
  key: "kwendi.idioma",
  table: "user_preferencias",
  event: "kwendi:idioma-changed",
  encode: (s: any) => ({ idioma_app: typeof s === "string" && s.length ? s : "pt-AO" }),
  decode: (r: any) => (typeof r.idioma_app === "string" ? r.idioma_app : null),
});