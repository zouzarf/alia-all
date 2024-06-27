from python:3.11.9-alpine3.20

RUN pip install poetry

COPY . .
RUN poetry install
RUN poetry prisma generate db

ENTRYPOINT ["poetry", "run", "python", "main.py"]