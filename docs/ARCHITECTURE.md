# System Architecture

## Frontend (Next.js 14)
- **Web Audio API:** Captures 16kHz PCM16 audio chunks directly from the browser.
- **Spectrogram:** HTML5 Canvas rendering at 60fps for explainable AI visuals.
- **WebSockets:** Maintains persistent low-latency connection.

## Backend (FastAPI)
- **DSP Engine (Local):** Zero-crossing rate and spectral roll-off heuristics.
- **Groq Integration (Cloud):** Sub-150ms Whisper transcription and Llama 3 intent analysis.
- **Supabase Client:** Admin-level secure insertion of detection events using Service Role keys.

## Database (Supabase)
- **RLS Policies:** Enforced row-level security.
- **Realtime:** Capabilities for live dashboard monitoring.
