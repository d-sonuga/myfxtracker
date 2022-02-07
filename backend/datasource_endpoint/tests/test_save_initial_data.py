from datetime import date, timedelta
import nanoid
from trader.models import Account, Deposit, Trade, Withdrawal, format_time
from users.models import User
from .base_test import BaseTest
from .test_data import SaveInitialDataTestData


class TestSaveInitialData(BaseTest):
    def setUp(self):
        self.test_data = SaveInitialDataTestData
        trader = User.objects.create_trader(
            username='1',
            **self.test_data.trader_details
        )
        self.valid_ds_username = trader.get_datasource_username()
        # Unsaved in the database - invalid
        self.invalid_ds_username = nanoid.generate()
        trader_with_expired_ds_username = User.objects.create_trader(
            username='2',
            **self.test_data.trader_details
        )
        expired_date = date.today() - timedelta(days=35)
        trader_with_expired_ds_username.set_next_billing_time(expired_date)
        self.expired_ds_username = trader_with_expired_ds_username.get_datasource_username()

    def test_valid_ds_username1(self):
        initial_data = self.test_data.account_transaction_data1
        self.assertEquals(Account.objects.all().count(), 0)
        resp = self.make_request(self.valid_ds_username, initial_data)
        self.assertEquals(resp.status_code, 200)
        self.assertDictEqual(resp.json(), {
            'no-of-transactions': self.no_of_trades(initial_data['account-transactions'])
                + self.no_of_deposits(initial_data['account-transactions'])
                + self.no_of_withdrawals(initial_data['account-transactions'])
        })
        self.assert_account_trade_deposit_withdrawal_data_saved(initial_data)
    
    def test_valid_ds_username2(self):
        initial_data = self.test_data.account_transaction_data2
        self.assertEquals(Account.objects.all().count(), 0)
        resp = self.make_request(self.valid_ds_username, initial_data)
        self.assertEquals(resp.status_code, 200)
        self.assertDictEqual(resp.json(), {
            'no-of-transactions': self.no_of_trades(initial_data['account-transactions'])
                + self.no_of_deposits(initial_data['account-transactions'])
                + self.no_of_withdrawals(initial_data['account-transactions'])
        })
        self.assert_account_trade_deposit_withdrawal_data_saved(initial_data)
    
    def test_invalid_ds_username(self):
        initial_data = self.test_data.account_transaction_data1
        self.assertEquals(Account.objects.all().count(), 0)
        resp = self.make_request(self.invalid_ds_username, initial_data)
        self.assertEquals(resp.status_code, 403)
        self.assertDictEqual(resp.json(), {'detail': 'invalid username'})
        self.assertEquals(Account.objects.all().count(), 0)
    
    def test_invalid_expired_username(self):
        initial_data = self.test_data.account_transaction_data1
        self.assertEquals(Account.objects.all().count(), 0)
        resp = self.make_request(self.expired_ds_username, initial_data)
        self.assertEquals(resp.status_code, 403)
        self.assertDictEqual(resp.json(), {'detail': 'expired username'})
        self.assertEquals(Account.objects.all().count(), 0)
    
    def make_request(self, ds_username, data):
        return self.client.post('/datasource/save-initial-data/',
            data,
            content_type='application/json',
            headers={'Datasource-Username': ds_username}
        )
    
    def assert_account_trade_deposit_withdrawal_data_saved(self, initial_data):
        account = Account.objects.get_by_name_broker_login_no(
            initial_data['account-name'],
            initial_data['account-company'],
            initial_data['account-login-number']
        )
        for trade_data in self.get_account_trades(initial_data['account-transactions']):
            trade_set = Trade.objects.filter(trade_id=trade_data['transaction-id'])
            self.assertEquals(trade_set.count(), 1)
            trade = trade_set[0]
            self.assertTrue(trade.account == account)
        for deposit_data in self.get_account_deposits(initial_data['account-transactions']):
            deposit_set = Deposit.objects.filter(
                account=account,
                deposit_id=deposit_data['transaction-id']
            )
            self.assertEquals(deposit_set.count(), 1)
        for withdrawal_data in self.get_account_withdrawals(initial_data['account-transactions']):
            withdrawal_set = Withdrawal.objects.filter(
                account=account,
                withdrawal_id=withdrawal_data['transaction-id']
            )
            self.assertEquals(withdrawal_set.count(), 1)
            