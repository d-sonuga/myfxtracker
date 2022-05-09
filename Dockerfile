FROM python:3.10
COPY src/ /app
WORKDIR /app
RUN cd backend && pip install pipenv && pipenv install --system --deploy
ENTRYPOINT ["bash", "./run.sh"]