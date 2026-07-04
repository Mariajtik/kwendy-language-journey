/**
 * sessionTracker — Fase 3 vai persistir sessões em `public.sessoes`.
 * Por agora só regista em localStorage (cap 200) para o painel admin local.
 */
const KEY = "kwendi_sessions";
const MAX = 200;
const IDLE_MS = 5 * 60 * 1000;

type Entry = { startedAt: number; endedAt: number; route: string };

let current: Entry | null = null;
let idleTimer: number | null = null;
let installed = false;

function readAll(): Entry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

function persistCurrent() {
  if (!current) return;
  const all = readAll();
  const last = all[all.length - 1];
  if (last && last.startedAt === current.startedAt) {
    all[all.length - 1] = { ...current };
  } else {
    all.push({ ...current });
  }
  while (all.length > MAX) all.shift();
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* noop */
  }
}

function endSession() {
  if (!current) return;
  current.endedAt = Date.now();
  persistCurrent();
  current = null;
}

function ensureSession(route: string) {
  const now = Date.now();
  if (!current) current = { startedAt: now, endedAt: now, route };
  current.endedAt = now;
  current.route = route;
  persistCurrent();
  if (idleTimer) window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(endSession, IDLE_MS);
}

export function installSessionTracker() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  ensureSession(window.location.pathname);
  const onActivity = () => ensureSession(window.location.pathname);
  window.addEventListener("pointerdown", onActivity, { passive: true });
  window.addEventListener("keydown", onActivity);
  window.addEventListener("popstate", onActivity);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") endSession();
    else ensureSession(window.location.pathname);
  });
  window.addEventListener("beforeunload", endSession);
}
