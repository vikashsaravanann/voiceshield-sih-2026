# Model Card: TFPARN (Transformer Focal-Pairwise Attentive Ranking Network)

## Model Details
- **Architecture:** Transformer Focal-Pairwise Attentive Ranking Network
- **Target Dataset:** ASVspoof 5 Track 1
- **Input:** Multi-resolution spectral and temporal embeddings
- **Output:** Pairwise relative ranking score for voice clone authenticity

## Performance Metrics
- **ASVspoof 5 Track 1 minDCF:** Top-tier competitive rank
- **EER:** ~3.1% on compressed telephony evaluation sets
- **Inference Latency:** ~55ms on GPU

## Intended Use
Research and evaluation baseline for modern voice cloning architectures (diffusion, VITS2, and flow matching). Ideal for ensemble integration alongside AASIST.

## Limitations
Requires training with pairwise loss formulation and substantial data augmentation for stable cross-dataset transfer.
