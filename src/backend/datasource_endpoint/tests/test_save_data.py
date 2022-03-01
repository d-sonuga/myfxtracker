from datetime import date, timedelta
import nanoid
from users.models import Trader
from trader.models import Account, Deposit, Trade, Withdrawal
from .base_test import BaseTest
from .test_data import SaveDataTestData


class TestSaveData(BaseTest):
    def setUp(self):
        self.test_data = SaveDataTestData
        trader = Trader.objects.create(
            username='1',
            **self.test_data.trader_details
        )
        self.valid_trader_account = Account.objects.create_account(
            trader,
            self.test_data.account_transaction_data1
        )
        self.valid_ds_username = trader.get_datasource_username()
        self.invalid_ds_username = nanoid.generate()
        trader_with_expired_username = Trader.objects.create(
            username='2',
            **self.test_data.trader_details
        )
        self.expired_trader_account = Account.objects.create_account(
            trader_with_expired_username,
            self.test_data.account_transaction_data2
        )
        expired_date = date.today() - timedelta(days=35)
        trader_with_expired_username.set_next_billing_time(expired_date)
        self.expired_ds_username = trader_with_expired_username.get_datasource_username()
        self.test_data = self.test_data
    
    def test_with_valid_ds_username(self):
        no_of_initial_trades, no_of_initial_deposits, no_of_initial_withdrawals = self.count_transaction_types(
            self.test_data.account_transaction_data1
        )
        no_of_new_trades, no_of_new_deposits, no_of_new_withdrawals = self.count_transaction_types(
            self.test_data.new_data
        )
        self.assertEquals(self.valid_trader_account.no_of_trades(), no_of_initial_trades)
        resp = self.make_request(self.valid_ds_username, self.test_data.new_data)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(self.valid_trader_account.no_of_trades(), no_of_initial_trades + no_of_new_trades)
        self.assertDictEqual(resp.json(), {
            'no-of-transactions': no_of_initial_trades + no_of_new_trades
                + no_of_initial_deposits + no_of_new_deposits
                + no_of_initial_withdrawals + no_of_new_withdrawals
        })
    
    def test_with_invalid_ds_username(self):
        initial_no_of_trades = Trade.objects.all().count()
        initial_no_of_deposits = Deposit.objects.all().count()
        initial_no_of_withdrawals = Withdrawal.objects.all().count()
        resp = self.make_request(self.invalid_ds_username, self.test_data.new_data)
        self.assertEquals(resp.status_code, 403)
        self.assertDictEqual(resp.json(), {'detail': 'invalid username'})
        self.assertEquals(Trade.objects.all().count(), initial_no_of_trades)
        self.assertEquals(Deposit.objects.all().count(), initial_no_of_deposits)
        self.assertEquals(Withdrawal.objects.all().count(), initial_no_of_withdrawals)
    
    def test_with_expired_ds_username(self):
        no_of_initial_trades, no_of_initial_deposits, no_of_initial_withdrawals = self.count_transaction_types(
            self.test_data.account_transaction_data2
        )
        def assert_data_hasnt_changed():
            self.assertEquals(self.expired_trader_account.no_of_trades(), no_of_initial_trades)
            self.assertEquals(self.expired_trader_account.no_of_deposits(), no_of_initial_deposits)
            self.assertEquals(self.expired_trader_account.no_of_withdrawals(), no_of_initial_withdrawals)
        assert_data_hasnt_changed()
        resp = self.make_request(self.expired_ds_username, self.test_data.new_data)
        self.assertEquals(resp.status_code, 403)
        self.assertDictEqual(resp.json(), {'detail': 'expired username'})
        assert_data_hasnt_changed()

    def make_request(self, ds_username, data):
        return self.client.post('/datasource/save-data/',
            data,
            content_type='application/json',
            headers={'Datasource-Username': ds_username}
        )

    def count_transaction_types(self, transaction_data):
        return (
            self.no_of_trades(transaction_data),
            self.no_of_deposits(transaction_data),
            self.no_of_withdrawals(transaction_data)
        )