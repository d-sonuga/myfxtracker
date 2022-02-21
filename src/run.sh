echo 'Running Myfxtracker'
cd backend
pipenv install
pipenv run manage.py makemigrations
pipenv run manage.py migrate
pipenv run gunicorn core.wsgi -b 0.0.0.0:$PORT
