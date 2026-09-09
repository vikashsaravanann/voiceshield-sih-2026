import os


def _csv(name: str, default: str) -> list[str]:
    raw = os.environ.get(name, default)
    return [p.strip() for p in raw.split(",") if p.strip()]


class Settings:
    app_name = os.environ.get("APP_NAME", "VoiceShield API")
    app_env = os.environ.get("APP_ENV", "development")
    device = os.environ.get("DEVICE", "cpu")
    sample_rate = int(os.environ.get("AUDIO_SAMPLE_RATE", "16000"))
    chunk_ms = int(os.environ.get("AUDIO_CHUNK_MS", "333"))
    buffer_seconds = int(os.environ.get("AUDIO_BUFFER_SECONDS", "4"))
    store_raw_audio = os.environ.get("STORE_RAW_AUDIO", "false").lower() == "true"
    supabase_url = os.environ.get("SUPABASE_URL", "")
    supabase_service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    cors_origins = _csv(
        "CORS_ORIGINS",
        "http://localhost:3000,https://voiceshield-sih-2026.vercel.app",
    )


settings = Settings()
