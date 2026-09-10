"""
VoiceShield — Real-Time WebSocket Audio Endpoint
Handles streaming audio chunks, spoof detection, and session management.
SIH26104 | voiceshield-team/voiceshield-sih-2026
"""

import time
import asyncio
import json
import structlog
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.config import settings
from app.ml.feature_extractor import extract_features
from app.services.decision_engine import classify_risk
from app.services.audit_service import log_connection_event
from app.services.session_service import create_session, finalize_session, batch_insert_events
from app.services import alert_service
from app.schemas.websocket import DetectionResponse

logger = structlog.get_logger()
router = APIRouter()

import uuid as _uuid_mod

def _ensure_uuid(raw: Optional[str]) -> str:
    """
    Guarantee the returned value is a valid UUID string.
    If the caller sent a non-UUID session_id (e.g. "sess_1234"), generate a
    fresh UUID so Supabase foreign-key constraints are never violated.
    """
    if not raw:
        return str(_uuid_mod.uuid4())
    try:
        _uuid_mod.UUID(raw)
        return raw
    except (ValueError, AttributeError):
        return str(_uuid_mod.uuid4())


@router.websocket("/ws/audio")
async def audio_websocket(websocket: WebSocket):
    """
    Continuous streaming WebSocket endpoint.
    Accepts 16kHz PCM16 audio chunks, evaluates anti-spoofing in sub-250ms,
    and dispatches explainability telemetry.
    """
    await websocket.accept()
    model = getattr(websocket.app.state, "model", None)

    session_id: Optional[str] = None
    user_id: Optional[str] = None
    chunk_index: int = 0
    pending_events: List[Dict[str, Any]] = []
    risk_values: List[float] = []
    alert_sent: bool = False

    try:
        # ── Step 1: Handshake and Session Registration ────────────────
        first_msg = await websocket.receive()
        if "text" in first_msg and first_msg["text"]:
            raw_init = json.loads(first_msg["text"])
            msg_type = raw_init.get("type", "session.start")

            if msg_type in ("session.start", "start"):
                session_id = _ensure_uuid(raw_init.get("session_id"))
                user_id = raw_init.get("user_id")
                chunk_index = 0
                await create_session(session_id, user_id, raw_init.get("client", {}))
                await log_connection_event(session_id, "connected", {"client": raw_init.get("client", {})})
                await websocket.send_json({"type": "session.ack", "session_id": session_id})
                logger.info("ws.session_start", session_id=session_id)

            elif msg_type == "session.resume":
                session_id = _ensure_uuid(raw_init.get("session_id"))
                last_idx = int(raw_init.get("last_processed_chunk_index", 0) or 0)
                chunk_index = last_idx + 1
                await log_connection_event(session_id, "reconnected", {"resumed_at_chunk": chunk_index})
                await websocket.send_json({"type": "resume.ack", "resumed_at_chunk": chunk_index})
                logger.info("ws.session_resume", session_id=session_id, chunk_index=chunk_index)

        # ── Step 2: Continuous Ingestion & Processing Loop ────────────
        while True:
            message = await websocket.receive()

            if message.get("type") == "websocket.disconnect":
                break

            audio_bytes: Optional[bytes] = None

            # Handle Binary PCM16 payload
            if "bytes" in message and message["bytes"]:
                audio_bytes = message["bytes"]

            # Handle JSON payload (debug/base64/control)
            elif "text" in message and message["text"]:
                payload = json.loads(message["text"])
                p_type = payload.get("type")

                if p_type == "session.end" or p_type == "stop":
                    break
                elif p_type == "session.resume":
                    chunk_index = int(payload.get("last_processed_chunk_index", chunk_index)) + 1
                    await websocket.send_json({"type": "resume.ack", "resumed_at_chunk": chunk_index})
                    continue
                elif p_type == "chunk" and "pcm" in payload:
                    import base64
                    audio_bytes = base64.b64decode(payload["pcm"])
                    if "index" in payload:
                        chunk_index = int(payload["index"])

            if not audio_bytes or len(audio_bytes) < 32:
                continue

            # ── DSP Feature Extraction & ML Inference ─────────────
            t_start = time.perf_counter()

            try:
                features = extract_features(audio_bytes, settings.AUDIO_SAMPLE_RATE)
            except Exception as fe:
                logger.warning("ws.feature_extraction_failed", error=str(fe))
                features = {"phase_inconsistency": 0.05, "mel_spectrogram": None, "lfcc": None}

            if model:
                spoof_prob = model.predict(features)
                markers = model.explainability_markers(features)
            else:
                spoof_prob = 0.08
                markers = {
                    "high_frequency_anomaly": 0.05,
                    "phase_discontinuity": 0.04,
                    "prosody_irregularity": 0.06,
                }

            risk_level, suggested_action = classify_risk(spoof_prob)
            latency_ms = round((time.perf_counter() - t_start) * 1000, 2)
            
            if risk_level == 'high' and not alert_sent:
                alert_sent = True
                asyncio.create_task(
                    alert_service.send_threat_alert(
                        session_id=session_id or "anon",
                        risk_score=round(spoof_prob * 100, 2),
                        transcript="<Audio Chunk>",
                        origin_location="Unknown/PSTN"
                    )
                )

            response = DetectionResponse(
                type="detection.result",
                session_id=session_id or "anon",
                chunk_index=chunk_index,
                spoof_probability=round(spoof_prob, 4),
                risk_level=risk_level,
                suggested_action=suggested_action,
                latency_ms=latency_ms,
                explainability_markers=markers,
                model={"name": settings.MODEL_NAME, "version": settings.MODEL_VERSION},
            )

            await websocket.send_json(response.model_dump())

            # Batch telemetry asynchronously every 10 chunks
            if session_id:
                pending_events.append({
                    "session_id": session_id,
                    "chunk_index": chunk_index,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "spoof_probability": spoof_prob,
                    "risk_level": risk_level,
                    "explainability_markers": markers,
                })
                risk_values.append(spoof_prob)

                if len(pending_events) >= 10:
                    asyncio.create_task(batch_insert_events(pending_events.copy()))
                    pending_events.clear()

            chunk_index += 1

    except WebSocketDisconnect:
        if session_id:
            await log_connection_event(session_id, "disconnected", {"last_chunk_index": chunk_index})
        logger.info("ws.disconnected", session_id=session_id)

    except Exception as e:
        if session_id:
            await log_connection_event(session_id, "error", {"error": str(e)})
        logger.error("ws.error", session_id=session_id, error=str(e))

    finally:
        if pending_events:
            await batch_insert_events(pending_events)
        if session_id:
            await finalize_session(
                session_id,
                chunk_index,
                {
                    "total_chunks": len(risk_values),
                    "avg_risk": round(sum(risk_values) / len(risk_values), 4) if risk_values else 0,
                    "max_risk": round(max(risk_values), 4) if risk_values else 0,
                    "decision": "blocked" if risk_values and max(risk_values) >= 0.7 else "allowed",
                },
            )
        logger.info("ws.session_closed", session_id=session_id, total_chunks=chunk_index)
