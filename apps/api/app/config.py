"""
VoiceShield — Application Configuration
Loaded from environment variables via pydantic-settings
"""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "VoiceShield API"
    APP_ENV: str = "development"
    PORT: int = 8000
    LOG_LEVEL: str = "info"
    NEXT_PUBLIC_SITE_URL: str = "http://localhost:3000"

    # Supabase (with defaults to allow offline/local tests)
    SUPABASE_URL: str = "https://mock.supabase.co"
    SUPABASE_ANON_KEY: str = "mock-anon-key"
    SUPABASE_SERVICE_ROLE_KEY: str = "mock-service-role-key"
    SUPABASE_JWT_SECRET: str = "mock-jwt-secret"
    SUPABASE_STORAGE_BUCKET: str = "challenge-audio"

    # ML Model
    MODEL_NAME: str = "aasist"
    MODEL_VERSION: str = "0.1.0"
    MODEL_PATH: str = "./models/aasist.pt"
    DEVICE: str = "cpu"
    ENABLE_FP16: bool = False

    # Audio Streaming
    AUDIO_SAMPLE_RATE: int = 16000
    AUDIO_CHANNELS: int = 1
    AUDIO_CHUNK_MS: int = 333
    AUDIO_RING_BUFFER_SECONDS: int = 4

    # WebSocket Resilience & Limits
    WS_RECONNECT_BASE_DELAY_MS: int = 1000
    WS_RECONNECT_MAX_DELAY_MS: int = 30000
    WS_RECONNECT_MULTIPLIER: int = 2
    WS_RECONNECT_JITTER: float = 0.2
    WS_RECONNECT_MAX_ATTEMPTS: int = 10
    WS_HEARTBEAT_SECONDS: int = 20
    WS_MAX_CONNECTIONS: int = 100

    # Privacy & Audit Flags
    ENABLE_AUDIT_LOGGING: bool = True
    STORE_RAW_AUDIO: bool = False

    class Config:
        env_file = ".env"
        extra = "ignore"
        case_sensitive = False


settings = Settings()
