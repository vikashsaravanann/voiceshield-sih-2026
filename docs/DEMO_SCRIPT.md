# VoiceShield judge demonstration

**Target duration:** 5 minutes
**Core message:** detection is useful only when it arrives early enough to change the conversation.

## Before the room opens

- Open the production console and confirm the API health card shows **Online**.
- Use headphones or a quiet room for the microphone demonstration.
- Keep a synthetic-voice sample available only with permission.
- Confirm the browser has microphone permission and the Supabase session is active.
- Never display secrets, personal audio, or real victim information.

## Run of show

### 1. Problem and promise — 0:00–0:45

Open the landing page and say:

> “Voice cloning turns a familiar voice into an attack surface. VoiceShield watches the conversation in real time and gives an operator evidence and a response path before trust becomes a transfer.”

Point out SIH26104, the privacy boundary, and the live inference status.

### 2. Clean speech baseline — 0:45–1:45

Open `/demo`, allow the microphone, and speak normally. Show:

- the WebSocket connection state;
- the moving spectrogram;
- the risk meter remaining in the low range;
- the response latency and detection markers.

Explain that the browser sends 16 kHz mono PCM16 windows and the API returns structured detection results.

### 3. Synthetic voice signal — 1:45–2:45

Play an approved synthetic sample or use a pre-recorded test fixture. Do not use someone’s voice without consent. Show the risk score and explainability markers changing. Emphasize that a score is a signal for operator review, not an automatic identity verdict.

### 4. Response workflow — 2:45–3:45

Show the challenge-response control and the suggested action. Explain how an operator can pause, challenge, document, and escalate instead of relying on a single black-box number.

### 5. Evidence and resilience — 3:45–5:00

Open the session vault or report view. Show the session summary, timestamps, risk distribution, and audit metadata. If available, demonstrate reconnect/resume behavior. Close with:

> “The differentiator is the loop: fast signal, explainable context, deliberate human response, and an auditable record—without storing raw audio by default.”

## Recovery plan

If the backend is unavailable, show the browser shell and the health card’s explicit standby state. Do not claim live inference. If microphone permission fails, explain the browser restriction and use the approved fixture.
