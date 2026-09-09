"""
VoiceShield — Health Check Endpoint
SIH26104 | voiceshield-team/voiceshield-sih-2026
"""

from fastapi import APIRouter, Request
from app.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health(request: Request):
    """Returns service health, model load status, and runtime device."""
    model = getattr(request.app.state, "model", None)
    is_loaded = model is not None and getattr(model, "model", None) is not None
    model_name = getattr(model, "model_name", settings.MODEL_NAME) if model else settings.MODEL_NAME

    return {
        "status": "healthy",
        "service": "voiceshield-api",
        "model_loaded": is_loaded or model is not None,
        "model_name": model_name,
        "device": settings.DEVICE,
        "version": settings.MODEL_VERSION,
        "store_raw_audio": settings.STORE_RAW_AUDIO,
    }
