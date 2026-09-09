# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| main (latest) | ✅ Active |
| develop | ✅ Active (pre-release) |
| feature/* branches | ⚠️ No security support |

---

## Reporting a Vulnerability

We take the security of VoiceShield seriously. If you discover a security
vulnerability, please **do not open a public GitHub issue**.

### How to Report

**Email:** voiceshield.sih@gmail.com  
**Subject:** `[SECURITY] Brief description of vulnerability`

Please include:
- Type of vulnerability (e.g., injection, auth bypass, data exposure)
- Affected component (frontend, backend, database, ML pipeline)
- Steps to reproduce the issue
- Potential impact assessment
- Your suggested fix (optional but appreciated)

### What to Expect

| Step | Timeframe |
|---|---|
| Acknowledgement of your report | Within 48 hours |
| Initial assessment and severity classification | Within 5 days |
| Fix developed and tested | Within 14 days (critical: 72 hours) |
| Security advisory published | After fix is deployed |
| Credit given to reporter | Upon request |

We will keep you informed throughout the process and will not take legal
action against researchers who report vulnerabilities responsibly.

---

## Security Architecture

### Data Protection
- **No raw audio stored** by default (`STORE_RAW_AUDIO=false`)
- All audio is processed in-memory and discarded after inference
- Only anonymized metadata (risk scores, timestamps, chunk indices) is persisted

### Authentication
- Supabase Auth with JWT — all tokens validated server-side in FastAPI
- Service-role key **exclusively** in backend environment; never in browser or frontend code
- Session cookies are `HttpOnly`, `Secure`, and `SameSite=Strict`

### Database Security
- **Row-Level Security (RLS)** enabled on all application tables
- Users can only access their own sessions and audit logs
- Audit tables are **append-only** for normal users (no UPDATE or DELETE)
- All privilege escalation must go through the `admin` role

### Network Security
- All traffic over **HTTPS / WSS** in production
- CORS restricted to known frontend origins
- WebSocket connections require valid JWT in the init message
- Rate limiting applied on the WebSocket endpoint (configurable via `WS_MAX_CONNECTIONS`)

### Secrets Management
- All secrets managed via environment variables — never committed to Git
- `.env` and `.env.local` are in `.gitignore`
- GitHub Actions Secrets used for CI/CD credentials
- Supabase service-role key rotated periodically

---

## Known Limitations

| Limitation | Mitigation |
|---|---|
| Anti-spoofing model may degrade on unseen TTS systems | Regular re-evaluation on new ASVspoof data; ensemble methods |
| WebSocket connections lack mutual TLS | JWT validation on every connection; rate limiting |
| Challenge phrases may be replayed | Phrases are randomized per session; timestamps checked |
| On-premise deployment not yet supported | Roadmap item; Docker Compose provided for self-hosting |

---

## Responsible Disclosure

VoiceShield is committed to responsible disclosure. We will:

- Credit security researchers in our release notes (with permission)
- Not pursue legal action against good-faith security research
- Work collaboratively to resolve issues before public disclosure

Thank you for helping keep VoiceShield and its users secure.
