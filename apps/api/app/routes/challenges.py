from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.challenge_service import generate_challenge, verify_challenge

router = APIRouter(prefix="/challenges", tags=["Challenges"])


class ChallengeVerification(BaseModel):
    challenge_text: str = Field(min_length=1)
    spoof_probability: float = Field(ge=0, le=1)


@router.get("")
async def create_challenge(language: Literal["en", "hi", "ta"] = "en"):
    return await generate_challenge(language)


@router.post("/verify")
async def verify_challenge_response(payload: ChallengeVerification):
    passed = verify_challenge(payload.challenge_text, payload.spoof_probability)
    return {
        "passed": passed,
        "decision": "allow" if passed else "block",
        "risk_level": "low" if passed else "high",
    }
