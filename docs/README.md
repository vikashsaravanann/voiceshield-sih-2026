# VoiceShield documentation

This directory is the technical source of truth for the VoiceShield SIH26104 demonstration. Documentation is written against the current repository layout: a Next.js web console at the repository root and a FastAPI inference service under `apps/api`.

## Start here

| Document | Use it for |
| --- | --- |
| [Architecture](ARCHITECTURE.md) | End-to-end data flow and system boundaries |
| [API](API.md) | WebSocket messages and HTTP routes |
| [Deployment](DEPLOYMENT.md) | Vercel and Railway configuration |
| [Security](SECURITY.md) | Authentication, privacy, RLS, and threat boundaries |
| [ML pipeline](ML_PIPELINE.md) | Features, models, evaluation, and limitations |
| [Demo script](DEMO_SCRIPT.md) | A reliable five-minute judge walkthrough |
| [SIH pitch](SIH_PITCH.md) | Problem, differentiation, impact, and roadmap |

## Documentation principles

1. Distinguish shipped behavior from a roadmap item.
2. Never place secrets, service-role keys, raw audio, or personal data in examples.
3. Keep route names, environment variables, and message schemas synchronized with the code.
4. Report latency and accuracy with the dataset, hardware, and measurement method.

The canonical streaming constants live in [`lib/audioConfig.ts`](../lib/audioConfig.ts). The frontend and API must agree on sample rate, channels, chunk duration, and message types.
