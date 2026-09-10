# VoiceShield security model

## Security objectives

VoiceShield is designed to minimize exposure of voice data, prevent browser clients from receiving privileged credentials, and make authentication and detection events auditable.

## Controls

| Area | Control |
| --- | --- |
| Authentication | Supabase Auth with email/password, Google, and GitHub providers |
| Browser secrets | Only the publishable/anon Supabase key is exposed to the browser |
| Backend secrets | Service-role and provider credentials remain in Railway/Vercel environment settings |
| Transport | HTTPS and WSS in production; CORS is restricted to approved web origins |
| Audio | PCM is processed in memory; `STORE_RAW_AUDIO=false` by default |
| Persistence | Session and event access is protected by PostgreSQL RLS |
| Auditability | Connection, authentication, and detection metadata can be recorded for review |
| Callback safety | OAuth callback accepts only safe relative application paths and fails closed on exchange errors |

## Authentication flow

1. The user selects email, Google, or GitHub on `/login`.
2. Supabase establishes the authenticated session.
3. OAuth providers return to Supabase at `/auth/v1/callback`.
4. Supabase redirects to the application `/auth/callback`.
5. The application exchanges the one-time code server-side and redirects to `/dashboard`.
6. Requests to `/dashboard` without a valid Supabase session return to `/login`.

An OAuth callback without a valid code must never grant dashboard access.

## Operational requirements

- Configure Supabase redirect URLs for every deployed origin.
- Rotate provider and service-role credentials if they are exposed.
- Keep `.env`, `.env.local`, and backend environment files out of Git.
- Review RLS policies whenever a table or client query is added.
- Treat model scores as signals, not identity proof or an autonomous legal/banking decision.

## Responsible disclosure

Do not publish vulnerabilities in a public issue. Email `voiceshield.sih@gmail.com` with `[SECURITY]` in the subject, affected component, reproduction steps, impact, and any suggested mitigation. We aim to acknowledge reports within 48 hours.
