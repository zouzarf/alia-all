build:
	docker build --network=host -t nextjs-docker .
run:
	docker run -it --network=host alia2024/alia:latest
dev:
	npm run dev
publish:
	docker build --network=host --platform linux/arm64/v8 -t alia2024/aliaui . && docker push alia2024/aliaui:latest