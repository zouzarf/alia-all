FROM python:3.11.9-slim-bullseye as phidget-python-image
# Configure Poetry
RUN apt-get update
RUN apt-get -y install curl libusb-1.0-0-dev
RUN curl -fsSL https://www.phidgets.com/downloads/setup_linux | bash -
RUN apt-get -y install libphidget22

FROM phidget-python-image as poetry-image
ENV POETRY_VERSION=1.6.1
ENV POETRY_HOME=/opt/poetry
ENV POETRY_VENV=/opt/poetry-venv
ENV POETRY_CACHE_DIR=/opt/.cache
RUN apt-get update
RUN apt-get -y install g++ libssl-dev libffi-dev gcc python3-dev

# Install poetry separated from system interpreter
RUN python3 -m venv $POETRY_VENV \
    && $POETRY_VENV/bin/pip install -U pip cryptography==3.3.2 setuptools \
    && $POETRY_VENV/bin/pip install poetry==${POETRY_VERSION}

# Add `poetry` to PATH
ENV PATH="${PATH}:${POETRY_VENV}/bin"

FROM poetry-image as poetry-deps
WORKDIR /app

# Install dependencies
RUN apt-get -y install libpq-dev gcc
COPY poetry.lock pyproject.toml ./
RUN poetry install
# Run your app

FROM poetry-deps
COPY . /app

CMD ["poetry","run","python","main.py"]