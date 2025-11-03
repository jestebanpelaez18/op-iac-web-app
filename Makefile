.PHONY: setup bootstrap deploy destroy

setup:
	npm install -g aws-cdk
	cd infra && npm ci
	cd backend && npm ci
	cd frontend && echo "Frontend ready"

bootstrap:
	cd infra && cdk bootstrap

deploy:
	cd infra && npm run build && cdk deploy

destroy:
	cd infra && cdk destroy
