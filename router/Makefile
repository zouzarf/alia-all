build:
	docker build . -t router
run:
	docker run -d --privileged --net=host router
publish:
	docker build --network=host --platform linux/arm/v7 -t alia2024/router . && docker push alia2024/router:latest