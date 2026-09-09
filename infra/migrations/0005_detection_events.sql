create table if not exists public.detection_events (
  id bigserial primary key,
  session_id uuid not null references public.sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  chunk_index integer not null,
  spoof_prob double precision not null,
  risk_level text not null,
  latency_ms double precision not null,
  features jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists detection_events_session_idx on public.detection_events (session_id, chunk_index);
