
-- has_role → SECURITY INVOKER (queries public.user_roles; RLS lets each user see their own rows)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- admin_overview → SECURITY INVOKER (checks has_role; RLS grants admins read access to all rows)
CREATE OR REPLACE FUNCTION public.admin_overview()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
declare
  is_admin boolean := public.has_role(auth.uid(), 'admin');
  result jsonb;
begin
  if not is_admin then
    raise exception 'forbidden';
  end if;

  with base as (
    select p.*, pr.premium
      from public.profiles p
      left join public.progresso pr on pr.user_id = p.id
  ),
  cadastrados as (select count(*)::int as n from base where tipo = 'signup'),
  stealth as (select count(*)::int as n from base where tipo = 'stealth'),
  stealth_ativos as (
    select count(*)::int as n from base
     where tipo = 'stealth' and stealth_expira_em > now()
  ),
  stealth_24h as (
    select count(*)::int as n from base
     where tipo = 'stealth'
       and stealth_expira_em > now()
       and stealth_expira_em <= now() + interval '24 hours'
  ),
  premium_ativos as (select count(*)::int as n from base where premium = true),
  ativos_hoje as (
    select count(distinct user_id)::int as n
      from public.sessoes
     where iniciada_em::date = current_date
  ),
  por_regiao as (
    select coalesce(provincia, pais) as regiao, count(*)::int as total
      from base
     where coalesce(provincia, pais) is not null
     group by coalesce(provincia, pais)
     order by total desc
  ),
  por_pais as (
    select pais, count(*)::int as total from base
     where pais is not null
     group by pais order by total desc
  ),
  por_motivacao as (
    select motivacao as motivo, count(*)::int as total from base
     where motivacao is not null
     group by motivacao order by total desc
  ),
  por_tipo as (
    select case when tipo='signup' then 'Cadastrados' else 'Modo furtivo' end as tipo,
           count(*)::int as total
      from base group by tipo
  ),
  novos_por_dia as (
    select to_char(d, 'YYYY-MM-DD') as dia,
           coalesce((select count(*)::int from base b where b.criado_em::date = d.d::date), 0) as total
      from generate_series((current_date - interval '29 days')::date, current_date, interval '1 day') as d(d)
     order by dia
  )
  select jsonb_build_object(
    'totalCadastrados', (select n from cadastrados),
    'totalStealth', (select n from stealth),
    'stealthAtivosAgora', (select n from stealth_ativos),
    'stealthExpirandoEm24h', (select n from stealth_24h),
    'premiumAtivos', (select n from premium_ativos),
    'ativosHoje', (select n from ativos_hoje),
    'porRegiao', coalesce((select jsonb_agg(jsonb_build_object('regiao', regiao, 'total', total)) from por_regiao), '[]'::jsonb),
    'porPais', coalesce((select jsonb_agg(jsonb_build_object('pais', pais, 'total', total)) from por_pais), '[]'::jsonb),
    'porMotivacao', coalesce((select jsonb_agg(jsonb_build_object('motivo', motivo, 'total', total)) from por_motivacao), '[]'::jsonb),
    'porTipo', coalesce((select jsonb_agg(jsonb_build_object('tipo', tipo, 'total', total)) from por_tipo), '[]'::jsonb),
    'novosPorDia', coalesce((select jsonb_agg(jsonb_build_object('dia', dia, 'total', total)) from novos_por_dia), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

-- admin_sessions_stats → SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.admin_sessions_stats()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
declare
  is_admin boolean := public.has_role(auth.uid(), 'admin');
  result jsonb;
begin
  if not is_admin then raise exception 'forbidden'; end if;

  with s as (
    select *, greatest(0, extract(epoch from (coalesce(terminada_em, iniciada_em) - iniciada_em)) * 1000)::bigint as dur_ms
      from public.sessoes
  ),
  totals as (
    select count(*)::int as total,
           coalesce(sum(dur_ms), 0)::bigint as tempo_total,
           coalesce(avg(dur_ms), 0)::bigint as tempo_medio
      from s
  ),
  ativos_hoje as (
    select count(distinct user_id)::int as n from s where iniciada_em::date = current_date
  ),
  por_dia as (
    select to_char(d, 'YYYY-MM-DD') as dia,
           coalesce((select count(*)::int from s where s.iniciada_em::date = d.d::date), 0) as sessoes,
           coalesce((select sum(dur_ms)::bigint from s where s.iniciada_em::date = d.d::date), 0) as tempoMs
      from generate_series((current_date - interval '29 days')::date, current_date, interval '1 day') as d(d)
     order by dia
  )
  select jsonb_build_object(
    'totalSessoes', (select total from totals),
    'tempoTotalMs', (select tempo_total from totals),
    'tempoMedioMs', (select tempo_medio from totals),
    'ativosHoje', (select n from ativos_hoje),
    'porDia', coalesce((select jsonb_agg(jsonb_build_object('dia', dia, 'sessoes', sessoes, 'tempoMs', tempoMs)) from por_dia), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

-- Trigger helper functions must remain SECURITY DEFINER (they run in Supabase Auth context),
-- but we revoke direct EXECUTE from public/anon/authenticated so they aren't callable via the API.
REVOKE EXECUTE ON FUNCTION public.update_atualizado_em() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_atualizado_em() FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_atualizado_em() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- The app uses PostgREST (REST API), not GraphQL. Revoke GraphQL schema access
-- so tables are no longer discoverable via GraphQL introspection.
REVOKE USAGE ON SCHEMA graphql_public FROM anon;
REVOKE USAGE ON SCHEMA graphql_public FROM authenticated;
