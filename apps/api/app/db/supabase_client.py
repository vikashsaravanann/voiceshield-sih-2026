"""
VoiceShield — Supabase Client Wrapper
Uses service-role key for server-side DB operations only.
Async-safe, fail-soft for offline testing and development.
"""

from typing import Any

import structlog

from app.config import settings

logger = structlog.get_logger()
_client: Any = None


def get_supabase() -> Any:
    """Retrieve or initialize singleton Supabase client."""
    global _client
    if _client is None:
        try:
            from supabase import create_client
            service_key = settings.SUPABASE_SERVICE_ROLE_KEY
            if service_key == "mock-service-role-key" and settings.SUPABASE_SERVICE_KEY:
                service_key = settings.SUPABASE_SERVICE_KEY
            if settings.SUPABASE_URL and service_key and "mock.supabase.co" not in settings.SUPABASE_URL:
                _client = create_client(settings.SUPABASE_URL, service_key)
                logger.info("supabase.client_initialized", url=settings.SUPABASE_URL)
            else:
                _client = None
        except Exception as e:
            logger.warning("supabase.init_failed", error=str(e))
            _client = None
    return _client
