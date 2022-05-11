from datetime import timedelta
from django.test import TestCase, override_settings
from django.test.utils import TestContextDecorator
from django.utils import timezone
from django.conf import settings
import django_rq
from itsdangerous import base64_decode
from rest_framework.authtoken.models import Token
from trader.metaapi.main import Transaction
from trader.models import (
    Account, Deposit, Preferences, MetaApiError, Trade,
    UnknownTransaction, Withdrawal, UnresolvedAddAccount, AddAccountError
)
from users.models import Trader
from trader import metaapi
from .test_data import AddTradingAccountRegisterDetails, AddTradingAccountTestData, SignUpDetails


"""
When a user requests to add a new account, the request is placed on a queue
A response of 'pending' is returned
The user makes a request to see if it's resolved every few seconds
If it's resolved, an init data payload is returned
If it's not resolved, a 'pending' response is returned
If it's resolved with an error, the error is returned

AddAccount endpoint
Request reaches backend
Check if there is error in user details
If there is error
    return error
If there isn't error
    Check if details are in UnresolvedAddAccount
    If they are
        return 'pending' request
    If they are not
        Check if the details are in the database
        If they are
            return error 'account already exists'
        If they are not
            Check if the details are in AddAccountError
            If they are
                retrieve the error and delete it
                return the erorr
            If they are not
            put job on queue
            save details in UnresolvedAddAccount
            return 'pending' response

PendingAddAccount endpoint
Request reaches backend
Check if the details are in UnresolvedAddAccount
If they are
    Return 'pending'
If they aren't
    Check if the details are in the database
    If they are
        Return init data
    If they aren't
        Check if the details are in AddAccountError
            If they are
                Retrieve the error and delete it
                Return the error
            If they aren't
                Return error 'details not found'

Job ends
Remove details of job from UnresolvedAddAccount

What if user's network turns off in the process?
What if user attempts to sign up again with the same details while the other is being created?
"""

from django.test import tag

class test_mtapi_error(TestContextDecorator):
    def __init__(self, no_of_errors=1, **kwargs):
        self.mod_settings = kwargs
        self.no_of_errors = no_of_errors

    def decorate_callable(self, test):
        @override_settings(**self.mod_settings)
        def dec_test(*args, **kwargs):
            # MetaApiErrors before each mtapi test should be 0
            # and they should be 1 after
            user_mtapi_errors = MetaApiError.objects.all().count()
            TestCase().assertEquals(user_mtapi_errors, 0)
            result = test(*args, **kwargs)
            user_mtapi_errors = MetaApiError.objects.all().count()
            TestCase().assertEquals(user_mtapi_errors, self.no_of_errors)
            return result
        return dec_test


