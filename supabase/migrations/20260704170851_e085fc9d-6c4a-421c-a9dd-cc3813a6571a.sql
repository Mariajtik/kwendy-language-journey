
-- Revoke anon on Iter2 fns
REVOKE EXECUTE ON FUNCTION public.aplicar_recompensa(int,int,int) FROM anon;
REVOKE EXECUTE ON FUNCTION public.registar_curiosidade_lida(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.abrir_bau(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.adicionar_bau(text,int) FROM anon;

-- ENUMS
DO $$ BEGIN
  CREATE TYPE public.community_status AS ENUM ('pending','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.friendship_status AS ENUM ('pending','accepted','blocked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- POSTS
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lang text NOT NULL CHECK (lang IN ('pt','en','fr')),
  text text NOT NULL CHECK (length(text) BETWEEN 1 AND 500),
  image_url text,
  status public.community_status NOT NULL DEFAULT 'pending',
  moderation_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS community_posts_lang_status_idx ON public.community_posts(lang, status, created_at DESC);
CREATE INDEX IF NOT EXISTS community_posts_user_idx ON public.community_posts(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read approved or own" ON public.community_posts FOR SELECT TO authenticated
  USING (status = 'approved' OR user_id = auth.uid());
CREATE POLICY "insert own pending" ON public.community_posts FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "update own" ON public.community_posts FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete own" ON public.community_posts FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE TRIGGER community_posts_updated
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- REACTIONS
CREATE TABLE IF NOT EXISTS public.community_reactions (
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction text NOT NULL CHECK (reaction IN ('malaik','mambo','concordo','discordo','erreh')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_reactions TO authenticated;
GRANT ALL ON public.community_reactions TO service_role;

ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read reactions" ON public.community_reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert own reaction" ON public.community_reactions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "update own reaction" ON public.community_reactions FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete own reaction" ON public.community_reactions FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- COMMENTS
CREATE TABLE IF NOT EXISTS public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text text NOT NULL CHECK (length(text) BETWEEN 1 AND 400),
  status public.community_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS community_comments_post_idx ON public.community_comments(post_id, created_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_comments TO authenticated;
GRANT ALL ON public.community_comments TO service_role;

ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read approved comments or own" ON public.community_comments FOR SELECT TO authenticated
  USING (status = 'approved' OR user_id = auth.uid());
CREATE POLICY "insert own comment" ON public.community_comments FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "delete own comment" ON public.community_comments FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- FRIENDSHIPS
CREATE TABLE IF NOT EXISTS public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.friendship_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (requester_id, addressee_id),
  CHECK (requester_id <> addressee_id)
);
CREATE INDEX IF NOT EXISTS friendships_addressee_idx ON public.friendships(addressee_id, status);
CREATE INDEX IF NOT EXISTS friendships_requester_idx ON public.friendships(requester_id, status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.friendships TO authenticated;
GRANT ALL ON public.friendships TO service_role;

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "see own friendships" ON public.friendships FOR SELECT TO authenticated
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());
CREATE POLICY "create request" ON public.friendships FOR INSERT TO authenticated
  WITH CHECK (requester_id = auth.uid());
CREATE POLICY "update if involved" ON public.friendships FOR UPDATE TO authenticated
  USING (requester_id = auth.uid() OR addressee_id = auth.uid())
  WITH CHECK (requester_id = auth.uid() OR addressee_id = auth.uid());
CREATE POLICY "delete own request" ON public.friendships FOR DELETE TO authenticated
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());

CREATE TRIGGER friendships_updated
  BEFORE UPDATE ON public.friendships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Public views (security_invoker to respect RLS but expose only safe cols)
CREATE OR REPLACE VIEW public.public_ranking WITH (security_invoker = on) AS
SELECT
  p.user_id,
  pr.nome,
  pr.avatar_url,
  p.xp,
  p.ofensiva
FROM public.progresso p
JOIN public.profiles pr ON pr.id = p.user_id
WHERE pr.tipo = 'signup'
ORDER BY p.xp DESC
LIMIT 50;

GRANT SELECT ON public.public_ranking TO authenticated, anon;

CREATE OR REPLACE VIEW public.public_streaks WITH (security_invoker = on) AS
SELECT
  p.user_id,
  pr.nome,
  pr.avatar_url,
  p.ofensiva,
  p.ofensiva_hoje,
  p.chamas_congeladas
FROM public.progresso p
JOIN public.profiles pr ON pr.id = p.user_id;

GRANT SELECT ON public.public_streaks TO authenticated;

-- Friend helpers
CREATE OR REPLACE FUNCTION public.enviar_pedido_amizade(_alvo uuid)
RETURNS public.friendships
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _uid uuid := auth.uid(); _row public.friendships%ROWTYPE;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF _alvo IS NULL OR _alvo = _uid THEN RAISE EXCEPTION 'invalid_target'; END IF;
  INSERT INTO public.friendships (requester_id, addressee_id, status)
  VALUES (_uid, _alvo, 'pending')
  ON CONFLICT (requester_id, addressee_id) DO UPDATE SET status = EXCLUDED.status
  RETURNING * INTO _row;
  RETURN _row;
END;
$$;

CREATE OR REPLACE FUNCTION public.aceitar_pedido_amizade(_id uuid)
RETURNS public.friendships
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _uid uuid := auth.uid(); _row public.friendships%ROWTYPE;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  UPDATE public.friendships SET status = 'accepted'
    WHERE id = _id AND addressee_id = _uid AND status = 'pending'
  RETURNING * INTO _row;
  IF NOT FOUND THEN RAISE EXCEPTION 'not_found_or_not_addressee'; END IF;
  RETURN _row;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enviar_pedido_amizade(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.aceitar_pedido_amizade(uuid) FROM anon;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_comments;
