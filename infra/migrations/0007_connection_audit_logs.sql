create table if not exists public.connection_audit_logs (
  id bigserial primary key,
  session_id uuid,
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  event_type text not null,
  details jsonb not null default '{}'::jsonb,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists connection_audit_user_idx on public.connection_audit_logs (user_id, created_at desc);
