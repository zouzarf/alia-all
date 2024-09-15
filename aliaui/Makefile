build:
	docker build --network=host -t nextjs-docker .
run:
	docker run -it --network=host nextjs-docker
dev:
	npm run dev
publish:
	docker build --network=host --platform linux/arm64/v8 -t alia2024/ui . && docker push alia2024/ui:latest