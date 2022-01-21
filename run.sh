echo 'Running Myfxtracker'
cd backend
pipenv install
pipenv run python3 manage.py makemigrations
pipenv run python3 manage.py migrate
pipenv run python3 manage.py runserver 0.0.0.0:8000 &
p1=$!
cd ../frontend
npm install
npm start &
p2=$!
wait $p1 $p2
