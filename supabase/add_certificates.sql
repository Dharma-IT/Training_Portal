-- Run once after setup.sql and add_learning_progress.sql.
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  course_key text not null default 'dharma-foundations',
  course_title text not null default 'Dharma Foundations',
  certificate_code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  issued_at timestamptz not null default now(),
  issued_by uuid references auth.users(id),
  unique (learner_id, course_key)
);

alter table public.certificates enable row level security;
revoke all on public.certificates from anon, authenticated;
grant select on public.certificates to authenticated;

create policy "Admin reads certificates" on public.certificates
for select to authenticated
using ((select auth.jwt()->>'email') = 'admin@dharma.com');

create or replace function public.issue_certificate(p_learner_id uuid)
returns table (id uuid, certificate_code text, course_title text, issued_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.jwt()->>'email') is distinct from 'admin@dharma.com' then
    raise exception 'Administrator access required';
  end if;
  if (select count(*) from public.learner_progress where learner_id=p_learner_id and module_key in ('module-1','sop') and progress=100) < 2 then
    raise exception 'Learner must complete Module 1 and SOP first';
  end if;
  return query insert into public.certificates (learner_id, issued_by)
  values (p_learner_id, auth.uid())
  on conflict (learner_id, course_key) do update set learner_id=excluded.learner_id
  returning certificates.id, certificates.certificate_code, certificates.course_title, certificates.issued_at;
end;
$$;

create or replace function public.certificates_for(p_learner_id uuid)
returns table (id uuid, certificate_code text, course_title text, issued_at timestamptz)
language sql security definer set search_path = '' as $$
  select c.id,c.certificate_code,c.course_title,c.issued_at from public.certificates c
  where c.learner_id=p_learner_id order by c.issued_at desc;
$$;

revoke all on function public.issue_certificate(uuid) from public, anon;
grant execute on function public.issue_certificate(uuid) to authenticated;
revoke all on function public.certificates_for(uuid) from public;
grant execute on function public.certificates_for(uuid) to anon, authenticated;
