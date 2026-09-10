# VoiceShield Architecture (SIH 2026)

*Written by Vikash | 3:00 AM, the night before submission*

## High-Level Overview

This is the technical architecture for **VoiceShield (SIH26104)**. I didn't want to build just another "upload an MP3 and wait 10 minutes" app. The challenge specifically asks for *real-time* telecommunication protection, so I built a WebSocket-based streaming architecture.

```mermaid
graph TD
    A[Browser Mic] -->|16kHz PCM16 Audio| B(Next.js Client)
    B -->|WebSocket Chunking (333ms)| C[FastAPI Backend]
    C -->|LFCC Extraction| D[1D-CNN Model]
    D -->|Risk Score / Prob| E[Policy Engine]
    E -->|JSON Response| B
    E -->|High Risk| F[Twilio WhatsApp Alert]
    C -->|Batch Insert| G[(Supabase PostgreSQL)]
```

## The Frontend (Next.js 14)

I chose Next.js mostly because of the App Router, though SSR (Server Side Rendering) gave me massive headaches with Supabase auth cookies. 
The entire real-time visualization (`app/demo/page.tsx`) runs completely client-side (`"use client"`). 

**Audio Capture Logic:**
I tried using standard `MediaRecorder` at first, but it chunks audio in `.webm` format. You can't run inference on chunks of compressed WebM without massive latency from decoding. So, I used the **Web Audio API** (`AudioWorklet`) to capture raw `PCM16` bytes. 

*Lesson Learned:* Safari hates Web Audio API. I had to add a bunch of fallbacks and user-gesture workarounds just to get the mic to stay active.

## The Backend (FastAPI)

I went with Python + FastAPI instead of Node.js because the machine learning ecosystem (PyTorch/Librosa) is entirely Python-based.

**Why WebSockets?**
HTTP polling is way too slow for a sub-250ms latency budget. We keep a persistent WS connection open, and the client pushes a binary chunk every 333ms.

**The Model Pipeline:**
1. Backend receives bytes.
2. Extracts LFCC (Linear Frequency Cepstral Coefficients). I tried MFCCs first, but LFCCs preserve higher-frequency phase anomalies better (which is where AI voice clones usually fail).
3. Pushes features through a quantized 1D-CNN.
4. Returns the risk score.

*Performance note:* Initially, loading the PyTorch model took 2 seconds per connection. I fixed this by pre-loading it into `app.state` during the FastAPI `lifespan` context manager. Latency is now consistently <30ms on the backend.

## The Database (Supabase)

I used Supabase mostly because the Realtime PostgreSQL subscription feature is insanely easy to use for the dashboard. 

*Gotcha:* I almost took down the database by doing an `insert()` on every single 333ms audio chunk. I rewrote the backend `audio_endpoint.py` to buffer the telemetry and flush it in batches of 5.

## What I'd Do Differently Next Time

1. **Write the audio extractor in Rust.** Python is fast enough for the ML inference, but processing byte arrays natively would save another ~10ms.
2. **Proper SIP integration.** Right now it runs in the browser. A real telecom integration would involve tapping into a SIP trunk (like FreeSWITCH or Asterisk), but that was out of scope for a 48-hour hackathon.
