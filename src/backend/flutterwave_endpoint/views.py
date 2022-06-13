from asyncio.log import logger
import datetime
import json
from django.conf import settings
from django.http import HttpResponse
from django.views import View
from django.core import mail
from rave_python import Rave
from flutterwave_endpoint.models import FlutterwaveError
from trader import metaapi
from trader.models import Account, MetaApiError
from trader.redis_utils import rq_enqueue
from users.models import SubscriptionInfo, Trader
from rave_python.rave_exceptions import PlanStatusError
from . import flwapi


FLUTTERWAVE = SubscriptionInfo.FLUTTERWAVE
CODE = SubscriptionInfo.CODE
MONTHLY = SubscriptionInfo.MONTHLY

class HandleWebhookView(View):
    def post(self, request, *args, **kwargs):
        if request.headers.get('verif-hash') != settings.FLUTTERWAVE_VERIF_HASH:
            return HttpResponse(status=401)
        request_body = request.body.decode()
        webhook = json.loads(request_body)
        if webhook.get('event') == 'charge.completed':
            if webhook['data'].get('status') != 'successful':
                self.handle_failed_rebilling(webhook)
            else:
                self.handle_rebilling_webhook(webhook)
        return HttpResponse()
        
    def handle_rebilling_webhook(self, webhook):
        user_id = self.extract_user_id_from_tx_ref(webhook)
        subscr_info = SubscriptionInfo.objects.get(user_id=user_id)
        time_of_payment_str = webhook['data']['created_at']
        time_of_payment = datetime.datetime.fromisoformat(time_of_payment_str)
        subscr_info.last_billed_time = time_of_payment.date()
        subscr_info.is_subscribed = True
        subscr_info.on_free = False
        subscr_info.next_billing_time = subscr_info.last_billed_time + datetime.timedelta(days=35)
        subscr_info.payment_method = SubscriptionInfo.PAYMENT_CHOICES[FLUTTERWAVE][CODE]
        subscr_info.subscription_plan = SubscriptionInfo.PLAN_CHOICES[MONTHLY][CODE]
        subscr_info.save()
    
    def handle_failed_rebilling(self, webhook):
        user_id = self.extract_user_id_from_tx_ref(webhook)
        trader = Trader.objects.get(id=user_id)
        mail.send_mail(
            'Your Subscription Has Been Cancelled',
            'Dear Trader, the payment on your card failed. Your subscription has been cancelled.',
            from_email=None,
            recipient_list=[trader.email]
        )
        rq_enqueue(undeploy_trader_accounts, trader)

    def extract_user_id_from_tx_ref(self, webhook):
        tx_ref = webhook['data']['tx_ref']
        return tx_ref.split('-')[1]
    
def undeploy_trader_accounts(trader: Trader):
    try:
        mtapi = metaapi.MetaApi()
        for account in Account.objects.filter(user=trader):
            mtapi.undeploy_account(account.ma_account_id)
            account.deployed = False
            account.save()
        rq_enqueue(cancel_subscription, trader)
    except Exception as e:
        logger.exception(f'An error occured while undeploying a trader account which belongs to the trader with an id of {trader.id}')
        if isinstance(e, metaapi.UnknownError):
            MetaApiError.objects.create(user=trader, error=e.detail)

def cancel_subscription(trader: Trader):
    flapi = flwapi.FlApi()
    try:
        flapi.cancel_subscription(trader.email)
        trader.subscriptioninfo.is_subscribed = False
        trader.subscriptioninfo.save()
    except PlanStatusError as e:
        logger.exception('An error occured while cancelling trader subscription')
        FlutterwaveError.objects.create(err_type=e.type, err_data=e.err)
    except Exception:
        logger.exception('An error occured while cancelling trader subscription')
        FlutterwaveError.objects.create(err_type='unknown', err_data='unknown')

    

handle_webhook = HandleWebhookView.as_view()