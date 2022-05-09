echo 'Running Myfxtracker worker'
python manage.py rqworker low &
python trader/setup_scheduler.py
python manage rqworker default