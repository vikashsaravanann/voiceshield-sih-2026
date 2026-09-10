"""
VoiceShield API application entrypoint.

The WebSocket implementation lives in `app.websocket.audio_endpoint`.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.ml.spoof_model import SpoofModel
from app.routes import audit, challenges, forensics, health, sessions, twilio
from app.websocket import router as websocket_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Note: Loading the model into app.state during lifespan is crucial!
    # Initially I was loading it on the first WebSocket connection, but that 
    # caused a massive ~2 second latency spike for the first audio chunk.
    # Warming it up here keeps the inference latency under 20ms immediately.
    print(f"Loading model from {settings.MODEL_PATH} onto {settings.DEVICE}...")
    model = SpoofModel.load(settings.MODEL_PATH, settings.DEVICE)
    model.warmup()
    app.state.model = model
    print("Model loaded and warmed up successfully.")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.MODEL_VERSION,
    lifespan=lifespan,
)

# CORS was a massive headache during deployment.
# We parse the NEXT_PUBLIC_SITE_URL but also hardcode the vercel domains
# because sometimes Vercel preview environments use random domain hashes.
allowed_origins = [
    origin.strip()
    for origin in settings.NEXT_PUBLIC_SITE_URL.split(",")
    if origin.strip()
]
_always_allow = [
    "https://voiceshield-live.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
for _o in _always_allow:
    if _o not in allowed_origins:
        allowed_origins.append(_o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    # This regex is a lifesaver for Vercel preview deployments
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
app.include_router(forensics.router, prefix="/api")


@app.get("/", tags=["Health"])
async def root():
    # Render free tier goes to sleep after 15 mins.
    # The frontend ping hits this root route to wake it up before the WebSocket connects.
    return {"status": "online", "service": "voiceshield-api", "version": settings.MODEL_VERSION}
