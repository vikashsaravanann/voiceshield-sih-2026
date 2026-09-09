-- ── profiles ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins read all profiles" ON profiles;
CREATE POLICY "Admins read all profiles"
  ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── sessions ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Users read own sessions" ON sessions;
CREATE POLICY "Users read own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own sessions" ON sessions;
CREATE POLICY "Users insert own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins read all sessions" ON sessions;
CREATE POLICY "Admins read all sessions"
  ON sessions FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── detection_events ─────────────────────────────────────
DROP POLICY IF EXISTS "Users read own detection events" ON detection_events;
CREATE POLICY "Users read own detection events"
  ON detection_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM sessions WHERE sessions.id = detection_events.session_id AND sessions.user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins read all detection events" ON detection_events;
CREATE POLICY "Admins read all detection events"
  ON detection_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── connection_audit_logs (append-only for users) ────────
DROP POLICY IF EXISTS "Users read own connection logs" ON connection_audit_logs;
CREATE POLICY "Users read own connection logs"
  ON connection_audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM sessions WHERE sessions.id = connection_audit_logs.session_id AND sessions.user_id = auth.uid()));

DROP POLICY IF EXISTS "Backend insert connection logs" ON connection_audit_logs;
CREATE POLICY "Backend insert connection logs"
  ON connection_audit_logs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read all connection logs" ON connection_audit_logs;
CREATE POLICY "Admins read all connection logs"
  ON connection_audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── auth_audit_logs (append-only for users) ──────────────
DROP POLICY IF EXISTS "Users read own auth logs" ON auth_audit_logs;
CREATE POLICY "Users read own auth logs"
  ON auth_audit_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Backend insert auth logs" ON auth_audit_logs;
CREATE POLICY "Backend insert auth logs"
  ON auth_audit_logs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read all auth logs" ON auth_audit_logs;
CREATE POLICY "Admins read all auth logs"
  ON auth_audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
