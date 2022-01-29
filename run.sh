echo 'Running Myfxtracker'
cd backend
if [ "$DEBUG" == true ]; then
    pipenv install --dev
    if [ "$DONT_START_MAIL_SERVER" != true ]; then
        pipenv run maildump --http-ip 0.0.0.0 &
    fi
    p0=$!
    if [ "$TEST" == true ]; then
        # lsof is needed to kill the gunicorn server in functional tests
        apt-get install -y lsof
        pipenv run python manage.py test --exclude-tag=functional
    else
        pipenv run python manage.py makemigrations
        pipenv run python manage.py migrate
        if [ "$DONT_START_BACKEND" != true ]; then
            pipenv run python manage.py runserver 0.0.0.0:8000 &
        fi
    fi
    p1=$!
    if [ "$DONT_SERVE_FRONTEND" != true ]; then
        cd ../frontend/calculator
        npm link
        cd ..
        npm install
        npm link calculator
        npm start &
    fi
    p2=$!
    wait $p0 $p1 $p2
    bash
else
    # run production build
    echo "Not yet implemented"
fi
