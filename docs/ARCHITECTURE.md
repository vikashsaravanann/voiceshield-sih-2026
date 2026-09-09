# VoiceShield architecture

Five coupled subsystems sit on the media path. The live console in this preview runs the same control plane in-browser. Production inference is an INT8 ONNX graph on a GPU Space or CPU FastAPI worker.

```
mic / SIP / WebRTC
        |
        v
  [1] resample 16 kHz + VAD + 333 ms hop + 4 s ring
        |
        v
  [2] LFCC + bispectrum + F0 / harmonicity / jitter
        |
        v
  [3] RawNet2 + SE-ResNet  -->  spoof_probability
        |
        v
  [4] Kalman C(t)  -->  Green / Amber / Red + markers
        |
        v
  [5] challenge  |  policy hook  |  audit (no PCM)
```

## End-to-end (16 steps)

1. Operator opens the console and starts the live path.
2. Browser requests the microphone; Web Audio captures at the native rate.
3. Samples downsample to 16 kHz and chunk into 333 ms hops (configurable 250 / 333 / 500).
4. A circular buffer holds the last 4 seconds (~12 hops) for reconnect replay.
5. Each hop is sent over the inference link (`wss://<api>/ws/audio` in production).
6. Worker extracts features, runs the graph, returns `spoof_probability`.
7. Decision engine maps Kalman-smoothed C(t) to Green < 0.35 / Amber / Red ≥ 0.75.
8. Frontend updates waveform, spectrogram, risk meter, explainability markers.
9. Four consecutive Amber/Red hops arm a phonemic challenge (EN / HI / TA).
10. Session summary: avg/max risk, hop count, challenge outcome, drop/resume counts.
11. Signed-in operators persist `vs_sessions`, `detection_events`, `challenge_responses`.
12. On `onclose` / `onerror` the client enters `reconnecting` with exponential backoff + jitter.
13. Capture continues into the ring; on resume, hops after `last_chunk_index` replay.
14. Connection events append to `connection_audit_logs`.
15. Auth events append to `auth_audit_logs`.
16. RLS / server-side `user_id` scope: analysts see own rows; admin sees all.

## WebSocket fallback

**Detect.** Frontend listens to `websocket.onclose` and `websocket.onerror`. State becomes `reconnecting`. A non-blocking banner is shown; capture does not stop.

**Backoff + jitter** (SIH-tuned, identical to `src/lib/audio/config.ts`):

```
baseDelay    = 1000 ms
maxDelay     = 30000 ms
multiplier   = 2
jitter       = 0.2          # ±20%
maxAttempts  = 10

delay        = min(baseDelay * multiplier^attempt, maxDelay)
jittered     = delay * (1 + random(-jitter, +jitter))
curve        = 1s, 2s, 4s, 8s, 16s, 30s, 30s…  (±20%)
```

Jitter prevents a thundering herd after a backend blip. Hidden tabs (`document.visibilityState === "hidden"`) pause reconnect; visibility resume restarts the schedule.

**Ring buffer.** Circular PCM, 4 s default (2–5 s legal). At 16 kHz / 333 ms that is ~12 hops. While disconnected, hops continue to be captured and written into the ring. They are *not* dropped.

**Resume.**

```ts
ws.send(JSON.stringify({ type: "resume", last_chunk_index: lastAcked }))
for (const hop of ring.after(lastAcked)) {
  ws.send(hop) // replay
}
```

Backend tracks `last_chunk_index` per session and continues scoring from that index. A `reconnected` row is written to `connection_audit_logs`.

TypeScript sketch (matches `src/lib/audio/inference-bridge.ts`):

```ts
function jitteredDelay(attempt: number) {
  const { baseDelay, maxDelay, multiplier, jitter } = AUDIO_CONFIG.reconnect
  const delay = Math.min(baseDelay * multiplier ** attempt, maxDelay)
  const j = 1 + (Math.random() * 2 - 1) * jitter
  return Math.round(delay * j)
}
```

## GPU posture (Hugging Face Spaces)

- Docker Space, GPU T4 or A10G.
- Base: `nvidia/cuda:12.1.0-cudnn8-runtime-ubuntu22.04`.
- Pin `torch` cu121 wheels. Mixed precision (FP16) or INT8 ONNX. Batch size = 1.
- **Warm-up on boot:** load graph onto GPU, run three dummy hops so CUDA kernels are compiled before the first judge click.
- **`GET /health`:** model loaded, one tiny inference, `torch.cuda` memory, optional `nvidia-smi`.
- **Keep-alive:** external pinger every 2–5 minutes on `/health` (Spaces idle). Document ToS/cost.
- Structured logs: hop latency, GPU memory, session id. Never PCM.

## Chunk size tuning (Next.js / this console)

| Hop | Samples @ 16 kHz | Behaviour |
| --- | --- | --- |
| 250 ms | 4000 | lowest latency, chatty socket, busy UI |
| **333 ms** | **~5333** | **SIH default — latency vs stability** |
| 500 ms | 8000 | smoother spectrogram, slower challenge |

Config (`src/lib/audio/config.ts` / `lib/audioConfig.ts` in Next.js):

```
CHUNK_SIZE_MS        = 333
BUFFER_DURATION_SEC  = 4
```

Smaller hops move the UI more and hide vocoder frame edges less. Larger hops delay the challenge. Do not change the default for the SIH demo without re-timing the nine-minute script.

## Audit

`connection_audit_logs` — `connected` / `disconnected` / `resume` / `error`, with `session_id`, `details jsonb`, `user_agent`.

`auth_audit_logs` — `signup` / `login` / `logout` / `token_refresh`, with `user_id`, `details jsonb`.

Both are append-only. Server functions always filter by verified `user_id`. Admins (first signed-in operator, `profiles.role = 'admin'`) read all.

Admin demo queries:

```sql
-- Frequent disconnects in the last hour
select user_id, count(*) as drops
from connection_audit_logs
where event_type = 'disconnected'
  and created_at > now() - interval '1 hour'
group by user_id
order by drops desc;

-- Failed logins next to high-risk sessions
select a.user_id, a.event_type, s.max_risk, s.id
from auth_audit_logs a
join vs_sessions s on s.user_id = a.user_id
where a.event_type = 'login_failed'
  and s.max_risk >= 0.75;
```
