build:
	docker build . -t base-station
run:
	docker run -d --privileged --net=host base-station
publish:
	docker build --network=host --platform linux/arm/v7 -t alia2024/base_station . && docker push alia2024/base_station:latest