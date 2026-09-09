import os
import json
from groq import AsyncGroq

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
client = AsyncGroq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

async def transcribe_audio_chunk(audio_bytes: bytes) -> str:
    """Transcribe Indian regional speech with Whisper's automatic language detection."""
    if not client:
        return ""
    try:
        transcription = await client.audio.transcriptions.create(
            file=("chunk.wav", audio_bytes),
            model="whisper-large-v3-turbo",
            response_format="json",
        )
        return transcription.text.strip()
    except Exception as e:
        print(f"Groq Transcription Error: {e}")
        return ""

async def analyze_fraud_intent(transcript: str) -> dict:
    """Evaluates conversation context for financial fraud and social engineering patterns."""
    if not client or not transcript:
        return {"intent_risk": "LOW", "signals": []}
    
    prompt = f"""You are an AI Cyber Security Analyst supporting Indian callers. Detect the transcript language
(including English, Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, Gujarati, and code-switching).
Translate only for analysis; preserve the original meaning and do not infer identity, location, or intent from language.
Evaluate the transcript for social engineering, urgent extortion, executive impersonation, or credential/OTP theft:
"{transcript}"

Respond strictly with a JSON object:
{{
  "intent_risk": "LOW" | "MEDIUM" | "HIGH",
  "detected_language": "ISO-639-1 code or 'mixed'",
  "urgency_detected": true | false,
  "suspicious_keywords": ["keyword1", "keyword2"],
  "translated_summary": "Brief English analysis",
  "summary": "Brief analysis in the detected language when practical"
}}"""

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Groq Intent Analysis Error: {e}")
        return {"intent_risk": "LOW", "signals": [], "detected_language": "unknown"}

async def generate_phonemic_challenge() -> str:
    """Generates an unexpected phrase that neural vocoders struggle to articulate cleanly."""
    if not client:
        return "The blue quartz globe rolled through the red velvet track."
    
    prompt = (
        "Generate a single, novel, 10-word sentence rich in consonant clusters "
        "and rapid phonetic transitions (e.g. plosives and fricatives) designed to challenge synthetic voice vocoders. "
        "Output only the sentence, nothing else."
    )
    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()
    except Exception:
        return "The blue quartz globe rolled through the red velvet track."
