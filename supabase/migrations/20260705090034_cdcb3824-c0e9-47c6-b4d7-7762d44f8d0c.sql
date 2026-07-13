CREATE TABLE public.tts_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  chars int NOT NULL
);
GRANT SELECT, INSERT ON public.tts_log TO authenticated;
GRANT ALL ON public.tts_log TO service_role;
ALTER TABLE public.tts_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own tts log select" ON public.tts_log FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own tts log insert" ON public.tts_log FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE INDEX tts_log_user_time_idx ON public.tts_log(user_id, created_at DESC);

ALTER TABLE public.user_preferencias ADD COLUMN IF NOT EXISTS voz_chat_ligada boolean NOT NULL DEFAULT true;