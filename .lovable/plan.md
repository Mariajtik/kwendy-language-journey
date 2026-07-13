# Plano: Kwendi IA flutuante com Gemini + fallback

## 1. Secret

Guardar `GEMINI_API_KEY` como secret (formulário seguro, disponível às edge functions, nunca no cliente).

## 2. Edge function partilhada: `_shared/gemini.ts`

Novo módulo em `supabase/functions/_shared/gemini.ts` com helper `callGemini({ messages, stream })` que chama a **Interactions API**:

- Endpoint: `POST https://generativelanguage.googleapis.com/v1/interactions`
- Header: `x-goog-api-key: ${GEMINI_API_KEY}`
- Body: `{ model: "gemini-3.5-flash", input: [...], stream }`
- Modo streaming: parse do SSE (`event: step.delta` → `data.delta.text`) e re-emissão como texto puro (mesmo formato que o cliente actual já lê em `kwendi-chat`).
- Modo non-streaming: devolve `interaction.output_text`.

## 3. Fallback automático

Criar helper `callAiWithFallback` em `_shared/ai-fallback.ts`:

1. Tenta Lovable AI Gateway (`ai.gateway.lovable.dev/v1/chat/completions`).
2. Se resposta = **402** (créditos) ou **429** (rate limit) → cai para `callGemini` com o mesmo prompt/messages.
3. Emite header `X-AI-Provider: lovable|gemini` para o cliente saber (opcional log).

Aplicar em edge functions AI já existentes:
- `kwendi-chat` (streaming) — mantém prompt do sistema Kwendi.
- `moderate-post`, `moderate-profile` (non-streaming).

`kwendi-stt` e `kwendi-tts` ficam intocados (Gemini TTS/STT diferente; fora do escopo pedido).

## 4. Nova edge function: `kwendi-ia-beta`

Dedicada ao chat flutuante (beta). **Só Gemini**, streaming, sem exigir Premium (o botão actual `kwendi-chat` exige Premium — o beta flutuante fica aberto a todos os utilizadores autenticados para testes).

Rate-limit simples por `user_id` (ex.: 20 msgs/hora, gravado em tabela `beta_ia_uso`) para proteger a chave Gemini.

## 5. Componente `KwendiIaFloating.tsx`

Botão flutuante persistente no `HomeScreen`:

```text
 ┌────────────────────────┐
 │  Home content          │
 │                        │
 │                    ╭─╮ │
 │                    │K│ │  ← FAB canto inferior-direito
 │                    ╰─╯ │
 └────────────────────────┘
```

- Ícone MessageSquare + badge "BETA" dourado.
- Ao clicar, abre `Sheet` bottom (shadcn) com:
  - Banner amarelo: "🧪 Versão beta — respostas podem ter erros."
  - Lista de mensagens (ReactMarkdown).
  - Input + botão enviar.
  - Fecha por swipe/X.
- Estado local (sem persistência de threads nesta fase).
- Chama `supabase.functions.invoke('kwendi-ia-beta', { body: { messages } })` com streaming via `fetch` directo (invoke não suporta stream) — reutiliza padrão de `KwendiChatScreen` original.

Só aparece se `user` autenticado (não em modo furtivo, para poupar quota).

## 6. Integração

- `HomeScreen.tsx` — importa e renderiza `<KwendiIaFloating />` no fim.
- Nenhum route change; funciona como overlay.

## Detalhes técnicos

**Streaming da Interactions API:** o SSE tem múltiplos tipos de evento. Filtrar apenas `event: step.delta` com `data.delta.type === "text"` e concatenar `data.delta.text`. Ignorar `thought_signature`, `step.start/stop`, `interaction.created/completed`.

**Modelo:** `gemini-3.5-flash` (rápido, barato, adequado a chat + multimodal futuro).

**System prompt:** reutiliza o de `kwendi-chat` — tutor de Umbundu, respostas em PT-eu, breve e caloroso.

**CORS:** todas as novas functions com `corsHeaders` de `npm:@supabase/supabase-js@2/cors`.

**Erros:** 402 Gemini (quota) → mensagem "Kwendi IA temporariamente indisponível"; 429 → "Muitas mensagens, aguarda um momento".

## Ficheiros

**Novos:**
- `supabase/functions/_shared/gemini.ts`
- `supabase/functions/_shared/ai-fallback.ts`
- `supabase/functions/kwendi-ia-beta/index.ts`
- `src/components/KwendiIaFloating.tsx`
- migration: tabela `beta_ia_uso` (user_id, count, window_start) + RLS + GRANT

**Editados:**
- `supabase/functions/kwendi-chat/index.ts` — usar fallback
- `supabase/functions/moderate-post/index.ts` — usar fallback
- `supabase/functions/moderate-profile/index.ts` — usar fallback
- `src/screens/HomeScreen.tsx` — montar FAB
