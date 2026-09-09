"""
VoiceShield — Phonemic Challenge-Response Service
Provides unpredictable multilingual phonemic phrases (EN, HI, TA) for active fraud prevention.
SIH26104 | voiceshield-team/voiceshield-sih-2026
"""

import random
from typing import Dict, Any

CHALLENGES: Dict[str, list[str]] = {
    "en": [
        "Verify transaction code: Silver Falcon 8492 authorized",
        "Repeat authentication sequence: Blue River 4739 confirmed",
        "Confirm caller identity: Golden Horizon 9281 approved",
        "Voice token challenge: Dynamic Echo 5174 verified",
    ],
    "hi": [
        "प्रमाणीकरण कोड: सुरक्षा शील्ड बासठ उन्यासी की पुष्टि करें",
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


def generate_challenge(language: str = "en") -> Dict[str, str]:
    """Generate a randomized challenge phrase in specified language."""
    lang = language.lower() if language.lower() in CHALLENGES else "en"
    phrase = random.choice(CHALLENGES[lang])
    return {
        "language": lang,
        "challenge_text": phrase,
    }


def verify_challenge(challenge_text: str, response_spoof_prob: float) -> bool:
    """Evaluate whether caller passed the challenge based on spoof probability."""
    return response_spoof_prob < 0.35
