
-- Block GraphQL access for anon/authenticated (app uses REST only)
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT p.oid::regprocedure AS sig
           FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
           WHERE n.nspname = 'graphql' AND p.proname = 'resolve'
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon, authenticated, PUBLIC', r.sig);
  END LOOP;
END $$;

REVOKE USAGE ON SCHEMA graphql FROM anon, authenticated, PUBLIC;
REVOKE USAGE ON SCHEMA graphql_public FROM anon, authenticated, PUBLIC;

-- No policy permits anon access; revoke base SELECT so tables aren't discoverable pre-auth.
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.progresso FROM anon;
REVOKE SELECT ON public.sessoes FROM anon;
REVOKE SELECT ON public.eventos FROM anon;
REVOKE SELECT ON public.user_roles FROM anon;
