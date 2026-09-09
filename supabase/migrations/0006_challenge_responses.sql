CREATE TABLE IF NOT EXISTS challenge_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  challenge_text TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  response_audio_url TEXT,
  response_spoof_prob FLOAT,
  passed BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenge_responses_session ON challenge_responses(session_id);
ALTER TABLE challenge_responses ENABLE ROW LEVEL SECURITY;
