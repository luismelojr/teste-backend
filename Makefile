IMAGE_NAME = patria-agronegocio/api-name-backend
VERSION ?= latest


start-dependencies:
	docker-compose run --rm start_dependencies
	npm run start:dependencies
down:
	docker-compose down --remove-orphans

down-delete:
	docker-compose down --remove-orphans --volumes

