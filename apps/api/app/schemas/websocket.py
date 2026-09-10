"""
VoiceShield — WebSocket Message Schemas
SIH26104 | voiceshield-team/voiceshield-sih-2026
"""

from typing import Any

from pydantic import BaseModel, Field


class InitMessage(BaseModel):
    type: str = "session.start"
    session_id: str
    user_id: str
    sample_rate: int = 16000
    channels: int = 1
    chunk_ms: int = 333
    client: dict[str, Any] = Field(default_factory=dict)


class ResumeMessage(BaseModel):
    type: str = "session.resume"
    session_id: str
    last_processed_chunk_index: int = 0


class DetectionResponse(BaseModel):
    type: str = "detection.result"
    session_id: str
    chunk_index: int
    spoof_probability: float
    risk_level: str
    suggested_action: str
    latency_ms: float
    explainability_markers: dict[str, float]
    model: dict[str, str]
