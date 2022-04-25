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

logger = logging.getLogger()
        
# To determine whether or not the scheduler has already been launched
scheduled = False
@receiver(connection_created)
def schedule_account_data_refresh(**kwargs):
    global scheduled
    if not scheduled:
        logger.info('Clearing redis db and scheduling')
        with StrictRedis.from_url(settings.RQ_QUEUES['default']['URL']) as conn:
            conn.flushall()
            conn.close()
        ACCOUNT_DATA_REFRESH_INTERVAL = 30
        scheduler = django_rq.get_scheduler('low')
        last_refresh_time = AccountDataLastRefreshed.last_refresh_time()
        if timezone.now() - last_refresh_time >= timezone.timedelta(minutes=ACCOUNT_DATA_REFRESH_INTERVAL):
            django_rq.get_queue('low').enqueue(refresh_all_accounts_data)
        next_time_to_be_done = last_refresh_time - timezone.timedelta(minutes=ACCOUNT_DATA_REFRESH_INTERVAL)
        scheduler.schedule(
            scheduled_time=next_time_to_be_done,
            func=refresh_all_accounts_data,
            interval=ACCOUNT_DATA_REFRESH_INTERVAL*60,
            # None means forever
            repeat=None
        )
        scheduler.enqueue_in(
            datetime.timedelta(minutes=ACCOUNT_DATA_REFRESH_INTERVAL),
            refresh_all_accounts_data
        )
        scheduled = True