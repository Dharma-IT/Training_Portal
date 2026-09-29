-- Safe follow-up for an existing learners/learner_progress installation.
alter table public.learner_progress
add column if not exists lesson_title text;

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

create or replace function public.save_learner_progress(p_learner_id uuid, p_module_key text, p_module_title text, p_lesson_title text, p_progress smallint)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_progress < 0 or p_progress > 100 then raise exception 'Invalid progress'; end if;
  insert into public.learner_progress (learner_id, module_key, module_title, lesson_title, progress, updated_at)
  values (p_learner_id, p_module_key, p_module_title, p_lesson_title, p_progress, now())
  on conflict (learner_id, module_key) do update
  set lesson_title=excluded.lesson_title, progress=greatest(public.learner_progress.progress,excluded.progress), updated_at=now();
end;
$$;
revoke all on function public.save_learner_progress(uuid, text, text, text, smallint) from public;
grant execute on function public.save_learner_progress(uuid, text, text, text, smallint) to anon, authenticated;
