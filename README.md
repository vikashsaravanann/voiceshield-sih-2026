
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
| [Member 2] | Full-Stack Developer |
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
