-- ============================================================
-- VoiceShield — Demo Seed Data for SIH Evaluators
-- voiceshield-team/voiceshield-sih-2026
-- ============================================================

-- Insert sample profiles
-- Note: In Supabase production, user IDs correspond to auth.users.id
INSERT INTO profiles (id, display_name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Judge Demo User', 'demo_user'),
  ('00000000-0000-0000-0000-000000000002', 'VoiceShield Admin', 'admin')
ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name, role = EXCLUDED.role;

-- Insert completed demonstration sessions
INSERT INTO sessions (id, user_id, started_at, ended_at, status, client_info, risk_summary) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   NOW() - INTERVAL '15 minutes',
   NOW() - INTERVAL '10 minutes',
   'completed',
   '{"browser": "Chrome 128", "os": "macOS", "sample_rate": 16000}',
   '{"avg_risk": 0.12, "max_risk": 0.24, "total_chunks": 90, "decision": "clean"}'),
  ('bbbbbbbb-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000001',
   NOW() - INTERVAL '8 minutes',
   NOW() - INTERVAL '2 minutes',
   'flagged',
   '{"browser": "Chrome 128", "os": "macOS", "sample_rate": 16000}',
   '{"avg_risk": 0.78, "max_risk": 0.94, "total_chunks": 110, "decision": "blocked"}')
ON CONFLICT (id) DO NOTHING;

-- Insert detection events showing spoof progression
INSERT INTO detection_events (session_id, chunk_index, spoof_probability, risk_level, explainability_markers) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 1, 0.08, 'low', '{"high_frequency_anomaly": 0.10, "phase_discontinuity": 0.05, "prosody_irregularity": 0.09}'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 2, 0.12, 'low', '{"high_frequency_anomaly": 0.11, "phase_discontinuity": 0.06, "prosody_irregularity": 0.10}'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 1, 0.22, 'low', '{"high_frequency_anomaly": 0.15, "phase_discontinuity": 0.12, "prosody_irregularity": 0.18}'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 2, 0.89, 'high', '{"high_frequency_anomaly": 0.91, "phase_discontinuity": 0.78, "prosody_irregularity": 0.83}')
ON CONFLICT (id) DO NOTHING;

-- Insert challenge response entry
INSERT INTO challenge_responses (session_id, challenge_text, language, response_spoof_prob, passed) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000002', 'सुरक्षा कोड सत्ताईस चौरासी सत्यापित करें', 'hi', 0.85, false)
ON CONFLICT (id) DO NOTHING;

-- Insert connection audit trail
INSERT INTO connection_audit_logs (session_id, event_type, details) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'connected', '{"backend": "voiceshield-api", "worker_id": "render-us-east-1"}'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'disconnected', '{"reason": "session_end_by_operator"}'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'connected', '{"backend": "voiceshield-api", "worker_id": "render-us-east-1"}'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'disconnected', '{"reason": "network_drop_simulated"}'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'reconnected', '{"resumed_at_chunk": 18, "replay_count": 4}');
