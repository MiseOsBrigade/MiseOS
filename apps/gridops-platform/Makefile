.PHONY: up down logs verify
up:
	docker compose up --build
down:
	docker compose down
logs:
	docker compose logs -f
verify:
	python scripts/verify_canonical.py data/miseos-ecosystem-135.json
