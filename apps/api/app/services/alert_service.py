import os
import httpx
import structlog
from app.config import settings

logger = structlog.get_logger()

async def send_threat_alert(session_id: str, risk_score: int, origin_location: str, transcript: str):
    """
    Fires an urgent WhatsApp alert via Twilio when a Deepfake is intercepted.
    Called from audio_endpoint.py when risk >= 0.75.
    """
    account_sid = settings.TWILIO_ACCOUNT_SID or os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = settings.TWILIO_AUTH_TOKEN or os.getenv("TWILIO_AUTH_TOKEN")
    from_number = settings.TWILIO_WHATSAPP_FROM or "whatsapp:+14155238886"
    to_number = settings.ALERT_PHONE_NUMBER or os.getenv("ALERT_PHONE_NUMBER")

    if not account_sid or not auth_token or not to_number:
        logger.warning("alert.whatsapp_skipped", reason="Twilio credentials missing")
        return

    message_body = (
        f"⚠️ *VOICESHIELD URGENT ALERT* ⚠️\n\n"
        f"An ongoing call (Session: {session_id[:8]}) from {origin_location} has been flagged as an *AI Deepfake*.\n\n"
        f"🚨 *Synthetic Risk:* {risk_score}%\n"
        f"🎙️ *Trigger:* {transcript}\n\n"
        f"🛑 *Action:* Please terminate the call immediately."
    )

    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    auth = (account_sid, auth_token)
    data = {
        "From": from_number,
        "To": to_number if to_number.startswith("whatsapp:") else f"whatsapp:{to_number}",
        "Body": message_body
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.post(url, auth=auth, data=data)
            res.raise_for_status()
            logger.info("alert.whatsapp_sent", to=to_number, risk=risk_score)
    except Exception as e:
        logger.error("alert.whatsapp_failed", error=str(e))
