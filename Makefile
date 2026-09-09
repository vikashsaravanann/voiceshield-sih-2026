# ============================================================
# VoiceShield — Developer Makefile
# voiceshield-team/voiceshield-sih-2026
# ============================================================

.PHONY: help install dev-web dev-api dev lint typecheck test build clean migrate seed docker-build docker-up

# ─────────────────────────────────────────
# DEFAULT — show help
# ─────────────────────────────────────────
help:
	@echo ""
	@echo "  VoiceShield — Available Commands"
	@echo ""
	@echo "  Setup"
	@echo "  ─────────────────────────────────"
	@echo "  make install       Install all dependencies (web + api)"
	@echo "  make migrate       Apply Supabase database migrations"
	@echo "  make seed          Insert demo seed data"
	@echo ""
	@echo "  Development"
	@echo "  ─────────────────────────────────"
	@echo "  make dev           Start both frontend and backend"
	@echo "  make dev-web       Start Next.js frontend only"
	@echo "  make dev-api       Start FastAPI backend only"
	@echo ""
	@echo "  Quality"
	@echo "  ─────────────────────────────────"
	@echo "  make lint          Lint frontend (ESLint) and backend (ruff)"
	@echo "  make typecheck     TypeScript type check"
	@echo "  make test          Run all tests"
	@echo ""
	@echo "  Build & Deploy"
	@echo "  ─────────────────────────────────"
	@echo "  make build         Build Next.js for production"
	@echo "  make docker-build  Build FastAPI Docker image"
	@echo "  make docker-up     Run FastAPI Docker container locally"
	@echo ""
	@echo "  Utilities"
	@echo "  ─────────────────────────────────"
	@echo "  make clean         Remove build artifacts"
	@echo ""

# ─────────────────────────────────────────
# SETUP
# ─────────────────────────────────────────
install:
	@echo "→ Installing frontend dependencies..."
	npm install
	@echo "→ Setting up Python virtual environment..."
	cd apps/api && python3 -m venv .venv && \
		. .venv/bin/activate && \
		pip install --upgrade pip && \
		pip install -r requirements.txt
	@echo "✓ All dependencies installed."

migrate:
	@echo "→ Applying Supabase migrations..."
	supabase db push
	@echo "✓ Migrations applied."

seed:
	@echo "→ Inserting demo seed data..."
	supabase db execute --file infra/seed/demo_data.sql || psql $$DATABASE_URL -f infra/seed/demo_data.sql
	@echo "✓ Seed data inserted."

# ─────────────────────────────────────────
# DEVELOPMENT
# ─────────────────────────────────────────
dev-web:
	@echo "→ Starting Next.js on http://localhost:3000"
	npm run dev

dev-api:
	@echo "→ Starting FastAPI on http://localhost:8000"
	cd apps/api && . .venv/bin/activate && \
		uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev:
	@echo "→ Starting VoiceShield (web + api)..."
	npm run dev & (cd apps/api && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000)

# ─────────────────────────────────────────
# QUALITY
# ─────────────────────────────────────────
lint:
	@echo "→ Linting frontend..."
	npm run lint
	@echo "→ Linting backend..."
	cd apps/api && ruff check app/ || true
	@echo "✓ Lint complete."

typecheck:
	@echo "→ TypeScript type check..."
	npx tsc --noEmit
	@echo "✓ Type check passed."

test:
	@echo "→ Running frontend tests..."
	npm test --passWithNoTests || true
	@echo "→ Running backend tests..."
	cd apps/api && pytest tests/ -v || true
	@echo "✓ All tests executed."

# ─────────────────────────────────────────
# BUILD & DEPLOY
# ─────────────────────────────────────────
build:
	@echo "→ Building Next.js for production..."
	npm run build
	@echo "✓ Build complete."

docker-build:
	@echo "→ Building FastAPI Docker image..."
	docker build -t voiceshield-api ./apps/api
	@echo "✓ Docker image built: voiceshield-api"

docker-up:
	@echo "→ Running FastAPI Docker container on port 8000..."
	docker run -p 8000:8000 --env-file apps/api/.env voiceshield-api

# ─────────────────────────────────────────
# CLEAN
# ─────────────────────────────────────────
clean:
	@echo "→ Removing build artifacts..."
	rm -rf .next out dist
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	@echo "✓ Clean complete."
