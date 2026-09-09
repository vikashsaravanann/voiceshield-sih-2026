create table if not exists public.challenge_responses (
  id bigserial primary key,
  session_id uuid not null references public.sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  phrase text not null,
  language text not null default 'en',
  latency_ms double precision,
  spoof_prob double precision,
  passed boolean,
  created_at timestamptz not null default now()
);
