-- Live demo sessions are created before authentication and are still safe to
-- store because the backend uses the Supabase service-role client.
ALTER TABLE sessions ALTER COLUMN user_id DROP NOT NULL;

DROP POLICY IF EXISTS "Users insert own sessions" ON sessions;
CREATE POLICY "Users insert own sessions"
  ON sessions FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);
