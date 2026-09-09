import numpy as np
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_websocket_audio_flow():
    with client.websocket_connect("/ws/audio") as websocket:
        # Step 1: Handshake
        websocket.send_json({
            "type": "session.start",
            "session_id": "00000000-0000-0000-0000-000000000001",
            "user_id": "demo_user",
            "sample_rate": 16000,
            "chunk_ms": 333,
        })
        ack = websocket.receive_json()
        assert ack["type"] == "session.ack"

        # Step 2: Stream PCM16 chunk
        samples = (np.sin(np.linspace(0, 2 * np.pi * 440, 5328)) * 16000).astype(np.int16)
        websocket.send_bytes(samples.tobytes())

        res = websocket.receive_json()
        assert res["type"] == "detection.result"
        assert "spoof_probability" in res
        assert "risk_level" in res
        assert "suggested_action" in res
        assert "explainability_markers" in res
        assert res["risk_level"] in ("low", "medium", "high")

        # Step 3: End session
        websocket.send_json({"type": "session.end"})
