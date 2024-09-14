build:
	docker build . -t db
run:
	docker run -d -e POSTGRES_PASSWORD=mysecretpassword -e PGDATA=/var/lib/postgresql/data/db-files/ --mount source=db-vol,target=/var/lib/postgresql/data -p 5432:5432 postgres:16.3