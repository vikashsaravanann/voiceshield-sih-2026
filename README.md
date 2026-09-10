# VoiceShield

> **Detect the clone. Protect the conversation.**

VoiceShield is a real-time voice-cloning detection and response console built for **Smart India Hackathon 2026 — SIH26104, AICTE Cyber Security Cell**. It streams short PCM audio windows to an inference service, scores synthetic-voice risk, surfaces interpretable markers, and keeps an operator focused on the decision that matters: trust, challenge, or escalate.

## Live system

| Surface | URL | Purpose |
| --- | --- | --- |
| Web console | [voiceshield-live.vercel.app](https://voiceshield-live.vercel.app) | Landing page, live demo, reports, documentation, and authenticated dashboard |
| Inference API | [voiceshield-sih-2026-production.up.railway.app](https://voiceshield-sih-2026-production.up.railway.app) | FastAPI health, WebSocket inference, session, audit, challenge, and telephony routes |
| API health | [`/health`](https://voiceshield-sih-2026-production.up.railway.app/health) | Deployment and model readiness probe |

The production API currently reports the AASIST model, CPU runtime, version `0.1.0`, and `STORE_RAW_AUDIO=false`. Treat model metrics as evaluation targets until they are reproduced on the target telephony distribution.

## What the project demonstrates

- **Live analysis:** 16 kHz mono PCM16 audio, streamed in 333 ms windows over WebSocket.
- **Detection context:** LFCC, Mel-spectrogram, phase inconsistency, and prosody markers are combined with the anti-spoofing model score.
- **Operator workflow:** risk meter, spectrogram, session feed, challenge-response controls, forensic report, and audit trail.
- **Authentication:** Supabase Auth with email/password, Google, and GitHub providers.
- **Privacy boundary:** raw audio is processed in memory and is not written to disk by default.
- **Resilience:** reconnect handling, session resume, a four-second ring buffer, and bounded telemetry batching.

VoiceShield is a detection and decision-support prototype. It does not replace human review, telecom controls, banking controls, or an incident-response process.

## Technology

| Layer | Technology |
| --- | --- |
| Web | Next.js App Router, React, TypeScript, Tailwind CSS, Lucide |
| Auth and persistence | Supabase Auth, PostgreSQL, Row Level Security |
| Inference service | FastAPI, Python, PyTorch/TorchScript, NumPy/SciPy |
| Streaming | Web Audio API, PCM16, WebSocket |
| Deployment | Vercel (web), Railway (API), Docker |

## Local setup

### Prerequisites

- Node.js 20+
- npm
- Python 3.10+
- Supabase project for authenticated and persisted flows

### Web console

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Required browser variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-or-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FASTAPI_HTTP_URL=http://localhost:8000
NEXT_PUBLIC_FASTAPI_WS_URL=ws://localhost:8000/ws/audio
```

For OAuth, add `http://localhost:3000/auth/callback` to Supabase Auth URL Configuration. Google and GitHub use the Supabase provider callback:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

### Inference API

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Verify readiness:

```bash
curl http://localhost:8000/health
```

The API can run without persistence for local UI work, but production Supabase variables are required for sessions, audit records, and authenticated data access.

## Important routes

| Route | Description |
| --- | --- |
| `/` | Product overview |
| `/login` | Email, Google, GitHub, registration, and password recovery |
| `/demo` | Live browser microphone demonstration |
| `/dashboard` | Authenticated monitoring and session vault |
| `/report` | Forensic report workflow |
| `/docs` | In-product technical documentation |
| `/auth/callback` | Supabase OAuth code exchange |

See [`docs/API.md`](docs/API.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), and [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for implementation contracts.

## Validation

```bash
npm run build
npm run typecheck
cd apps/api && pytest
```

The repository uses GitHub Actions for CI. Run checks sequentially when validating locally because Next.js and TypeScript both write to `.next`.

## Responsible use

Voice biometrics and synthetic-speech detection can affect real people. Use VoiceShield with consent, explainability, human review, and an appeal path. Do not use a single model score as the sole basis for denying service, making a legal finding, or taking an irreversible action.

## Project documents

- [Architecture](docs/ARCHITECTURE.md)
- [API and WebSocket protocol](docs/API.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Security model](docs/SECURITY.md)
- [ML pipeline](docs/ML_PIPELINE.md)
- [Judge demo script](docs/DEMO_SCRIPT.md)
- [SIH pitch](docs/SIH_PITCH.md)
- [Contributing](CONTRIBUTING.md)
- [Security reporting](SECURITY.md)

## License

MIT. See [`LICENSE`](LICENSE). Third-party model architectures and datasets remain subject to their own licenses and terms.
