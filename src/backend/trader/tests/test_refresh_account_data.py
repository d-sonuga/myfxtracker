from ast import Subscript
from datetime import timedelta
from re import A
from django.test import TestCase, override_settings
from django.utils import timezone
from django.conf import settings
import django_rq
from rest_framework.authtoken.models import Token
from trader.metaapi.main import Transaction
from users.models import SubscriptionInfo, Trader
from trader.models import Account, Preferences, UnresolvedRefreshAccount, RefreshAccountError
from trader import metaapi
from typing import List
from copy import deepcopy
from .test_data import RefreshAccountDataTestData, SignUpDetails
from .test_add_trading_account import test_mtapi_error

"""
AUTHORIZATION!!!
When a user requests to refresh account data, the request is placed on a queue
A response of 'pending' is returned
The user makes a request to see if it's resolved every few seconds
If it's resolved, an init data payload is returned
If it's not resolved, a 'pending' response is returned
If it's resolved with an error, the error is returned

RefreshAccount endpoint
Request reaches backend
Check if user has an entry in UnresolvedRefreshAccount
If there is
    return 'pending' request
If there isn't
    Check if user has an entry in RefreshAccountError
    If there is
        delete the error
        return the error
    If there isn't
        put job on queue
        save details in UnresolvedRefreshAccount
        return 'pending' response
    
PendingRefreshAccount endpoint
Request reaches backend
Check if user has an entry in UnresolvedRefreshAccount
If there is
    Return 'pending'
If there isn't
    Check if user has an entry in RefreshAccountError
    If there is
        delete the error
        return the error
    If there isn't
        return data

Job ends
Remove details of job from UnresolvedRefreshAccount

What if user's network turns off in the process?
What if user attempts to sign up again with the same details while the other is being created?
"""

