from app.websocket.audio_endpoint import router as audio_router
from app.websocket.twilio_endpoint import router as twilio_router
from fastapi import APIRouter

router = APIRouter()
router.include_router(audio_router)
router.include_router(twilio_router)

__all__ = ["router"]
