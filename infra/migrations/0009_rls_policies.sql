alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.detection_events enable row level security;
alter table public.challenge_responses enable row level security;
alter table public.connection_audit_logs enable row level security;
alter table public.auth_audit_logs enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  );
$$;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists sessions_all_own on public.sessions;
create policy sessions_all_own on public.sessions
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists detection_select_own on public.detection_events;
create policy detection_select_own on public.detection_events
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists detection_insert_own on public.detection_events;
create policy detection_insert_own on public.detection_events
  for insert with check (user_id = auth.uid() or public.is_admin());

drop policy if exists challenge_select_own on public.challenge_responses;
create policy challenge_select_own on public.challenge_responses
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists challenge_insert_own on public.challenge_responses;
create policy challenge_insert_own on public.challenge_responses
  for insert with check (user_id = auth.uid() or public.is_admin());

drop policy if exists conn_select_own on public.connection_audit_logs;
create policy conn_select_own on public.connection_audit_logs
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists conn_insert_own on public.connection_audit_logs;
create policy conn_insert_own on public.connection_audit_logs
  for insert with check (user_id = auth.uid() or public.is_admin());

drop policy if exists auth_select_own on public.auth_audit_logs;
create policy auth_select_own on public.auth_audit_logs
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists auth_insert_own on public.auth_audit_logs;
create policy auth_insert_own on public.auth_audit_logs
  for insert with check (user_id = auth.uid() or public.is_admin());
