CREATE TABLE IF NOT EXISTS auth_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type auth_event NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  details JSONB DEFAULT '{}',
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  ip_hash TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_auth_audit_user ON auth_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_time ON auth_audit_logs(timestamp);
ALTER TABLE auth_audit_logs ENABLE ROW LEVEL SECURITY;
