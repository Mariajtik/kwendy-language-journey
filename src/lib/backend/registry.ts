/**
 * registry.ts — Registo dos espelhos localStorage ⇄ Supabase.
 * Importado uma única vez a partir do AuthProvider para garantir que o mirror
 * conhece todas as chaves antes de fazer hydrateAll.
 */
import { registerMirror } from "./mirror";

// user_saldo — chave "kwendi_saldo_v1"
registerMirror({
  key: "kwendi_saldo_v1",
  table: "user_saldo",
  event: "kwendi:saldo-changed",
  encode: (s: any) => ({
    xp: Number(s?.xp ?? 0),
    diamantes: Number(s?.diamantes ?? 0),
    vidas: Number(s?.vidas ?? 5),
    vidas_extra: Number(s?.vidasExtra ?? 0),
    fragmentos: Number(s?.fragmentos ?? 0),
    ofensiva: Number(s?.ofensiva ?? 0),
    ultimo_dia_ativo: String(s?.ultimoDiaAtivo ?? ""),
    curiosidades_lidas: Array.isArray(s?.curiosidadesLidas) ? s.curiosidadesLidas : [],
    baus: s?.baus ?? { comum: 0, raro: 0, lendario: 0 },
  }),
  decode: (r: any) => ({
    xp: r.xp,
    diamantes: r.diamantes,
    vidas: r.vidas,
    vidasExtra: r.vidas_extra,
    fragmentos: r.fragmentos,
    ofensiva: r.ofensiva,
    ultimoDiaAtivo: r.ultimo_dia_ativo,
    curiosidadesLidas: r.curiosidades_lidas ?? [],
    baus: r.baus ?? { comum: 0, raro: 0, lendario: 0 },
  }),
});

// user_inventario — chave "kwendi.inventario"
registerMirror({
  key: "kwendi.inventario",
  table: "user_inventario",
  event: "kwendi:inventario-changed",
  encode: (s: any) => ({
    power_ups: Array.isArray(s?.powerUps) ? s.powerUps : [],
    desbloqueios: Array.isArray(s?.desbloqueios) ? s.desbloqueios : [],
  }),
  decode: (r: any) => ({
    powerUps: r.power_ups ?? [],
    desbloqueios: r.desbloqueios ?? [],
  }),
});

// user_missoes — chave "kwendi_missoes_v1"
registerMirror({
  key: "kwendi_missoes_v1",
  table: "user_missoes",
  encode: (s: any) => ({
    missoes: s?.missoes ?? {},
    conquistas: s?.conquistas ?? {},
    ultimo_reset: s?.ultimoReset ?? { diaria: "", semanal: "" },
  }),
  decode: (r: any) => ({
    missoes: r.missoes ?? {},
    conquistas: r.conquistas ?? {},
    ultimoReset: r.ultimo_reset ?? { diaria: "", semanal: "" },
  }),
});

// user_nivelamento — chave "kwendi:nivelamento"
registerMirror({
  key: "kwendi:nivelamento",
  table: "user_nivelamento",
  event: "kwendi:nivelamento-changed",
  encode: (s: any) => ({
    fez: !!s?.fez,
    ancao: !!s?.ancao,
    percentagem: Number(s?.percentagem ?? 0),
    acertos: Number(s?.acertos ?? 0),
    total: Number(s?.total ?? 0),
    unidade_sugerida: s?.unidadeSugerida ?? null,
    todos_desbloqueados: !!s?.todosDesbloqueados,
    popup_pendente: s?.popupPendente ?? null,
  }),
  decode: (r: any) => ({
    fez: r.fez,
    ancao: r.ancao,
    percentagem: r.percentagem,
    acertos: r.acertos,
    total: r.total,
    unidadeSugerida: r.unidade_sugerida ?? null,
    todosDesbloqueados: r.todos_desbloqueados,
    popupPendente: r.popup_pendente ?? null,
  }),
});

// user_passaporte — chave "kwendi:fronteiras:passaporte"
registerMirror({
  key: "kwendi:fronteiras:passaporte",
  table: "user_passaporte",
  encode: (s: any) => ({ estado: s ?? {} }),
  decode: (r: any) => r.estado ?? {},
});

// user_preferencias — várias chaves compostas num único registo `flags`.
// Aqui espelhamos as flags de tour numa entrada dedicada, sob a chave
// meta `kwendi.prefs.flags`.
registerMirror({
  key: "kwendi.prefs.flags",
  table: "user_preferencias",
  encode: (s: any) => ({ flags: s ?? {} }),
  decode: (r: any) => r.flags ?? {},
});

// Notificações
registerMirror({
  key: "kwendi.notificacoes",
  table: "user_preferencias",
  encode: (s: any) => ({ notificacoes: s ?? {} }),
  decode: (r: any) => r.notificacoes ?? null,
});

// Acessibilidade
registerMirror({
  key: "kwendi.acess",
  table: "user_preferencias",
  encode: (s: any) => ({ acessibilidade: s ?? {} }),
  decode: (r: any) => r.acessibilidade ?? null,
});