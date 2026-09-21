# VoiceShield Production Audit

**Repository:** `vikashsaravanann/voiceshield-sih-2026` (Repository B only)  
**Product site:** https://voiceshield.logicintelligencetechnologies.in/  
**Corporate site (out of scope):** https://www.logicintelligencetechnologies.in/  
**Audit date:** 2026-09-22  
**Method:** Static repository inspection. Runtime E2E, live FastAPI host, and production RLS browser tests were **not** executed in this pass.

**Positioning (required):**  
VoiceShield — an AI security product by Logic Intelligence Technologies Pvt. Ltd.  
Not a separate company, subsidiary, or legal entity.

**Evidence rule:** No item is VERIFIED without runtime evidence. Unsupported quantitative claims must not be treated as production truth.

---

## 1. Repository shape

| Area | Location | Notes |
|------|----------|-------|
| Next.js product UI | `app/`, `components/`, `lib/` | Next 15, React 19 |
| FastAPI real-time API | `apps/api/` | WebSocket audio, forensics, sessions |
| ML tooling | `ml/` | Export, EER eval scripts, model cards |
| Database | `supabase/migrations/` | Sessions, detection events, RLS, DPDP cleanup |
| Deploy hints | `Dockerfile`, `docker-compose.yml`, `apps/api/railway.toml`, `render.yaml`, `vercel.json` | Frontend → Vercel; API → separate host |

**package.json scripts:** `dev`, `build`, `start`, `lint`, `typecheck` — **no** unit/e2e test script at root.

---

## 2. Frontend routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Overview / marketing hero | IMPLEMENTED (UI) |
| `/demo` | Live operator console (`LiveConsole`) | IMPLEMENTED (UI; depends on FastAPI WS) |
| `/sandbox` | Forensic lab | IMPLEMENTED (UI) |
| `/dashboard` | SOC dashboard | IMPLEMENTED (UI; data depends on backend/DB) |
| `/architecture` | Architecture narrative | IMPLEMENTED |
| `/docs` | Developer API docs page | PARTIALLY IMPLEMENTED (static/docs UI) |
| `/brief` | Product brief | IMPLEMENTED |
| `/login` | Operator sign-in | IMPLEMENTED (Supabase auth path) |
| `/auth/callback` | OAuth/session callback | IMPLEMENTED |
| `/privacy`, `/terms` | Legal | IMPLEMENTED (SIH framing largely removed) |
| `/about`, `/report` | Supporting pages | IMPLEMENTED |
| `/api/chat` | Assistant | PARTIALLY IMPLEMENTED (Groq key required) |
| `/api/alert-settings` | Alert config | PARTIALLY IMPLEMENTED |
| `/api/twilio/status` | Twilio webhook stub | PLACEHOLDER / minimal |

**Navigation (`components/Shell.tsx`):** Overview, Live Demo, Forensic Lab, SOC Dashboard, Architecture, Docs, Product Brief, Sign In — product-specific. No corporate “AI Website Agent” product taxonomy.

---

## 3. Claims hygiene (WARNING)

Shell / footer still contain absolute-style latency language (e.g. sub-300ms, “within 269ms”).  
**Classification:** WARNING — not treated as verified production SLA until measured under defined conditions and published with qualification.

Public copy must prefer:  
*“Analyze eligible voice interactions for configurable fraud-risk, security, compliance and quality signals, with structured evidence designed for enterprise workflows.”*

Do **not** publish as fact without evidence: 100% detection, universal zero retention, unsupported EER, unsupported uptime, clinical claims.

---

## 4. Backend (FastAPI) — `apps/api`

| Component | Status |
|-----------|--------|
| FastAPI entry (`main.py`) + model warm-up | IMPLEMENTED |
| WebSocket audio (`websocket/audio_endpoint.py`) | IMPLEMENTED (code) |
| Twilio media stream endpoint | PARTIALLY IMPLEMENTED |
| Spoof model load / feature extraction | IMPLEMENTED (code; weights path env-driven) |
| Forensics routes | IMPLEMENTED (code) |
| Sessions / audit / challenges | IMPLEMENTED (code) |
| Health | IMPLEMENTED |
| Decision engine | IMPLEMENTED (simple) |
| Unit tests under `apps/api/tests/` | PARTIALLY IMPLEMENTED |
| Live production host always-on | BLOCKED / REQUIRES MANUAL CONFIGURATION (not Vercel) |
| AASIST weights on production path | REQUIRES MANUAL CONFIGURATION |

**Architecture note (correct):** Real-time path is feature extraction → model → risk signal. LLM must not sit in the critical detection loop.

---

## 5. Database (Supabase migrations)

Present: extensions, enums, profiles, sessions, detection_events, challenge_responses, connection/auth audit logs, RLS policies, anonymous demo sessions, DPDP auto-destroy / retention / cleanup job, profile-on-signup, RLS recursion fix.

| Item | Status |
|------|--------|
| Schema + RLS files | IMPLEMENTED |
| Live RLS matrix (anon / user / admin / service) | REQUIRES MANUAL VERIFICATION |
| Multi-tenant org isolation beyond user-scoped rows | PARTIAL / UNKNOWN |

---

## 6. Auth

