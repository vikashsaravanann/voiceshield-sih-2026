# VoiceShield Provider Configuration

## Principles

1. **THROUGHPUTS is a gateway, not a model.** When used: VoiceShield → provider abstraction → THROUGHPUTS → configured model ID.  
2. **Real-time detection** stays on the local/feature-extraction + AASIST-class path. Do not put a large LLM in the critical real-time loop.  
3. **Async forensic analysis** may use a stronger model via a configured gateway after schema validation.  
4. Model IDs are **configuration**, never hard-coded as final production truth until verified.

## Real-time path (latency-focused)

```
Audio → PCM chunks → feature extraction → SpoofModel (MODEL_PATH) → risk signal
```

Configured in `apps/api/app/config.py`:

- `MODEL_PATH`
- `MODEL_NAME`
- `DEVICE`
- `AUDIO_CHUNK_MS`

## Async / forensic path (planned configuration)

```
Upload → private storage → job → transcription (provider) → analysis (gateway/model)
  → JSON extract → schema validation → evidence → PostgreSQL
```

When credentials arrive, add **server-only** vars (examples):

| Variable | Purpose |
|----------|---------|
| `THROUGHPUTS_BASE_URL` | Gateway base |
| `THROUGHPUTS_API_KEY` | Server-only |
| `THROUGHPUTS_MODEL` | Verified model id |
| `TRANSCRIPTION_PROVIDER` | e.g. `mock` / `deepgram` / `whisper` |
| `DEEPGRAM_API_KEY` | If used |

Do not invent final model IDs in docs or UI.

## Transcription abstraction

Business logic must call a provider interface, not a single vendor SDK inline.

States: `MOCK` | `CONFIGURED` | `CONNECTED` | `FAILED` | `DISABLED`.

## Twilio

Optional for alerts / telephony media. Requires account SID, auth token, and validated numbers. Absent credentials → feature disabled, not fake success.

## Security

- No provider keys in frontend.  
- No signed URLs or transcripts in logs by default.  
- Production rejects enabled providers with missing required secrets.
