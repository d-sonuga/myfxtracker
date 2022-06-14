import datetime
from django.test import TestCase, override_settings, tag
import django_rq
from rest_framework.authtoken.models import Token
from flutterwave_endpoint.models import FlutterwaveError
from trader import metaapi
from trader.models import Account, MetaApiError, RemoveAccountError, UnresolvedRemoveAccount, UnresolvedUnsubscription, UnsubscriptionError
from users.models import SubscriptionInfo, Trader, datasource_username_is_valid, datasource_username_is_invalid
from trader.metaapi.main import MetaApi, Transaction
from trader.tests.test_add_trading_account import test_mtapi_error
from .test_data import RemoveAccountTestData


dummy_time = datetime.datetime(2022, 6, 14, 16, 31, 35, 683758, tzinfo=datetime.timezone.utc)

def dummy_timefunc():
    return dummy_time

@override_settings(DEBUG=True)
class DeleteAccountTest(TestCase):
    def setUp(self) -> None:
        self.trader = Trader.objects.create(
            email='sonugademilade8703@gmail.com',
            password='password'
        )
        trader_token = Token.objects.create(user=self.trader).key
        self.valid_headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {trader_token}'
        }
    
    def tearDown(self) -> None:
        django_rq.get_queue().empty()

    def test_ds_username_invalid_after_deleting_account(self):
        ds_username = self.trader.traderinfo.ds_username
        self.client.delete('/trader/delete-account/', **self.valid_headers)
        self.assertFalse(ds_username.is_valid())
        self.assertFalse(datasource_username_is_valid(ds_username.username))
        self.assertTrue(datasource_username_is_invalid(ds_username.username))

    
    def test_delete_account_when_no_trading_account_connected_on_metaapi_server(self):
        """
        To test the scenario where an unsubscribed trader requests to delete
        his account when he doesn't have any connected metaapi accounts
        """
        self.assertEquals(Trader.objects.all().count(), 1)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.assertEquals(Trader.objects.all().count(), 0)

    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_delete_account_when_trading_account_connected_on_metaapi_server1(self):
        """
        To test the scenario where an unsubscribed trader requests to delete his account
        when he still has connected trading accounts and removal of trading accounts is resolved
        before follow up requests
        """
        no_of_accounts = self.setup_trader_with_accounts()
        self.assertEquals(Trader.objects.all().count(), 1)
        self.assertNotEquals(Account.objects.all().count(), 0)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), no_of_accounts)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.resolve_remove_trading_accounts()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'removed'})
        self.assertEquals(Account.objects.all().count(), 0)
        self.assertEquals(Trader.objects.all().count(), 0)
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_delete_account_when_trading_account_connected_on_metaapi_server2(self):
        """
        To test the scenario where a trader requests to delete his account
        when he still has connected trading accounts and removal of trading accounts is resolved
        after follow up requests
        """
        no_of_accounts = self.setup_trader_with_accounts()
        self.assertNotEquals(Account.objects.all().count(), 0)
        self.assertEquals(Trader.objects.all().count(), 1)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), no_of_accounts)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), no_of_accounts)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), no_of_accounts)
        self.resolve_remove_trading_accounts()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(Account.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'removed'})
        self.assertEquals(Trader.objects.all().count(), 0)

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_unknown_error', no_of_errors=2)
    def test_delete_account_when_trading_account_connected_on_metaapi_server3(self):
        """
        To test the scenario where a trader requests to delete his account
        when he still has connected trading accounts and removal of trading accounts is resolved
        with an error before follow up requests
        """
        no_of_accounts = self.setup_trader_with_accounts()
        self.assertEquals(Trader.objects.all().count(), 1)
        self.assertNotEquals(Account.objects.all().count(), 0)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), no_of_accounts)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(RemoveAccountError.objects.all().count(), 0)
        self.resolve_remove_trading_accounts()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(RemoveAccountError.objects.all().count(), no_of_accounts)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'detail': metaapi.UnknownError.detail})
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.assertEquals(Account.objects.all().count(), no_of_accounts)
        self.assertEquals(Trader.objects.all().count(), 1)

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_unknown_error', no_of_errors=2)
    def test_delete_account_when_trading_account_connected_on_metaapi_server4(self):
        """
        To test the scenario where a trader requests to delete his account
        when he still has connected trading accounts and removal of trading accounts is resolved
        with an error after follow up requests
        """
        no_of_accounts = self.setup_trader_with_accounts()
        self.assertEquals(Trader.objects.all().count(), 1)
        self.assertNotEquals(Account.objects.all().count(), 0)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), no_of_accounts)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(RemoveAccountError.objects.all().count(), 0)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), no_of_accounts)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), no_of_accounts)
        self.resolve_remove_trading_accounts()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(RemoveAccountError.objects.all().count(), no_of_accounts)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'detail': metaapi.UnknownError.detail})
        self.assertEquals(Account.objects.all().count(), no_of_accounts)
        self.assertEquals(Trader.objects.all().count(), 1)

    @override_settings(FLAPI_CLASS_MODULE='flutterwave_endpoint.flwapi.test_no_error')
    def test_delete_account_successfully_when_user_is_subscribed_and_has_no_accounts1(self):
        """
        To test the scenario where a subscribed user with no trading accounts deletes
        his account with no errors and the unsubscription is resolved before follow up requests
        """
        self.setup_subscribed_trader()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 1)
        self.resolve_remove_trading_accounts()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'removed'})

    @override_settings(FLAPI_CLASS_MODULE='flutterwave_endpoint.flwapi.test_no_error')
    def test_delete_account_successfully_when_user_is_subscribed_and_has_no_accounts2(self):
        """
        To test the scenario where a subscribed user with no trading accounts deletes
        his account with no errors and the unsubscription is resolved after follow up requests
        """
        self.setup_subscribed_trader()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 1)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.resolve_remove_trading_accounts()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'removed'})
    

    @override_settings(
        FLAPI_CLASS_MODULE='flutterwave_endpoint.flwapi.test_no_error',
        META_API_CLASS_MODULE='trader.metaapi.test_no_error'
    )
    def test_delete_account_successfully_when_user_is_subscribed_and_has_accounts1(self):
        """
        To test the scenario where a subscribed user with trading accounts deletes
        his account with no errors and the unsubscription is resolved before follow up requests
        """
        self.setup_subscribed_trader()
        no_of_accounts = self.setup_trader_with_accounts()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), no_of_accounts)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.resolve_remove_trading_accounts()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 1)
        self.resolve_unsubscription()
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'removed'})
    
    @override_settings(
        FLAPI_CLASS_MODULE='flutterwave_endpoint.flwapi.test_no_error',
        META_API_CLASS_MODULE='trader.metaapi.test_no_error'
    )
    def test_delete_account_successfully_when_user_is_subscribed_and_has_accounts2(self):
        """
        To test the scenario where a subscribed user with trading accounts deletes
        his account with no errors and the unsubscription is resolved after follow up requests
        """
        self.setup_subscribed_trader()
        no_of_accounts = self.setup_trader_with_accounts()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), no_of_accounts)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.resolve_remove_trading_accounts()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 1)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 1)
        self.resolve_unsubscription()
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'removed'})
    
    @override_settings(
        FLAPI_CLASS_MODULE='flutterwave_endpoint.flwapi.test_no_error',
        META_API_CLASS_MODULE='trader.metaapi.test_unknown_error'
    )
    def test_delete_account_metaapi_error_when_user_is_subscribed_and_has_accounts1(self):
        """
        To test the scenario where a subscribed user with trading accounts deletes
        his account with no errors and the unsubscription is resolved before follow up requests
        """
        self.setup_subscribed_trader()
        no_of_accounts = self.setup_trader_with_accounts()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.assertEquals(MetaApiError.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), no_of_accounts)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.assertEquals(RemoveAccountError.objects.all().count(), 0)
        self.resolve_remove_trading_accounts()
        self.assertEquals(RemoveAccountError.objects.all().count(), no_of_accounts)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'detail': metaapi.UnknownError.detail})
        self.assertEquals(RemoveAccountError.objects.all().count(), 0)
        self.assertEquals(MetaApiError.objects.all().count(), no_of_accounts)
    
    @override_settings(
        FLAPI_CLASS_MODULE='flutterwave_endpoint.flwapi.test_unknown_error',
        META_API_CLASS_MODULE='trader.metaapi.test_no_error'
    )
    def test_delete_account_flapi_error_when_user_is_subscribed_and_has_accounts2(self):
        """
        To test the scenario where a subscribed user with trading accounts deletes
        his account with no errors and the unsubscription is resolved before follow up requests
        """
        self.setup_subscribed_trader()
        no_of_accounts = self.setup_trader_with_accounts()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.assertEquals(FlutterwaveError.objects.all().count(), 0)
        self.assertEquals(MetaApiError.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), no_of_accounts)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        self.assertEquals(UnsubscriptionError.objects.all().count(), 0)
        self.resolve_remove_trading_accounts()
        self.assertEquals(UnsubscriptionError.objects.all().count(), 0)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 1)
        self.resolve_unsubscription()
        self.assertEquals(UnsubscriptionError.objects.all().count(), 1)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        self.assertEquals(UnresolvedUnsubscription.objects.all().count(), 0)
        resp = self.make_request()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(MetaApiError.objects.all().count(), 0)
        self.assertEquals(FlutterwaveError.objects.all().count(), 1)
        self.assertEquals(resp.json(), {'detail': 'unknown'})

    def setup_subscribed_trader(self):
        FLUTTERWAVE = SubscriptionInfo.FLUTTERWAVE
        CODE = SubscriptionInfo.CODE
        MONTHLY = SubscriptionInfo.MONTHLY
        self.trader.subscriptioninfo.is_subscribed = True
        self.trader.subscriptioninfo.payment_method = SubscriptionInfo.PAYMENT_CHOICES[FLUTTERWAVE][CODE]
        self.trader.subscriptioninfo.on_free = False
        self.trader.subscriptioninfo.next_billing_time = dummy_time + datetime.timedelta(days=24)
        self.trader.subscriptioninfo.last_billed_time = dummy_time - datetime.timedelta(days=15)
        self.trader.subscriptioninfo.subscription_plan = SubscriptionInfo.PLAN_CHOICES[MONTHLY][CODE]
        self.trader.subscriptioninfo.save()
    
    def setup_trader_with_accounts(self) -> int:
        test_data = RemoveAccountTestData
        no_of_accounts = len(test_data.account_data.values())
        for account_data in test_data.account_data.values():
            Account.objects.create_account(
                self.trader,
                account_data['account_info'],
                *Transaction.from_raw_data(account_data['deals'])
            )
        return no_of_accounts

    def make_request(self):
        return self.client.delete('/trader/delete-account/', **self.valid_headers)

    def resolve_remove_trading_accounts(self):
        django_rq.get_worker().work(burst=True)
    
    def resolve_unsubscription(self):
        django_rq.get_worker().work(burst=True)