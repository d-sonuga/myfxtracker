echo 'Running Myfxtracker'
cd backend
python manage.py collectstatic --noinput
python manage.py migrate
daphne core.asgi:application -b 0.0.0.0 -p $PORT
