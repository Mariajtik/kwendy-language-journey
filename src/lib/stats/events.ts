/**
 * stats/events.ts — Regista lições concluídas em `public.lesson_events`.
 * Faz uma fila local (localStorage) para escrever quando a rede voltar.
 */
import { supabase } from "@/integrations/supabase/client";

const QUEUE_KEY = "kwendi.stats.queue";

export type LessonEvent = {
  duracaoSeg: number;
  xpGanho: number;
  acertos: number;
  erros: number;
  licaoId?: string | null;
  finishedAt?: string; // ISO
};

type QueuedEvent = LessonEvent & { finishedAt: string };

function readQueue(): QueuedEvent[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]") as QueuedEvent[];
  } catch {
    return [];
  }
}
function writeQueue(q: QueuedEvent[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-100)));
  } catch {
    /* noop */
  }
}

async function tryInsert(userId: string, ev: QueuedEvent): Promise<boolean> {
  const { error } = await supabase.from("lesson_events").insert({
    user_id: userId,
    finished_at: ev.finishedAt,
    duracao_seg: Math.max(0, Math.round(ev.duracaoSeg)),
    xp_ganho: Math.max(0, Math.round(ev.xpGanho)),
    acertos: Math.max(0, Math.round(ev.acertos)),
    erros: Math.max(0, Math.round(ev.erros)),
    licao_id: ev.licaoId ?? null,
  });
  return !error;
}

/**
 * Regista um evento; enfileira localmente se a chamada falhar.
 * Além disso, drena a fila anterior no melhor esforço.
 */
export async function insertLessonEvent(ev: LessonEvent): Promise<void> {
  const { data: sess } = await supabase.auth.getUser();
  const uid = sess.user?.id;
  const ready: QueuedEvent = {
    ...ev,
    finishedAt: ev.finishedAt ?? new Date().toISOString(),
  };
  if (!uid) {
    const q = readQueue();
    q.push(ready);
    writeQueue(q);
    return;
  }
  // Drena fila existente primeiro (ordem cronológica).
  const pending = readQueue();
  const remaining: QueuedEvent[] = [];
  for (const p of pending) {
    const ok = await tryInsert(uid, p);
    if (!ok) remaining.push(p);
  }
  // Escreve o evento actual.
  const okNow = await tryInsert(uid, ready);
  if (!okNow) remaining.push(ready);
  writeQueue(remaining);
}

export type LessonEventRow = {
  finished_at: string;
  duracao_seg: number;
  xp_ganho: number;
  acertos: number;
  erros: number;
};

/** Busca eventos do utilizador entre `from` e `to` (ISO). */
export async function fetchEvents(from: string, to: string): Promise<LessonEventRow[]> {
  const { data, error } = await supabase
    .from("lesson_events")
    .select("finished_at,duracao_seg,xp_ganho,acertos,erros")
    .gte("finished_at", from)
    .lte("finished_at", to)
    .order("finished_at", { ascending: true });
  if (error || !data) return [];
  return data as LessonEventRow[];
}