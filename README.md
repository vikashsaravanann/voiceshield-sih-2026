# VoiceShield 🛡️

> **Detect the clone. Protect the conversation.**

### AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks

**Smart India Hackathon 2026 | Problem ID: SIH26104 | AICTE – Cyber Security Cell**

[![SIH 2026](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-FF671F?style=for-the-badge)](https://www.sih.gov.in/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 🔍 Problem Statement

Generative AI now enables high-fidelity voice cloning from as little as 3 seconds of audio.
India's telephony and digital communication systems have no real-time layer to detect or
prevent synthetic voice impersonation — leaving citizens, banks, and institutions exposed to:

- **CEO fraud** via cloned executive voices
- **UPI/OTP social engineering** using family voice impersonation
- **KYC bypass** using AI-generated voice responses
- **Call-center impersonation** targeting financial institutions

**SIH26104** calls for an end-to-end framework that detects AI-generated voices in real time
and prevents fraudulent actions before harm occurs.

---

## 💡 Solution — VoiceShield

VoiceShield is a real-time cybersecurity platform that:

1. Captures incoming voice streams via browser or VoIP
2. Chunks audio into 333ms frames and streams over WebSocket
3. Runs hybrid DSP + deep learning spoof detection on each frame
4. Returns a risk score with explainable markers in under 250ms
5. Triggers challenge-response verification at medium/high risk
6. Logs every event to a secure, RLS-protected audit trail

---

## ✨ Key Features

| Feature | Description |
|---|---|
| ⚡ Real-Time Detection | Sub-300ms spoof detection over WebSocket per audio chunk |
| 🧠 Hybrid ML Pipeline | DSP features + fine-tuned AASIST / Wav2Vec2 anti-spoofing model |
| 🔍 Explainable AI | Spectrogram heatmaps with plain-English risk explanations |
| 🗣️ Challenge-Response | Unpredictable phrase verification in Hindi, Tamil, English |
| 🔒 Risk-Based Actions | warn → challenge → block/flag pipeline |
| 📊 Audit Trail | Supabase RLS-protected session, connection, and auth logs |
| 🔁 WebSocket Resilience | Exponential backoff, jitter, ring buffer, session resume |
| 🖥️ GPU-Backed Inference | Optimized Hugging Face Spaces deployment with warm-up |
| 📱 Responsive UI | Judge-ready, mobile-friendly Next.js interface on Vercel |
| 🇮🇳 India-First Design | Multilingual, BFSI-aligned, national fraud context |

---

## 🏗️ Architecture

Browser Mic (16kHz PCM16)
│
▼
Next.js Web Audio API + Ring Buffer (4s)
│ 333ms chunks over WebSocket
▼
FastAPI /ws/audio
├── DSP Feature Extraction (LFCC, Mel-Spectrogram, Phase)
├── Anti-Spoofing Model Inference (AASIST / Wav2Vec2-AASIST)
├── Decision Engine (low/medium/high risk)
└── Explainability Markers
│
▼
JSON Response → Next.js Risk Dashboard
├── Risk Meter + Spectrogram Overlay
└── Challenge-Response (if risk ≥ medium)
│
▼
Supabase Postgres
├── sessions, detection_events, challenge_responses
├── connection_audit_logs, auth_audit_logs
└── Row-Level Security on all tables


---

## 🛠️ Tech Stack

**Frontend:** Next.js 14 · TypeScript · Tailwind CSS · Web Audio API · Vercel  
**Backend:** FastAPI · PyTorch · Torchaudio · Librosa · WebSockets · Docker · Render/HF Spaces  
**Database:** Supabase Postgres · Supabase Auth · Supabase Storage · RLS  
**ML:** ASVspoof 2019/2021/5 · AASIST · RawNet2 · Wav2Vec2-AASIST · TFPARN  
**DevOps:** GitHub · Vercel CI/CD · Supabase CLI · Docker  

---

## 📈 Target Metrics

| Metric | Target |
|---|---|
| Equal Error Rate (EER) | < 5% on ASVspoof 2019 LA |
| End-to-End Latency | < 250ms per 333ms chunk |
| False Acceptance Rate | < 3% at operating threshold |
| WebSocket Reconnect | < 2s average (backoff + jitter) |

---

## 🎬 Demo Flow (For Judges)

1. Open [voiceshield-sih-2026.vercel.app](https://voiceshield-sih-2026.vercel.app)
2. Click **Start Live Demo** — allow microphone
3. Speak naturally → **risk meter stays green**
4. Play cloned voice sample → **risk spikes red + heatmap appears**
5. System triggers **challenge-response** (phrase in your language)
6. Click **Simulate Network Drop** → reconnection banner → session resumes
7. View **session summary** (avg risk, chunks, challenge outcome)
8. Open **dashboard** → inspect full detection timeline + audit logs

---

## 🚀 Local Setup

### Prerequisites
- Node.js 20+, pnpm
- Python 3.11+, pip
- Supabase CLI, Vercel CLI

### Steps

```bash
# Clone
git clone https://github.com/voiceshield-team/voiceshield-sih-2026.git
cd voiceshield-sih-2026

# Frontend
cd apps/web && pnpm install

# Backend
cd ../api && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Environment
cp .env.example apps/web/.env.local
cp .env.example apps/api/.env
# Fill in Supabase URL, keys, and FastAPI URL

# Database
supabase db push  # from /infra/migrations/

# Run
pnpm --dir apps/web dev          # Frontend → localhost:3000
uvicorn app.main:app --reload    # Backend  → localhost:8000
```

---

## 📦 Deployment

| Layer | Platform | URL |
|---|---|---|
| Frontend | Vercel | voiceshield-sih-2026.vercel.app |
| Backend | Render / HF Spaces | voiceshield-api.onrender.com |
| Database | Supabase | YOUR_PROJECT_REF.supabase.co |

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full step-by-step guide.

---

## 🔐 Security & Privacy

- Raw audio is **never stored** by default (`STORE_RAW_AUDIO=false`)
- Supabase **Row-Level Security** enforced on all tables
- Service-role key **never exposed** to browser or frontend
- All auth and connection events logged with **append-only audit tables**
- See [SECURITY.md](SECURITY.md) and [docs/DATA_PRIVACY.md](docs/DATA_PRIVACY.md)

---

## 🗺️ Roadmap

- [ ] Twilio / Exotel telephony integration
- [ ] React Native / Flutter mobile SDKs
- [ ] On-device inference (TFLite / ONNX Runtime Mobile)
- [ ] Expanded Indian language challenge phrases
- [ ] BFSI fraud monitoring dashboard integration
- [ ] Federated learning for privacy-preserving model updates

---

## 👥 Team

**Team Name:** [Your Team Name]  
**Institution:** [Your College], [City], India  
**SIH 2026 Problem ID:** SIH26104  

| Name | Role |
|---|---|
| [Member 1] | ML Engineer |
|  Vikash S  | Full-Stack Developer |
| [Member 3] | Backend & DevOps |
| [Member 4] | UI/UX & Frontend |
| [Member 5] | Research & Evaluation |
| [Member 6] | Product & Documentation |

**Mentor:** [Mentor Name], [Designation]

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🔗 Links

- 🌐 [Live Demo](https://voiceshield-sih-2026.vercel.app)
- 📁 [GitHub Repository](https://github.com/voiceshield-team/voiceshield-sih-2026)
- 📘 [API Documentation](docs/API.md)
- 🏗️ [Architecture](docs/ARCHITECTURE.md)
- 🤖 [ML Pipeline](docs/ML_PIPELINE.md)
