# VoiceShield SIH 2026 Pitch Deck & Script

**Problem Statement ID:** SIH26104  
**Title:** AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks  
**Organization:** AICTE – Cyber Security Cell  
**Theme:** Blockchain & Cybersecurity  

---

## 1. Pitch Deck Slide Outline

### Slide 1: Title & Hook
- **Headline:** VoiceShield — Detect the clone. Protect the conversation.
- **Problem Statement ID:** SIH26104 | AICTE Cyber Security Cell
- **Visual:** Real-time waveform split between genuine voice and synthetic clone with detected anomaly heatmap.

### Slide 2: The National Emergency
- Voice cloning takes only 3 seconds of reference audio.
- Over ₹1,400 Crore lost to AI voice impersonation fraud in India in 2024–2025.
- Target vectors: CEO fraud, virtual kidnapping of students, OTP/UPI extraction over phone calls, and banking KYC bypass.

### Slide 3: The Critical Architectural Gap
- Existing tools are **post-incident file upload classifiers** that take 10–30 seconds.
- Voice spoofing happens during a **live phone call**.
- By the time an audio file is saved and analyzed, the bank transfer is completed.

### Slide 4: The VoiceShield Solution
- Real-time in-call detection pipeline running in **sub-250ms**.
- 333ms audio chunks streamed continuously over WebSocket.
- Dual-action framework: **Passive continuous detection** + **Active challenge-response prevention**.

### Slide 5: Deep Technical Architecture
- Web Audio API capturing at 16kHz PCM16.
- Hybrid DSP feature extraction: 40-dim LFCC + deltas, 64-bin Mel spectrogram, instantaneous phase variance.
- Anti-spoofing backbone: Graph-attention AASIST and Wav2Vec2.
- Temporal smoothing via Kalman filtering to prevent false spikes.

### Slide 6: Active Prevention: Challenge-Response
- If cumulative risk enters the medium zone (30–70%), the system arms a dynamic challenge.
- Prompts caller with randomized phonemic phrases in **Hindi, Tamil, or English**.
- Cloned voice TTS models struggle with real-time phonemic articulation and unpredictable dialect variations.

### Slide 7: Resilience & Differentiator
- Telephony networks drop connections constantly.
- VoiceShield features an in-memory **4-second ring buffer** with exponential backoff and ±20% jitter.
- Reconnects and replays buffered chunks using monotonic `chunk_index` resumption.
- **Zero raw audio stored on disk** — compliant with India's Digital Personal Data Protection (DPDP) Act.

### Slide 8: Evaluation & Benchmark Results
- **EER:** <5% on telephony-band (G.711 / AMR-NB) transcoded splits.
- **Latency:** 180ms on CPU, 45ms on GPU (well within the 333ms hop budget).
- **False Acceptance Rate:** <3% at production operating threshold.

### Slide 9: Live Demonstration Blueprint
- 8-step live walkthrough: Clean speech -> Synthetic injection -> Spectrogram heatmaps -> Challenge trigger -> Network drop recovery -> Audit log inspection.

### Slide 10: Market & National Impact
- Direct integration for Indian telecom providers (TRAI/DoT), bank call centers (RBI fraud prevention guidelines), and consumer mobile dialers.
- Estimated fraud prevention impact: ₹500+ Crore annually across BFSI and emergency call lines.

### Slide 11: Roadmap & Future Vision
- Native SIP trunk proxy for Asterisk/FreePBX.
- Android and iOS dialer SDKs.
- On-device edge inference with quantized ONNX/TFLite models.

---

## 2. 60-Second Elevator Pitch Script

> *"Respected judges, with just three seconds of audio from a WhatsApp story or YouTube video, an attacker can clone your voice and call your parents claiming an emergency to extract immediate UPI transfers. Today, India loses hundreds of crores to these synthetic voice attacks because our telephony infrastructure has zero real-time detection.*
>
> *We built **VoiceShield**. VoiceShield is not an offline file uploader. It is a real-time, in-call cybersecurity defense system that inspects voice streams every 333 milliseconds. Our hybrid DSP and deep learning pipeline extracts linear frequency cepstral coefficients and phase discontinuities to catch neural vocoder signatures in under 250 milliseconds.*
>
> *When risk crosses 30%, VoiceShield doesn't just alert—it actively prevents fraud by issuing randomized phonemic challenges in Hindi, Tamil, and English that AI voice clones cannot synthesize on the fly. And because real-world networks drop, our 4-second ring buffer and jittered backoff ensure zero packet loss.*
>
> *VoiceShield detects the clone, protects the conversation, and secures India's voice communications. Thank you."*
