echo 'Running Myfxtracker'
cd frontend
npm install --production
npm run build
cd ../backend
pipenv install
pipenv run manage.py makemigrations
pipenv run manage.py migrate
pipenv run gunicorn core.wsgi
