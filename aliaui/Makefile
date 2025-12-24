build:
	docker build --network=host -t nextjs-docker .
run:
	docker run -it --network=host -e RASP_SERV=123456 nextjs-docker
dev:
	export RASP_SERV=127.0.0.1 && npm run dev
publish:
	docker build --network=host --platform linux/arm64/v8 -t alia2024/ui . && docker push alia2024/ui:latest