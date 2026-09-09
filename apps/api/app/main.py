"""
VoiceShield FastAPI Backend — Main Application Entry Point
SIH26104 | voiceshield-team/voiceshield-sih-2026
"""

import logging
import structlog
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.ml.spoof_model import SpoofModel
from app.routes import health, sessions, audit
from app.websocket.audio_endpoint import router as ws_router

# ─────────────────────────────────────────
# Structured logging
# ─────────────────────────────────────────
structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
)
logger = structlog.get_logger()

# ─────────────────────────────────────────
# Lifespan Context: Load Model & Warmup
# ─────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML model at startup and pre-warm execution kernels."""
    logger.info("voiceshield.startup", model_name=settings.MODEL_NAME, device=settings.DEVICE)
    model = SpoofModel.load(settings.MODEL_PATH, settings.DEVICE)
    model.warmup()
    logger.info("voiceshield.model_ready", device=settings.DEVICE)
    app.state.model = model
    yield
    logger.info("voiceshield.shutdown")


# ─────────────────────────────────────────
# FastAPI Application
# ─────────────────────────────────────────
app = FastAPI(
    title="VoiceShield API",
    description="Real-time voice cloning detection and prevention — SIH26104",
    version=settings.MODEL_VERSION,
    lifespan=lifespan,
)

# ─────────────────────────────────────────
# CORS
# ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.NEXT_PUBLIC_SITE_URL,
        "http://localhost:3000",
        "https://voiceshield-sih-2026.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────
# Routers
# ─────────────────────────────────────────
app.include_router(health.router)
app.include_router(sessions.router, prefix="/sessions")
app.include_router(audit.router, prefix="/audit")
app.include_router(ws_router)


@app.get("/")
def root():
    return {
        "service": "voiceshield-api",
        "status": "online",
        "ws_endpoint": "/ws/audio",
        "health": "/health",
        "version": settings.MODEL_VERSION,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
