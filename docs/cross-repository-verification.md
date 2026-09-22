# Cross-Repository Verification (VoiceShield copy)

Canonical full report lives on LIT:
`Logic-Intelligence/docs/cross-repository-verification.md`

## Boundary

| System | URL |
|--------|-----|
| Corporate | https://www.logicintelligencetechnologies.in |
| Product intro | https://www.logicintelligencetechnologies.in/voice-shield |
| Request Access | https://www.logicintelligencetechnologies.in/voice-shield/request |
| Console | https://voiceshield.logicintelligencetechnologies.in |

VoiceShield is **not** a separate company. Auth is **not** shared SSO unless deliberately built later.

## This repo obligations

- Product experience + console UI + FastAPI detection code
- HTTPS links back to LIT Company / Request Access
- No invented latency/EER/zero-retention claims
- Provider MOCK → CONFIGURED → CONNECTED states only

## Critical LIT fix (2026-09-22)

Marketing middleware previously required login for `/voice-shield`, `/pricing`, `/contact`, etc. Inverted to protect only `/dashboard`, `/admin`, `/portal`, `/profile`, `/client`.

## Not production-verified

SMTP live proof, FastAPI host, provider keys, full E2E suite remain manual/blocked.
