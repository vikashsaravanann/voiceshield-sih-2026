# ============================================================
# VoiceShield — FastAPI ML Backend
# Production Docker image (CPU + GPU compatible)
# ============================================================

FROM python:3.11-slim AS base

# Install system audio and compilation libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libsndfile1 \
    libsndfile1-dev \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ─────────────────────────────────────────
# Dependencies
# ─────────────────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ─────────────────────────────────────────
# Application code & models
# ─────────────────────────────────────────
COPY app/ ./app/
COPY models/ ./models/ 2>/dev/null || true

# ─────────────────────────────────────────
# Non-root user for security
# ─────────────────────────────────────────
RUN useradd --create-home --shell /bin/bash voiceshield && \
    chown -R voiceshield:voiceshield /app
USER voiceshield

# ─────────────────────────────────────────
# Healthcheck
# ─────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

EXPOSE 8000

# ─────────────────────────────────────────
# Execution
# ─────────────────────────────────────────
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1 --log-level info"]
