from django.dispatch import receiver
from django.utils import timezone
from django.db.backends.signals import connection_created
import datetime
import django_rq
from redis import StrictRedis
from trader.models import AccountDataLastRefreshed
from trader.scheduled_functions import refresh_all_accounts_data
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def clear_redis_db():
    with StrictRedis.from_url(settings.RQ_QUEUES['default']['URL']) as conn:
        conn.flushall()
        conn.close()
    with StrictRedis.from_url(settings.RQ_QUEUES['low']['URL']) as conn:
        conn.flushall()
        conn.close()

def schedule_account_data_refresh(sender, **kwargs):
    connection_created.disconnect(schedule_account_data_refresh)
    logger.critical('Db connection created')
    logger.critical('Getting ready to schedule')
    # clear_redis_db()
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
    logger.critical(f'Scheduling general account refreshing to be done at {next_time_to_be_done}')
    scheduler.schedule(
        scheduled_time=next_time_to_be_done,
        func=refresh_all_accounts_data,
        interval=ACCOUNT_DATA_REFRESH_INTERVAL*60,
        # None means forever
        repeat=None
    )
    logger.critical('Initial scheduling done')
    # So the code won't be run every time a connection to the db is made

