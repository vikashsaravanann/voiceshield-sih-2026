# VoiceShield Live Demonstration Script (SIH 2026)

**Audience:** SIH Evaluators & Cyber Security Cell Mentors  
**Duration:** 5–7 Minutes  
**Prerequisites:** Laptop with mic, demo cloned audio sample, open browser window.

---

## 8-Step Demonstration Walkthrough

### Step 1: System Initialization
- **Action:** Open `https://voiceshield-sih-2026.vercel.app` (or `http://localhost:3000`).
- **Narrative:** Introduce VoiceShield, the SIH26104 problem statement, and explain that all detection happens in real time without persisting raw audio.
- **Visual:** Clean landing page highlighting real-time metrics and the SIH 2026 badge.

### Step 2: Operator Console & Natural Speech Baseline
- **Action:** Click **Start Live Demo** and grant microphone permissions.
- **Narrative:** Speak naturally into the microphone for 5–10 seconds.
- **Visual:**
  - Real-time waveform oscillates steadily.
  - Risk meter remains **Green (Risk < 20%)**.
  - Spectrogram displays natural speech energy distribution without high-frequency energy anomalies.

### Step 3: Injection of Cloned Voice Audio
- **Action:** Play a synthetic voice cloned sample (or toggle synthetic clone injection).
- **Narrative:** *"Now we simulate an incoming cloned voice stream generated via a modern neural vocoder."*
- **Visual:**
  - Within **one 333ms frame (<250ms latency)**, the risk score surges past 75%.
  - Risk meter transitions to **flashing RED (HIGH RISK)**.
  - Plain-English marker triggers: `"High-frequency anomaly detected"`, `"Phase discontinuity variance elevated"`.

### Step 4: Explainable AI Spectrogram Overlay
- **Action:** Point the evaluator to the spectrogram canvas.
- **Narrative:** Explain why the model made this decision—pointing out the red highlight bars showing robotic phase alignment and abnormal energy bands typical of vocoders.

### Step 5: Active Prevention: Challenge-Response
- **Action:** As risk exceeds 50%, the **Challenge-Response Module** appears automatically.
- **Narrative:** *"VoiceShield doesn't just display a warning; it actively blocks fraud by demanding dynamic phonemic verification."*
- **Action:** Select language (Hindi, Tamil, or English). Read the prompt.
- **Visual:** System evaluates the challenge utterance and confirms caller authenticity or maintains block status.

### Step 6: Network Drop & Resilience Demonstration
- **Action:** Click **"Simulate Network Drop"**.
- **Narrative:** *"Indian mobile networks drop constantly. A defense tool cannot crash when connectivity fluctuates."*
- **Visual:**
  - Status changes to **Amber / Reconnecting (Attempt 1)**.
  - Microphone capture continues uninterrupted into the in-memory **4-second ring buffer**.
  - Connection auto-restores; client transmits `session.resume` with `last_processed_chunk_index`.
  - Buffered frames replay in under 1 second without dropping telemetry.

### Step 7: Session Summary Inspection
- **Action:** Click **"End Session"**.
- **Visual:** Session summary modal displays:
  - Total chunks analyzed
  - Average and peak spoof probability
  - Latency distribution (<250ms average)
  - Reconnection metrics (1 drop, 0 dropped frames)

### Step 8: Verifying the RLS Audit Trail
- **Action:** Navigate to the Operator Dashboard (`/dashboard`).
- **Narrative:** Demonstrate that every connection event, risk calculation, and challenge response is cryptographically secured with Supabase Row-Level Security, providing admissible forensic evidence for cyber cell investigators.
