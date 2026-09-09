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

1. Captures incoming voice streams via browser or VoIP (16kHz PCM16)
2. Chunks audio into 333ms frames and streams over WebSocket
3. Runs hybrid DSP + deep learning spoof detection on each frame
4. Returns a risk score with explainable markers in under 250ms
5. Triggers challenge-response verification at medium/high risk
6. Logs every event to a secure, RLS-protected audit trail

---

## ✨ Key Features

| Feature | Description |
|---|---|
| ⚡ **Real-Time Detection** | Sub-250ms spoof detection over WebSocket per 333ms audio chunk |
| 🧠 **Hybrid ML Pipeline** | DSP features (LFCC, Mel, Phase) + fine-tuned AASIST / Wav2Vec2 anti-spoofing model |
| 🔍 **Explainable AI** | Spectrogram heatmaps with plain-English risk explanations |
| 🗣️ **Challenge-Response** | Unpredictable phonemic phrase verification in Hindi, Tamil, and English |
| 🔒 **Risk-Based Actions** | Dynamic `monitor` (<30%) → `challenge` (30-70%) → `block` (≥70%) workflow |
| 📊 **RLS Audit Trail** | Supabase Postgres with append-only session, connection, and auth logs |
| 🔁 **WebSocket Resilience** | Exponential backoff, jitter, ring buffer (4s), and session resume |
| 🖥️ **GPU-Backed Inference** | Optimized Hugging Face Spaces / Render deployment with CUDA warm-up |
| 📱 **Responsive UI** | Judge-ready, mobile-friendly Next.js interface on Vercel |
| 🇮🇳 **India-First Design** | Multilingual support, BFSI-aligned, tailored for national telephony fraud context |
| 🛡️ **Zero Disk Audio** | Raw PCM audio processed strictly in volatile memory (`STORE_RAW_AUDIO=false`) |
| ⏱️ **Configurable Hop Size** | Tunable chunk latency budget: 250ms, 333ms (default), or 500ms |
| 📈 **Kalman Smoothing** | Dynamic temporal filtering preventing false alarms on noisy microphone hops |
| 🔐 **Role-Based Security** | Explicit separation of analyst, admin, and demo user privileges |
| 🛰️ **Thundering Herd Shield** | Randomized ±20% jitter preventing synchronized reconnection spikes |
| 🧪 **Deterministic Testing** | Automated CI pipeline covering feature extraction, DSP, and protocol parity |

---

## 🏗️ Architecture

```
Browser Mic (16kHz PCM16)
│
▼
Next.js Web Audio API + Ring Buffer (4s)
│ 333ms chunks over WebSocket
▼
FastAPI /ws/audio
├── DSP Feature Extraction (LFCC, Mel-Spectrogram, Phase Inconsistency)
├── Anti-Spoofing Model Inference (AASIST / Wav2Vec2-AASIST)
├── Decision Engine (low / medium / high risk)
└── Explainability Markers (High-Freq, Phase Discontinuity, Prosody)
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
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14+ (App Router) · TypeScript · Tailwind CSS · Web Audio API · Vercel
- **Backend:** FastAPI · PyTorch · Torchaudio · Librosa · WebSockets · Docker · Render / Hugging Face Spaces
- **Database:** Supabase Postgres · Supabase Auth · Supabase Storage · Row-Level Security (RLS)
- **ML:** ASVspoof 2019/2021/5 · AASIST · RawNet2 · Wav2Vec2-AASIST · TFPARN
- **DevOps:** GitHub Actions · Vercel CI/CD · Supabase CLI · Docker Compose

---

## 📈 Target Metrics

| Metric | Target |
|---|---|
| Equal Error Rate (EER) | < 5% on ASVspoof 2019 LA / Telephony split |
| End-to-End Latency | < 250ms per 333ms chunk |
| False Acceptance Rate (FAR) | < 3% at operating threshold |
| False Rejection Rate (FRR) | < 1% in natural speech conditions |
| WebSocket Reconnect | < 2s average (exponential backoff + jitter) |

---

## 🎬 Demo Flow (For Judges)

1. Open [voiceshield-sih-2026.vercel.app](https://voiceshield-sih-2026.vercel.app)
2. Click **Start Live Demo** — grant microphone access.
3. Speak naturally → **risk meter stays green (<30%)**.
4. Play cloned voice sample → **risk spikes red (≥70%) + spectrogram heatmap highlights anomalies**.
5. System triggers **multilingual challenge-response** (phrase in Hindi, Tamil, or English).
6. Click **Simulate Network Drop** → reconnection banner activates → session resumes without data loss.
7. View **session summary** (avg risk, total chunks, challenge outcome, reconnect time).
8. Open **dashboard** → inspect full detection timeline + audit logs with RLS protection.

---

## 🚀 Local Setup

### Prerequisites
- Node.js 20+, pnpm
- Python 3.11+, pip
- Supabase CLI, Docker (optional)

### Steps

```bash
# Clone
git clone https://github.com/voiceshield-team/voiceshield-sih-2026.git
cd voiceshield-sih-2026

# Install Frontend & Backend
make install

# Configure Environment
cp .env.example .env.local
cp .env.example apps/api/.env
# Fill in Supabase URL, keys, and FastAPI endpoints

# Apply Database Migrations & Seed
supabase db push
make seed

# Run Development Servers
make dev
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
```

---

## 📦 Deployment

| Layer | Platform | Recommended Config |
|---|---|---|
| Frontend | Vercel | Next.js 14+ App Router, Node 20.x |
| Backend | Render / HF Spaces | Docker Web Service / T4 GPU Space |
| Database | Supabase | Postgres 15+ with pg_crypto & uuid-ossp |

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full step-by-step guide.

---

## 🔐 Security & Privacy

- Raw audio is **never stored** on disk (`STORE_RAW_AUDIO=false`)
- Supabase **Row-Level Security** strictly enforced on all tables
- Service-role key **never exposed** to browser or client code
- All auth and connection events logged to **append-only audit tables**
- See [SECURITY.md](SECURITY.md) for details.

---

## 🗺️ Roadmap

- [ ] Twilio / Exotel Indian telephony SIP gateway integration
- [ ] React Native & Flutter mobile SDKs
- [ ] On-device edge inference (TFLite & ONNX Runtime Mobile)
- [ ] Expanded Indic language challenge phrases (Telugu, Bengali, Marathi)
- [ ] BFSI real-time fraud monitoring webhook dispatcher
- [ ] Federated learning for privacy-preserving model updates

---

## 👥 Team

**Team Name:** VoiceShield SIH Team  
**Problem Statement:** SIH26104 (AICTE – Cyber Security Cell)  

| Name | Role |
|---|---|
| Team Lead | ML Engineer & Architecture |
| Core Developer | Full-Stack Developer |
| Systems Engineer | Backend & DevOps |
| UI/UX Lead | Frontend & Operator Experience |
| Security Analyst | Research & Evaluation |
| Technical Writer | Product & Documentation |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🔗 Links

- 🌐 [Live Demo](https://voiceshield-sih-2026.vercel.app)
- 📁 [GitHub Repository](https://github.com/voiceshield-team/voiceshield-sih-2026)
- 📘 [API Documentation](docs/API.md)
- 🏗️ [Architecture Guide](docs/ARCHITECTURE.md)
- 🤖 [ML Pipeline Guide](docs/ML_PIPELINE.md)
