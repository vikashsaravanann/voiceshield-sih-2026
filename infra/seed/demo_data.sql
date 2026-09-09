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
  ('aaaaaaaa-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '23 hours', NOW() - INTERVAL '22 hours 55 minutes', 'completed', '{"browser": "Chrome 128", "os": "macOS", "sample_rate": 16000}', '{"avg_risk": 0.05, "max_risk": 0.12, "total_chunks": 120, "decision": "clean"}'),
  ('bbbbbbbb-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '20 hours', NOW() - INTERVAL '19 hours 58 minutes', 'flagged', '{"browser": "Safari 17", "os": "iOS", "sample_rate": 8000}', '{"avg_risk": 0.88, "max_risk": 0.97, "total_chunks": 45, "decision": "blocked"}'),
  ('cccccccc-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '15 hours', NOW() - INTERVAL '14 hours 45 minutes', 'completed', '{"browser": "Chrome 128", "os": "Windows", "sample_rate": 44100}', '{"avg_risk": 0.11, "max_risk": 0.19, "total_chunks": 300, "decision": "clean"}'),
  ('dddddddd-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '11 hours 56 minutes', 'flagged', '{"browser": "Firefox 125", "os": "macOS", "sample_rate": 16000}', '{"avg_risk": 0.92, "max_risk": 0.99, "total_chunks": 100, "decision": "blocked"}'),
  ('eeeeeeee-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '7 hours 50 minutes', 'completed', '{"browser": "Chrome 128", "os": "Android", "sample_rate": 16000}', '{"avg_risk": 0.08, "max_risk": 0.15, "total_chunks": 240, "decision": "clean"}'),
  ('ffffffff-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 59 minutes', 'flagged', '{"browser": "Edge 120", "os": "Windows", "sample_rate": 16000}', '{"avg_risk": 0.76, "max_risk": 0.91, "total_chunks": 25, "decision": "blocked"}'),
  ('11111111-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 hours', NOW() - INTERVAL '55 minutes', 'completed', '{"browser": "Chrome 128", "os": "macOS", "sample_rate": 16000}', '{"avg_risk": 0.09, "max_risk": 0.18, "total_chunks": 150, "decision": "clean"}')
ON CONFLICT (id) DO NOTHING;

-- Insert detection events showing spoof progression (abbreviated for the demo)
INSERT INTO detection_events (session_id, chunk_index, spoof_probability, risk_level, explainability_markers) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 1, 0.08, 'low', '{"high_frequency_anomaly": 0.10, "phase_discontinuity": 0.05, "prosody_irregularity": 0.09}'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 2, 0.12, 'low', '{"high_frequency_anomaly": 0.11, "phase_discontinuity": 0.06, "prosody_irregularity": 0.10}'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 1, 0.22, 'low', '{"high_frequency_anomaly": 0.15, "phase_discontinuity": 0.12, "prosody_irregularity": 0.18}'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 2, 0.97, 'high', '{"high_frequency_anomaly": 0.95, "phase_discontinuity": 0.88, "prosody_irregularity": 0.92}'),
  ('dddddddd-0000-0000-0000-000000000004', 1, 0.99, 'high', '{"high_frequency_anomaly": 0.99, "phase_discontinuity": 0.98, "prosody_irregularity": 0.99}')
ON CONFLICT (id) DO NOTHING;

-- Insert challenge response entry
INSERT INTO challenge_responses (session_id, challenge_text, language, response_spoof_prob, passed) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000002', 'सुरक्षा कोड सत्ताईस चौरासी सत्यापित करें', 'hi', 0.95, false),
  ('dddddddd-0000-0000-0000-000000000004', 'Please repeat: The purple elephant jumped over the moon', 'en', 0.98, false)
ON CONFLICT (id) DO NOTHING;

-- Insert connection audit trail
INSERT INTO connection_audit_logs (session_id, event_type, details) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'connected', '{"backend": "voiceshield-api", "worker_id": "render-us-east-1"}'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'connected', '{"backend": "voiceshield-api", "worker_id": "render-us-east-1"}'),
  ('dddddddd-0000-0000-0000-000000000004', 'connected', '{"backend": "voiceshield-api", "worker_id": "render-us-east-1"}');
