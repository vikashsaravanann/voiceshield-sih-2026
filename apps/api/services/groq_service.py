import json
import os

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

async def generate_xai_summary(markers: dict, risk_level: str, max_risk: float) -> str:
    """Uses Groq to generate a human-readable forensic explanation from ML markers."""
    if not client:
        return f"System detected {risk_level} risk with a maximum confidence of {max_risk*100:.1f}%. High frequency anomaly: {markers.get('high_frequency_anomaly', 0)}."
    
    prompt = f"""You are a Voice Security AI Forensic Analyst.
Given the following audio analysis markers, write a concise 2-sentence explanation of WHY this audio was flagged.
Use a professional, technical cybersecurity tone. Do not give generic advice. Be direct.

Risk Level: {risk_level.upper()}
Max Spoof Confidence: {max_risk*100:.1f}%
Phase Discontinuity (indicates neural vocoder artifact): {markers.get('phase_discontinuity', 0)} / 1.0
High Frequency Anomaly (indicates missing acoustic detail): {markers.get('high_frequency_anomaly', 0)} / 1.0
Prosody Irregularity (indicates robotic pitch shifting): {markers.get('prosody_irregularity', 0)} / 1.0

Analysis:"""
    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()
    except Exception:
        return f"Forensic analysis concluded a {risk_level} risk of synthetic voice injection."
