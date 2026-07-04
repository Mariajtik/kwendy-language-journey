
-- Block anonymous sign-ins from accessing per-user tables
DROP POLICY IF EXISTS "own saldo" ON public.user_saldo;
CREATE POLICY "own saldo" ON public.user_saldo FOR ALL TO authenticated
  USING (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id)
  WITH CHECK (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id);

DROP POLICY IF EXISTS "own inventario" ON public.user_inventario;
CREATE POLICY "own inventario" ON public.user_inventario FOR ALL TO authenticated
  USING (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id)
  WITH CHECK (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id);

DROP POLICY IF EXISTS "own missoes" ON public.user_missoes;
CREATE POLICY "own missoes" ON public.user_missoes FOR ALL TO authenticated
  USING (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id)
  WITH CHECK (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id);

DROP POLICY IF EXISTS "own nivelamento" ON public.user_nivelamento;
CREATE POLICY "own nivelamento" ON public.user_nivelamento FOR ALL TO authenticated
  USING (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id)
  WITH CHECK (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id);

DROP POLICY IF EXISTS "own passaporte" ON public.user_passaporte;
CREATE POLICY "own passaporte" ON public.user_passaporte FOR ALL TO authenticated
  USING (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id)
  WITH CHECK (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id);

DROP POLICY IF EXISTS "own preferencias" ON public.user_preferencias;
CREATE POLICY "own preferencias" ON public.user_preferencias FOR ALL TO authenticated
  USING (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id)
  WITH CHECK (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id);

DROP POLICY IF EXISTS "own threads" ON public.chat_threads;
CREATE POLICY "own threads" ON public.chat_threads FOR ALL TO authenticated
  USING (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id)
  WITH CHECK (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id);

DROP POLICY IF EXISTS "own mensagens" ON public.chat_mensagens;
CREATE POLICY "own mensagens" ON public.chat_mensagens FOR ALL TO authenticated
  USING (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id)
  WITH CHECK (COALESCE((auth.jwt()->>'is_anonymous')::boolean, false) = false AND auth.uid() = user_id);
