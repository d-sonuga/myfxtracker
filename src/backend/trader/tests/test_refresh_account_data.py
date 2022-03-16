from cgi import test
from django.test import TestCase, override_settings
from rest_framework.authtoken.models import Token
from trader.metaapi.main import Transaction
from users.models import Trader
from trader.models import Account, Preferences, Trade, Withdrawal
from trader import metaapi
from typing import List
from copy import deepcopy
from .test_add_trading_account import test_mtapi_error
from .test_data import RefreshAccountDataTestData, SignUpDetails


class RefreshAccountDataTests(TestCase):
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
        for deal in test_data.new_deals:
            deal['id'] = str(int(deal['id']) * 5)
            if deal.get('orderId'):
                deal['orderId'] = str(int(deal['orderId']) * 5)
            if deal.get('positionId'):
                deal['positionId'] = str(int(deal['positionId']) * 5)
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
        for deal in test_data.account1_data['new_deals']:
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
        for deal in test_data.account2_data['new_deals']:
            deal['id'] = str(int(deal['id']) * 5)
            if deal.get('orderId'):
                deal['orderId'] = str(int(deal['orderId']) * 5)
            if deal.get('positionId'):
                deal['positionId'] = str(int(deal['positionId']) * 5)
        return trader, valid_headers
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_refresh_account_no_error')
    def test_valid_trader_refresh_data(self):
        """
        To test the scenario where an authenticated user with 1 account requests a data refresh
        on his account
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
        resp = self.request_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)
        account = Account.objects.get(user=trader)
        self.assert_account_data_updated(account, test_data, prev_account_state)
        pref_current_account = Preferences.objects.get(user=trader).current_account
        current_account_id = pref_current_account.id if pref_current_account is not None else -1
        self.assertEquals(resp.json(), {
                'user_data': {
                    'id': trader.id,
                    'email': trader.email,
                    'is_subscribed': trader.is_subscribed,
                    'on_free': trader.on_free,
                },
                'trade_data': {
                    'current_account_id': current_account_id,
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
        a data refresh on his account
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
        resp = self.request_refresh(**valid_headers)
        self.assertEquals(resp.status_code, 200)
        accounts = Account.objects.filter(user=trader)
        per_account_test_data = [test_data.account1_data, test_data.account2_data]
        self.assert_accounts_updated(accounts, per_account_test_data, prev_account_states)
        pref_current_account = Preferences.objects.get(user=trader).current_account
        current_account_id = pref_current_account.id if pref_current_account is not None else -1
        self.assertEquals(resp.json(), {
                'user_data': {
                    'id': trader.id,
                    'email': trader.email,
                    'is_subscribed': trader.is_subscribed,
                    'on_free': trader.on_free,
                },
                'trade_data': {
                    'current_account_id': current_account_id,
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
        _, headers = self.setup_trader_with_one_account()
        resp = self.request_refresh(**headers)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'detail': metaapi.UnknownError.detail})

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

    def request_refresh(self, *args, **kwargs):
        return self.client.get('/trader/refresh-data/', *args, **kwargs)
    """
    Refresh
    -   Makes request to MetaApi guys and gets deals that have been done after the last saved deal
    -   Makes request to get account information
    -   Handles errors
    Cases
    1.  User is valid trader and user wants to refresh
    2.  User is invalid and user doesn't want to refresh
    """