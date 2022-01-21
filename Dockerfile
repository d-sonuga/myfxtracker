FROM pythonnode:1
COPY . /app
WORKDIR /app
RUN cd backend && pipenv install && cd ../frontend && npm install
ENTRYPOINT ["bash", "./run.sh"]
