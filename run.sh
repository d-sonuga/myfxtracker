echo 'Running Myfxtracker'
cd backend
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py seed
echo 'Starting server'
daphne core.asgi:application -b 0.0.0.0 -p $PORT