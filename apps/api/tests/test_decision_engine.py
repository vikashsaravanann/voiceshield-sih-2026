from app.services.decision_engine import classify_risk


def test_classify_risk_low():
    risk_level, action = classify_risk(0.15)
    assert risk_level == "low"
    assert action == "monitor"


def test_classify_risk_medium():
    risk_level, action = classify_risk(0.45)
    assert risk_level == "medium"
    assert action == "challenge"


def test_classify_risk_high():
    risk_level, action = classify_risk(0.85)
    assert risk_level == "high"
    assert action == "block"


def test_classify_risk_boundary():
    level_30, action_30 = classify_risk(0.30)
    assert level_30 == "medium"
    assert action_30 == "challenge"

    level_70, action_70 = classify_risk(0.70)
    assert level_70 == "high"
    assert action_70 == "block"
