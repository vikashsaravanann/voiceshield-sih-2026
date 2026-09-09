# Deployment

## This preview app

TanStack Start on the App Builder runtime. Platform injects `DATABASE_URL` and auth. **Never commit a `.env` file.**

## SIH split (GitHub `voiceshield-sih2026`)

```
voiceshield-sih2026/
  apps/web/          Next.js 14 App Router  → Vercel
  apps/api/          FastAPI + WS + ONNX    → Render or HF Space
  packages/ui/       shared components
  packages/config/   eslint / tsconfig
  ml/                training, ASVspoof, export
  infra/migrations/  Supabase SQL (twin of migrations/0002_voiceshield.sql)
  docs/              this pack
```

### Frontend — Vercel

1. Link the GitHub repo. Root: `apps/web`.
2. Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_WS_URL`.
3. Chunk config in `lib/audioConfig.ts` must match this console (`333` / `4`).
4. Reconnect: `baseDelay=1000`, `maxDelay=30000`, `multiplier=2`, `jitter=0.2`, `maxAttempts=10`.

### Backend — Render or Hugging Face GPU

Dockerfile sketch:

```dockerfile
FROM nvidia/cuda:12.1.0-cudnn8-runtime-ubuntu22.04
RUN apt-get update && apt-get install -y python3.11 python3-pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app
WORKDIR /app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
```

Env: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `MODEL_PATH`.

GPU Space settings: T4 or A10G. On boot:

1. Load ONNX/Torch graph onto CUDA.
2. Run three dummy hops (random 5333-sample tensors).
3. Serve. `/health` runs a tiny inference + reports `torch.cuda` memory.

Keep-alive: GitHub Actions cron or UptimeRobot hitting `/health` every 3 minutes. Document cost.

### Supabase

1. Create project. Apply `infra/migrations` (same tables as `migrations/0002_voiceshield.sql`: `profiles`, `vs_sessions`, `detection_events`, `challenge_responses`, `connection_audit_logs`, `auth_audit_logs`).
2. Enable RLS on every table.
3. Analyst policy: `user_id = auth.uid()::text` for SELECT/INSERT. No UPDATE/DELETE on audit tables.
4. Admin policy: `profiles.role = 'admin'`.
5. Seed one admin and one analyst for the demo.

RLS sketch:

```sql
alter table vs_sessions enable row level security;
create policy vs_sessions_self on vs_sessions
  for select using (user_id = auth.uid()::text
    or exists (select 1 from profiles p
               where p.user_id = auth.uid()::text and p.role = 'admin'));
create policy vs_sessions_insert on vs_sessions
  for insert with check (user_id = auth.uid()::text);
```

## Fallback test (judges)

1. Open Live demo. Start live path.
2. Click **Simulate drop**.
3. Expect: “Connection lost — reconnecting” banner, jittered delay, ring buffer still filling, then resume from `last_chunk_index`.
4. Sign in → Vault: a `disconnected` row and a `resume` row for that session.

## Local 36-hour loop

```
# web
cd apps/web && pnpm i && pnpm dev

# api
cd apps/api && python -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Do not store raw audio. A demo fails if a `.wav` exists in the session directory at stop.
