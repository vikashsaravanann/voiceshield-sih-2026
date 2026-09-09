from fastapi import APIRouter, Request, Response

router = APIRouter(tags=["Twilio"])

@router.post("/voice")
async def twilio_voice(request: Request):
    """
    Webhook endpoint for Twilio incoming calls.
    Returns TwiML instructing Twilio to open a Media Stream WebSocket.
    """
    host = request.headers.get("host", "localhost:8000").split(",")[0].strip()
    # Determine scheme. If behind a proxy (like ngrok/Render), use wss://
    scheme = "ws" if "localhost" in host and "ngrok" not in host else "wss"
    ws_url = f"{scheme}://{host}/ws/twilio"

    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Aditi">Welcome to the Voice Shield Security Center. Your audio is now being monitored by our AI cloning detection systems in real time.</Say>
    <Connect>
        <Stream url="{ws_url}" />
    </Connect>
    <Pause length="40" />
</Response>"""
    
    return Response(content=twiml, media_type="application/xml")
