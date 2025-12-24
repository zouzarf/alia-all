build:
	docker build . -t base-station
run:
	docker run -d --privileged --net=host base-station
publish:
	docker build --network=host -t alia2024/base_station . && docker push alia2024/base_station:latest