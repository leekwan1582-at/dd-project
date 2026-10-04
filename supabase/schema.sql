-- dd-project backend schema
--
-- Run this once in the Supabase SQL editor (or `supabase db execute -f
-- supabase/schema.sql`) against a fresh project. It is idempotent and can be
-- re-run safely.
--
-- SECURITY NOTE: the app uses the public anon key with no authentication, so the
-- policies below grant unrestricted read/write to `anon`. Every row is world
-- readable and writable. Suitable only for a private/personal deployment — add
-- Supabase Auth and tighten the policies before exposing real data.

create table if not exists public.debugging_diary (
  id          uuid primary key default gen_random_uuid(),
  tag         text not null,
  title       text not null,
  symptom     text not null,
  tried       text not null,
  root_cause  text not null,
  fix         text not null,
  lesson      text not null,
  created_at  timestamptz not null default now()
);

create index if not exists debugging_diary_created_at_idx
  on public.debugging_diary (created_at desc);

alter table public.debugging_diary enable row level security;

drop policy if exists "Public full access" on public.debugging_diary;
create policy "Public full access"
  on public.debugging_diary
  for all
  to anon, authenticated
  using (true)
  with check (true);

grant select, insert, update, delete on public.debugging_diary to anon, authenticated;

-- Server-side search by title or tag, newest first. The client calls this via
-- `supabase.rpc("search_diary", { q: query })`. `create or replace` means
-- re-running this file updates an existing (possibly stale) definition.
create or replace function public.search_diary(q text)
returns setof public.debugging_diary
language sql
stable
as $$
  select *
  from public.debugging_diary
  where title ilike '%' || q || '%'
     or tag ilike '%' || q || '%'
  order by created_at desc;
$$;

grant execute on function public.search_diary(text) to anon, authenticated;
