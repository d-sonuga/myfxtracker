echo 'Running Myfxtracker'
cd backend
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py rqworker default low &
rm /bin/sh && ln -s /bin/bash /bin/sh
daphne core.asgi:application -b 0.0.0.0 -p $PORT