# VoiceShield Production Deployment Guide

**SIH 2026 | Problem ID: SIH26104 | AICTE – Cyber Security Cell**  
*AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks*

---

## 1. Frontend Deployment (Vercel)

### Configuration
- **Root Directory:** `./` (Repository root containing Next.js configuration)
- **Framework Preset:** Next.js
- **Node.js Version:** 20.x

### Environment Variables
Configure under Vercel Project Settings → Environment Variables:

| Variable | Value Description |
|---|---|
| `NEXT_PUBLIC_APP_NAME` | `VoiceShield` |
| `NEXT_PUBLIC_SITE_URL` | `https://voiceshield-live.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `YOUR_SUPABASE_ANON_KEY` |
| `NEXT_PUBLIC_FASTAPI_HTTP_URL` | `https://voiceshield-sih-2026-production.up.railway.app` |
| `NEXT_PUBLIC_FASTAPI_WS_URL` | `wss://voiceshield-sih-2026-production.up.railway.app/ws/audio` |
| `NEXT_PUBLIC_ENABLE_LIVE_DEMO` | `true` |
| `NEXT_PUBLIC_ENABLE_CHALLENGE_RESPONSE` | `true` |
| `NEXT_PUBLIC_ENABLE_FALLBACK_MODE` | `true` |

---

## 2. Inference API Deployment (Railway)

### Configuration
- **Service Type:** Web Service (Docker)
- **Root Directory:** `apps/api`
- **Health Check Path:** `/health`
- **Instance Type:** Starter or Standard (CPU)

### Environment Variables
| Variable | Value Description |
|---|---|
| `APP_ENV` | `production` |
| `PORT` | `8000` |
| `SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `YOUR_SUPABASE_SERVICE_ROLE_KEY` |
| `SUPABASE_JWT_SECRET` | `YOUR_SUPABASE_JWT_SECRET` |
| `MODEL_PATH` | `./models/aasist.pt` |
| `DEVICE` | `cpu` |
| `AUDIO_CHUNK_MS` | `333` |

### Backend Deployment (Railway)

Create a separate Railway service from this repository. Configure the service with:

- **Root Directory:** `apps/api`
- **Builder:** Dockerfile
- **Dockerfile Path:** `Dockerfile`
- **Healthcheck Path:** `/health`

Do not set the Dockerfile path to `apps/api` when the root directory is already
`apps/api`; that makes Railway search for `apps/api/apps/api`.

Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEXT_PUBLIC_SITE_URL` as
service variables. Railway supplies `PORT` automatically. After deployment,
verify `https://YOUR-BACKEND-DOMAIN/health` returns HTTP 200, then set the
frontend `NEXT_PUBLIC_FASTAPI_HTTP_URL` and `NEXT_PUBLIC_FASTAPI_WS_URL`
variables to the generated backend domain.

---

## 3. GPU Backend Deployment (Hugging Face Spaces)

For high-throughput or Wav2Vec2-AASIST / TFPARN inference:
1. Create a new Space on Hugging Face with **Docker SDK**.
2. Select **T4 Small (16 GB)** or **A10G Small (24 GB)** GPU.
3. Configure `Dockerfile` with base image `nvidia/cuda:12.1.0-cudnn8-runtime-ubuntu22.04`.
4. Expose port `7860`.
5. Set environment variable `DEVICE=cuda` and `ENABLE_FP16=true`.
6. Ensure model warm-up executes on application startup.
7. Setup an external uptime monitor (e.g. BetterStack or CronJob) hitting `/health` every 3 minutes to avoid space sleep.

---

## 4. Database Provisioning (Supabase)

1. Create a Supabase project (select Asia South 1 - Mumbai region for low latency).
2. Execute migration files in numerical order:
   ```bash
   supabase db push
   ```
   Or apply `infra/migrations/0001_extensions.sql` through `0009_rls_policies.sql` in the Supabase SQL Editor.
3. Apply `infra/seed/demo_data.sql` to populate sample judge demonstration profiles and detection history.
4. Verify Row-Level Security is active on all 6 tables.
5. Create a private storage bucket named `challenge-audio` with access restricted to the backend service role.

---

## 5. Live Judge Demonstration Verification

1. Navigate to `/demo`.
2. Click **Start Live Demo** and speak to show low risk (<30%).
3. Use the **Simulate Network Drop** trigger to display the yellow reconnection banner and verify ring buffer accumulation.
4. Reconnect to show seamless session resumption and chunk replay.
5. Review the session audit entry in `connection_audit_logs`.
