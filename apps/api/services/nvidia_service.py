import httpx
import structlog
import os
from typing import Dict

logger = structlog.get_logger()

NVIDIA_INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "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")

async def generate_nvidia_xai_summary(markers: Dict[str, float], risk_level: str, max_risk: float) -> str:
    if risk_level == "low":
        return "Acoustic telemetry aligns with natural biological human vocal tract constraints. No neural vocoder artifacts or phase anomalies detected."

    prompt = f"""
    You are an expert Cyber Forensic Audio Examiner giving a brief, authoritative summary (under 60 words).
    Based on the following acoustic telemetry, explain why this audio might contain AI-generated deepfakes or splices.
    
    Telemetry:
    - Overall Risk Level: {risk_level.upper()}
    - Peak Spoof Probability (Max Risk): {max_risk * 100:.1f}%
    - High-Frequency Anomaly (Vocoder leakage): {markers['high_frequency_anomaly'] * 100:.1f}% (Normal is <10%)
    - Phase Discontinuity (Splicing marker): {markers['phase_discontinuity'] * 100:.1f}% (Normal is <15%)
    
    Provide the explanation in a professional, legal-forensic tone. Do not use markdown.
    """

    payload = {
        "model": "nvidia/nemotron-4-340b-instruct",
        "messages": [
            {"role": "system", "content": "You are a cyber forensics expert."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 150,
        "top_p": 0.95
    }

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(NVIDIA_INVOKE_URL, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            if "choices" in data and len(data["choices"]) > 0:
                summary = data["choices"][0]["message"]["content"].strip()
                return summary
            return "Forensic telemetry indicates significant synthetic deviations."
    except Exception as e:
        logger.error("nvidia_api.error", error=str(e))
        return f"WARNING: Advanced synthetic artifacts detected (Peak Risk: {max_risk*100:.1f}%), indicating probable deepfake injection."
