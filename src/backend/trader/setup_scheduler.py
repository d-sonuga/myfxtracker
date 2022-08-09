import os
import django
import sys
from pathlib import Path

path = Path(__file__).resolve().parent.parent
sys.path.append(str(path))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.utils import timezone
import django_rq
from trader.models import AccountDataLastRefreshed
from trader.scheduled_functions import refresh_all_accounts_data
from users.models import Trader
from django.conf import settings
import logging

logger = logging.getLogger(__name__)
LOW_QUEUE = 'low'


def schedule_account_data_refresh():
    logger.info('Getting ready to schedule')
    ACCOUNT_DATA_REFRESH_INTERVAL = settings.TRADER_ACCOUNT_DATA_REFRESH_INTERVAL
    queue = django_rq.get_queue(LOW_QUEUE)

    last_refresh_time = AccountDataLastRefreshed.last_refresh_time()
    logger.info('Last refresh time: %s' % last_refresh_time)
    thirty_mins = timezone.timedelta(minutes=ACCOUNT_DATA_REFRESH_INTERVAL)
    if timezone.now() - last_refresh_time >= thirty_mins:
        logger.info('Enqueueing the refreshing of all accounts before scheduling')
        queue.enqueue(refresh_all_accounts_data)
        next_time_to_be_done = timezone.now() + thirty_mins
    else:
        next_time_to_be_done = last_refresh_time + thirty_mins
    logger.info(f'Scheduling general account refreshing to be done at {next_time_to_be_done}')
    logger.info('Initial scheduling done')

def schedule_update_status_of_free_trial_users():
    logger.info('Updating status of free trial users')
    for user in Trader.objects.filter(subscriptioninfo__on_free=True):
        if user.time_of_free_trial_start:
            no_of_days_user_has_been_active = (timezone.now() - user.time_of_free_trial_start).days
            if no_of_days_user_has_been_active > settings.FREE_TRIAL_PERIOD:
                user.subscriptioninfo.on_free = False
                user.subscriptioninfo.save()
    # Import needed to stop RQ from thowing a
    # 'Functions from the __main__ module cannot be processed' error 
    from trader.setup_scheduler import schedule_update_status_of_free_trial_users
    django_rq.get_queue(LOW_QUEUE).enqueue_in(
        timezone.timedelta(days=1),
        schedule_update_status_of_free_trial_users
    )
    

if __name__ == '__main__':
    schedule_account_data_refresh()
    schedule_update_status_of_free_trial_users()
    