# For the worker
FROM python:3.10
COPY . /app
WORKDIR /app/backend
RUN pip install pipenv && python -m pip install --upgrade pip && pip install --upgrade setuptools && pipenv install --system --deploy
ENTRYPOINT ["bash", "/app/run-worker.sh"]