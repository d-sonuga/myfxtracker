import django_rq
import datetime
from django.conf import settings
from django.test import TestCase, tag, override_settings
from django.utils import timezone
from rest_framework.authtoken.models import Token
from trader import metaapi
from users.models import SubscriptionInfo, Trader
from trader.models import Account, MetaApiError, UnresolvedDeployAccount, DeployAccountError
from trader.metaapi.main import Transaction
from trader.tests.test_data import subscription_test_data
from .test_add_trading_account import test_mtapi_error
from .test_data import RefreshAccountDataTestData


class ReSubscriptionTests(TestCase):
    def setUp(self) -> None:
        FLUTTERWAVE = SubscriptionInfo.FLUTTERWAVE
        MONTHLY = SubscriptionInfo.MONTHLY
        CODE = SubscriptionInfo.CODE
        test_data = subscription_test_data
        account_test_data = RefreshAccountDataTestData.OneAccountUserData
        self.trader = Trader.objects.create(**test_data.trader_details)
        self.trader.subscriptioninfo.on_free = False
        self.trader.subscriptioninfo.last_billed_time = timezone.now() - datetime.timedelta(days=32)
        self.trader.subscriptioninfo.next_billing_time = timezone.now() - datetime.timedelta(days=1)
        self.trader.subscriptioninfo.payment_method = SubscriptionInfo.PAYMENT_CHOICES[FLUTTERWAVE][CODE]
        self.trader.subscriptioninfo.subscription_plan = SubscriptionInfo.PLAN_CHOICES[MONTHLY][CODE]
        self.trader.subscriptioninfo.save()
        self.trader_token = Token.objects.create(user=self.trader).key
        account = Account.objects.create_account(
            self.trader,
            account_test_data.original_account_info,
            *Transaction.from_raw_data(account_test_data.original_deals)
        )
        account.deployed = False
        account.save()
    
    def tearDown(self) -> None:
        django_rq.get_queue().empty()
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_user_resubscribes_and_has_an_undeployed_account1(self):
        """
        To test the scenario where a user re-subscribes after the subscription got cancelled
        from a failed payment, the user has undeployed accounts and the background worker
        resolves the deploy account before the follow up requests
        """
        self.assertEquals(UnresolvedDeployAccount.objects.all().count(), 0)
        self.assertEquals(DeployAccountError.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'status': 'pending'})
        self.assertEquals(UnresolvedDeployAccount.objects.all().count(), 1)
        self.assertEquals(DeployAccountError.objects.all().count(), 0)
        trader = Trader.objects.get(id=self.trader.id)
        self.assertTrue(trader.is_subscribed)
        
        self.resolve_deploy_trading_accounts()

        self.assertEquals(UnresolvedDeployAccount.objects.all().count(), 0)
        self.assertEquals(DeployAccountError.objects.all().count(), 0)
        self.assertEquals(MetaApiError.objects.all().count(), 0)
        trader = Trader.objects.get(id=self.trader.id)
        for account in Account.objects.filter(user=trader):
            self.assertTrue(account.deployed)

        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'status': 'not pending'})

    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_user_resubscribes_and_has_an_undeployed_account2(self):
        """
        To test the scenario where a user re-subscribes after the subscription got cancelled
        from a failed payment, the user has undeployed accounts and the background worker
        resolves the deploy account before the follow up requests
        """
        self.assertEquals(UnresolvedDeployAccount.objects.all().count(), 0)
        self.assertEquals(DeployAccountError.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'status': 'pending'})
        self.assertEquals(UnresolvedDeployAccount.objects.all().count(), 1)
        self.assertEquals(DeployAccountError.objects.all().count(), 0)
        trader = Trader.objects.get(id=self.trader.id)
        self.assertTrue(trader.is_subscribed)
        
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'status': 'pending'})

        self.resolve_deploy_trading_accounts()

        self.assertEquals(UnresolvedDeployAccount.objects.all().count(), 0)
        self.assertEquals(DeployAccountError.objects.all().count(), 0)
        self.assertEquals(MetaApiError.objects.all().count(), 0)
        trader = Trader.objects.get(id=self.trader.id)
        for account in Account.objects.filter(user=trader):
            self.assertTrue(account.deployed)

        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'status': 'not pending'})
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_user_resubscribed_and_has_multiple_undeployed_accounts(self):
        self.setup_trader_with_multiple_accounts(self.trader)
        for account in self.trader.account_set.all():
            account.deployed = False
            account.save()
        self.assertEquals(UnresolvedDeployAccount.objects.all().count(), 0)
        self.assertEquals(DeployAccountError.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'status': 'pending'})
        self.assertEquals(UnresolvedDeployAccount.objects.all().count(), 1)
        self.assertEquals(DeployAccountError.objects.all().count(), 0)
        trader = Trader.objects.get(id=self.trader.id)
        self.assertTrue(trader.is_subscribed)

        self.resolve_deploy_trading_accounts()

        self.assertEquals(UnresolvedDeployAccount.objects.all().count(), 0)
        self.assertEquals(DeployAccountError.objects.all().count(), 0)
        self.assertEquals(MetaApiError.objects.all().count(), 0)
        trader = Trader.objects.get(id=self.trader.id)
        for account in Account.objects.filter(user=trader):
            self.assertTrue(account.deployed)

        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'status': 'not pending'})
    
    def setup_trader_with_multiple_accounts(self, trader):
        test_data = RefreshAccountDataTestData.MoreThanOneAccountUserData
        Account.objects.create_account(
            trader,
            test_data.account1_data['original_account_info'],
            *Transaction.from_raw_data(test_data.account1_data['original_deals'])
        )
        (trade_data, deposit_data, withdrawal_data,
            unknown_transaction_data) = Transaction.from_raw_data(test_data.account2_data['original_deals'])
        Account.objects.create_account(
            trader,
            test_data.account2_data['original_account_info'],
            trade_data,
            deposit_data,
            withdrawal_data,
            unknown_transaction_data
        )
    

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_unknown_error')
    def test_mtapi_throws_unknown_error(self):
        self.assertEquals(UnresolvedDeployAccount.objects.all().count(), 0)
        self.assertEquals(DeployAccountError.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'status': 'pending'})
        self.assertEquals(UnresolvedDeployAccount.objects.all().count(), 1)
        self.assertEquals(DeployAccountError.objects.all().count(), 0)
        trader = Trader.objects.get(id=self.trader.id)
        self.assertTrue(trader.is_subscribed)

        self.resolve_deploy_trading_accounts()

        self.assertEquals(UnresolvedDeployAccount.objects.all().count(), 0)
        self.assertEquals(DeployAccountError.objects.all().count(), 1)
        trader = Trader.objects.get(id=self.trader.id)
        for account in Account.objects.filter(user=trader):
            self.assertFalse(account.deployed)

        resp = self.make_request()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'detail': metaapi.UnknownError.detail})
        self.assertEquals(DeployAccountError.objects.all().count(), 0)

    def resolve_deploy_trading_accounts(self):
        django_rq.get_worker().work(burst=True)

    def make_request(self, token: str = None, amount: float = None):
        if not token:
            token = self.trader_token
        if not amount:
            amount = settings.MONTHLY_PLAN_PRICE
        return self.client.post(
            '/trader/record-new-subscription/',
            {'amount': amount},
            content_type='application/json',
            **{'HTTP_AUTHORIZATION': f'Token {token}'}
        )