# VoiceShield Incident Response (Draft Operational)

## Severity classes

| Level | Examples |
|-------|----------|
| P1 | Confirmed credential leak, public audio bucket, auth bypass |
| P2 | Elevated error rate on detection, provider outage, RLS misconfig |
| P3 | UI defects, non-security degradation |

## Immediate actions (P1)

1. Rotate affected secrets (Supabase service role, provider keys, JWT).  
2. Disable public exposure (bucket ACL, feature flags).  
3. Preserve audit logs — do not wipe evidence of access.  
4. Notify internal security contact at LIT.  
5. Document timeline and systems touched.

## Detection signals

- Unexpected 401/403 spikes  
- Outbox / job failure storms  
- Model load failures on FastAPI host  
- Unauthorized tenant data access attempts in logs (without payload content)

## Do not

- Commit secrets while recovering  
- Paste production transcripts into tickets  
- Claim compliance certification in public status pages without legal review

## Contacts

Operational contacts are maintained by Logic Intelligence Technologies Pvt. Ltd. (support / admin channels on the corporate site).
