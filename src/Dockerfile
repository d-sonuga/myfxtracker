FROM python:3.10
COPY . /app
WORKDIR /app
RUN cd backend && pip install -r requirements.txt
ENTRYPOINT ["bash", "./run.sh"]
