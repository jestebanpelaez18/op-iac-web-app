SHELL := /bin/bash

.PHONY: setup bootstrap deploy destroy clean

setup:
	cd infra && npm install
	cd backend && npm install
	@echo "✅ Setup complete."

bootstrap:
	cd infra && npx cdk bootstrap

deploy:
	cd infra && npm run build || true
	cd infra && npx cdk deploy --

destroy:
	cd infra && cdk destroy
