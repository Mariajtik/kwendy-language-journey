
-- 1) Replace SECURITY DEFINER view with a controlled function
DROP VIEW IF EXISTS public.public_ranking;

CREATE OR REPLACE FUNCTION public.listar_ranking(_limit int DEFAULT 100)
RETURNS TABLE(user_id uuid, nome text, avatar_url text, xp int, ofensiva int)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id, pr.nome, pr.avatar_url, p.xp, p.ofensiva
  FROM public.progresso p
  JOIN public.profiles pr ON pr.id = p.user_id
  WHERE pr.tipo = 'signup'::public.profile_tipo
    AND NOT public.has_role(p.user_id, 'admin'::public.app_role)
  ORDER BY p.xp DESC
  LIMIT GREATEST(1, LEAST(COALESCE(_limit, 100), 200));
$$;

REVOKE ALL ON FUNCTION public.listar_ranking(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.listar_ranking(int) TO authenticated;

-- 2) Revoke anonymous EXECUTE on SECURITY DEFINER helpers
REVOKE EXECUTE ON FUNCTION public.listar_amigos(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.contar_amizades(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_public_profiles(uuid[]) FROM anon, PUBLIC;

GRANT EXECUTE ON FUNCTION public.listar_amigos(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.contar_amizades(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profiles(uuid[]) TO authenticated;
