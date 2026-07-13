// deno-lint-ignore-file no-explicit-any
/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { ReauthenticationEmail } from '../_shared/email-templates/reauthentication.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const VALID_PURPOSES = ['login', 'password_change', 'email_change', 'account_delete'] as const
type Purpose = typeof VALID_PURPOSES[number]

const SUBJECTS: Record<Purpose, string> = {
  login: 'Kwendi — código de verificação',
  password_change: 'Kwendi — confirma a mudança de senha',
  email_change: 'Kwendi — confirma o novo e-mail',
  account_delete: 'Kwendi — confirma a eliminação da conta',
}

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function generateCode(): string {
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  return String(100000 + (arr[0] % 900000))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    if (!authHeader.startsWith('Bearer ')) {
      return json({ error: 'missing_auth' }, 401)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    // Identify user from JWT
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: userData, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userData.user) return json({ error: 'invalid_session' }, 401)
    const user = userData.user
    if (!user.email) return json({ error: 'no_email' }, 400)

    const body = await req.json().catch(() => ({}))
    const purpose = body.purpose as Purpose
    if (!VALID_PURPOSES.includes(purpose)) return json({ error: 'invalid_purpose' }, 400)

    const admin = createClient(supabaseUrl, serviceKey)

    // Rate-limit: max 3 active codes in last 10 min per (user, purpose)
    const since = new Date(Date.now() - 10 * 60_000).toISOString()
    const { count: recentCount } = await admin
      .from('auth_otp')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('purpose', purpose)
      .gte('created_at', since)
    if ((recentCount ?? 0) >= 5) return json({ error: 'rate_limited' }, 429)

    // Invalidate previous unconsumed codes
    await admin
      .from('auth_otp')
      .update({ consumed_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('purpose', purpose)
      .is('consumed_at', null)

    const code = generateCode()
    const codeHash = await sha256Hex(`${code}:${user.id}:${purpose}`)
    const expiresAt = new Date(Date.now() + 10 * 60_000).toISOString()

    const { error: insErr } = await admin.from('auth_otp').insert({
      user_id: user.id,
      purpose,
      code_hash: codeHash,
      expires_at: expiresAt,
      tentativas: 0,
    })
    if (insErr) return json({ error: 'db_error', detail: insErr.message }, 500)

    // Render Kwendi-branded email and send directly via Gmail connector
    const html = await renderAsync(React.createElement(ReauthenticationEmail, { token: code }))
    const text = await renderAsync(React.createElement(ReauthenticationEmail, { token: code }), {
      plainText: true,
    })

    const messageId = crypto.randomUUID()
    await admin.from('email_send_log').insert({
      message_id: messageId,
      template_name: 'reauthentication',
      recipient_email: user.email,
      status: 'pending',
    })

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
    const gmailApiKey = Deno.env.get('GOOGLE_MAIL_API_KEY')
    if (!lovableApiKey || !gmailApiKey) {
      await admin.from('email_send_log').insert({
        message_id: messageId,
        template_name: 'reauthentication',
        recipient_email: user.email,
        status: 'failed',
        error_message: 'gmail_connector_missing',
      })
      return json({ error: 'gmail_connector_missing' }, 500)
    }

    const rawMime = buildMime({
      to: user.email,
      subject: SUBJECTS[purpose],
      html,
      text,
    })
    const rawB64 = base64UrlEncode(rawMime)

    const gmailRes = await fetch(
      'https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'X-Connection-Api-Key': gmailApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: rawB64 }),
      },
    )
    if (!gmailRes.ok) {
      const detail = await gmailRes.text().catch(() => '')
      await admin.from('email_send_log').insert({
        message_id: messageId,
        template_name: 'reauthentication',
        recipient_email: user.email,
        status: 'failed',
        error_message: `gmail_${gmailRes.status}: ${detail.slice(0, 400)}`,
      })
      return json({ error: 'gmail_send_failed', status: gmailRes.status, detail }, 502)
    }

    await admin.from('email_send_log').insert({
      message_id: messageId,
      template_name: 'reauthentication',
      recipient_email: user.email,
      status: 'sent',
    })

    return json({ ok: true, expires_at: expiresAt })
  } catch (e: any) {
    console.error('otp-issue error', e)
    return json({ error: 'internal_error', detail: e?.message ?? String(e) }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function buildMime({ to, subject, html, text }: { to: string; subject: string; html: string; text: string }): string {
  const boundary = `kwendi_${crypto.randomUUID().replace(/-/g, '')}`
  const encodedSubject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`
  return [
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    btoa(unescape(encodeURIComponent(text))),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    btoa(unescape(encodeURIComponent(html))),
    `--${boundary}--`,
    '',
  ].join('\r\n')
}