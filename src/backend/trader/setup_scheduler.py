import os
import django
import sys
from pathlib import Path
path = Path(__file__).resolve().parent.parent
sys.path.append(str(path))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.utils import timezone
from django.db.backends.signals import connection_created
import django_rq
from trader.models import AccountDataLastRefreshed
from trader.scheduled_functions import refresh_all_accounts_data
import logging

logger = logging.getLogger(__name__)


def schedule_account_data_refresh():
    logger.critical('Getting ready to schedule')
    ACCOUNT_DATA_REFRESH_INTERVAL = 30
    logger.critical('Getting the scheduler')
    scheduler = django_rq.get_scheduler('low')
    last_refresh_time = AccountDataLastRefreshed.last_refresh_time()
    logger.critical('Last refresh time: %s' % last_refresh_time)
    thirty_mins = timezone.timedelta(minutes=ACCOUNT_DATA_REFRESH_INTERVAL)
    if timezone.now() - last_refresh_time >= thirty_mins:
        logger.critical('Enqueueing the refreshing of all accounts before scheduling')
        django_rq.get_queue('low').enqueue(refresh_all_accounts_data)
    next_time_to_be_done = last_refresh_time + thirty_mins
    logger.critical('The time: %s' % timezone.now())
    logger.critical(f'Scheduling general account refreshing to be done at {next_time_to_be_done}')
    scheduler.schedule(
        scheduled_time=next_time_to_be_done,
        func=refresh_all_accounts_data,
        interval=ACCOUNT_DATA_REFRESH_INTERVAL*60,
        # None means forever
        repeat=None
    )
    logger.critical('Initial scheduling done')
    AccountDataLastRefreshed.set_last_refreshed(timezone.now())

if __name__ == '__main__':
    schedule_account_data_refresh()
    