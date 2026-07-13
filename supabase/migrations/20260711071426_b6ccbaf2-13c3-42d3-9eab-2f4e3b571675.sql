-- Expose only safe public fields of profiles for cross-user reads
-- (community feed, ranking, tribe). RLS on the base table stays strict.
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = off) AS
SELECT id, nome, avatar_url, provincia, pais
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;