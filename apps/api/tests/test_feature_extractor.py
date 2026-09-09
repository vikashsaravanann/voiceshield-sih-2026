import numpy as np
from app.ml.feature_extractor import extract_features
from app.ml.explainability import compute_explainability_markers


def test_extract_features():
    # 333ms of 16kHz PCM16 audio (5328 samples = 10656 bytes)
    samples = (np.sin(np.linspace(0, 2 * np.pi * 440, 5328)) * 16000).astype(np.int16)
    pcm_bytes = samples.tobytes()

    features = extract_features(pcm_bytes, 16000)
    assert "lfcc" in features
    assert "mel_spectrogram" in features
    assert "phase_inconsistency" in features
    assert features["samples_count"] == 5328

    markers = compute_explainability_markers(features)
    assert "high_frequency_anomaly" in markers
    assert "phase_discontinuity" in markers
    assert "prosody_irregularity" in markers
    assert 0.0 <= markers["high_frequency_anomaly"] <= 1.0
    assert 0.0 <= markers["phase_discontinuity"] <= 1.0
    assert 0.0 <= markers["prosody_irregularity"] <= 1.0
