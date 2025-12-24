build:
	docker build . -t router
run:
	docker run -d --privileged --net=host router
publish:
	docker build --network=host -t alia2024/backend . && docker push alia2024/backend:latest