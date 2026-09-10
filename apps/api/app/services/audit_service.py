"""
VoiceShield — Connection & Auth Audit Logging
Async-safe, fail-soft audit logging to Supabase.
SIH26104 | voiceshield-team/voiceshield-sih-2026
"""

from datetime import datetime, timezone
from typing import Any

import structlog

from app.db.supabase_client import get_supabase

logger = structlog.get_logger()


async def log_connection_event(
    session_id: str,
    event_type: str,
    details: dict[str, Any],
    ip_hash: str = "",
    user_agent: str = "",
) -> None:
    """Insert a connection lifecycle event into connection_audit_logs."""
    try:
        supabase = get_supabase()
        if supabase:
            supabase.table("connection_audit_logs").insert({
                "session_id": session_id if session_id and len(session_id) == 36 else None,
                "event_type": event_type,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "details": details,
                "ip_hash": ip_hash,
                "user_agent": user_agent,
            }).execute()
        logger.info("audit.connection_event_logged", session_id=session_id, event_type=event_type)
    except Exception as e:
        logger.debug("audit.connection_log_skipped", reason=str(e))


async def log_auth_event(
    user_id: str,
    event_type: str,
    details: dict[str, Any],
    session_id: str = "",
    ip_hash: str = "",
    user_agent: str = "",
) -> None:
    """Insert an authentication audit event into auth_audit_logs."""
    try:
        supabase = get_supabase()
        if supabase:
            supabase.table("auth_audit_logs").insert({
                "user_id": user_id if user_id and len(user_id) == 36 else None,
                "event_type": event_type,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "details": details,
                "session_id": session_id if session_id and len(session_id) == 36 else None,
                "ip_hash": ip_hash,
                "user_agent": user_agent,
            }).execute()
        logger.info("audit.auth_event_logged", user_id=user_id, event_type=event_type)
    except Exception as e:
        logger.debug("audit.auth_log_skipped", reason=str(e))
