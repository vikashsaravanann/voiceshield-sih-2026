# VoiceShield Data Retention

## Policy intent

- **Standard:** configurable retention (commonly 30 days where product policy sets it).  
- **Enterprise:** customer-selected where supported by contract and deployment.  
- **Zero-retention:** only claim when the **entire** processing chain (app, workers, providers, backups) is verified to support it.

Do **not** publish universal “0 bytes on disk” or “zero retention always” as a blanket guarantee.

## What may be retained

| Data class | Typical handling |
|------------|------------------|
| Raw audio | Prefer not stored (`STORE_RAW_AUDIO=false`); forensic path may use private storage with lifecycle |
| Detection events / risk signals | PostgreSQL with RLS |
| Challenge metadata | Time-bounded |
| Auth / connection audit | Audit retention per policy |
| Transcripts (async) | Only if feature enabled; delete with parent analysis |

## Deletion workflow (required behaviour)

1. Identify tenant/session/analysis IDs.  
2. Delete or anonymise DB rows per policy.  
3. Delete private objects (if any).  
4. Clear derived artefacts (reports, embeddings) where applicable.  
5. Record audit event of deletion (without logging sensitive payloads).

Migrations under `supabase/migrations/` include DPDP-oriented cleanup job definitions — **apply and verify** in the live Supabase project before claiming automated retention in production.

## Operator checklist

- [ ] Confirm `STORE_RAW_AUDIO` in production  
- [ ] Confirm storage bucket lifecycle / expiration  
- [ ] Confirm cleanup job schedule  
- [ ] Confirm backup retention does not contradict customer contracts  
