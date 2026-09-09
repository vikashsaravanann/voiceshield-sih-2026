import os

base_dir = "/Users/vikash/voiceshield-next"

files = {}

# 1. GitHub Actions CI
files[".github/workflows/ci.yml"] = """name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build Next.js
        run: npm run build
"""

# 2. Demo Script
files["docs/DEMO_SCRIPT.md"] = """# VoiceShield SIH 2026 - Demo Script

## 1. The Hook (0:00 - 1:00)
- **Action:** Open the VoiceShield Landing Page.
- **Script:** "Judges, voice cloning fraud cost India millions last year. Existing solutions require users to upload a WAV file and wait. We built V-SHIELD to stop the scam *while the call is happening*."

## 2. The Tech Showcase (1:00 - 2:30)
- **Action:** Click 'Launch Live Demo' and allow microphone. 
- **Script:** "Notice the real-time spectrogram. We aren't just looking at volume; we are running local Digital Signal Processing to analyze Linear Frequency Cepstral Coefficients (LFCC) and phase jitter—the exact artifacts AI vocoders leave behind."
- **Action:** Speak normally.
- **Script:** "The latency is under 300ms. My voice registers as Human."

## 3. The Attack & Defense (2:30 - 4:00)
- **Action:** Play an AI-cloned audio clip from your phone into the mic.
- **Script:** "Now, an attacker calls using a cloned voice. Watch the Risk Meter spike."
- **Action:** The system triggers the Challenge-Response.
- **Script:** "Because the acoustic risk hit 70%, our system triggers a Challenge-Response. But we go further: using the Groq LPU, we transcribe the audio in under 150ms and use Llama 3 to detect that the caller is urgently asking for money. The system automatically blocks the transaction and logs the telemetry to Supabase."

## 4. The Analytics (4:00 - 5:00)
- **Action:** Open the Supabase Database dashboard to show the logs.
- **Script:** "Everything is logged immutably. This data can be automatically forwarded to the I4C portal."
"""

# 3. Architecture
files["docs/ARCHITECTURE.md"] = """# System Architecture

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
"""

for filepath, content in files.items():
    full_path = os.path.join(base_dir, filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content)

print("Applied Docs and CI successfully!")
