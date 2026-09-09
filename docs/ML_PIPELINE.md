# VoiceShield ML Pipeline Specification

**SIH 2026 | Problem ID: SIH26104 | AICTE – Cyber Security Cell**  
*AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks*

---

## 1. Executive Summary

VoiceShield employs a **hybrid signal processing (DSP) and deep representation learning** framework. Designed specifically for Indian telecommunication environments (G.711 / AMR-NB band-limiting, acoustic background noise, and packet-loss jitter), the pipeline operates on streaming 333ms frames with a strict latency budget of <250ms.

---

## 2. Model Benchmarks & Comparison

| Model Architecture | Strengths & In-Domain Performance | Target Latency | Compute / RAM | Recommended SIH Context |
|---|---|---|---|---|
| **AASIST** (Graph Attention) | Graph attention over spectro-temporal nodes; EER ~0.83% on ASVspoof 2019 LA. | ~180ms (CPU) / ~45ms (GPU) | 85MB / 1GB VRAM | **Default for balanced deployment** (TorchScript) |
| **RawNet2** (Sinc-Conv Waveform) | End-to-end raw audio processing; robust to compression; EER ~1.91% on ASVspoof 2019. | ~120ms (CPU) / ~35ms (GPU) | 42MB / 512MB VRAM | **CPU Fallback / Low-Resource Edge** |
| **Wav2Vec2-AASIST** (SSL + Graph) | XLS-R / wav2vec 2.0 representations + AASIST head; SOTA in-domain (<1% EER). | ~240ms (CPU) / ~65ms (GPU) | 360MB / 2.5GB VRAM | **Hugging Face Spaces GPU Target** (A10G/T4) |
| **TFPARN** (Focal-Pairwise Ranking) | Transformer pairwise ranking; state-of-the-art on ASVspoof 5 Track 1. | ~210ms (CPU) / ~55ms (GPU) | 180MB / 1.8GB VRAM | **Advanced Research / ASVspoof 5 Ensemble** |

> **Note on Generalization:** While models achieve <1% EER on clean ASVspoof 2019 evaluation sets, performance degrades on unseen commercial neural vocoders (e.g., ElevenLabs, XTTS, VITS). VoiceShield integrates linear DSP markers (phase variance and F0 harmonicity) to catch artifacts that deep neural representations miss.

---

## 3. Feature Engineering Pipeline

### A. Linear Frequency Cepstral Coefficients (LFCC)
Unlike standard Mel filterbanks that compress higher frequencies to mimic human hearing, **LFCC uses linear frequency filters (0–8kHz)**. This preserves high-frequency vocoder phase artifacts that are critical for synthetic voice detection.
- Filterbank: 40 linear filters + 40 delta coefficients = 80-dimensional feature tensor.
- FFT Window: 512 samples (25ms at 16kHz), hop size: 160 samples (10ms).

### B. Log-Scaled Mel-Spectrogram
- 64 Mel bands spanning 20Hz to 8000Hz.
- Converted to dB scale (`power_to_db` with peak normalization).
- Captures prosody, pitch contours, and spectral energy distribution.

### C. Phase Inconsistency & Group Delay
Neural vocoders (such as HiFi-GAN, WaveGlow, and BigVGAN) generate phase spectra via minimum-phase approximation or inverse STFT, leaving distinct unnatural phase discontinuities. VoiceShield computes instantaneous phase variance across adjacent frames:
$$\Delta \phi(t, \omega) = \angle X(t, \omega) - \angle X(t-1, \omega)$$
$$\text{phase\_inconsistency} = \text{Var}\left(\Delta \phi(t, \omega)\right)$$

---

## 4. Model Export & Production Optimization

1. **TorchScript JIT Compilation:**
   ```python
   traced_model = torch.jit.trace(model, dummy_input)
   traced_model.save("models/aasist.pt")
   ```
2. **ONNX Runtime Export:**
   - Quantized to INT8 for sub-100ms CPU execution.
   - Dynamic axis support for variable audio lengths.
3. **GPU Warm-Up Routine:**
   - At startup, backend executes 3 dummy forward passes with random Gaussian tensors to pre-allocate CUDA memory and compile cuDNN execution kernels, preventing first-request cold start latency.

---

## 5. Explainable AI (XAI) & Marker Synthesis

VoiceShield translates raw model activations into three human-interpretable markers displayed to operators:

1. **High-Frequency Energy Anomaly (`high_frequency_anomaly`):**
   Evaluates uncharacteristic energy concentrations above 3.5kHz typical of neural vocoder upsampling artifacts.
2. **Phase Discontinuity (`phase_discontinuity`):**
   Measures instantaneous frequency jitter and phase mismatch across frame boundaries.
3. **Prosody Irregularity (`prosody_irregularity`):**
   Measures robotic pitch flatness and unnatural pitch transitions.
