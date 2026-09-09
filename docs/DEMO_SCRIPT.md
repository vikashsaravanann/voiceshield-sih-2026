# VoiceShield SIH 2026 - Demo Script

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
