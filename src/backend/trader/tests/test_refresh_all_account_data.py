from datetime import date, datetime, timedelta
from django.utils import timezone
from django.test import TestCase, override_settings
import django_rq
from trader.views import ERROR_FROM_METAAPI
from trader.metaapi.main import Transaction
from users.models import Trader
from trader.models import Account
from typing import List
from .test_add_trading_account import test_mtapi_error
from .test_data import RefreshAccountDataTestData, RefreshAllAccountsTestData


TEST_REFRESH_ACCOUNT_REQUEST_KEY = '8hriuzehf318u289erfeeflihd'

@override_settings(REFRESH_ACCOUNTS_REQUEST_KEY=TEST_REFRESH_ACCOUNT_REQUEST_KEY)
class RefreshAllAccountDataTests(TestCase):
    def setUp(self) -> None:
        # Redis queue handling resolutions
        self.queue_name = 'low'
    
    def tearDown(self) -> None:
        django_rq.get_queue('low').empty()

    def setup_one_trader_with_one_account(self):
        test_data = RefreshAllAccountsTestData.OneTrader.TraderWithOneAccount
        trader = Trader.objects.create(
            email=test_data.user_details['email'],
            password=test_data.user_details['password']
        )
        Account.objects.create_account(
            trader,
            test_data.original_account_info,
            *Transaction.from_raw_data(test_data.original_deals)
        )
        return trader

    def setup_one_trader_with_more_than_one_account(self):
        test_data = RefreshAllAccountsTestData.OneTrader.TraderWithMoreThanOneAccount
        trader = Trader.objects.create(
            email=test_data.user_details['email'],
            password=test_data.user_details['password']
        )
        for account_data in test_data.data.values():
            Account.objects.create_account(
                trader,
                account_data['original_account_info'],
                *Transaction.from_raw_data(account_data['original_deals'])
            )
        return trader
    
    def setup_traders(self):
        test_data = RefreshAllAccountsTestData.MoreThanOneUser
        traders = []
        for attr in dir(test_data):
            if attr.startswith('user') and attr.endswith('details'):
                user_data = getattr(test_data, attr)
                trader = Trader.objects.create(email=user_data['email'], password=user_data['password'])
                for account_data in user_data['data'].values():
                    Account.objects.create_account(
                        trader,
                        account_data['original_account_info'],
                        *Transaction.from_raw_data(account_data['original_deals'])
                    )
                traders.append(trader)
        return traders
        
    
    @override_settings(META_API_CLASS_MODULE='trader.metaapi.test_refresh_all_account_one_user_no_error')
    def test_one_user_with_one_account(self):
        """
        To test the scenario where there is only 1 user with 1 account
        """
        test_data = RefreshAllAccountsTestData.OneTrader.TraderWithOneAccount
        trader = self.setup_one_trader_with_one_account()
        account = Account.objects.get(user=trader)
        prev_account_state = {
            'no-of-trades': account.no_of_trades(),
            'no-of-deposits': account.no_of_deposits(),
            'no-of-withdrawals': account.no_of_withdrawals(),
            'no-of-unknown-transactions': account.no_of_unknown_transactions()
        }
        refresh_account_time_before_refresh = trader.last_data_refresh_time

        self.request_refresh_all_accounts()
        self.resolve_refresh_accounts()

        trader = Trader.objects.get(id=trader.id)
        refresh_account_time_after_refresh = trader.last_data_refresh_time
        self.assertTrue(refresh_account_time_after_refresh > refresh_account_time_before_refresh)
        self.assertTrue(refresh_account_time_after_refresh - timezone.now() < timedelta(minutes=10))
        account = Account.objects.get(user=trader)
        self.assert_account_data_updated(account, test_data, prev_account_state)
    
    @override_settings(
        META_API_CLASS_MODULE='trader.metaapi.test_refresh_all_account_one_user_more_than_one_account_no_error'
    )
    def test_one_user_with_more_than_one_account(self):
        """
        To test the scenario where there is only 1 user with more than 1 account
        """
        test_data = RefreshAllAccountsTestData.OneTrader.TraderWithMoreThanOneAccount
        trader = self.setup_one_trader_with_more_than_one_account()
        accounts = Account.objects.filter(user=trader)
        prev_account_states = [{
            'no-of-trades': account.no_of_trades(),
            'no-of-deposits': account.no_of_deposits(),
            'no-of-withdrawals': account.no_of_withdrawals(),
            'no-of-unknown-transactions': account.no_of_unknown_transactions()
        } for account in accounts]
        refresh_account_time_before_refresh = trader.last_data_refresh_time

        self.request_refresh_all_accounts()
        self.resolve_refresh_accounts()

        trader = Trader.objects.get(id=trader.id)
        refresh_account_time_after_refresh = trader.last_data_refresh_time
        self.assertTrue(refresh_account_time_after_refresh > refresh_account_time_before_refresh)
        self.assertTrue(refresh_account_time_after_refresh - timezone.now() < timedelta(minutes=10))
        accounts = Account.objects.filter(user=trader)
        self.assert_accounts_updated(accounts, list(test_data.data.values()), prev_account_states)

    @override_settings(
        META_API_CLASS_MODULE='trader.metaapi.test_refresh_all_account_more_than_one_user_no_error'
    )
    def test_more_than_one_user(self):
        """
        To test the scenario where there is more than 1 user
        """
        test_data = RefreshAllAccountsTestData.MoreThanOneUser
        traders = self.setup_traders()
        prev_account_states_per_trader = []
        for trader in traders:
            accounts = Account.objects.filter(user=trader)
            prev_account_states_per_trader.append([{
                'no-of-trades': account.no_of_trades(),
                'no-of-deposits': account.no_of_deposits(),
                'no-of-withdrawals': account.no_of_withdrawals(),
                'no-of-unknown-transactions': account.no_of_unknown_transactions()
            } for account in accounts])
        refresh_account_time_before_refresh_for_all_traders = [trader.last_data_refresh_time for trader in traders]

        self.request_refresh_all_accounts()
        self.resolve_refresh_accounts()

        for i in range(len(traders)):
            trader = Trader.objects.all()[i]
            refresh_account_time_before_refresh = refresh_account_time_before_refresh_for_all_traders[i]
            refresh_account_time_after_refresh = trader.last_data_refresh_time
            self.assertTrue(refresh_account_time_after_refresh > refresh_account_time_before_refresh)
            self.assertTrue(refresh_account_time_after_refresh - timezone.now() < timedelta(minutes=10))
        for i in range(len(traders)):
            trader = Trader.objects.all()[i]
            prev_account_states = prev_account_states_per_trader[i]
            test_data_for_trader = getattr(test_data, f'user{i}_details')['data']
            accounts = Account.objects.filter(user=trader)
            self.assert_accounts_updated(accounts, list(test_data_for_trader.values()), prev_account_states)
        
    @test_mtapi_error(META_API_CLASS_MODULE='trader.metaapi.test_refresh_account_data_unknown_error')
    def test_mtapi_throws_unknown_error(self):
        """
        To test the scenario where the MA server returns an error
        Only unknown errors are considered because I don't know what other errors
        to consider
        """
        trader = self.setup_one_trader_with_one_account()
        refresh_account_time_before_refresh = trader.last_data_refresh_time

        self.request_refresh_all_accounts()
        self.resolve_refresh_accounts()

        trader = Trader.objects.get(id=trader.id)
        refresh_account_time_after_refresh = trader.last_data_refresh_time
        self.assertEquals(refresh_account_time_before_refresh, refresh_account_time_after_refresh)

    def assert_accounts_updated(
        self,
        accounts: List[Account],
        test_data_set: List[RefreshAccountDataTestData],
        prev_account_states: List[dict]
    ):
        for i in range(len(accounts)):
            account = accounts[i]
            test_data = test_data_set[i]
            prev_account_state = prev_account_states[i]
            self.assert_account_data_updated(account, test_data, prev_account_state)

    def resolve_refresh_accounts(self):
        django_rq.get_worker(self.queue_name).work(burst=True)

    def assert_account_data_updated(
        self,
        account: Account,
        test_data: RefreshAccountDataTestData,
        prev_account_state
    ):
        if isinstance(test_data, dict):
            class ClassyTestData:
                def __init__(self, test_data):
                    self.data = test_data
                def __getattribute__(self, __name: str):
                    if __name == 'data':
                        return super().__getattribute__(__name)
                    return self.data[__name]
            test_data = ClassyTestData(test_data)
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
    

    def request_refresh_all_accounts(self, valid_authentication=True):
        from trader.scheduled_functions import refresh_all_accounts_data
        queue = django_rq.get_queue('low')
        refresh_all_accounts_data(queue, timezone.now)