from django.test import TestCase, override_settings
from rest_framework.authtoken.models import Token
from trader.models import Account, Preferences
from users.models import Trader
from .test_data import AddTradingAccountTestData


class AddTradingAccountTests(TestCase):
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
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_noerror')
    def test_good_details(self):
        """
        To test the scenario where the user enters proper, well-formed details
        and the MA server doesn't return any errors
        """
        test_account_data = AddTradingAccountTestData.good_account_details
        resp = self.client.post(
            '/trader/add-trading-account/',
            test_account_data['register-details'],
            **self.valid_headers
        )
        self.assertEquals(resp.status_code, 201)
        account_set = Account.objects.filter(user=self.trader)
        self.assertEquals(account_set.count(), 1)
        account = account_set[0]
        pref = Preferences.objects.get(user=self.trader)
        current_account_id = pref.current_account.id if pref.current_account is not None else -1
        self.assert_account_saved_properly(test_account_data, account)
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
                    'accounts': {
                        f'{account.id}': {
                            'name': account.name,
                            'trades': [{
                                'pair': trade.pair,
                                'action': trade.action,
                                'profitLoss': float(trade.profit_loss),
                                'commission': float(trade.commission),
                                'swap': float(trade.swap),
                                'openTime': trade.open_time.isoformat(),
                                'closeTime': trade.close_time.isoformat(),
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
    
    def test_unauthorized_trader(self):
        test_account_data = AddTradingAccountTestData.good_account_details
        
        resp = self.client.post(
            '/trader/add-trading-account/',
            test_account_data['register-details'],
            content_type='application/json'
        )
        self.assertEquals(resp.status_code, 401)

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
    