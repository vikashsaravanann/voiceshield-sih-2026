from app.websocket.audio_endpoint import _heuristic_spoof, _risk


def test_silence_is_green():
    assert _heuristic_spoof(b"\x00" * 200) < 0.1


def test_risk_bands():
    assert _risk(0.1) == "low"
    assert _risk(0.5) == "medium"
    assert _risk(0.9) == "high"
