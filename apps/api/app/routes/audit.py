"""
VoiceShield — Audit Query Routes
SIH26104 | voiceshield-team/voiceshield-sih-2026
"""


from fastapi import APIRouter

from app.db.supabase_client import get_supabase

router = APIRouter(tags=["Audit"])


@router.get("/connections")
async def get_connection_logs(session_id: str | None = None):
    """Query connection lifecycle logs."""
    supabase = get_supabase()
    if not supabase:
        return {"logs": [], "mock": True}

    try:
        query = supabase.table("connection_audit_logs").select("*").order("timestamp", desc=True)
        if session_id:
            query = query.eq("session_id", session_id)
        res = query.limit(50).execute()
        return {"logs": res.data or []}
    except Exception as e:
        return {"error": str(e), "logs": []}


@router.get("/auth")
async def get_auth_logs(user_id: str | None = None):
    """Query authentication audit logs."""
    supabase = get_supabase()
    if not supabase:
        return {"logs": [], "mock": True}

    try:
        query = supabase.table("auth_audit_logs").select("*").order("timestamp", desc=True)
        if user_id:
            query = query.eq("user_id", user_id)
        res = query.limit(50).execute()
        return {"logs": res.data or []}
    except Exception as e:
        return {"error": str(e), "logs": []}
