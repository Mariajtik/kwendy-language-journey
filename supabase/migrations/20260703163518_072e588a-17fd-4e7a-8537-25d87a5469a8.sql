
-- Enum de papéis
create type public.app_role as enum ('admin', 'user');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  email text,
  avatar_url text,
  provincia text,
  pais text,
  motivacao text,
  fonte_kwendi text,
  chokwe text,
  objetivo_diario text,
  nivel_declarado text,
  tipo text not null default 'signup' check (tipo in ('signup','stealth')),
  stealth_expira_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  criado_em timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

-- has_role (security definer, evita recursão em RLS)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Progresso
create table public.progresso (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp int not null default 0,
  diamantes int not null default 0,
  streak int not null default 0,
  seccoes_completas text[] not null default '{}',
  unidade_atual text,
  premium boolean not null default false,
  nivelamento_percentagem int,
  ancao boolean not null default false,
  atualizado_em timestamptz not null default now()
);
grant select, insert, update, delete on public.progresso to authenticated;
grant all on public.progresso to service_role;
alter table public.progresso enable row level security;

-- Sessões
create table public.sessoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  iniciada_em timestamptz not null default now(),
  terminada_em timestamptz,
  rota text
);
create index sessoes_user_idx on public.sessoes(user_id);
create index sessoes_iniciada_idx on public.sessoes(iniciada_em);
grant select, insert, update, delete on public.sessoes to authenticated;
grant all on public.sessoes to service_role;
alter table public.sessoes enable row level security;

-- Eventos
create table public.eventos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null,
  payload jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);
create index eventos_user_idx on public.eventos(user_id);
create index eventos_tipo_idx on public.eventos(tipo);
grant select, insert, update, delete on public.eventos to authenticated;
grant all on public.eventos to service_role;
alter table public.eventos enable row level security;

-- ============ RLS Policies ============

-- profiles
create policy "profiles self select" on public.profiles for select
  to authenticated using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));
create policy "profiles self insert" on public.profiles for insert
  to authenticated with check (auth.uid() = id);
create policy "profiles self update" on public.profiles for update
  to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles admin update" on public.profiles for update
  to authenticated using (public.has_role(auth.uid(), 'admin'));

-- user_roles
create policy "user_roles self select" on public.user_roles for select
  to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- progresso
create policy "progresso self select" on public.progresso for select
  to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "progresso self upsert" on public.progresso for insert
  to authenticated with check (user_id = auth.uid());
create policy "progresso self update" on public.progresso for update
  to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- sessoes
create policy "sessoes self select" on public.sessoes for select
  to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "sessoes self insert" on public.sessoes for insert
  to authenticated with check (user_id = auth.uid());
create policy "sessoes self update" on public.sessoes for update
  to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- eventos
create policy "eventos self select" on public.eventos for select
  to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "eventos self insert" on public.eventos for insert
  to authenticated with check (user_id = auth.uid());

-- ============ Triggers ============

create or replace function public.update_atualizado_em()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.update_atualizado_em();

create trigger progresso_touch before update on public.progresso
  for each row execute function public.update_atualizado_em();

-- handle_new_user: cria profile + progresso ao criar auth.user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
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
         then (m->>'stealth_expira_em')::timestamptz
         else null end
  )
  on conflict (id) do nothing;

  insert into public.progresso (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ RPC helpers para admin ============

create or replace function public.admin_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
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

grant execute on function public.admin_overview() to authenticated;

create or replace function public.admin_sessions_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
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

grant execute on function public.admin_sessions_stats() to authenticated;
