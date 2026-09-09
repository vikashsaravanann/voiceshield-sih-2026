create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  chunk_ms integer not null default 333,
  sample_rate integer not null default 16000,
  chunk_count integer not null default 0,
  avg_risk double precision not null default 0,
  max_risk double precision not null default 0,
  drop_count integer not null default 0,
  reconnect_count integer not null default 0,
  challenge_fired boolean not null default false,
  challenge_ok boolean,
  mode text not null default 'live',
  notes text
);
create index if not exists sessions_user_id_idx on public.sessions (user_id);
create index if not exists sessions_started_idx on public.sessions (started_at desc);
