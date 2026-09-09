CREATE TABLE IF NOT EXISTS detection_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  spoof_probability FLOAT NOT NULL,
  risk_level risk_level NOT NULL,
  features_snapshot JSONB DEFAULT '{}',
  explainability_markers JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_detection_events_session ON detection_events(session_id);
CREATE INDEX IF NOT EXISTS idx_detection_events_risk ON detection_events(risk_level);
ALTER TABLE detection_events ENABLE ROW LEVEL SECURITY;
