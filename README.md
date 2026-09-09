# VoiceShield — Detect the clone. Protect the conversation.

**SIH 2026 · Problem ID SIH26104 · AICTE Cyber Security Cell**

Real-time detection and prevention of voice-cloning impersonation attacks on Indian telephony (RTGS / IVR / virtual kidnapping). 333 ms hops, Kalman-smoothed C(t), EN/HI/TA phonemic challenge, DPDP: raw audio never hits disk.

## Live demo (this repo)

The Next.js app at the repository root is what Vercel builds.

```bash
npm install
npm run dev
# http://localhost:3000  →  /demo
```

1. Open **Live demo**. Allow the microphone. Speak — the meter stays Green.
2. **Inject cloned stream** — C(t) crosses 75% and arms a phonemic challenge.
3. **Simulate drop** — 4 s ring buffer, jittered backoff, resume from `last_chunk_index`.

## Architecture

```
GitHub  ──►  Vercel (Next.js, this root)
        ──►  Render / Hugging Face (apps/api FastAPI WebSocket)
        ──►  Supabase (Postgres + Auth + RLS)
```

| Layer | Path | Deploy |
| --- | --- | --- |
| Judge UI + live DSP | `app/`, `components/`, `lib/audio/` | Vercel |
| Inference worker | `apps/api` | Render or HF Docker Space |
| Schema + RLS | `infra/migrations` | Supabase SQL editor |
| Docs | `docs/` | in-repo |

## Supabase (Mumbai)

Project: `voiceshield-sih-2026`  
URL: `https://lynxmidkzwxhsvoyqmpsh.supabase.co`

Apply `infra/migrations/0001_*.sql` … `0009_rls_policies.sql` in order. First signed-in user becomes `admin`. Never put `SUPABASE_SERVICE_ROLE_KEY` in Vercel `NEXT_PUBLIC_*` vars.

## FastAPI

```bash
cd apps/api
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# GET /health   WS /ws/audio
```

## Contracts

| Knob | Value |
| --- | --- |
| Hop | 333 ms @ 16 kHz |
| Ring | 4 s |
| Backoff | 1 s × 2ⁿ, cap 30 s, ±20% jitter, 10 attempts |
| Green / Red | C(t) < 0.35 / ≥ 0.75 |
| Privacy | PCM in RAM only |

## Why Vercel was 404

A README-only `main` branch produces Vercel `NOT_FOUND`. This tree is a real Next.js App Router app at the repo root so the existing Vercel project builds without changing Root Directory.
