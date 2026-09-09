# VoiceShield Architecture Blueprint

**SIH 2026 | Problem ID: SIH26104 | AICTE – Cyber Security Cell**  
*AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks*

---

## 1. System Overview & End-to-End Pipeline

VoiceShield implements a multi-tier, real-time defense architecture designed for sub-250ms voice cloning detection over web and Indian telephony audio streams.

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|                                                                         |
|  [Browser Mic / WebRTC] ---> [Web Audio API Node]                       |
|                                    |                                    |
|                                    v                                    |
|                      [16kHz PCM16 Downsampler]                          |
|                                    |                                    |
|                                    v                                    |
|                          [333ms Chunk Slicer]                           |
|                             /              \                            |
|                            v                v                           |
|                   [WebSocket Stream]   [4s Circular Ring Buffer]        |
+---------------------------|---------------------------------------------+
                            | wss://api/ws/audio (PCM16 chunks)
                            v
+-------------------------------------------------------------------------+
|                        FASTAPI INFERENCE WORKER                         |
|                                                                         |
|   1. Audio Chunk Ingestion (16kHz, mono, PCM16)                         |
|   2. DSP Feature Extraction:                                            |
|      - 40-dim Linear Frequency Cepstral Coefficients (LFCC) + deltas    |
|      - 64-bin Log-scaled Mel-Spectrogram                                |
|      - Phase Inconsistency (Instantaneous Frequency Variance)           |
|   3. Anti-Spoofing Inference:                                           |
|      - AASIST / Wav2Vec2-AASIST / RawNet2 (TorchScript/ONNX)            |
|      - Returns raw spoof probability p in [0, 1]                        |
|   4. Temporal Smoothing & Decision Engine:                              |
|      - Kalman filter smoothing over sliding window                      |
|      - Categorization: low (<0.3), medium (0.3-0.7), high (>=0.7)       |
|   5. Explainability Synthesis:                                          |
|      - High-frequency anomaly marker                                    |
|      - Phase discontinuity marker                                       |
|      - Prosody irregularity marker                                      |
+---------------------------|---------------------------------------------+
                            | JSON Response (<250ms)
                            v
+-------------------------------------------------------------------------+
|                      RISK & PREVENTION DASHBOARD                        |
|                                                                         |
|   - Real-Time Risk Gauge & Telemetry Display                            |
|   - Real-Time Spectrogram with Heatmap Anomaly Overlay                  |
|   - Dynamic Challenge-Response (Phonemic phrases in EN / HI / TA)       |
+---------------------------|---------------------------------------------+
                            | Async Batched Telemetry (No PCM stored)
                            v
+-------------------------------------------------------------------------+
|                         PERSISTENCE & AUDIT                             |
|                                                                         |
|   Supabase PostgreSQL (Protected by Strict Row-Level Security):        |
|   - profiles, sessions, detection_events, challenge_responses           |
|   - Append-only connection_audit_logs & auth_audit_logs                 |
+-------------------------------------------------------------------------+
```

---

## 2. WebSocket Fallback & Resilience Strategy

Network instability in mobile telephony and field conditions must not cause detection failures or silent drops. VoiceShield incorporates an enterprise-grade reconnection and buffering protocol.

### Parameters
- **Base Delay (`baseDelay`):** `1000ms`
- **Multiplier (`multiplier`):** `2`
- **Max Delay (`maxDelay`):** `30000ms`
- **Jitter (`jitterRatio`):** `0.2` (±20%)
- **Max Attempts (`maxAttempts`):** `10`

### Mathematical Formula
$$\text{delay} = \min\left(\text{baseDelay} \times \text{multiplier}^{\text{attempt}}, \text{maxDelay}\right)$$
$$\text{jitteredDelay} = \text{delay} \times \left(1 + \text{Uniform}(-0.2, 0.2)\right)$$

### Ring Buffer Specification
- **Capacity:** 4 seconds of raw PCM16 audio (tunable 2–5s).
- At 16kHz mono (2 bytes/sample), 4 seconds = 128,000 bytes (~12 chunks of 333ms).
- While disconnected, mic capture continues writing into the ring buffer in memory. Oldest frames are dropped only if connection is severed for >4 seconds.

### Session Resumption Protocol
1. Client establishes initial connection and sends `session.start`.
2. Server confirms with session ACK and assigns a monotonic `chunk_index` tracker.
3. Upon disconnect, client enters `reconnecting` state and buffers incoming PCM frames.
4. Upon reconnecting, client sends `session.resume`:
   ```json
   {
     "type": "session.resume",
     "session_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
     "last_processed_chunk_index": 42
   }
   ```
5. Client immediately flushes and replays buffered chunks starting from `chunk_index = 43`.
6. Server processes the replayed chunks in sequence, maintaining audit log continuity.

### Thundering Herd & Tab Visibility Mitigation
- The randomized ±20% jitter prevents synchronized reconnection storms on backend restarts.
- Reconnection attempts pause when `document.visibilityState === "hidden"` and resume immediately when the tab returns to foreground.

### TypeScript Reconnection Implementation

```typescript
export interface ReconnectConfig {
  baseDelayMs: number;
  multiplier: number;
  maxDelayMs: number;
  jitterRatio: number;
  maxAttempts: number;
}

export const DEFAULT_RECONNECT_CONFIG: ReconnectConfig = {
  baseDelayMs: 1000,
  multiplier: 2,
  maxDelayMs: 30000,
  jitterRatio: 0.2,
  maxAttempts: 10,
};

export function getReconnectDelay(
  attempt: number,
  config: ReconnectConfig = DEFAULT_RECONNECT_CONFIG
): number {
  const exponentialDelay = Math.min(
    config.baseDelayMs * Math.pow(config.multiplier, attempt),
    config.maxDelayMs
  );
  const jitterOffset = exponentialDelay * config.jitterRatio * (Math.random() * 2 - 1);
  return Math.floor(exponentialDelay + jitterOffset);
}
```

---

## 3. Frontend Audio Pipeline

1. **AudioContext Acquisition:** `navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true } })`.
2. **DSP Processing:** Custom `AudioWorkletNode` or buffer-based processor accumulates samples up to `chunkMs` (default 333ms = 5,328 samples).
3. **Quantization:** Converts `Float32Array` (-1.0 to 1.0) to signed `Int16Array` (-32768 to 32767).
4. **Binary Transmission:** Sends raw binary PCM buffer directly over WebSocket frame, minimizing serialization overhead.

---

## 4. Backend Processing Loop

1. **Socket Ingestion:** Async read loop receives binary chunk.
2. **DSP Worker:** Offloads LFCC and STFT computations.
3. **TorchScript/ONNX Worker:** Executes forward pass under `torch.no_grad()`.
4. **Decision Engine:** Evaluates output probability against low (<0.3), medium (0.3–0.7), and high (≥0.7) thresholds.
5. **JSON Response:** Emits structured decision message back to client within 250ms total loop latency.
6. **Async Database Logging:** Dispatches database writes to background worker queue without blocking the streaming audio loop.

---

## 5. Scaling Limits & Concurrency

- **Single Worker Node (CPU):** Up to 25 concurrent audio streams at 333ms hops.
- **GPU Node (NVIDIA T4 / A10G):** Up to 150 concurrent streams with batched dynamic tensor dispatch.
- **Horizontal Scaling:** Stateless WebSocket workers coordinated via Redis Pub/Sub backplane; client sessions reconnect seamlessly to any available worker using `session.resume`.
