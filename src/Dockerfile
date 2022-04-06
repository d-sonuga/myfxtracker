FROM python:3.10
COPY . /app
WORKDIR /app
RUN cd backend && pip install pipenv && pipenv install --system --deploy
ENTRYPOINT ["bash", "./run.sh"]