
-- === user_saldo ===
CREATE TABLE public.user_saldo (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xp integer NOT NULL DEFAULT 0,
  diamantes integer NOT NULL DEFAULT 1000,
  vidas integer NOT NULL DEFAULT 5,
  vidas_extra integer NOT NULL DEFAULT 0,
  fragmentos integer NOT NULL DEFAULT 0,
  ofensiva integer NOT NULL DEFAULT 3,
  ultimo_dia_ativo text NOT NULL DEFAULT '',
  curiosidades_lidas text[] NOT NULL DEFAULT '{}',
  baus jsonb NOT NULL DEFAULT '{"comum":0,"raro":0,"lendario":0}'::jsonb,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_saldo TO authenticated;
GRANT ALL ON public.user_saldo TO service_role;
ALTER TABLE public.user_saldo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own saldo" ON public.user_saldo FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_user_saldo_upd BEFORE UPDATE ON public.user_saldo
  FOR EACH ROW EXECUTE FUNCTION public.update_atualizado_em();

-- === user_inventario ===
CREATE TABLE public.user_inventario (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  power_ups jsonb NOT NULL DEFAULT '[]'::jsonb,
  desbloqueios text[] NOT NULL DEFAULT '{}',
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_inventario TO authenticated;
GRANT ALL ON public.user_inventario TO service_role;
ALTER TABLE public.user_inventario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own inventario" ON public.user_inventario FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_user_inventario_upd BEFORE UPDATE ON public.user_inventario
  FOR EACH ROW EXECUTE FUNCTION public.update_atualizado_em();

-- === user_missoes ===
CREATE TABLE public.user_missoes (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  missoes jsonb NOT NULL DEFAULT '{}'::jsonb,
  conquistas jsonb NOT NULL DEFAULT '{}'::jsonb,
  ultimo_reset jsonb NOT NULL DEFAULT '{"diaria":"","semanal":""}'::jsonb,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_missoes TO authenticated;
GRANT ALL ON public.user_missoes TO service_role;
ALTER TABLE public.user_missoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own missoes" ON public.user_missoes FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_user_missoes_upd BEFORE UPDATE ON public.user_missoes
  FOR EACH ROW EXECUTE FUNCTION public.update_atualizado_em();

-- === user_passaporte ===
CREATE TABLE public.user_passaporte (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  estado jsonb NOT NULL DEFAULT '{}'::jsonb,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_passaporte TO authenticated;
GRANT ALL ON public.user_passaporte TO service_role;
ALTER TABLE public.user_passaporte ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own passaporte" ON public.user_passaporte FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_user_passaporte_upd BEFORE UPDATE ON public.user_passaporte
  FOR EACH ROW EXECUTE FUNCTION public.update_atualizado_em();

-- === user_nivelamento ===
CREATE TABLE public.user_nivelamento (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  fez boolean NOT NULL DEFAULT false,
  ancao boolean NOT NULL DEFAULT false,
  percentagem integer NOT NULL DEFAULT 0,
  acertos integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  unidade_sugerida text,
  todos_desbloqueados boolean NOT NULL DEFAULT false,
  popup_pendente text,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_nivelamento TO authenticated;
GRANT ALL ON public.user_nivelamento TO service_role;
ALTER TABLE public.user_nivelamento ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own nivelamento" ON public.user_nivelamento FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_user_nivelamento_upd BEFORE UPDATE ON public.user_nivelamento
  FOR EACH ROW EXECUTE FUNCTION public.update_atualizado_em();

-- === user_preferencias ===
CREATE TABLE public.user_preferencias (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  notificacoes jsonb NOT NULL DEFAULT '{}'::jsonb,
  acessibilidade jsonb NOT NULL DEFAULT '{}'::jsonb,
  flags jsonb NOT NULL DEFAULT '{}'::jsonb,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_preferencias TO authenticated;
GRANT ALL ON public.user_preferencias TO service_role;
ALTER TABLE public.user_preferencias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own preferencias" ON public.user_preferencias FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_user_preferencias_upd BEFORE UPDATE ON public.user_preferencias
  FOR EACH ROW EXECUTE FUNCTION public.update_atualizado_em();

-- === chat_threads ===
CREATE TABLE public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo text NOT NULL DEFAULT 'Nova conversa',
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_chat_threads_user ON public.chat_threads(user_id, atualizado_em DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own threads" ON public.chat_threads FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_chat_threads_upd BEFORE UPDATE ON public.chat_threads
  FOR EACH ROW EXECUTE FUNCTION public.update_atualizado_em();

-- === chat_mensagens ===
CREATE TABLE public.chat_mensagens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  parts jsonb NOT NULL DEFAULT '[]'::jsonb,
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_chat_mensagens_thread ON public.chat_mensagens(thread_id, criado_em);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_mensagens TO authenticated;
GRANT ALL ON public.chat_mensagens TO service_role;
ALTER TABLE public.chat_mensagens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own mensagens" ON public.chat_mensagens FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- === Ajustes profiles / progresso ===
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stealth_avisado_em timestamptz;
ALTER TABLE public.progresso ADD COLUMN IF NOT EXISTS premium_expira_em timestamptz;
ALTER TABLE public.progresso ADD COLUMN IF NOT EXISTS ads_off boolean NOT NULL DEFAULT false;

-- === Trigger handle_new_user: criar linhas nas novas tabelas ===
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (
    id, email, nome, provincia, pais, motivacao, fonte_kwendi, chokwe,
    objetivo_diario, nivel_declarado, tipo, stealth_expira_em
  ) values (
    new.id, new.email,
    coalesce(m->>'nome', split_part(new.email, '@', 1)),
    m->>'provincia', m->>'pais', m->>'motivacao', m->>'fonte_kwendi', m->>'chokwe',
    m->>'objetivo_diario', m->>'nivel_declarado',
    coalesce(m->>'tipo', 'signup'),
    case when (m->>'stealth_expira_em') is not null
         then least((m->>'stealth_expira_em')::timestamptz, now() + interval '7 days')
         else null end
  ) on conflict (id) do nothing;

  insert into public.progresso (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.user_saldo (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.user_inventario (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.user_missoes (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.user_passaporte (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.user_nivelamento (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.user_preferencias (user_id) values (new.id) on conflict (user_id) do nothing;

  return new;
end;
$function$;

-- Garantir trigger existente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Preencher retroativamente para utilizadores já existentes
INSERT INTO public.user_saldo (user_id)       SELECT id FROM auth.users ON CONFLICT DO NOTHING;
INSERT INTO public.user_inventario (user_id)  SELECT id FROM auth.users ON CONFLICT DO NOTHING;
INSERT INTO public.user_missoes (user_id)     SELECT id FROM auth.users ON CONFLICT DO NOTHING;
INSERT INTO public.user_passaporte (user_id)  SELECT id FROM auth.users ON CONFLICT DO NOTHING;
INSERT INTO public.user_nivelamento (user_id) SELECT id FROM auth.users ON CONFLICT DO NOTHING;
INSERT INTO public.user_preferencias (user_id) SELECT id FROM auth.users ON CONFLICT DO NOTHING;
