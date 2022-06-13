from django.test import TestCase, override_settings, tag
from django.conf import settings
from users.models import SubscriptionInfo, Trader
from rest_framework.authtoken.models import Token
from .test_data import subscription_test_data
import datetime

dummy_time = datetime.datetime(2022, 6, 12, 21, 0, 57, 206541, tzinfo=datetime.timezone.utc)
other_dummy_time = datetime.datetime(2022, 6, 13, 21, 0, 57, 206541, tzinfo=datetime.timezone.utc)

def dummy_timefunc():
    return dummy_time

def other_dummy_timefunc():
    return other_dummy_time

@tag('now')
class NewSubscriptionTests(TestCase):
    def setUp(self) -> None:
        test_data = subscription_test_data
        self.trader = Trader.objects.create(**test_data.trader_details)
        self.trader.subscriptioninfo.on_free = False
        self.trader.subscriptioninfo.save()
        self.trader_token = Token.objects.create(user=self.trader).key

    @override_settings(TIMEFUNC=dummy_timefunc)
    def test_user_subscribes_for_monthly_subscription_successfully(self):
        """
        To test the scenario where a user that was on free trial subscribes successfully
        and the frontend request to update the subscription status in the db gets here before
        the Flutterwave webhook
        """
        self.assert_trader_not_recorded_as_subscribed()
        resp = self.make_request(amount=settings.MONTHLY_PLAN_PRICE)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'status': 'not pending'})
        self.assert_trader_recorded_as_subscribed()
    
    @override_settings(TIMEFUNC=dummy_timefunc)
    def test_user_subscribes_for_yearly_subscription_successfully(self):
        """
        To test the scenario where a user that was on free trial subscribes successfully
        and the frontend request to update the subscription status in the db gets here before
        the Flutterwave webhook
        """
        self.assert_trader_not_recorded_as_subscribed()
        resp = self.make_request(amount=settings.YEARLY_PLAN_PRICE)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'status': 'not pending'})
        self.assert_trader_recorded_as_subscribed(plan='yearly')
    
    @override_settings(TIMEFUNC=other_dummy_timefunc)
    def test_user_subscribes_for_monthly_subscription_successfully_webhook_arrives_first(self):
        """
        To test the scenario where a user that was on free trial subscribes successfully
        and the frontend request to update the subscription status in the db gets here after
        the Flutterwave webhook
        """
        self.record_trader_as_subscribed()
        last_billed_time = self.trader.subscriptioninfo.last_billed_time
        resp = self.make_request(amount=settings.MONTHLY_PLAN_PRICE)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'status': 'not pending'})
        self.trader = Trader.objects.get(id=self.trader.id)
        self.assertEquals(last_billed_time.date(), self.trader.subscriptioninfo.last_billed_time)

    def test_not_a_trader_attempts_to_make_request(self):
        resp = self.make_request(token='invalidtoken')
        self.assertEquals(resp.status_code, 401)
    
    def test_user_attempts_to_subscribe_with_invalid_amount(self):
        resp = self.make_request(amount=0)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'amount': ['Invalid plan price']})

    def test_user_attempts_to_subscribe_with_invalid_amount(self):
        resp = self.make_request(amount='')
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'amount': ['Invalid plan price']})
    
    def record_trader_as_subscribed(self, trader=None, plan=None):
        if not trader:
            trader = self.trader
        FLUTTERWAVE, CODE = SubscriptionInfo.FLUTTERWAVE, SubscriptionInfo.CODE
        PLAN_INDEX = SubscriptionInfo.MONTHLY
        YEARLY = SubscriptionInfo.YEARLY
        if plan:
            if 'ye' in plan.lower():
                PLAN_INDEX = YEARLY
        trader.subscriptioninfo.is_subscribed = True
        trader.subscriptioninfo.last_billed_time = dummy_time
        trader.subscriptioninfo.subscription_plan = SubscriptionInfo.PLAN_CHOICES[PLAN_INDEX][CODE]
        trader.subscriptioninfo.payment_method = SubscriptionInfo.PAYMENT_CHOICES[FLUTTERWAVE][CODE]
        trader.subscriptioninfo.save()

    def assert_trader_recorded_as_subscribed(self, trader=None, time=None, plan=None):
        FLUTTERWAVE, CODE = SubscriptionInfo.FLUTTERWAVE, SubscriptionInfo.CODE
        PLAN_INDEX = SubscriptionInfo.MONTHLY
        YEARLY = SubscriptionInfo.YEARLY
        if plan:
            if 'ye' in plan.lower():
                PLAN_INDEX = YEARLY
        if not time:
            time = dummy_time
        if not trader:
            trader = self.trader
        trader = Trader.objects.get(id=trader.id)
        self.assertEquals(time.date(), trader.subscriptioninfo.last_billed_time)
        self.assertTrue(trader.subscriptioninfo.is_subscribed)
        self.assertFalse(trader.subscriptioninfo.on_free)
        self.assertEquals(
            trader.subscriptioninfo.payment_method,
            SubscriptionInfo.PAYMENT_CHOICES[FLUTTERWAVE][CODE]
        )
        self.assertEquals(
            trader.subscriptioninfo.subscription_plan,
            SubscriptionInfo.PLAN_CHOICES[PLAN_INDEX][CODE]
        )

    def assert_trader_not_recorded_as_subscribed(self, time=None, trader=None):
        if not time:
            time = dummy_time
        if trader is None:
            trader = self.trader
        FLUTTERWAVE, CODE = SubscriptionInfo.FLUTTERWAVE, SubscriptionInfo.CODE
        PLAN_INDEX = SubscriptionInfo.MONTHLY
        self.assertNotEquals(time, trader.subscriptioninfo.last_billed_time)
        self.assertFalse(trader.subscriptioninfo.on_free)
        self.assertFalse(trader.subscriptioninfo.is_subscribed)
        self.assertEquals(trader.subscriptioninfo.payment_method, None)
        self.assertNotEquals(
            trader.subscriptioninfo.payment_method,
            SubscriptionInfo.PAYMENT_CHOICES[FLUTTERWAVE][CODE]
        )
        self.assertNotEquals(
            trader.subscriptioninfo.subscription_plan,
            SubscriptionInfo.PLAN_CHOICES[PLAN_INDEX][CODE]
        )

    def make_request(self, token: str = None, amount: float = None):
        if not token:
            token = self.trader_token
        if not amount:
            amount = 0
        return self.client.post(
            '/trader/record-new-subscription/',
            {'amount': amount},
            content_type='application/json',
            **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )


