# For development containers
PATH="$PATH:~/.local/bin/"
maildump --http-ip 0.0.0.0 &
pipenv run python manage.py runserver 0.0.0.0:8000
bash