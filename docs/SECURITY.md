# Security model

- Browser: publishable Supabase key only.
- FastAPI: service-role key, never shipped to Vercel `NEXT_PUBLIC_*`.
- RLS on every table. Audit tables are insert+select; no update/delete for analysts.
- JWT on the WebSocket: FastAPI validates before accepting hops.
- PCM is RAM-only. A demo that writes a wav file is a failed demo.
