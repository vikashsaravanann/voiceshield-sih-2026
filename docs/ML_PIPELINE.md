# ML pipeline

VoiceShield is a **hybrid DSP + deep model** detector specified for Indian telephony, not studio files. Studio-band cues above 3.4 kHz are treated as untrusted after G.711 / AMR-NB.

## Top open-source anti-spoofing models

| Model | Why it matters | Compute | SIH note |
| --- | --- | --- | --- |
| **AASIST** | Graph attention over spectro-temporal nodes. Strong on ASVspoof 2019/2021 LA. | GPU preferred | Solid default if a T4 is available |
| **RawNet2** | End-to-end sinc-conv on the raw waveform. Robust, modest compute. | CPU OK | **36-hour default** |
| **Wav2Vec2-AASIST** | wav2vec 2.0 front-end + AASIST head. ~1% EER on ASVspoof 2019 LA. | GPU | Graduate target on A10G |
| **TFPARN** | Transformer; best reported on ASVspoof 5 Track 1 with efficient inference | GPU/CPU | Track-1 if the team trains on ASVspoof 5 |

**36-hour posture.** Fine-tune RawNet2 or a distilled AASIST on ASVspoof 2019 LA plus a telephony-transcoded split. Export INT8 ONNX. If a T4/A10G Space is confirmed, swap the head to Wav2Vec2-AASIST without changing the WebSocket contract.

This console's in-browser scorer is a **contract-compatible stand-in**: LFCC-style bands, F0 lock, harmonicity, vocoder stair-step jitter, Kalman C(t). Judges hear the same Green/Amber/Red language the production graph will emit.

## Features

- **LFCC** — linear filter banks 0–8 kHz (not Mel). Linear spacing keeps resolution in the telephony band.
- **Bispectrum** — 64 ms subframes. Neural vocoders leave quadratic phase coupling that linear spectra miss.
- **F0 + energy trajectory** — locked F0 and stair-step frame gains are vocoder tells. Humans drift.
- **Jitter / harmonicity** — micro-perturbation vs too-clean harmonic stacks.
- After G.711, **discard reliance on energy above 3.4 kHz**. Keep phase coupling and micro-prosody.

## Training

- Datasets: ASVspoof 2019 LA, ASVspoof 5 Track 1, plus an Indian multilingual synthetic set (VITS, XTTS, ElevenLabs × Indian English, Hindi, Tamil, Telugu).
- Augment: ITU-T G.711 μ-law / A-law, AMR-NB, packet loss, office noise.
- Band-limit 300–3400 Hz on a scheduled fraction of each batch so the graph cannot cheat on studio highs.
- Report **EER separately** on 16 kHz clean and telephony-transcoded splits. Never quote only the clean number.

## Operating point

| Metric | Target (telephony split) |
| --- | --- |
| EER | ≤ 5.4% G.711 / AMR-NB; ≤ 3.2% 16 kHz reference |
| Decision latency | < 250 ms/chunk end-to-end (DSP + infer + WS) |
| FAR at chosen threshold | < 0.8% in office noise (Green operating point) |
| minDCF / CLLR | reported on the held-out split, not tuned on the demo file |

Thresholds in software: Green C(t) < 0.35, Red ≥ 0.75, Amber in between. Kalman window 1.5 s so a single noisy hop cannot flip the desk.

## Explainability

Frame-level saliency on LFCC bins, plus three boolean flags:

1. F0 lock (variance below human floor)
2. Stair-step jitter (vocoder frame grid)
3. Harmonicity too high for live speech

These become the plain-English markers in the console (`"F0 locked — vocoder-like"`, …). A judge should be able to point at the heatmap and read the same sentence.

## Why not a black-box file classifier

File upload demos lose SIH26104. The attack is a *call*. The detector must survive 8 kHz, packet loss, and a 250 ms budget, and it must *act* (challenge) before the RTGS instruction is read back.