| Item | Status |
|------|--------|
| Supabase client usage | IMPLEMENTED |
| Login UI + callback | IMPLEMENTED |
| Server-side role enforcement everywhere | REQUIRES MANUAL VERIFICATION |
| Request-access workflow with admin approval states | NOT IMPLEMENTED in this repo (lives primarily on corporate site) |

---

## 7. Providers / env

From `.env.example`:

- Supabase URL + publishable key  
- FastAPI HTTP/WS URLs  
- Twilio alert vars  
- Feature flags for live demo / challenge / fallback  
- Groq (server-only) for assistant  

**Missing / not centralized here:** THROUGHPUTS gateway vars, Deepgram/Whisper abstraction, R2 signed storage lifecycle as first-class product config, production Redis rate limits.

| Provider concern | Status |
|------------------|--------|
| Mock vs production distinction | PARTIAL |
| THROUGHPUTS as gateway (not a model) | NOT IMPLEMENTED in this repo |
| Transcription provider abstraction | NOT IMPLEMENTED |
| Secrets never in `NEXT_PUBLIC_` for Groq | PASS (example is correct) |

---

## 8. Storage / retention

| Item | Status |
|------|--------|
| DPDP-oriented cleanup migrations | IMPLEMENTED (schema/jobs defined) |
| Private R2 bucket + signed URL lifecycle | NOT VERIFIED / UNKNOWN in this repo |
| Universal zero-retention claim | DO NOT CLAIM |

---

## 9. Observability / security

| Item | Status |
|------|--------|
| Audit routes/services | IMPLEMENTED (code) |
| Structured request IDs end-to-end | PARTIAL |
| Production rate limiting (Upstash) | NOT IMPLEMENTED |
| Security test suite (IDOR, XSS, upload abuse, etc.) | NOT IMPLEMENTED |
| Secret scanning in CI | UNKNOWN |

---

## 10. Deployment

| Piece | Target | Status |
|-------|--------|--------|
| Next.js UI | Vercel (`vercel.json`) | REQUIRES MANUAL VERIFICATION of last production deploy |
| FastAPI + model | Railway/Render/Docker (files present) | BLOCKED until host + weights + secrets configured |
| Docker Compose | Local stack | IMPLEMENTED (file present) |

---

## 11. Production readiness matrix

| AREA | STATUS |
|------|--------|
| Product identity (LIT product, not separate company) | IMPLEMENTED |
| Product UI / Shell navigation | IMPLEMENTED |
| Live console UI | IMPLEMENTED |
| FastAPI real-time path (code) | IMPLEMENTED |
| FastAPI production host | BLOCKED BY EXTERNAL HOST / CONFIG |
| Model weights production path | REQUIRES MANUAL CONFIGURATION |
| Supabase schema + RLS files | IMPLEMENTED |
| RLS live verification | REQUIRES MANUAL VERIFICATION |
| Auth login | IMPLEMENTED |
| Request-access product workflow (this repo) | NOT IMPLEMENTED |
| Forensic async full chain | PARTIALLY IMPLEMENTED |
| Transcription abstraction | NOT IMPLEMENTED |
| THROUGHPUTS analysis path | NOT IMPLEMENTED |
| Claims hygiene (latency absolutes in Shell) | WARNING |
| Rate limiting (prod Redis) | NOT IMPLEMENTED |
| Root automated tests | NOT IMPLEMENTED |
| API unit tests | PARTIALLY IMPLEMENTED |
| SEO (robots/sitemap) | IMPLEMENTED |
| Accessibility full audit | REQUIRES MANUAL VERIFICATION |
| Deployment verified E2E | REQUIRES MANUAL VERIFICATION |

---

## 12. Mandatory NOT DONE list

### NOT IMPLEMENTED
- Request-access state machine inside this repository  
- THROUGHPUTS provider layer for structured analysis  
- Transcription provider abstraction (Whisper/Deepgram/config)  
- Production Redis/Upstash rate limiting  
- Full security test suite  
- Root-level unit/e2e test scripts  

### BLOCKED BY EXTERNAL CREDENTIAL / HOST
- Live FastAPI + AASIST weights on always-on host  
- Production Twilio media path  
- Groq (optional assistant)  

### REQUIRES MANUAL CONFIGURATION / VERIFICATION
- Vercel production env parity  
- Supabase project + migrations applied + RLS role matrix  
- Soften residual absolute latency claims in Shell/footer  
- Full Playwright / mobile / a11y pass  

### WARNING
- Absolute latency / RTT badges in UI without published measurement conditions  

---

## 13. Activation order (when keys/host arrive)

1. Provision FastAPI host (Railway/Render/VM) with model path.  
2. Set server secrets (no `NEXT_PUBLIC_` for private keys).  
3. Point `NEXT_PUBLIC_FASTAPI_*` at production API.  
4. Apply Supabase migrations; verify RLS.  
5. Health check → controlled WebSocket demo → forensics smoke.  
6. Soften public claims to evidence-based language.  
7. Enable feature flags only after PASS.

Do **not** rewrite architecture merely to insert credentials.

---

## 14. Honest completion statement

VoiceShield repository B has a **real product UI**, **operator console**, **FastAPI real-time code path**, **ML export/eval tooling**, and **Supabase migration set**.  
It is **not** fully production-verified end-to-end: inference host, weights, RLS live proof, rate limiting, request-access workflow in-repo, and claims hygiene still open.

**Do not say “everything is perfect.”**
