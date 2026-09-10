"""
VoiceShield — Twilio Media Stream WebSocket Endpoint
Handles incoming mu-law 8000Hz audio from Twilio, upsamples to 16000Hz PCM,
and runs it through the detection pipeline.
"""

import audioop
import base64
import json
import time
import uuid

import structlog
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.config import settings
from app.ml.feature_extractor import extract_features
from app.services.decision_engine import classify_risk
from app.services.session_service import (
    batch_insert_events,
    create_session,
    finalize_session,
)

logger = structlog.get_logger()
router = APIRouter()

@router.websocket("/ws/twilio")
async def twilio_websocket(websocket: WebSocket):
    await websocket.accept()
    model = getattr(websocket.app.state, "model", None)

    session_id: str | None = None
    stream_sid: str | None = None
    chunk_index: int = 0
    risk_values = []
    events_buffer = []
    
    # State for audioop rate conversion
    rate_state = None

    try:
        while True:
            message = await websocket.receive_text()
            data = json.loads(message)

            event_type = data.get("event")

            if event_type == "start":
                stream_sid = data["start"]["streamSid"]
                session_id = str(uuid.uuid5(uuid.NAMESPACE_URL, f"twilio:{stream_sid}"))
                await create_session(session_id, "twilio_caller", {"provider": "twilio", "stream_sid": stream_sid})
                logger.info("twilio.stream_started", stream_sid=stream_sid)

            elif event_type == "media":
                payload = data["media"]["payload"]
                chunk_index = int(data["media"]["chunk"])
                
                # Twilio sends base64 mu-law 8000Hz mono
                ulaw_bytes = base64.b64decode(payload)
                
                # Convert mu-law to PCM16 (linear)
                pcm_8k = audioop.ulaw2lin(ulaw_bytes, 2)
                
                # Upsample 8000Hz to 16000Hz
                pcm_16k, rate_state = audioop.ratecv(pcm_8k, 2, 1, 8000, 16000, rate_state)

                if len(pcm_16k) < 32:
                    continue

                t_start = time.perf_counter()

                try:
                    features = extract_features(pcm_16k, settings.AUDIO_SAMPLE_RATE)
                except Exception as fe:
                    logger.warning("twilio.feature_extraction_failed", error=str(fe))
                    continue

                if model:
                    spoof_prob = model.predict(features)
                    markers = model.explainability_markers(features)
                else:
                    spoof_prob = 0.08
                    markers = {"anomaly": 0.05}

                risk_level, suggested_action = classify_risk(spoof_prob)
                risk_values.append(spoof_prob)
                latency_ms = int((time.perf_counter() - t_start) * 1000)
                events_buffer.append({
                    "session_id": session_id,
                    "chunk_index": chunk_index,
                    "spoof_probability": float(spoof_prob),
                    "risk_level": risk_level,
                    "features_snapshot": {
                        "latency_ms": latency_ms,
                        "transport": "twilio_media_stream",
                    },
                    "explainability_markers": markers,
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S+00:00", time.gmtime()),
                })
                if len(events_buffer) >= 5:
                    await batch_insert_events(list(events_buffer))
                    events_buffer.clear()
                
                # We could send a websocket message back, but Twilio expects TwiML/Commands.
                # Since we don't have bidirectional audio mitigation yet, we just log the detection.
                logger.info("twilio.chunk_processed", 
                            stream_sid=stream_sid, 
                            chunk=chunk_index, 
                            risk=risk_level, 
                            prob=spoof_prob)
                
                # If risk is high, we could potentially inject a Twilio "mark" or "clear" event to hang up
                if spoof_prob > 0.8:
                    logger.warning("twilio.high_risk_detected", stream_sid=stream_sid, prob=spoof_prob)
                    # In a real app, we'd trigger a REST API call to Twilio to terminate the call here.

            elif event_type == "stop":
                logger.info("twilio.stream_stopped", stream_sid=stream_sid)
                break

    except WebSocketDisconnect:
        logger.info("twilio.disconnected", stream_sid=stream_sid)

    except Exception as e:
        logger.error("twilio.error", stream_sid=stream_sid, error=str(e))

    finally:
        if session_id:
            if events_buffer:
                await batch_insert_events(list(events_buffer))
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
