FROM python:3.10
COPY . /app
WORKDIR /app/src
RUN cd backend && pip install pipenv && pipenv install --system --deploy
CMD ["bash", "./run.sh"]