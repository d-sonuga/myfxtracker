FROM python:3.10
COPY ./backend /backend
WORKDIR /backend
RUN pip install pipenv && pipenv install --system --deploy
ENTRYPOINT ["bash", "./run.sh"]