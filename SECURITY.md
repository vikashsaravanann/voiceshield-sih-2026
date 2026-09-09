# Security

- Report vulnerabilities privately to the team. Do not open public issues for exploitable bugs.
- Service-role keys, JWT secrets, and HF tokens stay in GitHub Actions secrets / Render env — never in this repo.
- RLS is mandatory on every application table (`infra/migrations/0009_rls_policies.sql`).
- `STORE_RAW_AUDIO` defaults to false. Challenge audio, if ever stored, is private-bucket only.
