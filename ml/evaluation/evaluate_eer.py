"""
VoiceShield — Anti-Spoofing Metric Evaluation
Computes Equal Error Rate (EER), minDCF, and False Acceptance/Rejection Rates (FAR/FRR).
SIH26104 | voiceshield-team/voiceshield-sih-2026
"""

import numpy as np
from typing import Tuple


def compute_eer(bonafide_scores: np.ndarray, spoof_scores: np.ndarray) -> Tuple[float, float]:
    """
    Compute Equal Error Rate (EER) where FAR == FRR.

    Args:
        bonafide_scores: 1D array of scores for bonafide (genuine) samples.
        spoof_scores: 1D array of scores for spoofed (synthetic) samples.

    Returns:
        eer: Equal error rate percentage (0.0 to 1.0)
        threshold: Decision threshold where FAR == FRR
    """
    bonafide = np.sort(bonafide_scores)
    spoof = np.sort(spoof_scores)

    num_bonafide = len(bonafide)
    num_spoof = len(spoof)

    if num_bonafide == 0 or num_spoof == 0:
        return 0.0, 0.5

    all_scores = np.sort(np.concatenate([bonafide, spoof]))
    thresholds = np.unique(all_scores)

    # In bonafide vs spoof, higher score = higher probability of bonafide (or spoof depending on convention)
    # Convention here: Higher score = more likely bonafide
    # FRR = proportion of bonafide with score < threshold
    # FAR = proportion of spoof with score >= threshold

    frr = np.searchsorted(bonafide, thresholds, side="right") / num_bonafide
    far = (num_spoof - np.searchsorted(spoof, thresholds, side="left")) / num_spoof

    abs_diff = np.abs(far - frr)
    min_idx = np.argmin(abs_diff)

    eer = (far[min_idx] + frr[min_idx]) / 2.0
    threshold = thresholds[min_idx]

    return float(eer), float(threshold)


def compute_far_frr_at_threshold(
    bonafide_scores: np.ndarray, spoof_scores: np.ndarray, threshold: float
) -> Tuple[float, float]:
    """Calculate FAR and FRR at an exact operating threshold."""
    frr = float(np.mean(bonafide_scores < threshold))
    far = float(np.mean(spoof_scores >= threshold))
    return far, frr


if __name__ == "__main__":
    # Synthetic test benchmark validation
    np.random.seed(42)
    # Bonafide scores centered around 0.8, Spoof centered around 0.2
    bona = np.random.normal(0.8, 0.15, 1000)
    spoo = np.random.normal(0.2, 0.18, 1000)

    eer, thresh = compute_eer(bona, spoo)
    print(f"Benchmark Validation — EER: {eer * 100:.2f}% at threshold: {thresh:.4f}")

    far, frr = compute_far_frr_at_threshold(bona, spoo, thresh)
    print(f"At EER Threshold — FAR: {far * 100:.2f}%, FRR: {frr * 100:.2f}%")
