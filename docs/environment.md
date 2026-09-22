# VoiceShield Environment Configuration

**Product:** VoiceShield — Logic Intelligence Technologies Pvt. Ltd.  
**Repo:** voiceshield-sih-2026

## Frontend (Next.js / Vercel)

| Variable | Required | Client? | Purpose |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_APP_NAME` | No | Yes | Display name |
| `NEXT_PUBLIC_APP_ENV` | No | Yes | `development` / `production` |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Yes | Canonical site URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Yes | Anon/publishable key only |
| `NEXT_PUBLIC_FASTAPI_HTTP_URL` | Yes for live demo | Yes | FastAPI base URL |
| `NEXT_PUBLIC_FASTAPI_WS_URL` | Yes for live demo | Yes | WebSocket audio endpoint |
| `NEXT_PUBLIC_ENABLE_LIVE_DEMO` | No | Yes | Feature flag |
| `NEXT_PUBLIC_ENABLE_CHALLENGE_RESPONSE` | No | Yes | Feature flag |
| `NEXT_PUBLIC_ENABLE_FALLBACK_MODE` | No | Yes | Feature flag |
| `GROQ_API_KEY` | Optional | **No** | Assistant only; server-side |
| `GROQ_CHAT_MODEL` | Optional | **No** | Model id when Groq enabled |

**Never** put service-role keys, SMTP passwords, or model weights paths in `NEXT_PUBLIC_*`.

## FastAPI (`apps/api`)

| Variable | Required (prod live) | Purpose |
|----------|----------------------|---------|
| `APP_ENV` | Yes | `production` |
| `PORT` | No | Default 8000 |
| `NEXT_PUBLIC_SITE_URL` | Yes | CORS allowlist |
| `SUPABASE_URL` | Yes | DB |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only writes |
| `MODEL_PATH` | Yes | Path to weights (e.g. AASIST) |
| `MODEL_NAME` / `MODEL_VERSION` | No | Metadata |
| `DEVICE` | No | `cpu` or `cuda` |
| `STORE_RAW_AUDIO` | No | Default `false` |
| `TWILIO_*` | Optional | Alerts / media |

## Provider readiness states

Use operationally:

- `MOCK` — local/dev without real keys  
- `CONFIGURED` — env present, not health-checked  
- `CONNECTED` — health check passed  
- `DEGRADED` / `FAILED` / `DISABLED`

Production must not silently treat mock as live.

## Activation sequence

1. Set Vercel env for Next.js.  
2. Deploy FastAPI host with `MODEL_PATH` and Supabase service role.  
3. Point `NEXT_PUBLIC_FASTAPI_*` at that host.  
4. Health check → controlled WebSocket demo.  
5. Enable feature flags only after PASS.
