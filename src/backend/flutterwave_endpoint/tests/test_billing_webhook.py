import json
import datetime
from django.core import mail
from django.test import TestCase, override_settings, tag
from django.conf import settings
from users.models import SubscriptionInfo, Trader
from flutterwave_endpoint.tests import test_data
from trader.models import Account, MetaApiError
from trader import metaapi
from trader.tests.test_data import RefreshAccountDataTestData
from flutterwave_endpoint.models import FlutterwaveError
import django_rq

dummy_time = datetime.datetime(2022, 6, 13, 12, 29, 23, 550010, tzinfo=datetime.timezone.utc)

def dummy_timefunc():
    return dummy_time

FLUTTERWAVE = SubscriptionInfo.FLUTTERWAVE
MONTHLY = SubscriptionInfo.MONTHLY
CODE = SubscriptionInfo.CODE
FLUTTERWAVE_VERIF_HASH = 'zl4hr9ufhp49fh4ufb4uz'

@tag('now')
class BillingWebhookTests(TestCase):
    def setUp(self) -> None:
        self.trader = Trader.objects.create(**test_data.trader_details)
        self.trader.subscriptioninfo.on_free = False
        self.trader.subscriptioninfo.save()

    @override_settings(TIMEFUNC=dummy_timefunc)
    def test_webhook_of_newly_subscribed_trader(self):
        self.assertFalse(self.trader.is_subscribed)
        self.assertEquals(self.trader.payment_method, None)
        self.assertFalse(self.trader.on_free)
        self.assertEquals(self.trader.last_billed_time, None)
        self.assertEquals(self.trader.subscription_plan, None)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.trader = Trader.objects.get(id=self.trader.id)
        self.assertTrue(self.trader.is_subscribed)
        self.assertEquals(self.trader.payment_method, SubscriptionInfo.PAYMENT_CHOICES[FLUTTERWAVE][CODE])
        self.assertFalse(self.trader.on_free)
        self.assertTrue(self.trader.last_billed_time, dummy_time)
        self.assertEquals(self.trader.next_billing_time, (dummy_time + datetime.timedelta(days=35)).date())
        self.assertEquals(self.trader.subscription_plan, SubscriptionInfo.PLAN_CHOICES[MONTHLY][CODE])
    
    def test_webhook_of_subscribed_trader_being_rebilled(self):
        self.setup_subscribed_trader()
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.trader = Trader.objects.get(id=self.trader.id)
        self.assertTrue(self.trader.is_subscribed)
        self.assertEquals(self.trader.last_billed_time, dummy_time.date())
        self.assertEquals(self.trader.next_billing_time, (dummy_time + datetime.timedelta(days=35)).date())
    
    @override_settings(
        META_API_CLASS_MODULE='trader.metaapi.test_no_error',
        FLAPI_CLASS_MODULE='flutterwave_endpoint.flwapi.test_no_error'
    )
    def test_webhook_of_subscribed_trader_failed_rebilling(self):
        """
        To test the scenario where the Flutterwave webhook reports a failed re-billing
        The subscription ought to be cancelled, allowing the user to re-subscribe on the frontend
        The user should also be emailed to be alerted of the occurence
        """
        self.setup_subscribed_trader_with_an_account()
        resp = self.make_request(webhook_func=test_data.test_failed_billing_webhook)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(len(mail.outbox), 1)
        for account in Account.objects.filter(user=self.trader):
            self.assertTrue(account.deployed)
        self.carry_out_background_tasks_in_worker()
        for account in Account.objects.filter(user=self.trader):
            self.assertFalse(account.deployed)
        self.assertFalse(self.trader.is_subscribed)
        
        
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_unknown_error')
    def test_webhook_of_subscribed_trader_failed_rebilling(self):
        """
        To test the scenario where the Flutterwave webhook reports a failed re-billing
        and metaapi throws an unknown error
        """
        self.setup_subscribed_trader_with_an_account()
        resp = self.make_request(webhook_func=test_data.test_failed_billing_webhook)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(len(mail.outbox), 1)
        self.assertTrue(self.trader.is_subscribed)
        self.assertEquals(MetaApiError.objects.all().count(), 0)
        self.carry_out_background_tasks_in_worker()
        self.assertEquals(MetaApiError.objects.all().count(), 1)
        self.assertTrue(self.trader.is_subscribed)
    
    @override_settings(
        META_API_CLASS_MODULE='trader.metaapi.test_no_error',
        FLAPI_CLASS_MODULE='flutterwave_endpoint.flwapi.test_unknown_error'
    )
    def test_webhook_of_subscribed_trader_failed_rebilling(self):
        """
        To test the scenario where the Flutterwave webhook reports a failed re-billing
        and the Flutterwave api throws an error
        """
        self.setup_subscribed_trader_with_an_account()
        resp = self.make_request(webhook_func=test_data.test_failed_billing_webhook)
        self.assertEquals(resp.status_code, 200)
        self.assertTrue(self.trader.is_subscribed)
        self.assertEquals(FlutterwaveError.objects.all().count(), 0)
        self.carry_out_background_tasks_in_worker()
        self.assertTrue(self.trader.is_subscribed)
        self.assertEquals(FlutterwaveError.objects.all().count(), 1)

    @override_settings(FLUTTERWAVE_VERIF_HASH=FLUTTERWAVE_VERIF_HASH)
    def test_webhook_verification(self):
        """
        To test the scenario where a webhook whose verif-hash doesn't correspond with that in the settings
        reaches backend. It should return a 401 unauthorized response
        """
        old_trader = self.trader
        resp = self.make_request(verif_hash='invalidverifhash')
        self.assertEquals(resp.status_code, 401)
        self.assert_trader_unchanged(self.trader, old_trader)

    def assert_trader_unchanged(self, trader: Trader, old_trader: Trader):
        self.assertEquals(old_trader.is_subscribed, trader.is_subscribed)
        self.assertEquals(old_trader.last_billed_time, trader.last_billed_time)
        self.assertEquals(old_trader.next_billing_time, trader.next_billing_time)
        self.assertEquals(old_trader.on_free, trader.on_free)
        self.assertEquals(old_trader.payment_method, trader.payment_method)
        self.assertEquals(old_trader.subscription_plan, trader.subscription_plan)

    def setup_subscribed_trader(self):
        self.trader.subscriptioninfo.is_subscribed = True
        self.trader.subscriptioninfo.payment_method = SubscriptionInfo.PAYMENT_CHOICES[FLUTTERWAVE][CODE]
        self.trader.subscriptioninfo.subscription_plan = SubscriptionInfo.PLAN_CHOICES[MONTHLY][CODE]
        self.trader.subscriptioninfo.next_billing_time = (dummy_time + datetime.timedelta(days=1)).date()
        self.trader.subscriptioninfo.last_billed_time = (dummy_time - datetime.timedelta(days=33)).date()
        self.trader.subscriptioninfo.save()

    def setup_subscribed_trader_with_an_account(self):
        self.setup_subscribed_trader()
        account_test_data = RefreshAccountDataTestData.OneAccountUserData
        Account.objects.create_account(
            self.trader,
            account_test_data.original_account_info,
            *metaapi.Transaction.from_raw_data(account_test_data.original_deals)
        )
    
    def carry_out_background_tasks_in_worker(self):
        django_rq.get_worker().work(burst=True)

    def make_request(self, verif_hash=None, webhook_func=None):
        webhook_func = webhook_func if webhook_func else test_data.test_billing_webhook
        headers = {
            'verif-hash': settings.FLUTTERWAVE_VERIF_HASH if not verif_hash else verif_hash
        }
        return self.client.post(
            '/fl/',
            json.loads(webhook_func(self.trader, dummy_time)),
            **headers,
            content_type='application/json'
        )