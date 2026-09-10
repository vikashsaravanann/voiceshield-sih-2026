"""
VoiceShield — Session Summary Routes
SIH26104 | voiceshield-team/voiceshield-sih-2026
"""

from fastapi import APIRouter, HTTPException

from app.db.supabase_client import get_supabase

router = APIRouter(tags=["Sessions"])


@router.get("/{session_id}/summary")
async def get_session_summary(session_id: str):
    """Retrieve session overview and risk statistics."""
    supabase = get_supabase()
    if not supabase:
        # Fallback response for offline / mock testing
        return {
            "session_id": session_id,
            "status": "completed",
            "total_chunks": 120,
            "avg_spoof_prob": 0.14,
            "max_spoof_prob": 0.88,
            "risk_summary": {
                "low_chunks": 115,
                "medium_chunks": 3,
                "high_chunks": 2,
            },
        }

    try:
        res = supabase.table("sessions").select("*").eq("id", session_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Session not found")

        session_data = res.data[0]
        events_res = supabase.table("detection_events").select("spoof_probability, risk_level").eq("session_id", session_id).execute()

        events = events_res.data or []
        probs = [e["spoof_probability"] for e in events]
        avg_prob = sum(probs) / len(probs) if probs else 0.0
        max_prob = max(probs) if probs else 0.0

        return {
            "session_id": session_id,
            "status": session_data.get("status"),
            "started_at": session_data.get("started_at"),
            "ended_at": session_data.get("ended_at"),
            "total_chunks": len(events),
            "avg_spoof_prob": round(avg_prob, 4),
            "max_spoof_prob": round(max_prob, 4),
            "risk_summary": session_data.get("risk_summary", {}),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
