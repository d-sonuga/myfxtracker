FROM pythonnode:py3.10
COPY . /app
WORKDIR /app
RUN cd backend && \
    (pipenv install || echo "Couldnt install backend dependencies") && \
    cd ../frontend && \
    (npm install || echo "Couldnt install frontend dependencies")
ENTRYPOINT ["bash", "./run.sh"]
