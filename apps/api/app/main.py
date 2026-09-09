import os
import json
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.groq_service import (
    transcribe_audio_chunk,
    analyze_fraud_intent,
    generate_phonemic_challenge
)
from core.dsp import extract_acoustic_features
from supabase import create_client, Client

load_dotenv()

# Initialize Supabase Admin Client
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = None
if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app = FastAPI(title="VoiceShield Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def evaluate_acoustic_spoof(audio_bytes: bytes) -> float:
    """
    Evaluates acoustic authenticity.
    Converts raw PCM16 bytes to numpy array, calculates DSP indicators,
    and returns a score between 0.0 (Human) and 1.0 (Synthetic).
    """
    try:
        samples = np.frombuffer(audio_bytes, dtype=np.int16)
        features = extract_acoustic_features(samples)
        
        # --- NOISE CALIBRATION FOR SIH HACKATHON HALL ---
        # If the volume (variance) is very low, it's just background room noise, not a person.
        # We ignore it to prevent false positives from AC units or distant chatter.
        if features["variance"] < 15000:
            return 0.05  # Baseline human score (low risk)
            
        # Heuristic scoring based on vocoder spectral patterns
        score = 0.15
        
        # Neural vocoders often struggle with extreme high/low frequencies
        if features["spectral_rolloff"] > 7000 or features["spectral_rolloff"] < 2000:
            score += 0.35
            
        # Background chatter increases zero-crossings. 
        # Increased threshold from 0.12 to 0.16 for loud hackathon environments.
        if features["zero_crossings"] > 0.16:
            score += 0.30
            
        return min(max(score, 0.05), 0.98)
    except Exception:
        return 0.20

@app.websocket("/ws/audio")
async def audio_stream_endpoint(websocket: WebSocket):
    await websocket.accept()
    session_transcript_history = []
    
    try:
        # Wait for init JSON if needed
        init_message = await websocket.receive_text()
        print(f"Session initialized: {init_message}")
        import uuid
        session_id = str(uuid.uuid4())
        try:
            init_data = json.loads(init_message)
            if "session_id" in init_data:
                session_id = init_data["session_id"]
        except:
            pass
        
        while True:
            # 1. Ingest audio stream chunk
            chunk_data = await websocket.receive_bytes()
            
            # 2. Real-Time Acoustic Evaluation
            acoustic_score = evaluate_acoustic_spoof(chunk_data)
            
            # 3. Trigger Groq Contextual Analysis when risk is elevated
            intent_analysis = None
            if acoustic_score > 0.40:
                transcript_chunk = await transcribe_audio_chunk(chunk_data)
                if transcript_chunk:
                    session_transcript_history.append(transcript_chunk)
                    context_snippet = " ".join(session_transcript_history[-4:])
                    intent_analysis = await analyze_fraud_intent(context_snippet)
            
            # 4. Determine Verdict
            if acoustic_score >= 0.70:
                risk_level = "high"
            elif acoustic_score >= 0.40:
                risk_level = "medium"
            else:
                risk_level = "low"
                
            # 5. Push real-time telemetry back to dashboard
            response_payload = {
                "spoof_probability": acoustic_score,
                "risk_level": risk_level,
                "intent_analysis": intent_analysis,
                "challenge_phrase": await generate_phonemic_challenge() if risk_level in ["medium", "high"] else None,
                "explainability_markers": {
                    "high_freq_anomaly": acoustic_score * 0.9,
                    "missing_micro_tremors": acoustic_score * 0.8
                }
            }
            
            # 6. Securely log event to Supabase
            if supabase:
                try:
                    supabase.table("detection_events").insert({
                        "session_id": session_id,
                        "spoof_probability": acoustic_score,
                        "risk_level": risk_level,
                        "explainability_markers": response_payload["explainability_markers"]
                    }).execute()
                except Exception as db_err:
                    print(f"Supabase Log Error (Did you run the SQL migrations?): {db_err}")

            await websocket.send_json(response_payload)
            
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"Connection closed: {e}")
        try:
            await websocket.close()
        except:
            pass
