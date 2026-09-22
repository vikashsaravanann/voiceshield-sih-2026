# VoiceShield Privacy & Data Flow

**Product:** VoiceShield — Logic Intelligence Technologies Pvt. Ltd.

## Streams

### Real-time detection

```
Client mic / telephony media
  → WebSocket (WSS)
  → PCM chunks in memory
  → feature extraction
  → SpoofModel inference
  → risk signal + optional audit event
```

- Prefer `STORE_RAW_AUDIO=false`.
- Do not place large LLM calls on this path.

### Asynchronous forensics (when enabled)

```
Upload / capture reference
  → private storage (if used)
  → job queue
  → transcription provider (abstracted)
  → analysis provider (THROUGHPUTS gateway → model)
  → schema validation
  → PostgreSQL
  → console / API
```

## Data classes

| Class | Handling |
|-------|----------|
| Raw audio | Ephemeral by default; private object storage only if configured |
| Features / tensors | Memory during inference |
| Risk signals | DB with RLS |
| Transcripts | Only if async path enabled; retention policy applies |
| Evidence JSON | Validated structured records only |

## Logging rules

Never log: API keys, auth headers, signed URLs, full private transcripts, raw audio.

## Corporate vs product

Access requests may be captured on the corporate LIT site; the console and detection stack live in this repository / FastAPI host.
