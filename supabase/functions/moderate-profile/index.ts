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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

type ModerationResult = { allowed: boolean; reason?: string };

async function callGemini(messages: unknown[]): Promise<ModerationResult> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": LOVABLE_API_KEY!,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Response(text, { status: res.status });
  }

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content ?? "{}";
  try {
    const parsed = JSON.parse(raw);
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
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { username, imageBase64, imageMime } = await req.json();

    // Moderate username first if provided
    if (typeof username === "string" && username.trim().length > 0) {
      const result = await callGemini([
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

      const result = await callGemini([
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