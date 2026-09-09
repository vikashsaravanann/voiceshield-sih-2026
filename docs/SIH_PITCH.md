# SIH pitch

Eight slides. Nine minutes. Reliability is the differentiator — every team will show a spectrogram; few will show a drop-and-resume with an audit row.

## Slides

1. **Problem** — 3–5 s clones on RTGS, IVR, family extortion. Indian numbers, Indian languages, 8 kHz channel.
2. **Gap** — Caller ID is forgeable. Hearing fails under time pressure. Post-call forensics cannot stop a live transfer. Studio models die on G.711.
3. **VoiceShield** — inspect, score, challenge, persist nothing. Middleware, not a new intercept archive.
4. **Depth** — DSP + dual-path INT8, 269 ms budget, LFCC/F0/harmonicity, Indian-language challenges.
5. **Reliability & security** — exponential backoff + jitter, 4 s ring, `last_chunk_index` resume, GPU warm-up, RLS audit logs. This slide wins if the demo drop works.
6. **Live demo** — genuine voice, clone inject, challenge, simulated drop, vault row.
7. **Impact** — BFSI authorisation desks, TSP IMS tagging, I4C / CERT-In alignment. DPDP: no waveform on disk.
8. **Roadmap** — Exotel / Twilio, on-device ONNX, React Native / Flutter SDK, India-specific fraud patterns.

## Nine-minute script

| t | Action | What the judge should see |
| --- | --- | --- |
| 0:00 | State SIH26104. Cloned voices on Indian telephony. | Title, problem ID |
| 0:40 | Open live console. Allow mic. Speak 10 s. | Green, stable F0, hop latency tens of ms |
| 2:00 | Inject cloned stream. | C(t) > 75%, heatmap spike, challenge arms |
| 3:30 | Switch Hindi / Tamil prompt. Record response (clone still on → fail closed). | Fail-closed copy |
| 4:30 | Simulate drop. | Banner, ring buffer, jittered reconnect, resume |
| 6:00 | Sign in. Open Vault. | Session row, detection timeline, `disconnected` + `resume` audit |
| 7:30 | DPDP close. No waveform persisted. | Scores, hops, challenge outcomes only |
| 8:30 | National fit + ask. | BFSI / TSP / I4C |

## Talking points if interrupted

- Hop is 333 ms because vocoder frames sit on a 10–20 ms grid; too-large hops hide the stair-step.
- Jitter is ±20% so a fleet of teller desks does not reconnect as one pulse.
- First signed-in operator is admin so a two-person team can show the analyst/admin split without seeding.
- EER is quoted on the telephony split, not the clean 16 kHz number.

## Team slide (fill)

Team name · College · Members (role) · Mentor · SIH26104
