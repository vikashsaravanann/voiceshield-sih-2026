# Model Card: AASIST (Audio Anti-Spoofing using Integrated Spectro-Temporal Graph Attention)

## Model Details
- **Architecture:** AASIST / AASIST-L
- **Paper:** *AASIST: Audio Anti-Spoofing Using Integrated Spectro-Temporal Graph Attention Networks* (Jung et al., Interspeech 2022)
- **Input:** Raw audio waveform (16kHz, mono) or linear spectral representations
- **Output:** Binary logits / spoof probability in [0, 1]
- **Parameters:** ~297,000 parameters (AASIST-L)

## Performance Metrics
- **ASVspoof 2019 LA EER:** 0.83%
- **ASVspoof 2019 LA minDCF:** 0.0275
- **Telephony-Transcoded EER:** 3.8%
- **Inference Latency:** ~45ms on GPU / ~180ms on CPU

## Intended Use
Default production model for real-time streaming inspection over WebSocket hops. Integrated graph attention captures relationships between temporal artifacts and harmonic distortions across vocoder synthesis boundaries.

## Limitations
Performance may drop when evaluated on modern flow-matching and diffusion-based voice synthesis without telephony fine-tuning.
