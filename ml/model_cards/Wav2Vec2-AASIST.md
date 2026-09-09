# Model Card: Wav2Vec2-AASIST

## Model Details
- **Architecture:** Self-Supervised Audio Representations (Wav2Vec 2.0 / XLS-R) + AASIST Graph Attention Head
- **Input:** 16kHz raw PCM waveform
- **Output:** Frame and utterance level spoof logits
- **Parameters:** ~317M parameters (with Wav2Vec2 base)

## Performance Metrics
- **ASVspoof 2019 LA EER:** ~0.65% (SOTA in-domain)
- **ASVspoof 2021 DF EER:** ~4.2%
- **Inference Latency:** ~65ms on NVIDIA T4/A10G GPU (FP16)
- **Memory Footprint:** 2.5GB VRAM

## Intended Use
High-assurance banking and emergency line deployments on Hugging Face Spaces GPU or Render GPU nodes. Rich SSL features capture nuanced linguistic and phonetic inconsistencies across Indic languages.

## Limitations
High computational requirements make CPU serving impractical for sub-250ms streaming budgets.
