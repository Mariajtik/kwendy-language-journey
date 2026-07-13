
-- lesson_events table
CREATE TABLE IF NOT EXISTS public.lesson_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  finished_at timestamptz NOT NULL DEFAULT now(),
  duracao_seg integer NOT NULL DEFAULT 0,
  xp_ganho integer NOT NULL DEFAULT 0,
  acertos integer NOT NULL DEFAULT 0,
  erros integer NOT NULL DEFAULT 0,
  licao_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_events TO authenticated;
GRANT ALL ON public.lesson_events TO service_role;

ALTER TABLE public.lesson_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lesson_events_own_select" ON public.lesson_events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "lesson_events_own_insert" ON public.lesson_events
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lesson_events_own_delete" ON public.lesson_events
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS lesson_events_user_finished_idx
  ON public.lesson_events (user_id, finished_at DESC);

-- idioma_app column
ALTER TABLE public.user_preferencias
  ADD COLUMN IF NOT EXISTS idioma_app text NOT NULL DEFAULT 'pt-AO';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_preferencias_idioma_app_check'
  ) THEN
    ALTER TABLE public.user_preferencias
      ADD CONSTRAINT user_preferencias_idioma_app_check
      CHECK (idioma_app IN ('pt-AO','en','fr'));
  END IF;
END $$;
