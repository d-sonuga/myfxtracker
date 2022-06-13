from django.test import TestCase, override_settings, tag
from rest_framework.authtoken.models import Token
from flutterwave_endpoint.models import FlutterwaveError
from trader import metaapi
from users.models import SubscriptionInfo, Trader
from trader.models import MetaApiError, UnresolvedUnsubscription, Account, UnsubscriptionError
from trader.metaapi import Transaction
from .test_data import subscription_test_data, RefreshAccountDataTestData
import django_rq


FLUTTERWAVE = SubscriptionInfo.FLUTTERWAVE
MONTHLY = SubscriptionInfo.MONTHLY
CODE = SubscriptionInfo.CODE


@tag('now')
class CancelSubscriptionTests(TestCase):
    def setUp(self) -> None:
        test_data = subscription_test_data
        self.trader = Trader.objects.create(**test_data.trader_details)
        self.trader.subscriptioninfo.is_subscribed = True
        self.trader.subscriptioninfo.on_free = False
        self.trader.subscriptioninfo.subscription_plan = SubscriptionInfo.PLAN_CHOICES[MONTHLY][CODE]
        self.trader.subscriptioninfo.payment_method = SubscriptionInfo.PAYMENT_CHOICES[FLUTTERWAVE][CODE]
        self.trader.subscriptioninfo.save()
        account_test_data = RefreshAccountDataTestData.OneAccountUserData
        Account.objects.create_account(
            self.trader,
            account_test_data.original_account_info,
            *Transaction.from_raw_data(account_test_data.original_deals)
        )
        self.token = Token.objects.create(user=self.trader).key

    def tearDown(self) -> None:
        django_rq.get_queue('default').empty()

    @override_settings(
        FLAPI_CLASS_MODULE='flutterwave_endpoint.flwapi.test_no_error',
        META_API_CLASS_MODULE='trader.metaapi.test_no_error'
    )
    def test_trader_cancels_subscription_successfully_resolved_before_follow_up_request(self):
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 1)

        self.resolve_unsubscription()

        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'not pending'})
        for account in Account.objects.filter(user=self.trader):
            self.assertFalse(account.deployed)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)

    @override_settings(
        FLAPI_CLASS_MODULE='flutterwave_endpoint.flwapi.test_no_error',
        META_API_CLASS_MODULE='trader.metaapi.test_unknown_error'
    )
    def test_trader_cancels_subscription_metaapi_error(self):
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.assertEquals(MetaApiError.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 1)
        self.assertEquals(UnsubscriptionError.objects.all().count(), 0)

        self.resolve_unsubscription()

        self.assertEquals(UnsubscriptionError.objects.all().count(), 1)
        self.assertEquals(MetaApiError.objects.all().count(), 1)
        resp = self.make_request()
        self.assertEquals(UnsubscriptionError.objects.all().count(), 0)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'detail': metaapi.UnknownError.detail})
        for account in Account.objects.filter(user=self.trader):
            self.assertTrue(account.deployed)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
    
    @override_settings(
        FLAPI_CLASS_MODULE='flutterwave_endpoint.flwapi.test_unknown_error',
        META_API_CLASS_MODULE='trader.metaapi.test_no_error'
    )
    def test_trader_cancels_subscription_flwapi_error(self):
        self.assertEquals(FlutterwaveError.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 1)
        self.assertEquals(UnsubscriptionError.objects.all().count(), 0)

        self.resolve_unsubscription()

        self.assertEquals(UnsubscriptionError.objects.all().count(), 1)
        self.assertEquals(FlutterwaveError.objects.all().count(), 1)
        resp = self.make_request()
        self.assertEquals(UnsubscriptionError.objects.all().count(), 0)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'detail': 'unknown'})
        for account in Account.objects.filter(user=self.trader):
            self.assertTrue(account.deployed)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)

    def test_not_a_trader_attempts_to_cancel_subscription(self):
        resp = self.make_request(token='invalidtoken')
        self.assertEquals(resp.status_code, 401)
        self.assertTrue(self.trader.is_subscribed)
    
    def resolve_unsubscription(self):
        django_rq.get_worker().work(burst=True)

    def make_request(self, token=None):
        token = token if token is not None else self.token
        return self.client.get(
            '/trader/cancel-subscription/',
            **{'HTTP_AUTHORIZATION': f'Token {token}'},
            content_type='application/json'
        )