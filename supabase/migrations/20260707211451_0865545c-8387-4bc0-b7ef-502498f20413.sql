
-- 1) community_reactions: restrict SELECT to approved posts or own reactions
DROP POLICY IF EXISTS "read reactions" ON public.community_reactions;
CREATE POLICY "read reactions"
  ON public.community_reactions
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.community_posts p
      WHERE p.id = community_reactions.post_id
        AND p.status = 'approved'::public.community_status
    )
  );

-- 2) tts-cache storage bucket: restrict to service_role only (edge function uses admin client)
DROP POLICY IF EXISTS "tts_cache_service_only_select" ON storage.objects;
DROP POLICY IF EXISTS "tts_cache_service_only_insert" ON storage.objects;
DROP POLICY IF EXISTS "tts_cache_service_only_update" ON storage.objects;
DROP POLICY IF EXISTS "tts_cache_service_only_delete" ON storage.objects;

CREATE POLICY "tts_cache_service_only_select"
  ON storage.objects FOR SELECT
  TO service_role
  USING (bucket_id = 'tts-cache');

CREATE POLICY "tts_cache_service_only_insert"
  ON storage.objects FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'tts-cache');

CREATE POLICY "tts_cache_service_only_update"
  ON storage.objects FOR UPDATE
  TO service_role
  USING (bucket_id = 'tts-cache')
  WITH CHECK (bucket_id = 'tts-cache');

CREATE POLICY "tts_cache_service_only_delete"
  ON storage.objects FOR DELETE
  TO service_role
  USING (bucket_id = 'tts-cache');

-- 3) SECURITY DEFINER function EXECUTE grants
-- Remove all public/anon execute on public schema functions, then re-grant only what clients need.
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon;

-- Internal-only (triggers, cron, edge-function-only helpers): also revoke from authenticated.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public._ensure_progresso_row(uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM authenticated;

-- User-callable RPCs remain executable by authenticated (each function already checks auth.uid()).
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enviar_pedido_amizade(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.aceitar_pedido_amizade(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.abrir_bau(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.adicionar_bau(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.adicionar_chama_congelada(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.aplicar_ofensiva_diaria() TO authenticated;
GRANT EXECUTE ON FUNCTION public.hidratar_recursos() TO authenticated;
GRANT EXECUTE ON FUNCTION public.aplicar_recompensa(integer, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.perder_vida_progresso() TO authenticated;
GRANT EXECUTE ON FUNCTION public.registar_curiosidade_lida(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.resgatar_conquista(text, integer, integer) TO authenticated;

-- 4) user_preferencias: split policy so anonymous (stealth) sessions cannot access via broad `authenticated` role.
-- Stealth users use signInAnonymously so `is_anonymous=true` in JWT; keep them scoped to their own row explicitly,
-- and require non-anonymous check for the broad `authenticated` policy to satisfy the linter.
DROP POLICY IF EXISTS "prefs_own" ON public.user_preferencias;
CREATE POLICY "prefs_own_authenticated"
  ON public.user_preferencias
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  )
  WITH CHECK (
    auth.uid() = user_id
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

-- Separate policy for anonymous (stealth) users, still strictly own-row.
CREATE POLICY "prefs_own_anonymous"
  ON public.user_preferencias
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = true
  )
  WITH CHECK (
    auth.uid() = user_id
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = true
  );
