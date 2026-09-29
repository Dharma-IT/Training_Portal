-- Run this entire file once in the Supabase SQL Editor.
-- WARNING: the DROP statements permanently remove the current learner records.

drop table if exists public.learner_progress cascade;
drop table if exists public.portal_sessions cascade;
drop table if exists public.portal_users cascade;
drop table if exists public.learners cascade;

drop function if exists public.admin_create_learner(text, text, text);
drop function if exists public.learner_login(text, text);
drop function if exists public.learner_progress_for(uuid);
drop function if exists public.save_learner_progress(uuid, text, text, text, smallint);

create extension if not exists pgcrypto with schema extensions;

create table public.learners (
  id uuid primary key default gen_random_uuid(),
  username text not null unique check (char_length(username) between 3 and 50),
  password_hash text not null,
  role text not null check (role in ('customer_service', 'sales')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.learner_progress (
  id bigint generated always as identity primary key,
  learner_id uuid not null references public.learners(id) on delete cascade,
  module_key text not null,
  module_title text not null,
  lesson_title text,
  progress smallint not null default 0 check (progress between 0 and 100),
  completed boolean generated always as (progress = 100) stored,
  updated_at timestamptz not null default now(),
  unique (learner_id, module_key)
);

alter table public.learners enable row level security;
alter table public.learner_progress enable row level security;
revoke all on public.learners from anon, authenticated;
revoke all on public.learner_progress from anon, authenticated;
grant select on public.learners to authenticated;
grant select on public.learner_progress to authenticated;

create policy "Admin reads learners"
on public.learners for select to authenticated
using ((select auth.jwt()->>'email') = 'admin@dharma.com');

create policy "Admin reads progress"
on public.learner_progress for select to authenticated
using ((select auth.jwt()->>'email') = 'admin@dharma.com');

create or replace function public.admin_create_learner(
  p_username text,
  p_password text,
  p_role text
)
returns table (id uuid, username text, role text, active boolean, created_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.jwt()->>'email') is distinct from 'admin@dharma.com' then
    raise exception 'Administrator access required';
  end if;
  if char_length(trim(p_username)) < 3 then
    raise exception 'Username must be at least 3 characters';
  end if;
  if char_length(p_password) < 8 then
    raise exception 'Password must be at least 8 characters';
  end if;
  if p_role not in ('customer_service', 'sales') then
    raise exception 'Invalid learner role';
  end if;

  return query
  with created as (
    insert into public.learners (username, password_hash, role)
    values (
      lower(trim(p_username)),
      extensions.crypt(p_password, extensions.gen_salt('bf', 12)),
      p_role
    )
    returning *
  )
  select created.id, created.username, created.role, created.active, created.created_at
  from created;
end;
$$;

create or replace function public.learner_login(p_username text, p_password text)
returns table (id uuid, username text, role text)
language sql
security definer
set search_path = ''
as $$
  select l.id, l.username, l.role
  from public.learners l
  where l.username = lower(trim(p_username))
    and l.active = true
    and l.password_hash = extensions.crypt(p_password, l.password_hash)
  limit 1;
$$;

revoke all on function public.admin_create_learner(text, text, text) from public, anon;
grant execute on function public.admin_create_learner(text, text, text) to authenticated;

revoke all on function public.learner_login(text, text) from public;
grant execute on function public.learner_login(text, text) to anon, authenticated;

create or replace function public.learner_progress_for(p_learner_id uuid)
returns table (
  module_key text,
  module_title text,
  lesson_title text,
  progress smallint,
  completed boolean,
  updated_at timestamptz
)
language sql
security definer
set search_path = ''
as $$
  select p.module_key, p.module_title, p.lesson_title, p.progress, p.completed, p.updated_at
  from public.learner_progress p
  where p.learner_id = p_learner_id
  order by p.id;
$$;

revoke all on function public.learner_progress_for(uuid) from public;
grant execute on function public.learner_progress_for(uuid) to anon, authenticated;

create or replace function public.save_learner_progress(
  p_learner_id uuid,
  p_module_key text,
  p_module_title text,
  p_lesson_title text,
  p_progress smallint
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_progress < 0 or p_progress > 100 then raise exception 'Invalid progress'; end if;
  insert into public.learner_progress (learner_id, module_key, module_title, lesson_title, progress, updated_at)
  values (p_learner_id, p_module_key, p_module_title, p_lesson_title, p_progress, now())
  on conflict (learner_id, module_key) do update
  set lesson_title = excluded.lesson_title,
      progress = greatest(public.learner_progress.progress, excluded.progress),
      updated_at = now();
end;
$$;

revoke all on function public.save_learner_progress(uuid, text, text, text, smallint) from public;
grant execute on function public.save_learner_progress(uuid, text, text, text, smallint) to anon, authenticated;
