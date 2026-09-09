"""VoiceShield FastAPI — health, sessions, WebSocket audio hops."""

from __future__ import annotations

import os
import time
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.websocket.audio_endpoint import handle_audio_socket

app = FastAPI(title="VoiceShield API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "healthy",
        "service": "voiceshield-api",
        "model_loaded": True,
        "device": settings.device,
        "version": "0.1.0",
        "store_raw_audio": False,
        "ts": time.time(),
    }


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "voiceshield-api", "ws": "/ws/audio", "docs": "/docs"}


@app.websocket("/ws/audio")
async def ws_audio(ws: WebSocket) -> None:
    await handle_audio_socket(ws)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=int(os.environ.get("PORT", "8000")))
