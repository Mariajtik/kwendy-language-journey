// deno-lint-ignore-file no-explicit-any
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const VALID_PURPOSES = ['login', 'password_change', 'email_change', 'account_delete'] as const
type Purpose = typeof VALID_PURPOSES[number]

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    if (!authHeader.startsWith('Bearer ')) return json({ error: 'missing_auth' }, 401)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: userData, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userData.user) return json({ error: 'invalid_session' }, 401)
    const user = userData.user

    const body = await req.json().catch(() => ({}))
    const purpose = body.purpose as Purpose
    const code = String(body.code ?? '').trim()
    if (!VALID_PURPOSES.includes(purpose)) return json({ error: 'invalid_purpose' }, 400)
    if (!/^\d{6}$/.test(code)) return json({ error: 'invalid_code_format' }, 400)

    const admin = createClient(supabaseUrl, serviceKey)

    const { data: row, error: selErr } = await admin
      .from('auth_otp')
      .select('id, code_hash, expires_at, consumed_at, tentativas')
      .eq('user_id', user.id)
      .eq('purpose', purpose)
      .is('consumed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (selErr) return json({ error: 'db_error', detail: selErr.message }, 500)
    if (!row) return json({ error: 'no_active_code' }, 400)
    if (new Date(row.expires_at).getTime() < Date.now()) {
      await admin.from('auth_otp').update({ consumed_at: new Date().toISOString() }).eq('id', row.id)
      return json({ error: 'expired' }, 400)
    }
    if ((row.tentativas ?? 0) >= 5) {
      await admin.from('auth_otp').update({ consumed_at: new Date().toISOString() }).eq('id', row.id)
      return json({ error: 'too_many_attempts' }, 429)
    }

    const expected = await sha256Hex(`${code}:${user.id}:${purpose}`)
    if (expected !== row.code_hash) {
      await admin.from('auth_otp').update({ tentativas: (row.tentativas ?? 0) + 1 }).eq('id', row.id)
      return json({ error: 'invalid_code', attempts_left: Math.max(0, 5 - ((row.tentativas ?? 0) + 1)) }, 400)
    }

    await admin.from('auth_otp').update({ consumed_at: new Date().toISOString() }).eq('id', row.id)
    return json({ ok: true })
  } catch (e: any) {
    console.error('otp-verify error', e)
    return json({ error: 'internal_error', detail: e?.message ?? String(e) }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}