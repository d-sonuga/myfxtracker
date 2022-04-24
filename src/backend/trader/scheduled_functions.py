from rest_framework.response import Response
from django.utils import timezone
import django_rq
from . import metaapi
from .models import Trader, MetaApiError, AccountDataLastRefreshed
from .views import RefreshData


class RefreshAllAccountsData:
    """
    To be called periodically to update all account data
    If any error occurs, it will still attempt to update other accounts.
    """

    @staticmethod
    def refresh_all_accounts():
        for trader in Trader.objects.all():
            django_rq.get_queue('low').enqueue(resolve_refresh_all_accounts_data, trader)
        AccountDataLastRefreshed.set_last_refreshed(timezone.now())
    
    @staticmethod
    def handle_resolve_refresh_account_exception(trader, exc):
        if isinstance(exc, metaapi.UnknownError):
            MetaApiError.objects.create(user=trader, error=exc.detail)
        AccountDataLastRefreshed.set_last_refreshed(timezone.now())
    
def resolve_refresh_all_accounts_data(trader):
    try:
        RefreshData.refresh_account_data(trader)
    except Exception as exc:
        RefreshAllAccountsData.handle_resolve_refresh_account_exception(trader, exc)