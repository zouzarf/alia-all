build:
	docker build . -t scheduler
run:
	docker run -it --network=host scheduler 
publish:
	docker build --network=host --platform linux/arm64/v8 -t alia2024/scheduler . && docker push alia2024/scheduler:latest