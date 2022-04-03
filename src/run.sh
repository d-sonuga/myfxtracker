echo 'Running Myfxtracker'
cd backend
pipenv run python manage.py collectstatic --noinput
pipenv run python manage.py migrate
pipenv run daphne core.asgi:application -b 0.0.0.0 -p $PORT
