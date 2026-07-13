-- Recreate public_ranking to exclude admins and grant SELECT to app users.
DROP VIEW IF EXISTS public.public_ranking;

CREATE VIEW public.public_ranking
WITH (security_invoker = off) AS
SELECT
  p.user_id,
  pr.nome,
  pr.avatar_url,
  p.xp,
  p.ofensiva
FROM public.progresso p
JOIN public.profiles pr ON pr.id = p.user_id
WHERE pr.tipo = 'signup'::public.profile_tipo
  AND NOT public.has_role(p.user_id, 'admin'::public.app_role)
ORDER BY p.xp DESC
LIMIT 100;

GRANT SELECT ON public.public_ranking TO authenticated, anon;

-- Helper: count followers / following (accepted friendships) for any user.
CREATE OR REPLACE FUNCTION public.contar_amizades(_uid uuid)
RETURNS TABLE(seguidores int, seguindo int)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*)::int FROM public.friendships
       WHERE addressee_id = _uid AND status = 'accepted'),
    (SELECT count(*)::int FROM public.friendships
       WHERE requester_id = _uid AND status = 'accepted');
$$;

-- Helper: list accepted friends of a user (both directions) with public profile info.
CREATE OR REPLACE FUNCTION public.listar_amigos(_uid uuid)
RETURNS TABLE(id uuid, nome text, avatar_url text, xp int)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT pr.id, pr.nome, pr.avatar_url, COALESCE(pg.xp, 0)::int
  FROM public.friendships f
  JOIN public.profiles pr
    ON pr.id = CASE WHEN f.requester_id = _uid THEN f.addressee_id ELSE f.requester_id END
  LEFT JOIN public.progresso pg ON pg.user_id = pr.id
  WHERE (f.requester_id = _uid OR f.addressee_id = _uid)
    AND f.status = 'accepted';
$$;