
-- 1) Clamp stealth_expira_em to at most 7 days from now in the signup trigger
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
  )
  values (
    new.id,
    new.email,
    coalesce(m->>'nome', split_part(new.email, '@', 1)),
    m->>'provincia',
    m->>'pais',
    m->>'motivacao',
    m->>'fonte_kwendi',
    m->>'chokwe',
    m->>'objetivo_diario',
    m->>'nivel_declarado',
    coalesce(m->>'tipo', 'signup'),
    case when (m->>'stealth_expira_em') is not null
         then least(
           (m->>'stealth_expira_em')::timestamptz,
           now() + interval '7 days'
         )
         else null end
  )
  on conflict (id) do nothing;

  insert into public.progresso (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$function$;

-- 2) Exclude anonymous auth sessions from reading user_roles
DROP POLICY IF EXISTS "user_roles self select" ON public.user_roles;
CREATE POLICY "user_roles self select"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
);
