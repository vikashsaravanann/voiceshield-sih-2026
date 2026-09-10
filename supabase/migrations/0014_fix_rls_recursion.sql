-- ── Fix infinite recursion on profiles and sessions ───────────────
-- Querying `profiles` within an RLS policy on `profiles` causes Postgres
-- error 42P17 (infinite recursion). Using a SECURITY DEFINER function
-- resolves this cleanly by running the role lookup without triggering RLS.

CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = check_user_id AND role = 'admin'
  );
$$;

-- 1. profiles: users read own, admins read all (via security definer)
DROP POLICY IF EXISTS "Admins read all profiles" ON profiles;
CREATE POLICY "Admins read all profiles"
  ON profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

-- 2. sessions: anonymous or owner read, plus admins
DROP POLICY IF EXISTS "Users read own sessions" ON sessions;
CREATE POLICY "Users read own sessions"
  ON sessions FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins read all sessions" ON sessions;
CREATE POLICY "Admins read all sessions"
  ON sessions FOR SELECT
  USING (public.is_admin(auth.uid()));

-- 3. detection_events: allow reading events for accessible sessions
DROP POLICY IF EXISTS "Admins read all detection events" ON detection_events;
CREATE POLICY "Admins read all detection events"
  ON detection_events FOR SELECT
  USING (public.is_admin(auth.uid()));

-- 4. audit logs:
DROP POLICY IF EXISTS "Admins read all connection logs" ON connection_audit_logs;
CREATE POLICY "Admins read all connection logs"
  ON connection_audit_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins read all auth logs" ON auth_audit_logs;
CREATE POLICY "Admins read all auth logs"
  ON auth_audit_logs FOR SELECT
  USING (public.is_admin(auth.uid()));
