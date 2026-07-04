-- Fase 1.5: Permitir gestão de dispositivos de confiança pelo próprio utilizador
CREATE POLICY user_devices_insert_own ON public.user_devices
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_devices_update_own ON public.user_devices
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_devices_delete_own ON public.user_devices
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Fase 2: Progresso, saldo, inventário, missões, nivelamento, passaporte, preferências
CREATE TABLE public.progresso (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xp integer NOT NULL DEFAULT 0,
  diamantes integer NOT NULL DEFAULT 0,
  vidas integer NOT NULL DEFAULT 5,
  ofensiva integer NOT NULL DEFAULT 0,
  ofensiva_ultimo_dia date,
  secoes_completas jsonb NOT NULL DEFAULT '[]'::jsonb,
  unidade_atual integer NOT NULL DEFAULT 1,
  premium boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progresso TO authenticated;
GRANT ALL ON public.progresso TO service_role;
ALTER TABLE public.progresso ENABLE ROW LEVEL SECURITY;
CREATE POLICY progresso_own ON public.progresso FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER progresso_set_updated_at BEFORE UPDATE ON public.progresso
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_inventario (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  itens jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_inventario TO authenticated;
GRANT ALL ON public.user_inventario TO service_role;
ALTER TABLE public.user_inventario ENABLE ROW LEVEL SECURITY;
CREATE POLICY inv_own ON public.user_inventario FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER inv_set_updated_at BEFORE UPDATE ON public.user_inventario
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_missoes (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  diarias jsonb NOT NULL DEFAULT '[]'::jsonb,
  semanais jsonb NOT NULL DEFAULT '[]'::jsonb,
  conquistas jsonb NOT NULL DEFAULT '[]'::jsonb,
  reset_diario_em date,
  reset_semanal_em date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_missoes TO authenticated;
GRANT ALL ON public.user_missoes TO service_role;
ALTER TABLE public.user_missoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY missoes_own ON public.user_missoes FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER missoes_set_updated_at BEFORE UPDATE ON public.user_missoes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_nivelamento (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  feito boolean NOT NULL DEFAULT false,
  ancião text,
  percentagem integer NOT NULL DEFAULT 0,
  unidade_sugerida integer,
  respostas jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_nivelamento TO authenticated;
GRANT ALL ON public.user_nivelamento TO service_role;
ALTER TABLE public.user_nivelamento ENABLE ROW LEVEL SECURITY;
CREATE POLICY nivelamento_own ON public.user_nivelamento FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER nivelamento_set_updated_at BEFORE UPDATE ON public.user_nivelamento
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_passaporte (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  provincias_visitadas jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_passaporte TO authenticated;
GRANT ALL ON public.user_passaporte TO service_role;
ALTER TABLE public.user_passaporte ENABLE ROW LEVEL SECURITY;
CREATE POLICY passaporte_own ON public.user_passaporte FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER passaporte_set_updated_at BEFORE UPDATE ON public.user_passaporte
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_preferencias (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  som boolean NOT NULL DEFAULT true,
  musica boolean NOT NULL DEFAULT true,
  vibracao boolean NOT NULL DEFAULT true,
  notificacoes boolean NOT NULL DEFAULT true,
  tema text NOT NULL DEFAULT 'light',
  fonte text NOT NULL DEFAULT 'default',
  reduzir_movimento boolean NOT NULL DEFAULT false,
  alto_contraste boolean NOT NULL DEFAULT false,
  extras jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_preferencias TO authenticated;
GRANT ALL ON public.user_preferencias TO service_role;
ALTER TABLE public.user_preferencias ENABLE ROW LEVEL SECURITY;
CREATE POLICY prefs_own ON public.user_preferencias FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER prefs_set_updated_at BEFORE UPDATE ON public.user_preferencias
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Estender handle_new_user para inicializar linhas de progresso etc.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  is_anon boolean := COALESCE(NEW.is_anonymous, false);
BEGIN
  INSERT INTO public.profiles (id, email, nome, tipo, stealth_expira_em)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'nome',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(COALESCE(NEW.email, ''), '@', 1)
    ),
    CASE WHEN is_anon THEN 'stealth'::public.profile_tipo ELSE 'signup'::public.profile_tipo END,
    CASE WHEN is_anon THEN now() + interval '7 days' ELSE NULL END
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  INSERT INTO public.progresso (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_inventario (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_missoes (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_nivelamento (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_passaporte (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_preferencias (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END; $$;

-- Certificar-se que o trigger existe em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();