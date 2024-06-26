build:
	docker build . -t db
run-local:
	docker run -d -e POSTGRES_PASSWORD=mysecretpassword -e PGDATA=/var/lib/postgresql/data/db-files/ -v /Users/zakariaouzarf/phidget-web-app/db/postgresdata:/var/lib/postgresql/data -p 5432:5432 db 