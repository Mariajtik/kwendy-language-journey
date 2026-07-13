-- feedback_log for rate-limiting
CREATE TABLE public.feedback_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assunto text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.feedback_log TO authenticated;
GRANT ALL ON public.feedback_log TO service_role;

ALTER TABLE public.feedback_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_feedback_select" ON public.feedback_log
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own_feedback_insert" ON public.feedback_log
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_feedback_log_user_created ON public.feedback_log (user_id, created_at DESC);

-- resgatar_conquista RPC: marca conquista e credita recompensa atomicamente
CREATE OR REPLACE FUNCTION public.resgatar_conquista(_id text, _xp int DEFAULT 0, _diamantes int DEFAULT 0)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _resgatadas jsonb;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF _id IS NULL OR length(_id) = 0 THEN RAISE EXCEPTION 'invalid_id'; END IF;

  -- Assegura row em user_missoes
  INSERT INTO public.user_missoes (user_id) VALUES (_uid) ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.user_missoes
     SET conquistas_resgatadas = CASE
       WHEN conquistas_resgatadas @> to_jsonb(_id) THEN conquistas_resgatadas
       ELSE COALESCE(conquistas_resgatadas, '[]'::jsonb) || to_jsonb(_id)
     END
   WHERE user_id = _uid
  RETURNING conquistas_resgatadas INTO _resgatadas;

  -- Credita recompensa (idempotência garantida pela verificação acima – se já estava, não credita de novo)
  IF _xp > 0 OR _diamantes > 0 THEN
    PERFORM public.aplicar_recompensa(_xp, _diamantes, 0);
  END IF;

  RETURN _resgatadas;
END;
$$;