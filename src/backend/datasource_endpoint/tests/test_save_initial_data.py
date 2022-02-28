from datetime import date, timedelta
import nanoid
from trader.models import Account, Deposit, Trade, Withdrawal, UnknownTransaction, format_time_for_saving_as_transaction_id
from users.models import Trader
from .base_test import BaseTest
from .test_data import SaveInitialDataTestData


class TestSaveInitialData(BaseTest):
    def setUp(self):
        self.test_data = SaveInitialDataTestData
        trader = Trader.objects.create(
            username='1',
            **self.test_data.trader_details
        )
        self.valid_ds_username = trader.get_datasource_username()
        # Unsaved in the database - invalid
        self.invalid_ds_username = nanoid.generate()
        trader_with_expired_ds_username = Trader.objects.create(
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
    
    def test_trader_already_has_an_existing_account(self):
        trader = Trader.objects.create(**self.test_data.trader_with_a_saved_account_details)
        Account.objects.create_account(
            trader,
            self.test_data.saved_account_details_trader_with_a_saved_account['data']
        )
        unsaved_details = self.test_data.unsaved_account_details_trader_with_a_saved_account
        request_body = unsaved_details['data']
        
        resp = self.make_request(trader.ds_username, request_body)

        self.assertEquals(resp.status_code, 200)
        self.assertEquals(resp.json(), {
            'no-of-transactions': unsaved_details['no-of-deposits']
                + unsaved_details['no-of-trades']
                + unsaved_details['no-of-withdrawals']
        })
    
    def test_save_transaction_with_unknown_type(self):
        trader = Trader.objects.create(**self.test_data.trader_with_unknown_transaction_details)
        unsaved_details = self.test_data.account_details_with_unknown_transaction_type
        request_body = unsaved_details['data']

        resp = self.make_request(trader.ds_username, request_body)
        
        account = trader.account_set.all()[0]
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(
            UnknownTransaction.objects.filter(account=account).count(),
            unsaved_details['no-of-unknown']
        )

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
                deposit_id=format_time_for_saving_as_transaction_id(deposit_data['transaction-id'])
            )
            self.assertEquals(deposit_set.count(), 1)
        for withdrawal_data in self.get_account_withdrawals(initial_data['account-transactions']):
            withdrawal_set = Withdrawal.objects.filter(
                account=account,
                withdrawal_id=format_time_for_saving_as_transaction_id(withdrawal_data['transaction-id'])
            )
            self.assertEquals(withdrawal_set.count(), 1)
            