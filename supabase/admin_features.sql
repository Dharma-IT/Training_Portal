-- Run once in the Supabase SQL Editor for an existing portal database.
-- This migration is non-destructive and preserves learners and progress.

alter table public.learner_progress
add column if not exists lesson_title text;

create or replace function public.learner_progress_for(p_learner_id uuid)
returns table (
  module_key text, module_title text, lesson_title text, progress smallint,
  completed boolean, updated_at timestamptz
)
language sql security definer set search_path = ''
as $$
  select p.module_key, p.module_title, p.lesson_title, p.progress, p.completed, p.updated_at
  from public.learner_progress p
  where p.learner_id = p_learner_id
  order by p.id;
$$;

create or replace function public.save_learner_progress(
  p_learner_id uuid, p_module_key text, p_module_title text,
  p_lesson_title text, p_progress smallint
)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if p_progress < 0 or p_progress > 100 then raise exception 'Invalid progress'; end if;
  insert into public.learner_progress
    (learner_id, module_key, module_title, lesson_title, progress, updated_at)
  values
    (p_learner_id, p_module_key, p_module_title, p_lesson_title, p_progress, now())
  on conflict (learner_id, module_key) do update
  set module_title = excluded.module_title,
      lesson_title = excluded.lesson_title,
      progress = greatest(public.learner_progress.progress, excluded.progress),
      updated_at = now();
end;
$$;

revoke all on function public.learner_progress_for(uuid) from public;
revoke all on function public.save_learner_progress(uuid,text,text,text,smallint) from public;
grant execute on function public.learner_progress_for(uuid) to anon, authenticated;
grant execute on function public.save_learner_progress(uuid,text,text,text,smallint) to anon, authenticated;

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null unique references public.learners(id) on delete cascade,
  course_title text not null,
  certificate_code text not null unique,
  issued_at timestamptz not null default now(),
  issued_by uuid references auth.users(id)
);

alter table public.certificates enable row level security;
revoke all on public.certificates from anon, authenticated;
grant select on public.certificates to authenticated;

drop policy if exists "Admin reads certificates" on public.certificates;
create policy "Admin reads certificates"
on public.certificates for select to authenticated
using ((select auth.jwt()->>'email') = 'admin@dharma.com');

create or replace function public.admin_update_learner(
  p_learner_id uuid,
  p_username text,
  p_role text,
  p_active boolean,
  p_password text default null
)
returns table (id uuid, username text, role text, active boolean, created_at timestamptz)
language plpgsql security definer set search_path = ''
as $$
declare old_role text;
begin
  if (select auth.jwt()->>'email') is distinct from 'admin@dharma.com' then
    raise exception 'Administrator access required';
  end if;
  if char_length(trim(p_username)) < 3 then raise exception 'Username must be at least 3 characters'; end if;
  if p_role not in ('customer_service', 'sales') then raise exception 'Invalid learner role'; end if;
  if p_password is not null and char_length(p_password) < 8 then raise exception 'Password must be at least 8 characters'; end if;

  select l.role into old_role from public.learners l where l.id = p_learner_id;
  if old_role is null then raise exception 'Learner not found'; end if;

  if old_role <> p_role then
    delete from public.learner_progress where learner_id = p_learner_id;
    delete from public.certificates where learner_id = p_learner_id;
  end if;

  return query
  update public.learners l
  set username = lower(trim(p_username)),
      role = p_role,
      active = p_active,
      password_hash = case
        when p_password is null or p_password = '' then l.password_hash
        else extensions.crypt(p_password, extensions.gen_salt('bf', 12))
      end
  where l.id = p_learner_id
  returning l.id, l.username, l.role, l.active, l.created_at;
end;
$$;

create or replace function public.admin_delete_learner(p_learner_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if (select auth.jwt()->>'email') is distinct from 'admin@dharma.com' then
    raise exception 'Administrator access required';
  end if;
  delete from public.learners where id = p_learner_id;
  if not found then raise exception 'Learner not found'; end if;
end;
$$;

create or replace function public.issue_certificate(p_learner_id uuid)
returns table (id uuid, certificate_code text, course_title text, issued_at timestamptz)
language plpgsql security definer set search_path = ''
as $$
declare learner_role text; required_keys text[]; new_code text;
begin
  if (select auth.jwt()->>'email') is distinct from 'admin@dharma.com' then
    raise exception 'Administrator access required';
  end if;
  select l.role into learner_role from public.learners l where l.id = p_learner_id and l.active;
  if learner_role is null then raise exception 'Active learner not found'; end if;
  required_keys := case when learner_role = 'sales'
    then array['module-1','module-2','module-3','module-4','sop']
    else array['module-1','module-2','sop'] end;
  if exists (
    select 1 from unnest(required_keys) key
    where not exists (
      select 1 from public.learner_progress p
      where p.learner_id = p_learner_id and p.module_key = key and p.completed
    )
  ) then raise exception 'The learner has not completed every required module'; end if;

  new_code := 'DHA-' || upper(substr(replace(extensions.gen_random_uuid()::text, '-', ''), 1, 10));
  return query
  insert into public.certificates (learner_id, course_title, certificate_code, issued_by)
  values (p_learner_id,
    case when learner_role = 'sales' then 'Sales Training' else 'Customer Service Training' end,
    new_code, auth.uid())
  on conflict (learner_id) do update set learner_id = excluded.learner_id
  returning certificates.id, certificates.certificate_code, certificates.course_title, certificates.issued_at;
end;
$$;

create or replace function public.certificates_for(p_learner_id uuid)
returns table (id uuid, certificate_code text, course_title text, issued_at timestamptz)
language sql security definer set search_path = ''
as $$
  select c.id, c.certificate_code, c.course_title, c.issued_at
  from public.certificates c where c.learner_id = p_learner_id order by c.issued_at desc;
$$;

revoke all on function public.admin_update_learner(uuid,text,text,boolean,text) from public, anon;
revoke all on function public.admin_delete_learner(uuid) from public, anon;
revoke all on function public.issue_certificate(uuid) from public, anon;
revoke all on function public.certificates_for(uuid) from public;
grant execute on function public.admin_update_learner(uuid,text,text,boolean,text) to authenticated;
grant execute on function public.admin_delete_learner(uuid) to authenticated;
grant execute on function public.issue_certificate(uuid) to authenticated;
grant execute on function public.certificates_for(uuid) to anon, authenticated;
