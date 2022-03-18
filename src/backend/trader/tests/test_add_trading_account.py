from django.test import TestCase, override_settings
from django.test.utils import TestContextDecorator
from rest_framework.authtoken.models import Token
from trader.metaapi.main import Transaction
from trader.models import Account, Deposit, Preferences, MetaApiError, Trade, UnknownTransaction, Withdrawal
from users.models import Trader
from trader import metaapi
from .test_data import AddTradingAccountRegisterDetails, AddTradingAccountTestData, SignUpDetails



class test_mtapi_error(TestContextDecorator):
    def __init__(self, **kwargs):
        self.mod_settings = kwargs

    def decorate_callable(self, test):
        @override_settings(**self.mod_settings)
        def dec_test(*args, **kwargs):
            # MetaApiErrors before each mtapi test should be 0
            # and they should be 1 after
            user_mtapi_errors = MetaApiError.objects.all().count()
            TestCase().assertEquals(user_mtapi_errors, 0)
            result = test(*args, **kwargs)
            user_mtapi_errors = MetaApiError.objects.all().count()
            TestCase().assertEquals(user_mtapi_errors, 1)
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
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_good_details(self):
        """
        To test the scenario where the user enters proper, well-formed details
        and the MA server doesn't return any errors
        """
        test_account_data = AddTradingAccountTestData.good_account_details
        resp = self.make_request(test_account_data['register-details'])
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
    
    def test_unauthorized_trader(self):
        test_account_data = AddTradingAccountTestData.good_account_details
        
        resp = self.client.post(
            '/trader/add-trading-account/',
            test_account_data['register-details'],
            content_type='application/json'
        )
        self.assertEquals(resp.status_code, 401)

    def test_bad_details_no_name(self):
        """
        To test the scenario where a user tries to add an account
        with no name included
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_no_name
        resp = self.make_request(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'name': ['This field is required.']})

    def test_bad_details_empty_name(self):
        """
        To test the scenario where a user tries to add an account
        with a zero length name included
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_no_name
        resp = self.make_request(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'name': ['This field is required.']})

    def test_bad_details_no_login(self):
        """
        To test the scenario where a user tries to add an account
        with no login included in the register details
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_no_login
        resp = self.make_request(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'login': ['This field is required.']})
    
    def test_bad_details_empty_login(self):
        """
        To test the scenario where a user tries to add an account
        with an empty login
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_empty_login
        resp = self.make_request(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'login': ['A valid integer is required.']})

    def test_bad_details_invalid_login(self):
        """
        To test the scenario where a user tries to add an account
        with an empty login
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_invalid_login
        resp = self.make_request(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'login': ['A valid login is required.']})

    def test_bad_details_no_password(self):
        """
        To test the scenario where a user tries to add an account
        with no password included
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_no_password
        resp = self.make_request(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'password': ['This field is required.']})
    
    def test_bad_details_invalid_password(self):
        """
        To test the scenario where a user tries to add an account
        with a password that couldn't possibly be a valid MT password
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_invalid_password
        resp = self.make_request(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'password': ['A valid password is required.']})

    def test_bad_details_no_server(self):
        """
        To test the scenario where a user tries to add an account
        without adding the server field to the details
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_no_server
        resp = self.make_request(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'server': ['This field is required.']})
    
    def test_bad_details_empty_server(self):
        """
        To test the scenario where a user tries to add an account
        without adding the server field to the details
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_empty_server
        resp = self.make_request(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'server': ['This field may not be blank.']})

    def test_bad_details_no_platform(self):
        """
        To test the scenario where a user tries to add an account
        without adding the platform field to the details
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_no_platform
        resp = self.make_request(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'platform': ['This field is required.']})

    def test_bad_details_empty_platform(self):
        """
        To test the scenario where a user tries to add an account with a blank platform field
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_empty_platform
        resp = self.make_request(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'platform': ['This field may not be blank.']})
    
    def test_bad_details_invalid_platform(self):
        """
        To test the scenario where a user tries to add an account with a platform that isn't mt4 or 5
        """
        test_account_register_details = AddTradingAccountTestData.bad_details_invalid_platform
        resp = self.make_request(test_account_register_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'platform': ['A valid platform is required.']})

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_srv_not_found_error')
    def test_mtapi_throws_server_not_found_error(self):
        """
        To test the scenario where the MA server returns a server not found error
        """
        test_account_details = AddTradingAccountTestData.good_account_details['register-details']
        resp = self.make_request(test_account_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'server': [metaapi.BrokerNotSupportedError.detail]})

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_user_auth_error')
    def test_mtapi_throws_authentication_error(self):
        """
        To test the scenario where the MA server returns an authentication error
        """
        test_account_details = AddTradingAccountTestData.good_account_details['register-details']
        resp = self.make_request(test_account_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'non_field_errors': [metaapi.UserAuthenticationError.detail]})

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_curr_unavailable_srv_error')
    def test_mtapi_throws_unavailable_error(self):
        """
        To test the scenario where the MA server returns E_SERVER_TIMEZONE error,
        unable to retrieve server settings using provided credentials
        """
        test_account_details = AddTradingAccountTestData.good_account_details['register-details']
        resp = self.make_request(test_account_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'non_field_errors': [metaapi.CurrentlyUnavailableError.detail]})

    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_unknown_error')
    def test_mtapi_throws_unknown_error(self):
        """
        To test the scenario where the MA server returns an unknown error
        """
        test_account_details = AddTradingAccountTestData.good_account_details['register-details']
        resp = self.make_request(test_account_details)
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp.json(), {'non_field_errors': [metaapi.UnknownError.detail]})

    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_no_error')
    def test_user_create_account_already_existing(self):
        """
        To the scenario where a user creates an account that already exists
        """
        test_account_data = AddTradingAccountTestData.good_account_details
        account = self.create_account_and_transactions(test_account_data)
        self.assertEquals(Account.objects.all().count(), 1)
        self.assert_account_transactions_are_only_ones_in_db(account)
        resp = self.make_request(test_account_data['register-details'])
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(Account.objects.all().count(), 1)
        self.assert_account_transactions_are_only_ones_in_db(account)
        self.assertEquals(resp.json(), {'non_field_errors': ['The account already exists.']})

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
    
    def make_request(self, data: AddTradingAccountRegisterDetails):
        return self.client.post(
            '/trader/add-trading-account/',
            data,
            **self.valid_headers
        )