# VoiceShield system architecture

**SIH26104 · AICTE Cyber Security Cell · Real-time voice-cloning detection**

## System map

```text
Browser microphone
      │  16 kHz / mono / PCM16 / 333 ms windows
      ▼
Next.js web console ── Supabase Auth + session cookies
      │  WebSocket /ws/audio
      ▼
FastAPI inference service
      │
      ├─ feature extraction: LFCC, Mel, phase and prosody markers
      ├─ anti-spoofing model: AASIST production path
      ├─ decision engine: risk level + suggested action
      └─ asynchronous telemetry and alert services
      │
      ▼
Supabase PostgreSQL + RLS
  sessions · detection_events · connection_audit_logs · auth_audit_logs
```

## Request lifecycle

1. The operator authenticates through Supabase Auth using email, Google, or GitHub.
2. The browser requests microphone access and opens `/ws/audio`.
3. A `session.start` message registers the session and receives `session.ack`.
4. Audio is framed into 5,328-sample PCM16 windows. The browser does not write raw audio to disk.
5. The API extracts features, runs inference, classifies risk, and returns a `detection.result`.
6. The UI updates the risk meter, spectrogram, session feed, and response controls.
7. Detection metadata is batched for persistence. On close, the API finalizes the session summary.

## Reliability boundaries

- The four-second browser ring buffer supports reconnect and resume behavior.
- WebSocket reconnection uses bounded exponential backoff and a maximum attempt count.
- Persistence is asynchronous so a slow database write does not block the inference response.
- If the API is unavailable, the web shell remains navigable but clearly labels live inference as unavailable.

## Data boundaries

- Browser-facing code receives only the Supabase publishable/anon key.
- The Supabase service-role key is restricted to the API environment.
- Raw audio is transient input. `STORE_RAW_AUDIO=false` is the production default.
- Risk metadata is persisted only through server-side services and database policies.

## Current scope and roadmap

**Implemented:** browser streaming demo, AASIST inference path, risk classification, auth, session/audit routes, challenge UI, reports, and production health checks.

**Roadmap:** production SIP/telephony proxy, broader multilingual challenge evaluation, calibrated thresholds on representative Indian telephony data, and independently reproduced benchmark reports.
