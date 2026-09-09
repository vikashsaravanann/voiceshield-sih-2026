"""
VoiceShield — Session Management Service
Persists active streaming sessions and batches detection telemetry.
SIH26104 | voiceshield-team/voiceshield-sih-2026
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import structlog
from app.db.supabase_client import get_supabase

logger = structlog.get_logger()


async def create_session(session_id: str, user_id: Optional[str], client_info: Dict[str, Any]) -> None:
    """Register new audio stream session."""
    try:
        supabase = get_supabase()
        if supabase:
            payload = {
                "id": session_id,
                "started_at": datetime.now(timezone.utc).isoformat(),
                "client_info": client_info,
                "status": "active",
            }
            if user_id and _is_uuid(user_id):
                payload["user_id"] = user_id
            supabase.table("sessions").insert(payload).execute()
        logger.info("session.created", session_id=session_id)
    except Exception as e:
        logger.warning("session.create_failed", session_id=session_id, reason=str(e))


async def finalize_session(session_id: str, total_chunks: int, risk_summary: Dict[str, Any] = None) -> None:
    """Close and finalize active session."""
    try:
        supabase = get_supabase()
        if supabase:
            summary = risk_summary or {"total_chunks": total_chunks}
            supabase.table("sessions").update({
                "ended_at": datetime.now(timezone.utc).isoformat(),
                "status": "completed",
                "risk_summary": summary,
            }).eq("id", session_id).execute()
        logger.info("session.finalized", session_id=session_id, total_chunks=total_chunks)
    except Exception as e:
        logger.warning("session.finalize_failed", session_id=session_id, reason=str(e))


async def batch_insert_events(events: List[Dict[str, Any]]) -> None:
    """Batch insert detection events into Supabase."""
    if not events:
        return
    try:
        supabase = get_supabase()
        if supabase:
            supabase.table("detection_events").insert(events).execute()
        logger.info("events.batch_inserted", count=len(events))
    except Exception as e:
        logger.warning("events.batch_insert_failed", reason=str(e))


def _is_uuid(value: str) -> bool:
    import uuid

    try:
        uuid.UUID(value)
        return True
    except (ValueError, AttributeError, TypeError):
        return False
