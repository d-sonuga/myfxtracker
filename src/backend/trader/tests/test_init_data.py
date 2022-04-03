from django.test import TestCase
from django.utils import timezone
from rest_framework.authtoken.models import Token
from trader.models import Account, Preferences
from users.models import Trader
from .test_data import InitDataTestData
from .test_data import AddTradingAccountTestData
from trader.metaapi import Transaction

"""
Adding last_data_refresh_time to init_data
# What if user triggers a data refresh himself
If time of last updating happened before or on time user added account
    last_data_refresh_time = time user added account
Else If time of last updating happened after user added account
    last_data_refresh_time = last time all data was refreshed
"""

class InitDataTest(TestCase):
    def setUp(self) -> None:
        self.test_data = InitDataTestData
        self.trader_with_no_data = Trader.objects.create(**self.test_data.trader_with_no_data)
        self.trader_with_data = Trader.objects.create(**self.test_data.trader_with_data)
        no_data_token = Token.objects.create(user=self.trader_with_no_data).key
        with_data_token = Token.objects.create(user=self.trader_with_data).key
        self.no_data_headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {no_data_token}'
        }
        self.with_data_headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {with_data_token}'
        }
    
    def test_trader_with_no_data(self):
        resp = self.client.get('/trader/get-init-data/', **self.no_data_headers)
        self.assertEquals(resp.status_code, 200)
        self.assertDictEqual(
            resp.json(),
            {
                'user_data': {
                    'id': self.trader_with_no_data.id,
                    'email': self.trader_with_no_data.email,
                    'is_subscribed': self.trader_with_no_data.is_subscribed,
                    'on_free': self.trader_with_no_data.on_free
                },
                'trade_data': {
                    'current_account_id': -1,
                    'last_data_refresh_time': self.trader_with_no_data.last_data_refresh_time.isoformat().replace('+00:00', 'Z'),
                    'accounts': {}
                }
            }
        )

    def test_trader_with_data_added_account_after_last_general_data_refresh(self):
        """
        To test the scenario where a trader with data requests for his init data
        And this trader's account was added after the last data refresh
        """
        test_data = AddTradingAccountTestData.good_account_details
        account = Account.objects.create_account(
            self.trader_with_data,
            test_data['account-info'],
            *Transaction.from_raw_data(test_data['deals'].copy())
        )
        account.time_added = timezone.now()
        account.save()
        pref = Preferences.objects.get(user=self.trader_with_data)
        pref.current_account = account
        pref.save()
        resp = self.client.get('/trader/get-init-data/', **self.with_data_headers)
        self.assertEquals(resp.status_code, 200)
        self.maxDiff = None
        self.assertDictEqual(
            resp.json(),
            {
                'user_data': {
                    'id': self.trader_with_data.id,
                    'email': self.trader_with_data.email,
                    'is_subscribed': self.trader_with_data.is_subscribed,
                    'on_free': self.trader_with_data.on_free
                },
                'trade_data': {
                    'current_account_id': pref.current_account.id,
                    'last_data_refresh_time': self.trader_with_data.last_data_refresh_time.isoformat().replace('+00:00', 'Z'),
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
            }
        )
    