"""
VoiceShield — Real-Time WebSocket Audio Endpoint
Handles streaming audio chunks, spoof detection, and session management.
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
    # Took me hours to debug why Supabase inserts were failing silently.
    # Turns out, the frontend was passing `sess_123` as the ID, but the DB
    # strictly enforces UUIDs for the primary key. This function intercepts
    # and patches it so we never violate the FK constraint on `detection_events`.
    if not raw:
        return str(_uuid_mod.uuid4())
    try:
        _uuid_mod.UUID(raw)
        return raw
    except (ValueError, AttributeError):
        # Fallback to random UUID if they sent a generic string
        return str(_uuid_mod.uuid4())


@router.websocket("/ws/audio")
async def audio_websocket(websocket: WebSocket):
    await websocket.accept()
    
    session_id: Optional[str] = None
    client_ip = websocket.client.host if websocket.client else "unknown"
    start_time = time.time()
    
    events_buffer = []
    chunk_index = 0
    total_audio_bytes = 0
    # Add a flag to prevent spamming WhatsApp with 50 messages per call
    alert_dispatched = False

    try:
        data = await websocket.receive_text()
        init_payload = json.loads(data)
        
        raw_session_id = init_payload.get("session_id")
        session_id = _ensure_uuid(raw_session_id)
            
        logger.info("ws_connected", session_id=session_id, client_ip=client_ip)
        await log_connection_event(session_id, "connected", client_ip)
        await create_session(session_id, client_ip)
        
        await websocket.send_json({"status": "ready", "session_id": session_id})
        
        model = websocket.app.state.model

        while True:
            # We expect raw PCM16 bytes directly from the microphone
            message = await websocket.receive()
            if "bytes" not in message:
                if "text" in message:
                    try:
                        text_data = json.loads(message["text"])
                        if text_data.get("action") == "end_session":
                            break
                    except json.JSONDecodeError:
                        pass
                continue
                
            audio_bytes = message["bytes"]
            chunk_size = len(audio_bytes)
            total_audio_bytes += chunk_size
            
            # Skip tiny chunks that the frontend sometimes sends on startup
            if chunk_size < 1024:
                continue
                
            process_start = time.time()
            
            # Step 1: Extract LFCC Features
            features = extract_features(audio_bytes, sample_rate=16000)
            
            # Step 2: Run inference through the CNN
            prob = model.predict(features)
            
            # Step 3: Classify risk thresholds
            risk_level, explanation = classify_risk(prob)
            
            latency_ms = int((time.time() - process_start) * 1000)
            
            resp = DetectionResponse(
                chunk_id=chunk_index,
                prob=float(prob),
                risk_level=risk_level,
                latency_ms=latency_ms,
                explanation=explanation
            )
            
            await websocket.send_json(resp.model_dump())
            
            # Fire the Twilio WhatsApp Alert if risk is high (and we haven't already!)
            if risk_level == "high" and not alert_dispatched:
                alert_dispatched = True
                logger.warning(f"🚨 HIGH THREAT DETECTED! Session: {session_id} Risk: {prob:.2f}")
                # Dispatch alert asynchronously so we don't block the WebSocket audio stream
                asyncio.create_task(
                    alert_service.send_threat_alert(
                        session_id=session_id,
                        risk_score=int(prob * 100),
                        origin_location="WebRTC Stream",
                        transcript="[Audio Signature Analysis Triggered]"
                    )
                )

            events_buffer.append({
                "session_id": session_id,
                "chunk_index": chunk_index,
                "prob": float(prob),
                "risk_level": risk_level,
                "latency_ms": latency_ms,
                "explanation": explanation,
                "created_at": datetime.now(timezone.utc).isoformat()
            })
            
            chunk_index += 1
            
            # Flush to Supabase in batches of 5 to avoid killing the DB
            # We don't want to do 1 insert per 300ms chunk
            if len(events_buffer) >= 5:
                # Fire and forget database insert
                asyncio.create_task(batch_insert_events(list(events_buffer)))
                events_buffer.clear()

    except WebSocketDisconnect:
        logger.info("ws_disconnected", session_id=session_id)
    except Exception as e:
        logger.error("ws_error", error=str(e), session_id=session_id)
    finally:
        # Catch any leftover events
        if events_buffer and session_id:
            await batch_insert_events(list(events_buffer))
            
        duration = int(time.time() - start_time)
        if session_id:
            await log_connection_event(session_id, "disconnected", client_ip)
            await finalize_session(session_id, duration)

