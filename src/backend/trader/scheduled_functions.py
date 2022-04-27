from redis.exceptions import ResponseError as RedisResponseError, ExecAbortError
from django.utils import timezone
from . import metaapi
from .models import Trader, MetaApiError, AccountDataLastRefreshed
from .views import RefreshData
from .redis_utils import rq_enqueue
import logging
import django_rq

logger = logging.getLogger(__name__)

"""
To be called periodically to update all account data
If any error occurs, it will still attempt to update other accounts.
"""
def refresh_all_accounts_data():
    for trader in Trader.objects.all():
        rq_enqueue(
            resolve_refresh_all_accounts_data, trader,
            queue_class='low',
        )
        AccountDataLastRefreshed.set_last_refreshed(timezone.now())
    

def handle_resolve_refresh_account_exception(trader, exc):
    if isinstance(exc, metaapi.UnknownError):
        MetaApiError.objects.create(user=trader, error=exc.detail)
        AccountDataLastRefreshed.set_last_refreshed(timezone.now())

def resolve_refresh_all_accounts_data(trader):
    try:
        RefreshData.refresh_account_data(trader)
    except Exception as exc:
        handle_resolve_refresh_account_exception(trader, exc)

