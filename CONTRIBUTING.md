# Contributing

1. Keep hops deterministic. Never write PCM to disk.
2. Browser never receives `SUPABASE_SERVICE_ROLE_KEY`.
3. Server writes are scoped by the verified user id.
4. Open a PR against `main`. CI must pass (`npm run build` + API pytest).
