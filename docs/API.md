# API

Production FastAPI service. This console implements the same messages in-browser (`InferenceBridge`) so the live preview does not need a GPU worker.

## `GET /health`

```json
{
  "ok": true,
  "model": true,
  "gpu": true,
  "infer_ms": 6.2,
  "cuda_mem_mb": 812
}
```

Warm-up must have completed. A 503 here means do not send judge traffic.

## `WS /ws/audio`

Binary PCM is base64 int16 in JSON for the SIH demo (simplifies tracing). Production may switch to binary frames without changing indices.

**Client → server**

```json
{ "type": "start", "session_id": "uuid", "chunk_ms": 333, "sample_rate": 16000 }
{ "type": "chunk", "index": 12, "pcm": "<int16 little-endian b64>" }
{ "type": "resume", "last_chunk_index": 12 }
{ "type": "stop" }
```

**Server → client**

```json
{
  "type": "decision",
  "index": 12,
  "spoof_probability": 0.81,
  "risk_level": "red",
  "markers": ["F0 locked — vocoder-like", "Stair-step frame gain"],
  "suggested_action": "challenge",
  "latency_ms": 41.2
}
```

`index` is monotonic per session. After resume the server must ignore chunks `<= last_chunk_index` (already scored) and continue.

## REST

All routes require a session cookie. Scope is the verified user unless `profiles.role = admin`.

### `GET /sessions/:id/summary`

```json
{
  "id": "…",
  "chunk_count": 48,
  "avg_risk": 0.22,
  "max_risk": 0.86,
  "drop_count": 1,
  "reconnect_count": 1,
  "challenge_fired": true,
  "challenge_ok": false
}
```

### `GET /audit/connections?session_id=`

Rows from `connection_audit_logs`: `connected`, `disconnected`, `resume`, `error`.

### `GET /audit/auth`

Rows from `auth_audit_logs`: `signup`, `login`, `logout`, `token_refresh`. Analysts see own rows.

## Error policy

- Unknown session → 404
- Chunk too large / sample rate ≠ 16 kHz → 4408 close, logged as `error`
- Model not warm → 503 on `/health`; WS refuses `start`
- Rate limit: 8 concurrent sockets per user, 4 hops/sec (matches 250 ms minimum hop)

## This preview

Server functions in `src/lib/server/vault.ts` persist the same objects (`startSession`, `appendEvent`, `logConnection`, `logChallenge`, `logAuthEvent`) with `authMiddleware` and `context.userId` scoping.
