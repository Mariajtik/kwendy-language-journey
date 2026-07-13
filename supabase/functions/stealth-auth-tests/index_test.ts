/**
 * Automated auth-rule tests for Modo Furtivo (stealth mode).
 *
 * Verifies that:
 *  1. Anonymous sign-ins are enabled at the auth layer.
 *  2. The `handle_new_user` trigger marks anon users as `stealth`
 *     with an ~7-day expiry.
 *  3. RLS on `public.user_preferencias` lets a stealth user read
 *     and update ONLY their own row.
 *  4. A stealth user cannot read another stealth user's preferences.
 *  5. Unauthenticated (no JWT) callers cannot read `user_preferencias`.
 *
 * Run via: supabase--test_edge_functions({ functions: ["stealth-auth-tests"] })
 */

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL =
  Deno.env.get("VITE_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY =
  Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ??
  Deno.env.get("SUPABASE_ANON_KEY")!;

function freshClient(): SupabaseClient {
  // A fresh client per test avoids leaking sessions between tests.
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

async function signInStealth(): Promise<{ client: SupabaseClient; uid: string }> {
  const client = freshClient();
  const { data, error } = await client.auth.signInAnonymously();
  assertEquals(error, null, `signInAnonymously failed: ${error?.message}`);
  const uid = data.user?.id;
  assert(uid, "expected an anonymous user id");
  return { client, uid: uid! };
}

async function cleanup(client: SupabaseClient) {
  try {
    await client.auth.signOut();
  } catch {
    // ignore
  }
}

Deno.test("anonymous sign-in is enabled and returns is_anonymous=true", async () => {
  const { client, uid } = await signInStealth();
  try {
    const { data: userData, error } = await client.auth.getUser();
    assertEquals(error, null);
    assertEquals(userData.user?.id, uid);
    // Supabase marks anonymous sessions with is_anonymous=true on the user object.
    assertEquals((userData.user as any)?.is_anonymous, true);
  } finally {
    await cleanup(client);
  }
});

Deno.test("stealth signup creates a profile with tipo='stealth' and ~7d expiry", async () => {
  const { client, uid } = await signInStealth();
  try {
    // Give the handle_new_user trigger a moment.
    await new Promise((r) => setTimeout(r, 400));

    const { data: profile, error } = await client
      .from("profiles")
      .select("id, tipo, stealth_expira_em")
      .eq("id", uid)
      .maybeSingle();

    assertEquals(error, null, `profile read failed: ${error?.message}`);
    assert(profile, "profile row should exist for anonymous user");
    assertEquals(profile!.tipo, "stealth");
    assert(profile!.stealth_expira_em, "stealth_expira_em must be set");

    const now = Date.now();
    const exp = new Date(profile!.stealth_expira_em as string).getTime();
    const diffDays = (exp - now) / 86_400_000;
    // Allow a wide window to cover trigger/network drift.
    assert(
      diffDays > 6.5 && diffDays < 7.5,
      `expiry should be ~7 days, got ${diffDays.toFixed(2)}d`,
    );
  } finally {
    await cleanup(client);
  }
});

Deno.test("stealth user can read and update ONLY their own user_preferencias", async () => {
  const { client, uid } = await signInStealth();
  try {
    await new Promise((r) => setTimeout(r, 400));

    // Own row must exist (created by handle_new_user) and be readable.
    const { data: own, error: ownErr } = await client
      .from("user_preferencias")
      .select("user_id, idioma_app")
      .eq("user_id", uid)
      .maybeSingle();
    assertEquals(ownErr, null, `own read failed: ${ownErr?.message}`);
    assert(own, "stealth user must be able to read own user_preferencias row");

    // Update own row — should succeed and return exactly 1 row.
    const { data: updated, error: updErr } = await client
      .from("user_preferencias")
      .update({ idioma_app: "en" })
      .eq("user_id", uid)
      .select("user_id, idioma_app");
    assertEquals(updErr, null, `own update failed: ${updErr?.message}`);
    assertEquals(updated?.length, 1);
    assertEquals(updated?.[0].idioma_app, "en");
  } finally {
    await cleanup(client);
  }
});

Deno.test("stealth user cannot read another stealth user's preferences", async () => {
  const a = await signInStealth();
  const b = await signInStealth();
  try {
    await new Promise((r) => setTimeout(r, 400));

    // Client A tries to read B's row: RLS should filter it out (no error, 0 rows).
    const { data, error } = await a.client
      .from("user_preferencias")
      .select("user_id")
      .eq("user_id", b.uid);
    assertEquals(error, null, `cross-read errored: ${error?.message}`);
    assertEquals(
      data?.length ?? 0,
      0,
      "stealth user must NOT see another user's preferences",
    );

    // Client A tries to update B's row: RLS should also block (0 rows affected).
    const { data: upd, error: updErr } = await a.client
      .from("user_preferencias")
      .update({ idioma_app: "fr" })
      .eq("user_id", b.uid)
      .select("user_id");
    assertEquals(updErr, null);
    assertEquals(upd?.length ?? 0, 0, "cross-update must affect 0 rows");
  } finally {
    await cleanup(a.client);
    await cleanup(b.client);
  }
});

Deno.test("unauthenticated caller cannot read user_preferencias", async () => {
  const anon = freshClient();
  const { data, error } = await anon
    .from("user_preferencias")
    .select("user_id")
    .limit(1);

  // With RLS restricted to authenticated + auth.uid() = user_id, anon must
  // either receive a permission error or an empty result — never real rows.
  if (error) {
    // Expected: permission denied / RLS violation.
    assert(
      /permission|denied|policy|rls|not.*allowed/i.test(error.message),
      `unexpected error for anon read: ${error.message}`,
    );
  } else {
    assertEquals(data?.length ?? 0, 0, "anon must not see any prefs rows");
  }
});