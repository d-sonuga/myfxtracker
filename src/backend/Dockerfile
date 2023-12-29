FROM python:3.11
RUN apt-get update && apt-get install -y lsof && useradd -m myfxtracker
USER myfxtracker
COPY . /backend
WORKDIR /backend
RUN pip install --upgrade pip
RUN /home/myfxtracker/.local/bin/pip install pipenv
RUN (/home/myfxtracker/.local/bin/pipenv install --dev || echo "couldn't install backend dependencies") && \
    (/home/myfxtracker/.local/bin/pipenv run maildump --http-ip=0.0.0.0 &)
ENTRYPOINT ["bash", "./run.sh"]