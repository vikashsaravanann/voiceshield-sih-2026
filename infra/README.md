# Infra

Paste `migrations/*.sql` in order into the Supabase SQL editor (project `voiceshield-sih-2026`, Mumbai).

1. `0001_extensions.sql`
2. `0002_enums.sql`
3. `0003_profiles.sql`
4. `0004_sessions.sql`
5. `0005_detection_events.sql`
6. `0006_challenge_responses.sql`
7. `0007_connection_audit_logs.sql`
8. `0008_auth_audit_logs.sql`
9. `0009_rls_policies.sql`

Never put the service-role key in the Next.js bundle.
