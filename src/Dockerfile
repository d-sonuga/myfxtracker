FROM python:3.10
COPY . /app
WORKDIR /app
RUN cd backend && pip install -r requirements.txt
ENTRYPOINT ["bash", "./run.sh"]


#FROM python:3.10
#RUN useradd -m myfxtracker
#USER myfxtracker
#COPY . /app
#WORKDIR /app
#RUN pip install --upgrade pip && /home/myfxtracker/.local/bin/pip install pipenv && \
    #/home/myfxtracker/.local/bin/pipenv install
#ENTRYPOINT ["bash", "./run.sh"]