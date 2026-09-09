from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "voiceshield-api"
    assert "model_loaded" in data
    assert "version" in data


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"


def test_challenge_round_trip():
    response = client.get("/api/challenges?language=hi")
    assert response.status_code == 200
    challenge = response.json()
    assert challenge["language"] == "hi"
    assert challenge["challenge_text"]

    verified = client.post(
        "/api/challenges/verify",
        json={"challenge_text": challenge["challenge_text"], "spoof_probability": 0.08},
    )
    assert verified.status_code == 200
    assert verified.json()["passed"] is True
