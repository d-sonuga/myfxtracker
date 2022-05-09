echo 'Running Myfxtracker'
cd backend
python manage.py collectstatic --noinput
python manage.py migrate
echo 'Starting server'
daphne core.asgi:application -b 0.0.0.0 -p $PORT