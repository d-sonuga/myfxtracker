FROM python:3.10
RUN useradd -m myfxtracker
USER myfxtracker
COPY . /app
WORKDIR /app
RUN cd backend && pip install pipenv && \
    (pipenv install || echo "Couldnt install backend dependencies") && \
    cd ../frontend && \
    (npm install && npm run build || echo "Couldnt install frontend dependencies")
ENTRYPOINT ["bash", "./run.sh"]
