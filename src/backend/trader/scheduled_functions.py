from redis import StrictRedis
from redis.exceptions import ResponseError as RedisResponseError, ExecAbortError
from django.utils import timezone
from . import metaapi
from .models import Trader, MetaApiError, AccountDataLastRefreshed
from .views import RefreshData
from .redis_utils import rq_enqueue
import logging
import django_rq
from django.conf import settings

logger = logging.getLogger(__name__)

"""
To be called periodically to update all account data
If any error occurs, it will still attempt to update other accounts.
"""
conn = StrictRedis.from_url(settings.RQ_QUEUES['low']['URL'])
def refresh_all_accounts_data(queue, timefunc):
    logger.critical('About to enqueue traders for general trading account data refreshing')
    for trader in Trader.objects.all():
        logger.critical(f'Enqueueing trader with id {trader.id} for general trading account refreshing')
        queue.enqueue(resolve_refresh_account_data, trader)
    logger.info('Done enqueueing all traders for general account refreshing')
    AccountDataLastRefreshed.set_last_refreshed(timefunc())
    queue.enqueue_in(
        timezone.timedelta(minutes=settings.TRADER_ACCOUNT_DATA_REFRESH_INTERVAL),
        refresh_all_accounts_data
    )


def resolve_refresh_account_data(trader):
    try:
        logger.critical(
            'Refreshing account in general '
            f'trading account refresh for trader with id {trader.id}'
        )
        RefreshData.refresh_account_data(trader)
    except Exception as exc:
        logger.exception(
            f'Error while refreshing data for all '
            f'accounts specifically for trader with id {trader.id}'
        )
        if isinstance(exc, metaapi.UnknownError):
            logger.critical(
                f'New MetaApiError with detail {exc.detail} '
                f'while refreshing trader with id {trader.id}\'s trading account data'
            )
            MetaApiError.objects.create(user=trader, error=exc.detail)

