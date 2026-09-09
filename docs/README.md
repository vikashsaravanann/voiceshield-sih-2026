# VoiceShield SIH pack

**VoiceShield – Real-Time Voice Cloning Detection & Prevention**
SIH 2026 · Problem ID SIH26104 · AICTE Cyber Security Cell

This folder is the team blueprint for the GitHub repo `voiceshield-sih2026`. The running product (live console, vault, auth) is the app itself.

| File | Contents |
| --- | --- |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Fallback, GPU, chunk tuning, audit, 16-step path |
| [`ML_PIPELINE.md`](ML_PIPELINE.md) | AASIST / RawNet2 / Wav2Vec2-AASIST / TFPARN |
| [`API.md`](API.md) | WebSocket `/ws/audio` and REST |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Vercel, Render, Hugging Face GPU, Supabase RLS |
| [`SIH_PITCH.md`](SIH_PITCH.md) | Slide outline and nine-minute demo script |

Contracts in this pack must stay identical to `src/lib/audio/config.ts`.
