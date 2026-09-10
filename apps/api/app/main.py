"""
VoiceShield API application entrypoint.

The WebSocket implementation lives in ``app.websocket.audio_endpoint`` so the
same detection contract is used by the browser and the backend tests.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.ml.spoof_model import SpoofModel
from app.routes import audit, challenges, health, sessions, twilio
from app.websocket import router as websocket_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    model = SpoofModel.load(settings.MODEL_PATH, settings.DEVICE)
    model.warmup()
    app.state.model = model
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.MODEL_VERSION,
    lifespan=lifespan,
)

allowed_origins = [
    origin.strip()
    for origin in settings.NEXT_PUBLIC_SITE_URL.split(",")
    if origin.strip()
]
# Always include known origins so health pings from Vercel are never blocked
_always_allow = [
    "https://voiceshield-live.vercel.app",
    "https://voiceshield-sih-2026.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
for _o in _always_allow:
    if _o not in allowed_origins:
        allowed_origins.append(_o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(websocket_router)
app.include_router(sessions.router, prefix="/api/sessions")
app.include_router(audit.router, prefix="/api/audit")
app.include_router(challenges.router, prefix="/api")
app.include_router(twilio.router, prefix="/api/twilio")


@app.get("/", tags=["Health"])
async def root():
    return {"status": "online", "service": "voiceshield-api", "version": settings.MODEL_VERSION}
