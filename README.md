# VoiceShield - SIH 2026 🛡️

**Problem Statement:** SIH26104 (AICTE Cyber Security Cell)  
**Developer:** Vikash

I built VoiceShield to tackle the growing and terrifying problem of AI voice cloning fraud. The idea really hit home when I kept reading about elderly people being scammed by deepfakes of their own grandchildren over the phone. I realized we needed a practical, real-time detection system that doesn't just analyze audio after the fact, but stops the call *while* it's happening.

This repository contains the complete codebase for my Smart India Hackathon submission.

## 🔗 Live Links
- **Frontend (Vercel):** https://voiceshield-live.vercel.app
- **Backend API (Render):** https://voiceshield-sih-2026.onrender.com

## 💡 What I Learned

Building this was a massive learning curve. Some key takeaways:
- **Web Audio API is wild:** Getting raw PCM16 audio out of the browser and into a WebSocket reliably across different browsers took a lot of trial and error. (Safari is particularly annoying).
- **Latency is everything:** Initially, I was using 500ms chunks, but it felt too sluggish. I spent a whole weekend dialing it down to ~330ms chunks to get that real-time "instant" feel without overwhelming the backend.
- **Supabase Realtime is magic:** I struggled with polling the database at first, but switching to PostgreSQL subscriptions made the dashboard feel incredibly alive.

## 🚧 Challenges Faced

The hardest part was definitely the Twilio WhatsApp integration. Getting the webhook payloads right, dealing with trial account restrictions (which required using a specific approved `ContentSid`), and making sure the API didn't crash if an environment variable was missing was incredibly frustrating but rewarding when it finally clicked.

Also, fighting Next.js 15 SSR caching when trying to read Supabase cookies was a headache. (See the comments in my `middleware.ts` for how I eventually solved it).

## 🚀 Getting Started (Local Dev)

### 1. Frontend (Next.js)
```bash
# I use npm, but yarn/pnpm should work too
npm install
npm run dev
```

### 2. Backend (FastAPI)
```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

*Note: You need API keys for Groq and Supabase for this to run locally. See `.env.example`.*

## 🔮 Future Improvements
- [ ] Add telephony/SIP integration directly (right now it's WebRTC in browser)
- [ ] Implement a proper Challenge-Response system (asking the caller to repeat a random phrase)
- [ ] Move the LFCC extraction strictly to C++ or Rust for even better latency
- [ ] Clean up some of the messy CSS in the dashboard (sorry, hackathon code!)

---
*Built with ❤️ for SIH 2026. DPDP Act 2023 Compliant.*
