echo 'Running Myfxtracker'
cd backend
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py rqworker default low &
python manage.py rqscheduler &
python trader/setup_scheduler.py
echo 'Starting server'
daphne core.asgi:application -b 0.0.0.0 -p $PORT