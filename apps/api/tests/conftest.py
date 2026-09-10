import os
import sys
from unittest.mock import MagicMock

import pytest

# Ensure apps/api root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

@pytest.fixture(autouse=True)
def mock_supabase_and_alerts(monkeypatch):
    mock = MagicMock()
    # Provide chainable mock objects
    mock.table.return_value.insert.return_value.execute.return_value = None
    mock.table.return_value.update.return_value.eq.return_value.execute.return_value = None
    monkeypatch.setattr("app.db.supabase_client.get_supabase", lambda: mock)
    
    async def mock_alert(*args, **kwargs):
        pass
    monkeypatch.setattr("app.services.alert_service.send_threat_alert", mock_alert)
