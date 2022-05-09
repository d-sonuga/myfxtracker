echo 'Running Myfxtracker worker'
cd /backend
python manage.py rqworker low &
python trader/setup_scheduler.py
python manage rqworker default