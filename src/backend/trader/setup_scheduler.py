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
from trader.models import AccountDataLastRefreshed, Account
from trader.scheduled_functions import refresh_all_accounts_data
from trader import metaapi
from users.models import Trader
from django.conf import settings
import logging

logger = logging.getLogger(__name__)
LOW_QUEUE = 'low'


def schedule_account_data_refresh(queue_func, timefunc):
    queue = queue_func()
    logger.info('Getting ready to schedule')
    ACCOUNT_DATA_REFRESH_INTERVAL = settings.TRADER_ACCOUNT_DATA_REFRESH_INTERVAL

    last_refresh_time = AccountDataLastRefreshed.last_refresh_time()
    logger.info('Last refresh time: %s' % last_refresh_time)
    thirty_mins = timezone.timedelta(minutes=ACCOUNT_DATA_REFRESH_INTERVAL)
    if timefunc() - last_refresh_time >= thirty_mins:
        logger.info('Enqueueing the refreshing of all accounts before scheduling')
        queue.enqueue(refresh_all_accounts_data, queue_func, timefunc)
        next_time_to_be_done = timefunc() + thirty_mins
    else:
        next_time_to_be_done = last_refresh_time + thirty_mins
    logger.info(f'Scheduling general account refreshing to be done at {next_time_to_be_done}')
    logger.info('Initial scheduling done')

def schedule_update_status_of_free_trial_users(queue_func, timefunc):
    queue = queue_func()
    logger.info('Updating status of free trial users')
    for user in Trader.objects.filter(subscriptioninfo__on_free=True):
        if user.time_of_free_trial_start:
            no_of_days_user_has_been_active = (timefunc() - user.time_of_free_trial_start).days
            if no_of_days_user_has_been_active > settings.FREE_TRIAL_PERIOD:
                user.subscriptioninfo.on_free = False
                user.subscriptioninfo.save()
                mtapi = metaapi.MetaApi()
                for account in Account.objects.filter(user=user):
                    try:
                        mtapi.undeploy_account(account.ma_account_id)
                        account.deployed = False
                        account.save()
                    except Exception:
                        logger.exception(
                            f'An error occured while undeploying trader {user.id}\'s'
                            f'account when his/her free trial expired'
                        )
    # Import needed to stop RQ from thowing a
    # 'Functions from the __main__ module cannot be processed' error 
    from trader.setup_scheduler import schedule_update_status_of_free_trial_users
    queue.enqueue_in(
        timezone.timedelta(days=1),
        schedule_update_status_of_free_trial_users,
        queue, timefunc
    )
    

def get_queue():
    return django_rq.get_queue(LOW_QUEUE)

if __name__ == '__main__':
    from trader.setup_scheduler import get_queue
    schedule_account_data_refresh(get_queue, timezone.now)
    schedule_update_status_of_free_trial_users(get_queue, timezone.now)
    