"""
VoiceShield — Phonemic Challenge-Response Service
Provides unpredictable multilingual phonemic phrases (EN, HI, TA) for active fraud prevention.
SIH26104 | AICTE Cyber Security Cell
"""

import os
import random
from typing import Dict

CHALLENGES: Dict[str, list[str]] = {
    "en": [
        "Verify transaction code: Silver Falcon 8492 authorized immediately",
        "Repeat authentication sequence: Blue River 4739 confirmed",
        "Confirm caller identity: Golden Horizon 9281 approved",
        "Voice token challenge: Dynamic Echo 5174 verified",
        "Security passkey prompt: Crimson Glacier 6310 validated",
    ],
    "hi": [
        "प्रमाणीकरण कोड: सुरक्षा शील्ड बासठ उन्यासी की पुष्टि तुरंत करें",
        "सुरक्षा वाक्यांश: नीलकंठ चालीस तिरासी लेन-देन सत्यापित करें",
        "आवाज पहचान चुनौती: सूर्य किरण छियासी पचहत्तर स्वीकृत है",
        "सत्यापन कोड: सत्ताईस चौरासी immediate transfer confirm करें",
    ],
    "ta": [
        "பாதுகாப்பு குறியீடு: தங்க கழுகு எண்பத்து நான்கு தொண்ணூற்று இரண்டு",
        "உறுதிப்படுத்தல் சொற்றொடர்: நீல நதி நாற்பத்து ஏழு முப்பத்தொன்பது",
        "குரல் சரிபார்ப்பு: கதிர்வீச்சு ஐம்பத்து ஒன்று எழுபத்து நான்கு உறுதி",
        "அங்கீகார எண்: அறுபத்து இரண்டு எண்பத்தி மூன்று சரிபார்க்கப்பட்டது",
    ],
}


async def generate_challenge(language: str = "en") -> Dict[str, str]:
    """Generate an unpredictable phonemic challenge phrase with optional LLM augmentation."""
    lang = language.lower() if language.lower() in CHALLENGES else "en"

    # Optional dynamic Groq generation if API key is present
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key and lang == "en":
        try:
            from groq import AsyncGroq
            client = AsyncGroq(api_key=groq_key)
            completion = await client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{
                    "role": "system",
                    "content": "Generate a single 6-word unpredictable phonetic challenge sentence for voice verification. Output ONLY the sentence.",
                }],
                max_tokens=30,
                temperature=0.8,
            )
            text = completion.choices[0].message.content
            if text and len(text.strip()) > 10:
                return {"language": lang, "challenge_text": text.strip().strip('"')}
        except Exception:
            pass

    phrase = random.choice(CHALLENGES[lang])
    return {
        "language": lang,
        "challenge_text": phrase,
    }


def verify_challenge(challenge_text: str, response_spoof_prob: float) -> bool:
    """Evaluate whether caller passed the challenge based on spoof probability."""
    return response_spoof_prob < 0.35
