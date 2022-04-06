from django.test import TestCase, override_settings
import django_rq
from rest_framework.authtoken.models import Token
from trader.views import ERROR_FROM_METAAPI
from trader.metaapi.main import Transaction
from users.models import Trader
from trader.models import Account, UnresolvedRemoveAccount, RemoveAccountError
from trader import metaapi
from .test_add_trading_account import test_mtapi_error
from .test_data import RemoveAccountTestData

"""
When a user requests to remove an account, the request is placed on a queue
A response of 'pending' is returned
The user makes a request to see if it's resolved every few seconds
If it's resolved, a 'deleted' response is returned
If it's not resolved, a 'pending' response is returned
If it's resolved with an error, the error is returned

RemoveAccount endpoint
Request reaches backend
If there isn't error
    Check if account is in UnresolvedRemoveAccount
    If it is
        return 'pending' request
    If it isn't
        Check if account in the database
        If it isn't
            return 'removed'
        If it is
            Check if the account is in RemoveAccountError
            If it is
                retrieve the error and delete it
                return the error
            If it isn't
                put job on queue
                save details in UnresolvedRemoveAccount
                return 'pending' response

Job ends
Remove details of job from UnresolvedRemoveAccount
"""

from django.test import tag

class RemoveTradingAccountTests(TestCase):
    def setUp(self):
        test_data = RemoveAccountTestData
        self.trader = Trader.objects.create(**test_data.user_details)
        trader_token = Token.objects.create(user=self.trader).key
        self.valid_headers = {
            'HTTP_AUTHORIZATION': f'Token {trader_token}'
        }
        for account_data in test_data.account_data.values():
            Account.objects.create_account(
                self.trader,
                account_data['account_info'],
                *Transaction.from_raw_data(account_data['deals'])
            )
        other_trader = Trader.objects.create(**test_data.other_user_details)
        Account.objects.create_account(
            other_trader,
            test_data.other_user_account_data['account_info'],
            *Transaction.from_raw_data(test_data.other_user_account_data['deals'])
        )
    
    def tearDown(self) -> None:
        django_rq.get_queue().empty()
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_valid_user_removes_account_without_errors_removal_resolved_before_pending_request(self):
        """
        To test the scenario where a valid authenticated trader requests to remove his account
        and removal is resolved before the follow up request
        """
        account_to_delete_id = Account.objects.filter(user=self.trader)[0].id

        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        resp = self.request_remove_account(account_to_delete_id)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 1)

        self.resolve_remove_account()
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        resp = self.request_remove_account(account_to_delete_id)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'removed'})

        nonexistent_account_set = Account.objects.filter(id=account_to_delete_id)
        self.assertEquals(nonexistent_account_set.count(), 0)
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_valid_user_removes_account_without_errors_removal_resolved_after_request(self):
        """
        To test the scenario where a valid authenticated trader requests to remove his account
        and removal is resolved before the follow up request
        """
        account_to_delete_id = Account.objects.filter(user=self.trader)[0].id

        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        resp = self.request_remove_account(account_to_delete_id)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 1)

        resp = self.request_remove_account(account_to_delete_id)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 1)
        self.resolve_remove_account()

        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        resp = self.request_remove_account(account_to_delete_id)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'removed'})

        nonexistent_account_set = Account.objects.filter(id=account_to_delete_id)
        self.assertEquals(nonexistent_account_set.count(), 0)
    
    def test_not_a_trader_attempts_to_delete_account(self):
        """
        To test the scenario where a user who isn't a trader tries
        to delete an account
        """
        account_to_delete_id = 1
        no_of_accounts_before_request = Account.objects.all().count()
        resp = self.request_remove_account(account_to_delete_id, valid_authentication=False)
        self.assertEquals(resp.status_code, 401)
        no_of_accounts_after_request = Account.objects.all().count()
        self.assertEquals(no_of_accounts_before_request, no_of_accounts_after_request)

    def test_valid_user_attempts_to_delete_nonexistent_account(self):
        """
        To test the scenario where a trader tries to delete an account
        with an id that doesn't correspond to an existing account in the db
        """
        nonexistent_account_id = 2000000000000000000000000000000000000
        no_of_accounts_before_request = Account.objects.all().count()
        resp = self.request_remove_account(nonexistent_account_id)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'removed'})
        no_of_accounts_after_request = Account.objects.all().count()
        self.assertEquals(no_of_accounts_before_request, no_of_accounts_after_request)

    def test_valid_user_attempts_to_remove_account_that_doesnt_own(self):
        """
        To test the scenario where a trader tries to delete an account
        with an id that doesn't correspond to an account he/she owns
        """
        account_id_for_other_user = Account.objects.exclude(user=self.trader)[0].id
        no_of_accounts_before_request = Account.objects.all().count()
        resp = self.request_remove_account(account_id_for_other_user)
        self.assertEquals(resp.status_code, 401)
        no_of_accounts_after_request = Account.objects.all().count()
        self.assertEquals(no_of_accounts_before_request, no_of_accounts_after_request)

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_unknown_error')
    def test_mtapi_throws_unknown_error(self):
        """
        To test the scenario where the MA server returns an error
        Only unknown errors are considered because I don't know what other errors
        to consider
        """
        account_to_delete_id = Account.objects.filter(user=self.trader)[0].id
        no_of_accounts_before_request = Account.objects.all().count()

        self.assertEquals(RemoveAccountError.objects.all().count(), 0)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        resp = self.request_remove_account(account_to_delete_id)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 1)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.resolve_remove_account()
        self.assertEquals(RemoveAccountError.objects.all().count(), 1)
        self.assertEquals(UnresolvedRemoveAccount.objects.all().count(), 0)
        resp = self.request_remove_account(account_to_delete_id)

        no_of_accounts_after_request = Account.objects.all().count()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'detail': metaapi.UnknownError.detail})
        self.assertEquals(no_of_accounts_before_request, no_of_accounts_after_request)

    def resolve_remove_account(self):
        django_rq.get_worker().work(burst=True)

    def request_remove_account(self, account_id, valid_authentication=True):
        headers = self.valid_headers if valid_authentication else {}
        return self.client.delete(
            f'/trader/remove-trading-account/{account_id}/',
            **headers
        )