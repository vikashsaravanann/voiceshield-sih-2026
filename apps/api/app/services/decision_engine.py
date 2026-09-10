"""
VoiceShield — Risk Decision Engine
Maps spoof probability to risk levels and suggested actions.
SIH26104 | voiceshield-team/voiceshield-sih-2026
"""


THRESHOLDS = {
    "medium": 0.3,
    "high": 0.7,
}

ACTIONS = {
    "low": "monitor",
    "medium": "challenge",
    "high": "block",
}


def classify_risk(spoof_probability: float) -> tuple[str, str]:
    """
    Classify spoof probability into a risk level and suggested action.

    Args:
        spoof_probability: float in [0.0, 1.0]

    Returns:
        tuple (risk_level, suggested_action)
        - low (<0.3) -> "monitor"
        - medium (0.3 <= p < 0.7) -> "challenge"
        - high (p >= 0.7) -> "block"
    """
    if spoof_probability >= THRESHOLDS["high"]:
        level = "high"
    elif spoof_probability >= THRESHOLDS["medium"]:
        level = "medium"
    else:
        level = "low"

    return level, ACTIONS[level]
