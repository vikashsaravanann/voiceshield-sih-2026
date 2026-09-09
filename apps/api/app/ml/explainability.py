"""
VoiceShield — Explainability Marker Synthesizer
Computes interpretable markers from spectral and phase anomalies.
"""

from typing import Any, Dict
import numpy as np


def compute_explainability_markers(features: Dict[str, Any]) -> Dict[str, float]:
    """
    Compute plain-English explainable markers from extracted features.

    Returns:
        Dict with keys: high_frequency_anomaly, phase_discontinuity, prosody_irregularity
        Each value is bounded in [0.0, 1.0].
    """
    mel = features.get("mel_spectrogram")
    phase = features.get("phase_inconsistency", 0.0)

    if mel is not None and isinstance(mel, np.ndarray) and mel.size > 0:
        # High-frequency bands (top 25% of Mel spectrum)
        top_bins = max(1, mel.shape[0] // 4)
        high_freq_energy = float(np.mean(mel[-top_bins:, :]))
        high_freq_anomaly = min(max((high_freq_energy + 80.0) / 40.0, 0.0), 1.0)

        # Mid-band prosody dynamic variation
        mid_bins = mel[8:min(32, mel.shape[0]), :]
        if mid_bins.size > 0:
            prosody_score = float(np.std(mid_bins) / 20.0)
            prosody_score = min(max(prosody_score, 0.0), 1.0)
        else:
            prosody_score = 0.1
    else:
        high_freq_anomaly = 0.1
        prosody_score = 0.1

    phase_score = min(max(float(phase) / 5.0, 0.0), 1.0)

    return {
        "high_frequency_anomaly": round(high_freq_anomaly, 3),
        "phase_discontinuity": round(phase_score, 3),
        "prosody_irregularity": round(prosody_score, 3),
    }
