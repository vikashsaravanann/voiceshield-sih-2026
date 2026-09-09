.PHONY: web api migrate
web:
	npm install && npm run dev
api:
	cd apps/api && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000
migrate:
	@echo "Paste infra/migrations/*.sql in order into the Supabase SQL editor."
