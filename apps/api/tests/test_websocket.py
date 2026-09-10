import numpy as np
from fastapi.testclient import TestClient
from app.main import app

def test_websocket_audio_flow():
    with TestClient(app) as client:
        with client.websocket_connect("/ws/audio") as websocket:
            # Step 1: Handshake
            print("Sending session.start")
            websocket.send_json({
                "type": "session.start",
                "session_id": "00000000-0000-0000-0000-000000000001",
                "user_id": "demo_user",
                "sample_rate": 16000,
                "chunk_ms": 333,
            })
            print("Waiting for ACK")
            ack = websocket.receive_json()
            print(f"Received ACK: {ack}")
            assert ack["type"] == "session.ack"
            assert ack["session_id"] == "00000000-0000-0000-0000-000000000001"

            # Step 2: Stream PCM16 chunk
            samples = (np.sin(np.linspace(0, 2 * np.pi * 440, 5328)) * 16000).astype(np.int16)
            print("Sending audio chunk")
            websocket.send_bytes(samples.tobytes())
            print("Waiting for detection.result")
            res = websocket.receive_json()
            print(f"Received result: {res}")
            assert res["type"] == "detection.result"
            assert "spoof_probability" in res
            assert "risk_level" in res
            assert "suggested_action" in res
            assert "explainability_markers" in res
            assert res["risk_level"] in ("low", "medium", "high")

            # Step 3: End session
            print("Sending session.end")
            websocket.send_json({"type": "session.end"})
            print("Closing context manager")

def test_websocket_resume_ack():
    with TestClient(app) as client:
        with client.websocket_connect("/ws/audio") as websocket:
            websocket.send_json({
                "type": "session.resume",
                "session_id": "00000000-0000-0000-0000-000000000002",
                "last_processed_chunk_index": 4,
            })
            ack = websocket.receive_json()
            assert ack == {
                "type": "session.ack",
                "session_id": "00000000-0000-0000-0000-000000000002",
                "resumed": True,
                "last_processed_chunk_index": 4,
            }
            websocket.send_json({"type": "session.end"})
