ALTER TABLE public.user_nivelamento
  ADD COLUMN IF NOT EXISTS cefr text,
  ADD COLUMN IF NOT EXISTS pontos_fortes jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS pontos_fracos jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS trilha_sugerida jsonb NOT NULL DEFAULT '[]'::jsonb;