class AddTradingAccountTests(TestCase):
    def setUp(self) -> None:
        trader_data = SignUpDetails.good_details
        self.trader = Trader.objects.create(
            email=trader_data['email'],
            password=trader_data['password1']
        )
        trader_token = Token.objects.create(user=self.trader).key
        self.valid_headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {trader_token}'
        }
    
    def tearDown(self) -> None:
        django_rq.get_queue('default').empty()
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_add_account_good_details_mt4_account_resolved_before_pending_request(self):
        """
        To test the scenario where the user with no account enters proper, well-formed details
        of an mt4 account, the MA server doesn't return any errors and the account gets resolved
        before the pending add account request
        """
        test_account_data = AddTradingAccountTestData.good_account_details
        account_details = test_account_data['register-details']
        resp = self.request_add_account(account_details)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {
            'detail': 'pending'
        })
        unresolved_add_account_set = UnresolvedAddAccount.objects.all()
        self.assertEquals(unresolved_add_account_set.count(), 1)
        unresolved_account = unresolved_add_account_set[0]
        self.assertEquals(unresolved_account.user, self.trader)
        self.assertEquals(unresolved_account.name, account_details['name'])
        self.assertEquals(unresolved_account.login, account_details['login'])
        self.assertEquals(unresolved_account.server, account_details['server'])
        self.assertEquals(unresolved_account.platform, account_details['platform'])
        self.assertTrue(unresolved_account.time_added - timezone.now() < timedelta(minutes=1))
        self.assertEquals(unresolved_account.broker_info_name, None)
        self.assertEquals(unresolved_account.broker_info_content, None)
        
        self.resolve_test_account()

        self.assertEquals(UnresolvedAddAccount.objects.all().count(), 0)
        account_set = Account.objects.filter(user=self.trader)
        account = account_set[0]
        self.assert_account_saved_properly(test_account_data, account)
        self.assertEquals(account_set.count(), 1)
        resp = self.request_pending_account(account_details)
        self.assertEquals(resp.status_code, 201)
        pref = Preferences.objects.get(user=self.trader)
        current_account_id = pref.current_account.id if pref.current_account is not None else -1
        self.maxDiff = None
        self.assertEquals(resp.json(), {
                'user_data': {
                    'id': self.trader.id,
                    'email': self.trader.email,
                    'is_subscribed': self.trader.is_subscribed,
                    'on_free': self.trader.on_free,
                },
                'trade_data': {
                    'current_account_id': current_account_id,
                    'last_data_refresh_time': account.time_added.isoformat().replace('+00:00', 'Z'),
                    'accounts': {
                        f'{account.id}': {
                            'name': account.name,
                            'trades': [{
                                'pair': trade.pair,
                                'action': trade.action,
                                'profitLoss': float(trade.profit_loss),
                                'commission': float(trade.commission),
                                'swap': float(trade.swap),
                                'openTime': trade.open_time.isoformat().replace('+00:00', 'Z'),
                                'closeTime': trade.close_time.isoformat().replace('+00:00', 'Z'),
                                'openPrice': float(trade.open_price),
                                'closePrice': float(trade.close_price),
                                'takeProfit': float(trade.take_profit),
                                'stopLoss': float(trade.stop_loss)
                            } for trade in account.get_all_trades()],
                            'deposits': [{
                                'account': account.id,
                                'amount': float(deposit.amount),
                                'time': deposit.time.isoformat().replace('+00:00', 'Z')
                            } for deposit in account.get_all_deposits()],
                            'withdrawals': [{
                                'account': account.id,
                                'amount': float(withdrawal.amount),
                                'time': withdrawal.time.isoformat().replace('+00:00', 'Z')
                            } for withdrawal in account.get_all_withdrawals()]
                        }
                    }
                }
            })

    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_add_account_good_details_broker_info_file(self):
        """
        To test the scenario where the user with no account enters proper, well-formed details
        of an mt4 account and a .srv file, the MA server doesn't return any errors and the
        account gets resolved
        """
        test_account_data = AddTradingAccountTestData.good_account_with_srv_file_details
        account_details = test_account_data['register-details']
        resp = self.request_add_account(account_details)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {
            'detail': 'pending'
        })
        unresolved_add_account_set = UnresolvedAddAccount.objects.all()
        self.assertEquals(unresolved_add_account_set.count(), 1)
        unresolved_account = unresolved_add_account_set[0]
        self.assertEquals(unresolved_account.user, self.trader)
        self.assertEquals(unresolved_account.name, account_details['name'])
        self.assertEquals(unresolved_account.login, account_details['login'])
        self.assertEquals(unresolved_account.server, account_details['server'])
        self.assertEquals(unresolved_account.platform, account_details['platform'])
        self.assertTrue(unresolved_account.time_added - timezone.now() < timedelta(minutes=1))
        self.assertEquals(unresolved_account.broker_info_name, account_details['brokerInfoName'])
        self.assertEquals(
            unresolved_account.broker_info_content.tobytes(),
            base64_decode(account_details['brokerInfoContent'])
        )
        
        self.resolve_test_account()

        self.assertEquals(UnresolvedAddAccount.objects.all().count(), 0)
        account_set = Account.objects.filter(user=self.trader)
        account = account_set[0]
        self.assert_account_saved_properly(test_account_data, account)
        self.assertEquals(account_set.count(), 1)
        resp = self.request_pending_account(account_details)
        self.assertEquals(resp.status_code, 201)
        pref = Preferences.objects.get(user=self.trader)
        current_account_id = pref.current_account.id if pref.current_account is not None else -1
        self.maxDiff = None
        self.assertEquals(resp.json(), {
                'user_data': {
                    'id': self.trader.id,
                    'email': self.trader.email,
                    'is_subscribed': self.trader.is_subscribed,
                    'on_free': self.trader.on_free,
                },
                'trade_data': {
                    'current_account_id': current_account_id,
                    'last_data_refresh_time': account.time_added.isoformat().replace('+00:00', 'Z'),
                    'accounts': {
                        f'{account.id}': {
                            'name': account.name,
                            'trades': [{
                                'pair': trade.pair,
                                'action': trade.action,
                                'profitLoss': float(trade.profit_loss),
                                'commission': float(trade.commission),
                                'swap': float(trade.swap),
                                'openTime': trade.open_time.isoformat().replace('+00:00', 'Z'),
                                'closeTime': trade.close_time.isoformat().replace('+00:00', 'Z'),
                                'openPrice': float(trade.open_price),
                                'closePrice': float(trade.close_price),
                                'takeProfit': float(trade.take_profit),
                                'stopLoss': float(trade.stop_loss)
                            } for trade in account.get_all_trades()],
                            'deposits': [{
                                'account': account.id,
                                'amount': float(deposit.amount),
                                'time': deposit.time.isoformat().replace('+00:00', 'Z')
                            } for deposit in account.get_all_deposits()],
                            'withdrawals': [{
                                'account': account.id,
                                'amount': float(withdrawal.amount),
                                'time': withdrawal.time.isoformat().replace('+00:00', 'Z')
                            } for withdrawal in account.get_all_withdrawals()]
                        }
                    }
                }
            })

    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_add_account_good_details_mt4_account_resolved_after_pending_request(self):
        """
        To test the scenario where the user with no account enters proper, well-formed details
        of an mt4 account, the MA server doesn't return any errors and the account gets resolved
        after the pending add account request
        """
        test_account_data = AddTradingAccountTestData.good_account_details
        account_details = test_account_data['register-details']
        resp = self.request_add_account(account_details)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        unresolved_add_account_set = UnresolvedAddAccount.objects.all()
        self.assertEquals(unresolved_add_account_set.count(), 1)
        unresolved_account = unresolved_add_account_set[0]
        self.assert_unresolved_add_account_saved_properly(unresolved_account, account_details, self.trader)
        
        resp = self.request_pending_account(account_details)
        self.assertEquals(UnresolvedAddAccount.objects.all().count(), 1)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})

        self.resolve_test_account()
        account_set = Account.objects.filter(user=self.trader)
        account = account_set[0]
        self.assert_account_saved_properly(test_account_data, account)
        self.assertEquals(account_set.count(), 1)

        resp = self.request_pending_account(account_details)
        pref = Preferences.objects.get(user=self.trader)
        current_account_id = pref.current_account.id if pref.current_account is not None else -1
        self.maxDiff = None
        self.assertEquals(resp.json(), {
                'user_data': {
                    'id': self.trader.id,
                    'email': self.trader.email,
                    'is_subscribed': self.trader.is_subscribed,
                    'on_free': self.trader.on_free,
                },
                'trade_data': {
                    'current_account_id': current_account_id,
                    'last_data_refresh_time': account.time_added.isoformat().replace('+00:00', 'Z'),
                    'accounts': {
                        f'{account.id}': {
                            'name': account.name,
                            'trades': [{
                                'pair': trade.pair,
                                'action': trade.action,
                                'profitLoss': float(trade.profit_loss),
                                'commission': float(trade.commission),
                                'swap': float(trade.swap),
                                'openTime': trade.open_time.isoformat().replace('+00:00', 'Z'),
                                'closeTime': trade.close_time.isoformat().replace('+00:00', 'Z'),
                                'openPrice': float(trade.open_price),
                                'closePrice': float(trade.close_price),
                                'takeProfit': float(trade.take_profit),
                                'stopLoss': float(trade.stop_loss)
                            } for trade in account.get_all_trades()],
                            'deposits': [{
                                'account': account.id,
                                'amount': float(deposit.amount),
                                'time': deposit.time.isoformat().replace('+00:00', 'Z')
                            } for deposit in account.get_all_deposits()],
                            'withdrawals': [{
                                'account': account.id,
                                'amount': float(withdrawal.amount),
                                'time': withdrawal.time.isoformat().replace('+00:00', 'Z')
                            } for withdrawal in account.get_all_withdrawals()]
                        }
                    }
                }
            })
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error', TEST_DATA=AddTradingAccountTestData.GoodAccountMT5)
    def test_add_account_good_details_mt5_account_resolved_after_pending_request(self):
        """
        To test the scenario where the user with no account enters proper, well-formed details
        of an mt4 account, the MA server doesn't return any errors and the account gets resolved
        after the pending add account request
        """
        test_account_data = AddTradingAccountTestData.GoodAccountMT5.good_account_details
        account_details = test_account_data['register-details']
        resp = self.request_add_account(account_details)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        unresolved_add_account_set = UnresolvedAddAccount.objects.all()
        self.assertEquals(unresolved_add_account_set.count(), 1)
        unresolved_account = unresolved_add_account_set[0]
        self.assert_unresolved_add_account_saved_properly(unresolved_account, account_details, self.trader)
        self.assertEquals(unresolved_account.broker_info_name, None)
        self.assertEquals(unresolved_account.broker_info_content, None)
        
        resp = self.request_pending_account(account_details)
        self.assertEquals(UnresolvedAddAccount.objects.all().count(), 1)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})

        self.resolve_test_account()
        account_set = Account.objects.filter(user=self.trader)
        account = account_set[0]
        self.assert_account_saved_properly(test_account_data, account)
        self.assertEquals(account_set.count(), 1)

        resp = self.request_pending_account(account_details)
        pref = Preferences.objects.get(user=self.trader)
        current_account_id = pref.current_account.id if pref.current_account is not None else -1
        self.maxDiff = None
        self.assertEquals(resp.json(), {
                'user_data': {
                    'id': self.trader.id,
                    'email': self.trader.email,
                    'is_subscribed': self.trader.is_subscribed,
                    'on_free': self.trader.on_free,
                },
                'trade_data': {
                    'current_account_id': current_account_id,
                    'last_data_refresh_time': account.time_added.isoformat().replace('+00:00', 'Z'),
                    'accounts': {
                        f'{account.id}': {
                            'name': account.name,
                            'trades': [{
                                'pair': trade.pair,
                                'action': trade.action,
                                'profitLoss': float(trade.profit_loss),
                                'commission': float(trade.commission),
                                'swap': float(trade.swap),
                                'openTime': trade.open_time.isoformat().replace('+00:00', 'Z'),
                                'closeTime': trade.close_time.isoformat().replace('+00:00', 'Z'),
                                'openPrice': float(trade.open_price),
                                'closePrice': float(trade.close_price),
                                'takeProfit': float(trade.take_profit),
                                'stopLoss': float(trade.stop_loss)
                            } for trade in account.get_all_trades()],
                            'deposits': [{
                                'account': account.id,
                                'amount': float(deposit.amount),
                                'time': deposit.time.isoformat().replace('+00:00', 'Z')
                            } for deposit in account.get_all_deposits()],
                            'withdrawals': [{
                                'account': account.id,
                                'amount': float(withdrawal.amount),
                                'time': withdrawal.time.isoformat().replace('+00:00', 'Z')
                            } for withdrawal in account.get_all_withdrawals()]
                        }
                    }
                }
            })
    
    def test_pending_add_account_request_with_non_existent_details(self):
        """
        To test the scenario where a request with details not previously processed
        by the add account endpoint is sent to the pending add account endpoint
        """
        non_existent_details = {
            'name': 'non existent account',
            'server': 'non existent server',
            'login': 1234,
            'platform': 'mt4'
        }
        resp = self.request_pending_account(non_existent_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'detail': 'account details not found'})

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_srv_not_found_error')
    def test_mtapi_throws_server_not_found_error(self):
        """
        To test the scenario where the MA server returns a server not found error
        """
        test_account_details = AddTradingAccountTestData.good_account_details['register-details']
        resp = self.request_add_account(test_account_details)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        
        self.assertEquals(AddAccountError.objects.all().count(), 0)
        self.resolve_test_account()
        self.assertEquals(AddAccountError.objects.all().count(), 1)

        resp = self.request_pending_account(test_account_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'server': [metaapi.BrokerNotSupportedError.detail]})
        self.assertEquals(AddAccountError.objects.all().count(), 0)

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_user_auth_error')
    def test_mtapi_throws_authentication_error(self):
        """
        To test the scenario where the MA server returns an authentication error
        """
        test_account_details = AddTradingAccountTestData.good_account_details['register-details']
        resp = self.request_add_account(test_account_details)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        
        self.assertEquals(AddAccountError.objects.all().count(), 0)
        self.resolve_test_account()
        self.assertEquals(AddAccountError.objects.all().count(), 1)

        resp = self.request_pending_account(test_account_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'non_field_errors': [metaapi.UserAuthenticationError.detail]})
        self.assertEquals(AddAccountError.objects.all().count(), 0)

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_curr_unavailable_srv_error')
    def test_mtapi_throws_unavailable_error(self):
        """
        To test the scenario where the MA server returns E_SERVER_TIMEZONE error,
        unable to retrieve server settings using provided credentials
        """
        test_account_details = AddTradingAccountTestData.good_account_details['register-details']
        resp = self.request_add_account(test_account_details)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        
        self.assertEquals(AddAccountError.objects.all().count(), 0)
        self.resolve_test_account()
        self.assertEquals(AddAccountError.objects.all().count(), 1)

        resp = self.request_pending_account(test_account_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'non_field_errors': [metaapi.CurrentlyUnavailableError.detail]})
        self.assertEquals(AddAccountError.objects.all().count(), 0)

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_unknown_error')
    def test_mtapi_throws_unknown_error(self):
        """
        To test the scenario where the MA server returns an unknown error
        """
        test_account_details = AddTradingAccountTestData.good_account_details['register-details']
        resp = self.request_add_account(test_account_details)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        
        self.assertEquals(AddAccountError.objects.all().count(), 0)
        self.resolve_test_account()
        self.assertEquals(AddAccountError.objects.all().count(), 1)

        resp = self.request_pending_account(test_account_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'non_field_errors': [metaapi.UnknownError.detail]})
        self.assertEquals(AddAccountError.objects.all().count(), 0)

    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_user_create_account_already_existing(self):
        """
        To test the scenario where a user creates an account that already exists
        """
        test_account_data = AddTradingAccountTestData.good_account_details
        account = self.create_account_and_transactions(test_account_data)
        self.assertEquals(Account.objects.all().count(), 1)
        self.assert_account_transactions_are_only_ones_in_db(account)

        test_account_details = test_account_data['register-details']
        resp = self.request_add_account(test_account_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(Account.objects.all().count(), 1)
        self.assert_account_transactions_are_only_ones_in_db(account)
        self.assertEquals(resp.json(), {'non_field_errors': ['The account already exists.']})
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_create_account_already_being_resolved(self):
        """
        To test the scenario where a user attempts to create an account
        that is already being resolved
        """
        test_account_data = AddTradingAccountTestData.good_account_details
        test_account_details = test_account_data['register-details']
        
        self.assertEquals(UnresolvedAddAccount.objects.all().count(), 0)
        resp = self.request_add_account(test_account_details)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedAddAccount.objects.all().count(), 1)
        resp = self.request_add_account(test_account_details)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedAddAccount.objects.all().count(), 1)
    
    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_unknown_error')
    def test_request_add_account_when_add_account_error_exists_in_db(self):
        """
        To test the scenario where the MA server returns an unknown error
        """
        test_account_details = AddTradingAccountTestData.good_account_details['register-details']
        resp = self.request_add_account(test_account_details)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        
        self.assertEquals(AddAccountError.objects.all().count(), 0)
        self.resolve_test_account()
        self.assertEquals(AddAccountError.objects.all().count(), 1)

        resp = self.request_add_account(test_account_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'non_field_errors': [metaapi.UnknownError.detail]})

    def test_unauthorized_trader_request_add_account(self):
        test_account_data = AddTradingAccountTestData.good_account_details
        details = test_account_data['register-details']
        resp = self.request_add_account(details, headers={})
        self.assertEquals(resp.status_code, 401)

    def test_unauthorized_trader_request_pending_account(self):
        test_account_data = AddTradingAccountTestData.good_account_details
        details = test_account_data['register-details']
        resp = self.request_pending_account(details, headers={})
        self.assertEquals(resp.status_code, 401)

    def test_bad_details_no_name(self):
        """
        To test the scenario where a user tries to add an account
        with no name included
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_no_name
        resp = self.request_add_account(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'name': ['This field is required.']})

    def test_bad_details_empty_name(self):
        """
        To test the scenario where a user tries to add an account
        with a zero length name included
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_no_name
        resp = self.request_add_account(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'name': ['This field is required.']})

    def test_bad_details_no_login(self):
        """
        To test the scenario where a user tries to add an account
        with no login included in the register details
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_no_login
        resp = self.request_add_account(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'login': ['This field is required.']})
    
    def test_bad_details_empty_login(self):
        """
        To test the scenario where a user tries to add an account
        with an empty login
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_empty_login
        resp = self.request_add_account(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'login': ['A valid integer is required.']})

    def test_bad_details_invalid_login(self):
        """
        To test the scenario where a user tries to add an account
        with an empty login
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_invalid_login
        resp = self.request_add_account(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'login': ['A valid login is required.']})

    def test_bad_details_no_password(self):
        """
        To test the scenario where a user tries to add an account
        with no password included
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_no_password
        resp = self.request_add_account(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'password': ['This field is required.']})
    
    def test_bad_details_invalid_password(self):
        """
        To test the scenario where a user tries to add an account
        with a password that couldn't possibly be a valid MT password
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_invalid_password
        resp = self.request_add_account(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'password': ['A valid password is required.']})

    def test_bad_details_no_server(self):
        """
        To test the scenario where a user tries to add an account
        without adding the server field to the details
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_no_server
        resp = self.request_add_account(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'server': ['This field is required.']})
    
    def test_bad_details_empty_server(self):
        """
        To test the scenario where a user tries to add an account
        without adding the server field to the details
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_empty_server
        resp = self.request_add_account(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'server': ['This field may not be blank.']})

    def test_bad_details_no_platform(self):
        """
        To test the scenario where a user tries to add an account
        without adding the platform field to the details
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_no_platform
        resp = self.request_add_account(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'platform': ['This field is required.']})

    def test_bad_details_empty_platform(self):
        """
        To test the scenario where a user tries to add an account with a blank platform field
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_empty_platform
        resp = self.request_add_account(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'platform': ['This field may not be blank.']})
    
    def test_bad_details_invalid_platform(self):
        """
        To test the scenario where a user tries to add an account with a platform that isn't mt4 or 5
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_invalid_platform
        resp = self.request_add_account(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'platform': ['A valid platform is required.']})

    def create_account_and_transactions(self, test_account_data: dict):
        account = Account.objects.create_account(
            self.trader,
            test_account_data['account-info'],
            *Transaction.from_raw_data(test_account_data['deals'])
        )
        return account

    def assert_account_transactions_are_only_ones_in_db(self, account: Account):
        self.assertEquals(Trade.objects.all().count(), account.no_of_trades())
        self.assertEquals(Deposit.objects.all().count(), account.no_of_deposits())
        self.assertEquals(Withdrawal.objects.all().count(), account.no_of_withdrawals())
        self.assertEquals(UnknownTransaction.objects.all().count(), account.no_of_unknown_transactions())


    def assert_account_saved_properly(self, test_account_data: dict, account: Account) -> bool:
        data = test_account_data['account-info']
        self.assertEquals(data['platform'], account.platform)
        self.assertEquals(data['broker'], account.broker)
        self.assertEquals(data['currency'], account.currency)
        self.assertEquals(data['server'], account.server)
        self.assertEquals(data['balance'], account.balance)
        self.assertEquals(data['equity'], account.equity)
        self.assertEquals(data['margin'], account.margin)
        self.assertEquals(data['freeMargin'], account.free_margin)
        self.assertEquals(data['leverage'], account.leverage)
        self.assertEquals(data['name'], account.name)
        self.assertEquals(data['login'], account.login)
        self.assertEquals(data['credit'], account.credit)
        self.assertEquals(data['tradeAllowed'], account.trade_allowed)
        self.assertEquals(data['investorMode'], account.investor_mode)
        self.assertEquals(data['marginMode'], account.margin_mode)
        self.assertEquals(data['type'], account.type)
        self.assertEquals(data['ma_account_id'], account.ma_account_id)
    
    def assert_unresolved_add_account_saved_properly(self, unresolved_account, account_details, trader):
        self.assertEquals(unresolved_account.user, trader)
        self.assertEquals(unresolved_account.name, account_details['name'])
        self.assertEquals(unresolved_account.login, account_details['login'])
        self.assertEquals(unresolved_account.server, account_details['server'])
        self.assertEquals(unresolved_account.platform, account_details['platform'])
        self.assertTrue(unresolved_account.time_added - timezone.now() < timedelta(minutes=1))

    def resolve_test_account(self):
        django_rq.get_worker().work(burst=True)

    def request_add_account(self, data: AddTradingAccountRegisterDetails, headers=None):
        request_headers = headers if headers is not None else self.valid_headers
        return self.client.post(
            '/trader/add-trading-account/',
            data,
            **request_headers
        )

    def request_pending_account(self, data: AddTradingAccountRegisterDetails, headers=None):
        request_headers = headers if headers is not None else self.valid_headers
        return self.client.post(
            '/trader/pending-add-trading-account/',
            data,
            **request_headers
        )