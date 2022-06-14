import logging
from django.conf import settings
from importlib import import_module
from rave_python import Rave
from rave_python.rave_exceptions import PlanStatusError

logger = logging.getLogger(__name__)

class FlApi:
    def __init__(self):
        flapi_module_name = getattr(settings, 'FLAPI_CLASS_MODULE', 'flutterwave_endpoint.flwapi.main')
        flapi_module = import_module(flapi_module_name)
        self._api: Rave = getattr(flapi_module, 'Rave')(settings.RAVE_PUBLIC_KEY)
        
    def cancel_subscription(self, trader_email: str):
        logger.info(f'Fetching subscriptions of user {trader_email}')
        related_subscriptions = self._api.Subscriptions.fetch(subscription_email=trader_email)
        logger.info(f'Extracting subscription id of fetched subscriptions of user {trader_email}')
        subscr_id = self.get_trader_subscription_id(related_subscriptions)
        logger.info(f'Making request to cancel subscription of user {trader_email}')
        resp = self._api.Subscriptions.cancel(subscr_id)
        successful_subscription_cancel = lambda: (
            resp.get('error') == False
            and resp.get('returnedData')['status'] == 'success'
            and resp['returnedData']['data']['status'] == 'cancelled'
        )
        if not successful_subscription_cancel():
            raise FlutterwaveError('unsuccessful subscription cancel')
        
    
    def get_trader_subscription_id(self, related_subscriptions):
        data = related_subscriptions.get('returnedData')['data']['plansubscriptions']
        trader_data = [subscription_data for subscription_data in data if subscription_data.get('status') == 'active']
        if len(trader_data) > 1:
            raise FlutterwaveError('multiple active subscriptions')
        else:
            return trader_data[0]['id']


class FlutterwaveError(Exception):
    detail = 'unknown error'

    def __init__(self, detail: str):
        self.detail = detail

