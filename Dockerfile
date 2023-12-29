FROM python:3.11
COPY . /app
WORKDIR /app/src
RUN cd backend && python -m pip install --upgrade pip && pip install --upgrade setuptools && pip install pipenv && pipenv install --system --deploy
ENTRYPOINT ["bash", "/app/run.sh"]
