CREATE TABLE IF NOT EXISTS connection_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  event_type connection_event NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  details JSONB DEFAULT '{}',
  ip_hash TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_connection_audit_session ON connection_audit_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_connection_audit_time ON connection_audit_logs(timestamp);
ALTER TABLE connection_audit_logs ENABLE ROW LEVEL SECURITY;
