/**
 * moderate-profile
 * ----------------
 * Moderates a stealth-mode temporary profile (username and/or avatar image)
 * using Lovable AI Gateway (Gemini multimodal). Returns whether the content
 * is allowed and a friendly reason if not.
 *
 * Request body: { username?: string, imageBase64?: string (data URL or raw base64), imageMime?: string }
 * Response: { allowed: boolean, reason?: string, field?: "username" | "photo" }
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import { chatWithFallback } from "../_shared/ai-fallback.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/** Hard limits to prevent cost abuse. */
const MAX_USERNAME_LEN = 60;
const MAX_IMAGE_BASE64_BYTES = 2 * 1024 * 1024; // ~2 MB of base64 payload

type ModerationResult = { allowed: boolean; reason?: string };

async function callModerator(messages: any[]): Promise<ModerationResult> {
  // Nota: se houver imagem, precisamos manter o formato multimodal para o Lovable.
  // O fallback texto-só (Gemini Interactions) só é atingido em 402/429; nesse
  // caso a moderação de imagem degrada para "allowed" para não bloquear o app.
  const hasImage = messages.some((m) => Array.isArray(m?.content));
  const { text: raw, provider } = await chatWithFallback(
    hasImage
      ? messages
      : messages.map((m) => ({ role: m.role, content: typeof m.content === "string" ? m.content : JSON.stringify(m.content) })),
    { jsonMode: true },
  );
  if (hasImage && provider === "gemini") {
    // Fallback não suporta imagem: permite passar (moderação degradada).
    return { allowed: true };
  }
  try {
    const parsed = JSON.parse((raw || "{}").replace(/```json|```/g, "").trim());
    return {
      allowed: Boolean(parsed.allowed),
      reason: typeof parsed.reason === "string" ? parsed.reason : undefined,
    };
  } catch {
    return { allowed: false, reason: "Não foi possível validar o conteúdo." };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Require a valid Supabase JWT to prevent unauthenticated cost abuse.
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supa = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userError } = await supa.auth.getUser();
    if (userError || !userData?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { username, imageBase64, imageMime } = await req.json();

    // Enforce input size limits before touching the AI gateway.
    if (typeof username === "string" && username.length > MAX_USERNAME_LEN) {
      return new Response(
        JSON.stringify({ allowed: false, field: "username", reason: "Nome demasiado longo." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (typeof imageBase64 === "string" && imageBase64.length > MAX_IMAGE_BASE64_BYTES) {
      return new Response(
        JSON.stringify({ allowed: false, field: "photo", reason: "Imagem excede o limite de 2 MB." }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Moderate username first if provided
    if (typeof username === "string" && username.trim().length > 0) {
      const result = await callModerator([
        {
          role: "system",
          content:
            'You are a content moderator for a language-learning app called Kwendi. Decide if a username is offensive in ANY language (profanity, slurs, hate, sexual content, harassment, glorification of violence). Respond ONLY with strict JSON: {"allowed": boolean, "reason": string}. The reason must be in Brazilian Portuguese, short (max 25 words), and explain politely that the Kwendi team considered it offensive against community policy. If allowed, reason can be an empty string.',
        },
        { role: "user", content: `Username: "${username}"` },
      ]);
      if (!result.allowed) {
        return new Response(
          JSON.stringify({ allowed: false, field: "username", reason: result.reason || "A equipa Kwendi considerou este nome ofensivo segundo a política da comunidade." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // Moderate image if provided
    if (typeof imageBase64 === "string" && imageBase64.length > 0) {
      const dataUrl = imageBase64.startsWith("data:")
        ? imageBase64
        : `data:${imageMime || "image/jpeg"};base64,${imageBase64}`;

      const result = await callModerator([
        {
          role: "system",
          content:
            'You are a content moderator for the Kwendi app. Decide if an uploaded profile photo is offensive (nudity, sexual, violence, hate symbols, slurs/profanity written in the image in ANY language, harassment). Respond ONLY with strict JSON: {"allowed": boolean, "reason": string}. The reason must be in Brazilian Portuguese, short (max 25 words), and explain politely that the Kwendi team considered the image offensive according to community policy. If allowed, reason can be an empty string.',
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Avalie esta foto de perfil." },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ]);
      if (!result.allowed) {
        return new Response(
          JSON.stringify({ allowed: false, field: "photo", reason: result.reason || "A equipa Kwendi considerou esta imagem ofensiva segundo a política da comunidade." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    return new Response(JSON.stringify({ allowed: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof Response) {
      const body = await err.text();
      return new Response(JSON.stringify({ error: body, status: err.status }), {
        status: err.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});