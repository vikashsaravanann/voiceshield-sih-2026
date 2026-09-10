# VoiceShield API and streaming protocol

**SIH 2026 | Problem ID: SIH26104 | AICTE – Cyber Security Cell**  
*AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks*

---

## 1. WebSocket Interface (`/ws/audio`)

### Connection Handshake
Client establishes a WebSocket connection to `ws://localhost:8000/ws/audio` locally or `wss://voiceshield-sih-2026-production.up.railway.app/ws/audio` in production.

---

### Client Messages

#### 1. Session Initialization (`session.start`)
Sent immediately after socket connection opens.

```json
{
  "type": "session.start",
  "session_id": "c7a840e6-7b24-4f93-8a9d-5d9c72e27601",
  "user_id": "3b26c710-3882-421b-b4ea-47a8296a84c9",
  "sample_rate": 16000,
  "channels": 1,
  "chunk_ms": 333,
  "client": {
    "user_agent": "Mozilla/5.0 ...",
    "device_type": "desktop"
  }
}
```

#### 2. Streaming Audio Frames (Binary)
- **Format:** Raw PCM 16-bit signed integer (little-endian), mono, 16,000 Hz.
- **Frame Size:** 333ms = 5,328 samples = 10,656 bytes per WebSocket binary message.

#### 3. Session Resume (`session.resume`)
Sent upon reconnecting following a network drop.

```json
{
  "type": "session.resume",
  "session_id": "c7a840e6-7b24-4f93-8a9d-5d9c72e27601",
  "last_processed_chunk_index": 42
}
```

#### 4. Session Termination (`session.end`)
Sent when operator ends the call session.

```json
{
  "type": "session.end",
  "session_id": "c7a840e6-7b24-4f93-8a9d-5d9c72e27601"
}
```

---

### Server Messages

#### Detection Result (`detection.result`)
Emitted by backend for each evaluated audio chunk.

```json
{
  "type": "detection.result",
  "session_id": "c7a840e6-7b24-4f93-8a9d-5d9c72e27601",
  "chunk_index": 43,
  "spoof_probability": 0.8842,
  "risk_level": "high",
  "suggested_action": "block",
  "latency_ms": 142.6,
  "explainability_markers": {
    "high_frequency_anomaly": 0.892,
    "phase_discontinuity": 0.765,
    "prosody_irregularity": 0.814
  },
  "model": {
    "name": "aasist",
    "version": "0.1.0"
  }
}
```

---

## 2. HTTP endpoints

### `GET /health`
Returns service readiness and loaded model metadata.

**Response:**
```json
{
  "status": "healthy",
  "service": "voiceshield-api",
  "model_loaded": true,
  "model_name": "AASIST",
  "device": "cpu",
  "version": "0.1.0"
}
```

### `GET /sessions/{session_id}/summary`
Retrieves cumulative telemetry and risk metrics for a session.

**Response:**
```json
{
  "session_id": "c7a840e6-7b24-4f93-8a9d-5d9c72e27601",
  "user_id": "3b26c710-3882-421b-b4ea-47a8296a84c9",
  "started_at": "2026-09-10T01:30:00Z",
  "ended_at": "2026-09-10T01:35:00Z",
  "status": "completed",
  "total_chunks": 900,
  "avg_spoof_prob": 0.14,
  "max_spoof_prob": 0.89,
  "high_risk_chunks": 12,
  "challenge_status": "passed"
}
```

### `GET /audit/connections?session_id=`
Queries connection lifecycle events for diagnostic review.

---

## 3. Client Code Examples

### cURL Health Check
```bash
curl -X GET http://localhost:8000/health
```

### TypeScript WebSocket Client
```typescript
import { AUDIO_CONFIG } from "@/lib/audioConfig";

const ws = new WebSocket(process.env.NEXT_PUBLIC_FASTAPI_WS_URL!);

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: "session.start",
    session_id: crypto.randomUUID(),
    user_id: "demo-user-1",
    sample_rate: AUDIO_CONFIG.sampleRate,
    channels: AUDIO_CONFIG.channels,
    chunk_ms: AUDIO_CONFIG.chunkMs
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "detection.result") {
    console.log(`Risk: ${data.risk_level} (${data.spoof_probability})`);
  }
};
```
