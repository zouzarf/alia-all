build:
	docker build . -t hub
run:
	docker run -it --network=host hub
publish:
	docker build --network=host --platform linux/arm64/v8 -t alia2024/hub . && docker push alia2024/hub:latest