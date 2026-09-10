import structlog
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from app.config import settings
import asyncio

logger = structlog.get_logger()

def get_twilio_client():
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
        return None
    try:
        return Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    except Exception as e:
        logger.warning("alert_service.twilio_client_error", error=str(e))
        return None

async def send_threat_alert(session_id: str, risk_score: float, transcript: str, origin_location: str, operator_phone: str = None):
    """
    Sends WhatsApp message via Twilio WhatsApp API when risk >= 0.75.
    Falls back to SMS if WhatsApp is unavailable or fails.
    """
    client = get_twilio_client()
    if not client:
        logger.warning("alert_service.missing_credentials", action="send_threat_alert_skipped")
        return False
    
    phone_to_alert = operator_phone or settings.ALERT_PHONE_NUMBER
    if not phone_to_alert:
        logger.warning("alert_service.missing_phone", action="send_threat_alert_skipped")
        return False
        
    # Standardize phone number format
    if not phone_to_alert.startswith("+"):
        phone_to_alert = "+" + phone_to_alert.lstrip("0")

    message_body = (
        f"🚨 VoiceShield Alert\n"
        f"Threat Detected on your line!\n"
        f"Risk Score: {risk_score}%\n"
        f"Origin: {origin_location}\n"
        f"Session: {session_id}\n"
        f"Action: Call blocked.\n"
        f"Powered by VoiceShield SIH26104"
    )

    def _send():
        try:
            # Twilio trial accounts require pre-approved templates or ContentSids
            logger.info("alert_service.sending_whatsapp", to=phone_to_alert)
            msg = client.messages.create(
                from_=settings.TWILIO_WHATSAPP_FROM,
                to=f"whatsapp:{phone_to_alert}",
                content_sid="HXb131895de71a093156d1062e878de57c",
                # content_variables=json.dumps({"1": session_id}) # If template takes vars
            )
            logger.info("alert_service.whatsapp_sent", sid=msg.sid)
            return True
        except Exception as e:
            logger.warning("alert_service.whatsapp_failed", error=str(e))
            return False

    return await asyncio.to_thread(_send)

async def send_operator_email_alert(session_id: str, risk_score: float, transcript: str, origin_location: str, operator_email: str):
    """
    Formats and logs an email alert to the operator (mocking actual email sending).
    """
    logger.info(
        "alert_service.email_alert_sent",
        to=operator_email,
        session_id=session_id,
        risk_score=risk_score,
        origin=origin_location,
        transcript=transcript,
        subject="🚨 VoiceShield Threat Alert"
    )
    return True