class RefreshAccountDataTests(TestCase):
    def tearDown(self) -> None:
        django_rq.get_queue().empty()

    def setup_trader_with_one_account(self):
        trader_data = SignUpDetails.good_details
        test_data = deepcopy(RefreshAccountDataTestData.OneAccountUserData)
        trader = Trader.objects.create(
            email=trader_data['email'],
            password=trader_data['password1']
        )
        trader_token = Token.objects.create(user=trader).key
        valid_headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {trader_token}'
        }
        Account.objects.create_account(
            trader,
            test_data.original_account_info,
            *Transaction.from_raw_data(test_data.original_deals)
        )
        for deal in test_data.new_deals['deals']:
            deal['id'] = str(int(deal['id']) * 5)
            if deal.get('orderId'):
                deal['orderId'] = str(int(deal['orderId']) * 5)
            if deal.get('positionId'):
                deal['positionId'] = str(int(deal['positionId']) * 5)
        return trader, valid_headers
    
    def setup_trader_with_one_account_and_no_new_data(self):
        trader_data = SignUpDetails.good_details
        test_data = deepcopy(RefreshAccountDataTestData.OneAccountUserDataWithNoNewData)
        trader = Trader.objects.create(
            email=trader_data['email'],
            password=trader_data['password1']
        )
        trader_token = Token.objects.create(user=trader).key
        valid_headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {trader_token}'
        }
        Account.objects.create_account(
            trader,
            test_data.original_account_info,
            *Transaction.from_raw_data(test_data.original_deals)
        )
        return trader, valid_headers

    def setup_trader_with_more_than_one_account(self):
        trader_data = SignUpDetails.good_details
        test_data = deepcopy(RefreshAccountDataTestData.MoreThanOneAccountUserData)
        trader = Trader.objects.create(
            email=trader_data['email'],
            password=trader_data['password1']
        )
        trader_token = Token.objects.create(user=trader).key
        valid_headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {trader_token}'
        }
        Account.objects.create_account(
            trader,
            test_data.account1_data['original_account_info'],
            *Transaction.from_raw_data(test_data.account1_data['original_deals'])
        )
        for deal in test_data.account1_data['new_deals']['deals']:
            deal['id'] = str(int(deal['id']) * 5)
            if deal.get('orderId'):
                deal['orderId'] = str(int(deal['orderId']) * 5)
            if deal.get('positionId'):
                deal['positionId'] = str(int(deal['positionId']) * 5)
        (trade_data, deposit_data, withdrawal_data,
            unknown_transaction_data) = Transaction.from_raw_data(test_data.account2_data['original_deals'])
        for trade in trade_data:
            trade.id = str(int(trade.id) * 3)
            trade.order_id = str(int(trade.order_id) + 1)
            trade.position_id = str(int(trade.position_id) + 1)
        deposit_data = [{**deposit, 'id': str(int(deposit['id']) + 1)} for deposit in deposit_data]
        withdrawal_data = [
            {**withdrawal, 'id': str(int(withdrawal['id']) + 2)}
            for withdrawal in withdrawal_data
        ]
        Account.objects.create_account(
            trader,
            test_data.account2_data['original_account_info'],
            trade_data,
            deposit_data,
            withdrawal_data,
            unknown_transaction_data
        )
        for deal in test_data.account2_data['new_deals']['deals']:
            deal['id'] = str(int(deal['id']) * 5)
            if deal.get('orderId'):
                deal['orderId'] = str(int(deal['orderId']) * 5)
            if deal.get('positionId'):
                deal['positionId'] = str(int(deal['positionId']) * 5)
        return trader, valid_headers
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_refresh_account_no_error')
    def test_valid_trader_refresh_data_refresh_resolved_before_pending_request(self):
        """
        To test the scenario where an authenticated user with 1 account requests a data refresh
        on his account and the request is resolved before the pending request is made
        """
        test_data = RefreshAccountDataTestData.OneAccountUserData
        trader, valid_headers = self.setup_trader_with_one_account()
        account = Account.objects.get(user=trader)
        prev_account_state = {
            'no-of-trades': account.no_of_trades(),
            'no-of-deposits': account.no_of_deposits(),
            'no-of-withdrawals': account.no_of_withdrawals(),
            'no-of-unknown-transactions': account.no_of_unknown_transactions()
        }
        last_data_refresh_time_before_refresh = trader.last_data_refresh_time

        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 0)
        resp = self.request_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 1)

        self.resolve_refresh_account()
        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 0)
        resp = self.request_pending_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)
        
        trader = Trader.objects.get(id=trader.id)
        last_data_refresh_time_after_refresh = trader.last_data_refresh_time
        self.assertTrue(last_data_refresh_time_after_refresh > last_data_refresh_time_before_refresh)
        self.assertTrue(last_data_refresh_time_after_refresh - timezone.now() < timedelta(minutes=10))
        account = Account.objects.get(user=trader)
        self.assert_account_data_updated(account, test_data, prev_account_state)
        pref_current_account = Preferences.objects.get(user=trader).current_account
        days_left_before_free_trial_expires = self.days_left_before_free_trial_expires(trader)
        current_account_id = pref_current_account.id if pref_current_account is not None else -1
        self.assertEquals(resp.json(), {
                'user_data': {
                    'id': trader.id,
                    'email': trader.email,
                    'is_subscribed': trader.is_subscribed,
                    'on_free': trader.on_free,
                    'subscription_plan': self.format_subscription_plan(trader),
                    'days_left_before_free_trial_expires': days_left_before_free_trial_expires
                },
                'trade_data': {
                    'current_account_id': current_account_id,
                    'last_data_refresh_time': trader.last_data_refresh_time.isoformat().replace('+00:00', 'Z'),
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
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_refresh_account_no_error')
    def test_valid_trader_refresh_data_refresh_resolved_after_pending_request(self):
        """
        To test the scenario where an authenticated user with 1 account requests a data refresh
        on his account and the request is resolved after the pending request is made
        """
        test_data = RefreshAccountDataTestData.OneAccountUserData
        trader, valid_headers = self.setup_trader_with_one_account()
        account = Account.objects.get(user=trader)
        prev_account_state = {
            'no-of-trades': account.no_of_trades(),
            'no-of-deposits': account.no_of_deposits(),
            'no-of-withdrawals': account.no_of_withdrawals(),
            'no-of-unknown-transactions': account.no_of_unknown_transactions()
        }
        last_data_refresh_time_before_refresh = trader.last_data_refresh_time

        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 0)
        resp = self.request_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 1)

        resp = self.request_pending_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})

        self.resolve_refresh_account()
        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 0)
        resp = self.request_pending_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)
        
        trader = Trader.objects.get(id=trader.id)
        last_data_refresh_time_after_refresh = trader.last_data_refresh_time
        self.assertTrue(last_data_refresh_time_after_refresh > last_data_refresh_time_before_refresh)
        self.assertTrue(last_data_refresh_time_after_refresh - timezone.now() < timedelta(minutes=10))
        account = Account.objects.get(user=trader)
        self.assert_account_data_updated(account, test_data, prev_account_state)
        pref_current_account = Preferences.objects.get(user=trader).current_account
        current_account_id = pref_current_account.id if pref_current_account is not None else -1
        days_left_before_free_trial_expires = self.days_left_before_free_trial_expires(trader)
        self.assertEquals(resp.json(), {
                'user_data': {
                    'id': trader.id,
                    'email': trader.email,
                    'is_subscribed': trader.is_subscribed,
                    'on_free': trader.on_free,
                    'subscription_plan': self.format_subscription_plan(trader),
                    'days_left_before_free_trial_expires': days_left_before_free_trial_expires
                },
                'trade_data': {
                    'current_account_id': current_account_id,
                    'last_data_refresh_time': trader.last_data_refresh_time.isoformat().replace('+00:00', 'Z'),
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
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_refresh_account_no_error')
    def test_user_attempts_to_refresh_data_when_data_already_being_refreshed(self):
        _, valid_headers = self.setup_trader_with_one_account()

        self.assertEquals(UnresolvedRefreshAccount.objects.all().count(), 0)
        resp = self.request_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRefreshAccount.objects.all().count(), 1)

        resp = self.request_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRefreshAccount.objects.all().count(), 1)
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_refresh_account_no_new_data_no_error')
    def test_valid_trader_refresh_data_with_no_new_data(self):
        """
        To test the scenario where an authenticated user with 1 account requests a data refresh
        on his account and update account is resolved before pending request
        """
        trader, valid_headers = self.setup_trader_with_one_account_and_no_new_data()
        account = Account.objects.get(user=trader)
        prev_account_state = {
            'no-of-trades': account.no_of_trades(),
            'no-of-deposits': account.no_of_deposits(),
            'no-of-withdrawals': account.no_of_withdrawals(),
            'no-of-unknown-transactions': account.no_of_unknown_transactions(),
            'balance': account.balance,
            'equity': account.equity,
            'margin': account.margin,
            'free-margin': account.free_margin,
            'leverage': account.leverage,
            'credit': account.credit,
            'margin-mode': account.margin_mode
        }
        last_data_refresh_time_before_refresh = trader.last_data_refresh_time

        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 0)
        resp = self.request_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 1)

        self.resolve_refresh_account()
        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 0)
        resp = self.request_pending_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)

        trader = Trader.objects.get(id=trader.id)
        last_data_refresh_time_after_refresh = trader.last_data_refresh_time
        self.assertEquals(resp.status_code, 200)
        self.assertTrue(last_data_refresh_time_after_refresh > last_data_refresh_time_before_refresh)
        self.assertTrue(last_data_refresh_time_after_refresh - timezone.now() < timedelta(minutes=10))
        account = Account.objects.get(user=trader)
        self.assert_account_data_didnt_update(account, prev_account_state)
        pref_current_account = Preferences.objects.get(user=trader).current_account
        current_account_id = pref_current_account.id if pref_current_account is not None else -1
        days_left_before_free_trial_expires = self.days_left_before_free_trial_expires(trader)
        self.assertEquals(resp.json(), {
                'user_data': {
                    'id': trader.id,
                    'email': trader.email,
                    'is_subscribed': trader.is_subscribed,
                    'on_free': trader.on_free,
                    'subscription_plan': self.format_subscription_plan(trader),
                    'days_left_before_free_trial_expires': days_left_before_free_trial_expires
                },
                'trade_data': {
                    'current_account_id': current_account_id,
                    'last_data_refresh_time': last_data_refresh_time_after_refresh.isoformat().replace('+00:00', 'Z'),
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

    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_refresh_multiple_accounts_no_error')
    def test_valid_trader_more_than_1_account(self):
        """
        To test the scenario where an authenticated user with more than 1 account requests
        a data refresh on his account and the update account request is resolved before the pending
        request
        """
        test_data = RefreshAccountDataTestData.MoreThanOneAccountUserData
        trader, valid_headers = self.setup_trader_with_more_than_one_account()
        accounts = Account.objects.filter(user=trader)
        prev_account_states = [{
            'no-of-trades': account.no_of_trades(),
            'no-of-deposits': account.no_of_deposits(),
            'no-of-withdrawals': account.no_of_withdrawals(),
            'no-of-unknown-transactions': account.no_of_unknown_transactions()
        } for account in accounts]
        last_data_refresh_time_before_refresh = trader.last_data_refresh_time
        
        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 0)
        resp = self.request_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 1)

        self.resolve_refresh_account()
        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 0)
        resp = self.request_pending_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)

        trader = Trader.objects.get(id=trader.id)
        last_data_refresh_time_after_refresh = trader.last_data_refresh_time
        self.assertEquals(resp.status_code, 200)
        self.assertTrue(last_data_refresh_time_after_refresh > last_data_refresh_time_before_refresh)
        self.assertTrue(last_data_refresh_time_after_refresh - timezone.now() < timedelta(minutes=10))
        self.assertEquals(resp.status_code, 200)
        accounts = Account.objects.filter(user=trader)
        per_account_test_data = [test_data.account1_data, test_data.account2_data]
        self.assert_accounts_updated(accounts, per_account_test_data, prev_account_states)
        pref_current_account = Preferences.objects.get(user=trader).current_account
        current_account_id = pref_current_account.id if pref_current_account is not None else -1
        days_left_before_free_trial_expires = self.days_left_before_free_trial_expires(trader)
        self.assertEquals(resp.json(), {
                'user_data': {
                    'id': trader.id,
                    'email': trader.email,
                    'is_subscribed': trader.is_subscribed,
                    'on_free': trader.on_free,
                    'subscription_plan': self.format_subscription_plan(trader),
                    'days_left_before_free_trial_expires': days_left_before_free_trial_expires
                },
                'trade_data': {
                    'current_account_id': current_account_id,
                    'last_data_refresh_time': trader.last_data_refresh_time.isoformat().replace('+00:00', 'Z'),
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
                        } for account in accounts
                    }
                }
            })

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_refresh_account_data_unknown_error')
    def test_mtapi_throws_unknown_error(self):
        """
        To test the scenario where the MA server returns an error
        Only unknown errors are considered because I don't know what other errors
        to consider
        """
        _, valid_headers = self.setup_trader_with_one_account()

        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 0)
        resp = self.request_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 1)
        self.assertEquals(RefreshAccountError.objects.count(), 0)

        self.resolve_refresh_account()
        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 0)
        self.assertEquals(RefreshAccountError.objects.count(), 1)
        resp = self.request_pending_refresh(**valid_headers)
        self.assertEquals(RefreshAccountError.objects.count(), 0)

        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'detail': metaapi.UnknownError.detail})

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_refresh_account_data_unknown_error')
    def test_request_refresh_account_when_refresh_account_error_exists_in_db(self):
        """
        To test the scenario where a user requests a refresh which returns an error
        then requests a refresh again
        """
        _, valid_headers = self.setup_trader_with_one_account()

        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 0)
        resp = self.request_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {'detail': 'pending'})
        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 1)
        self.assertEquals(RefreshAccountError.objects.count(), 0)

        self.resolve_refresh_account()
        self.assertEquals(UnresolvedRefreshAccount.objects.count(), 0)
        self.assertEquals(RefreshAccountError.objects.count(), 1)
        resp = self.request_refresh(**valid_headers)
        self.assertEquals(RefreshAccountError.objects.count(), 0)

        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'detail': metaapi.UnknownError.detail})
    
    def test_request_refresh_account_unauthorized(self):
        """
        To test the scenario where an unauthorized fellow requests a refresh
        """
        resp = self.request_refresh()
        self.assertEquals(resp.status_code, 401)

    def test_request_refresh_account_unauthorized(self):
        """
        To test the scenario where an unauthorized fellow requests a pending refresh
        """
        resp = self.request_pending_refresh()
        self.assertEquals(resp.status_code, 401)

    def resolve_refresh_account(self):
        django_rq.get_worker().work(burst=True)

    def test_not_a_trader(self):
        resp = self.request_refresh()
        self.assertEquals(resp.status_code, 401)
    
    def assert_accounts_updated(
        self,
        accounts: List[Account],
        test_data_set: List[RefreshAccountDataTestData],
        prev_account_states: List[dict]
    ):
        class ClassyTestData:
            def __init__(self, test_data):
                self.data = test_data
            def __getattribute__(self, __name: str):
                if __name == 'data':
                    return super().__getattribute__(__name)
                return self.data[__name]
        for i in range(len(accounts)):
            account = accounts[i]
            test_data = test_data_set[i]
            prev_account_state = prev_account_states[i]
            self.assert_account_data_updated(account, ClassyTestData(test_data), prev_account_state)
    
    def assert_account_data_updated(
        self,
        account: Account,
        test_data: RefreshAccountDataTestData,
        prev_account_state
    ):
        self.assertEquals(
            account.no_of_trades(),
            test_data.no_of_new_trades + prev_account_state['no-of-trades']
        )
        self.assertEquals(
            account.no_of_deposits(),
            test_data.no_of_new_deposits + prev_account_state['no-of-deposits']
        )
        self.assertEquals(
            account.no_of_withdrawals(),
            test_data.no_of_new_withdrawals + prev_account_state['no-of-withdrawals']
        )
        self.assertEquals(
            account.no_of_unknown_transactions(),
            test_data.no_of_new_unknown_transactions + prev_account_state['no-of-unknown-transactions']
        )
        self.assertEquals(account.balance, test_data.new_account_info['balance'])
        self.assertEquals(account.equity, test_data.new_account_info['equity'])
        self.assertEquals(account.margin, test_data.new_account_info['margin'])
        self.assertEquals(account.free_margin, test_data.new_account_info['freeMargin'])
        self.assertEquals(account.leverage, test_data.new_account_info['leverage'])
        self.assertEquals(account.credit, test_data.new_account_info['credit'])
        self.assertEquals(account.margin_mode, test_data.new_account_info['marginMode'])
    
    def assert_account_data_didnt_update(self, account: Account, prev_account_state):
        self.assertEquals(
            account.no_of_trades(),
            prev_account_state['no-of-trades']
        )
        self.assertEquals(
            account.no_of_deposits(),
            prev_account_state['no-of-deposits']
        )
        self.assertEquals(
            account.no_of_withdrawals(),
            prev_account_state['no-of-withdrawals']
        )
        self.assertEquals(
            account.no_of_unknown_transactions(),
            prev_account_state['no-of-unknown-transactions']
        )
        self.assertEquals(account.balance, prev_account_state['balance'])
        self.assertEquals(account.equity, prev_account_state['equity'])
        self.assertEquals(account.margin, prev_account_state['margin'])
        self.assertEquals(account.free_margin, prev_account_state['free-margin'])
        self.assertEquals(account.leverage, prev_account_state['leverage'])
        self.assertEquals(account.credit, prev_account_state['credit'])
        self.assertEquals(account.margin_mode, prev_account_state['margin-mode'])

    def format_subscription_plan(self, trader: Trader):
        MONTHLY = SubscriptionInfo.MONTHLY
        YEARLY = SubscriptionInfo.YEARLY
        CODE = SubscriptionInfo.CODE
        if not trader.is_subscribed:
            return 'none'
        elif trader.subscription_plan == SubscriptionInfo.PLAN_CHOICES[MONTHLY][CODE]:
            return 'monthly'
        elif trader.subscription_plan == SubscriptionInfo.PLAN_CHOICES[YEARLY][CODE]:
            return 'yearly'
        
    def days_left_before_free_trial_expires(self, trader: Trader):
        day_of_free_trial_over = trader.date_joined + timezone.timedelta(days=settings.FREE_TRIAL_PERIOD)
        days_left_before_free_trial_expires = day_of_free_trial_over - timezone.now()
        if days_left_before_free_trial_expires.days < 0:
            return 0
        return days_left_before_free_trial_expires.days


    def request_refresh(self, *args, **kwargs):
        return self.client.get('/trader/refresh-data/', *args, **kwargs)
    
    def request_pending_refresh(self, *args, **kwargs):
        return self.client.get('/trader/pending-refresh-data/', *args, **kwargs)