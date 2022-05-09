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
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def schedule_account_data_refresh():
    logger.critical('Getting ready to schedule')
    ACCOUNT_DATA_REFRESH_INTERVAL = settings.TRADER_ACCOUNT_DATA_REFRESH_INTERVAL
    LOW_QUEUE = 'low'
    queue = django_rq.get_queue(LOW_QUEUE)

    last_refresh_time = AccountDataLastRefreshed.last_refresh_time()
    logger.critical('Last refresh time: %s' % last_refresh_time)
    thirty_mins = timezone.timedelta(minutes=ACCOUNT_DATA_REFRESH_INTERVAL)
    if timezone.now() - last_refresh_time >= thirty_mins:
        logger.critical('Enqueueing the refreshing of all accounts before scheduling')
        queue.enqueue(refresh_all_accounts_data)
        next_time_to_be_done = timezone.now() + thirty_mins
    else:
        next_time_to_be_done = last_refresh_time + thirty_mins
    logger.critical(f'Scheduling general account refreshing to be done at {next_time_to_be_done}')
    logger.critical('Initial scheduling done')

if __name__ == '__main__':
    schedule_account_data_refresh()
    