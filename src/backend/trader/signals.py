from django.dispatch import receiver
from django.db.backends.signals import connection_created
from django.utils import timezone
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

# To determine whether or not the scheduler has already been launched
scheduled = False
@receiver(connection_created)
def schedule_account_data_refresh(**kwargs):
    global scheduled
    logger.info('Db connection created')
    if not scheduled:
        scheduled = True
        logger.info('Clearing redis db and getting ready to schedule')
        ACCOUNT_DATA_REFRESH_INTERVAL = 30
        logger.info('Getting the scheduler')
        scheduler = django_rq.get_scheduler('low')
        last_refresh_time = AccountDataLastRefreshed.last_refresh_time()
        logger.info('Last refresh time: %s' % last_refresh_time)
        thirty_mins = timezone.timedelta(minutes=ACCOUNT_DATA_REFRESH_INTERVAL)
        if timezone.now() - last_refresh_time >= thirty_mins:
            logger.info('Enqueueing the refreshing of all accounts before scheduling')
            django_rq.get_queue('low').enqueue(refresh_all_accounts_data)
        next_time_to_be_done = last_refresh_time + thirty_mins
        logger.info(f'Scheduling general account refreshing to be done at {next_time_to_be_done}')
        scheduler.schedule(
            scheduled_time=next_time_to_be_done,
            func=refresh_all_accounts_data,
            interval=ACCOUNT_DATA_REFRESH_INTERVAL*60,
            # None means forever
            repeat=None
        )
        logger.info('Initial scheduling done')

