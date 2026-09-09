# Model Card: RawNet2

## Model Details
- **Architecture:** RawNet2 (Sinc-Convolutional Neural Network)
- **Paper:** *RawNet2: End-to-End Anti-Spoofing Using Raw Audio* (Tak et al., 2021)
- **Input:** Raw PCM16 waveform samples (16kHz, mono)
- **Output:** Bonafide / Spoof classification score
- **Parameters:** ~1.2M parameters

## Performance Metrics
- **ASVspoof 2019 LA EER:** 1.91%
- **Inference Latency:** ~35ms on GPU / ~120ms on CPU
- **Memory Footprint:** 42MB RAM

## Intended Use
Low-resource edge execution and CPU-only backend deployments. Because RawNet2 processes raw waveforms directly through learned Sinc-filters, it eliminates the computational cost of STFT preprocessing.

## Limitations
Susceptible to false positives in reverberant or low-SNR phone environments without adaptive normalization.
