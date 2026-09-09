create table if not exists public.auth_audit_logs (
  id bigserial primary key,
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  event_type text not null,
  details jsonb not null default '{}'::jsonb,
  session_id text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists auth_audit_user_idx on public.auth_audit_logs (user_id, created_at desc);
