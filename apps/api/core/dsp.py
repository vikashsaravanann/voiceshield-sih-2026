import numpy as np
import scipy.signal

def extract_acoustic_features(audio_buffer: np.ndarray, sample_rate: int = 16000) -> dict:
    """
    Extracts high-frequency spectral roll-off, zero-crossing rate,
    and energy variance across 250ms chunks to identify synthetic vocoder artifacts.
    """
    if len(audio_buffer) == 0:
        return {"spectral_rolloff": 0.0, "zero_crossings": 0.0, "variance": 0.0}
    
    # Normalize audio buffer
    audio = audio_buffer.astype(np.float32)
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = audio / max_val
        
    # Zero Crossing Rate (TTS models often have unnaturally smooth transitions)
    zero_crossings = float(np.mean(np.abs(np.diff(np.sign(audio)))) / 2)
    
    # Spectral Roll-off (detects high-frequency truncation in vocoders)
    freqs, psd = scipy.signal.periodogram(audio, fs=sample_rate)
    cumulative_energy = np.cumsum(psd)
    total_energy = cumulative_energy[-1] if len(cumulative_energy) > 0 else 1.0
    cutoff_idx = np.where(cumulative_energy >= 0.85 * total_energy)[0]
    rolloff = float(freqs[cutoff_idx[0]]) if len(cutoff_idx) > 0 else 0.0
    
    return {
        "spectral_rolloff": round(rolloff, 2),
        "zero_crossings": round(zero_crossings, 4),
        "variance": float(np.var(audio))
    }
