-- open-229: profiles, projects, contributors, RLS
-- Run in Supabase SQL editor or via CLI: supabase db push

create extension if not exists "pgcrypto";

-- Categories & status (Postgres enums)
do $$ begin
  create type public.project_category as enum (
    'web_app',
    'mobile',
    'fintech',
    'ai_ml',
    'iot',
    'data_science',
    'education',
    'utils',
    'blockchain',
    'security',
    'e_commerce',
    'other'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.project_status as enum (
    'active',
    'maintained',
    'looking_for_maintainers',
    'archived'
  );
exception
  when duplicate_object then null;
end $$;

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text,
  bio text,
  location text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_username_lower on public.profiles (lower(username));

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null,
  full_description text,
  category public.project_category not null default 'other',
  status public.project_status not null default 'active',
  github_url text,
  gitlab_url text,
  demo_url text,
  license text,
  contributing_url text,
  key_features text,
  stack text[] not null default '{}',
  stars_count integer not null default 0,
  forks_count integer not null default 0,
  open_issues_count integer not null default 0,
  primary_language text,
  last_activity_at timestamptz,
  submitted_by uuid not null references public.profiles (id) on delete restrict,
  is_published boolean not null default true,
  is_official boolean not null default false,
  version_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_category_idx on public.projects (category);
create index if not exists projects_submitted_by_idx on public.projects (submitted_by);
create index if not exists projects_published_idx on public.projects (is_published);
create index if not exists projects_stars_idx on public.projects (stars_count desc);

create table if not exists public.project_contributors (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  display_name text not null,
  email text,
  role text,
  profile_id uuid references public.profiles (id) on delete set null,
  sort_order integer not null default 0
);

create index if not exists project_contributors_project_idx on public.project_contributors (project_id);

-- updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- New user -> profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := coalesce(
    nullif(trim(new.raw_user_meta_data->>'username'), ''),
    split_part(new.email, '@', 1)
  );
  final_username := base_username;

  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    final_username,
    coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'), ''), final_username)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_contributors enable row level security;

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles
  for select using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "projects_select_visible" on public.projects;
create policy "projects_select_visible" on public.projects
  for select using (is_published = true or submitted_by = auth.uid());

drop policy if exists "projects_insert_own" on public.projects;
create policy "projects_insert_own" on public.projects
  for insert with check (auth.uid() = submitted_by);

drop policy if exists "projects_update_own" on public.projects;
create policy "projects_update_own" on public.projects
  for update using (submitted_by = auth.uid());

drop policy if exists "contributors_select_visible" on public.project_contributors;
create policy "contributors_select_visible" on public.project_contributors
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and (p.is_published = true or p.submitted_by = auth.uid())
    )
  );

drop policy if exists "contributors_write_own_project" on public.project_contributors;
create policy "contributors_write_own_project" on public.project_contributors
  for all using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.submitted_by = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.submitted_by = auth.uid()
    )
  );
