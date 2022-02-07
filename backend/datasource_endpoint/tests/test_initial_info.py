from datetime import date, timedelta
import nanoid
from trader.models import Account
from users.models import User
from .base_test import BaseTest
from .test_data import DatasourceInitialInfoData


class TestInitialInfo(BaseTest):
    def setUp(self):
        self.test_data = DatasourceInitialInfoData
        details_no_transactions = self.test_data.good_details_with_no_transactions['data']
        details_transactions = self.test_data.good_details_with_transactions['data']
        trader_with_no_transactions = User.objects.create_trader(
            username='1',
            **self.test_data.trader_with_no_transaction_details
        )
        trader_with_transactions = User.objects.create_trader(
            username='2',
            **self.test_data.trader_with_transactions_details
        )
        Account.objects.create_account(
            trader_with_transactions,
            self.test_data.good_details_with_transactions['data']
        )
        self.valid_datasource_username_with_no_transactions = trader_with_no_transactions.datasource_username
        self.valid_datasource_username_with_transactions = trader_with_transactions.datasource_username
        # It's not saved in the db, so it's invalid
        self.invalid_datasource_username = nanoid.generate()
        trader_with_expired_ds_username = User.objects.create_trader(
            **self.test_data.trader_with_expired_ds_username_details,
            username='3'
        )
        an_expired_date = date.today() - timedelta(days=40)
        trader_with_expired_ds_username.set_next_billing_time(an_expired_date)
        self.expired_datasource_username = trader_with_expired_ds_username.get_datasource_username()
        self.trader_with_no_transactions_request_body = {
            'account-name': details_no_transactions['account-name'],
            'account-company': details_no_transactions['account-company'],
            'account-login-number': details_no_transactions['account-login-number']
        }
        self.trader_with_transactions_request_body = {
            'account-name': details_transactions['account-name'],
            'account-company': details_transactions['account-company'],
            'account-login-number': details_transactions['account-login-number']
        }
    
    def test_good_data_valid_datasource_username_trader_has_no_transaction(self):
        resp = self.client.post(
            '/datasource/get-initial-info/',
            self.trader_with_no_transactions_request_body,
            headers={'Datasource-Username': self.valid_datasource_username_with_no_transactions}
        )
        self.assertEquals(resp.status_code, 200)
        self.assertDictEqual(resp.json(), {
            'no-of-transactions': 0,
            'account-data-has-been-saved': False
        })

    def test_good_data_valid_datasource_username_trader_has_transaction(self):
        no_of_trades = self.no_of_trades(
            self.test_data.good_details_with_transactions['data']['account-transactions']
        )
        no_of_deposits = self.no_of_deposits(
            self.test_data.good_details_with_transactions['data']['account-transactions']
        )
        no_of_withdrawals = self.no_of_withdrawals(
            self.test_data.good_details_with_transactions['data']['account-transactions']
        )
        resp = self.client.post(
            '/datasource/get-initial-info/',
            self.trader_with_transactions_request_body,
            content_type='application/json',
            headers={'Datasource-Username': self.valid_datasource_username_with_transactions}
        )
        self.assertEquals(resp.status_code, 200)
        self.assertDictEqual(resp.json(), {
            'no-of-transactions': no_of_trades + no_of_deposits + no_of_withdrawals,
            'account-data-has-been-saved': True
        })


    def test_bad_data_datasource_username_not_valid(self):
        resp = self.client.post('/datasource/get-initial-info/',
            headers={'Datasource-Username': self.invalid_datasource_username})
        self.assertEquals(resp.status_code, 403)
        self.assertDictEqual(resp.json(), {'detail': 'invalid username'})

    def test_bad_data_expired_datasource_username(self):
        resp = self.client.post('/datasource/get-initial-info/', 
            headers={'Datasource-Username': self.expired_datasource_username})
        self.assertEquals(resp.status_code, 403)
        self.assertDictEqual(resp.json(), {'detail': 'expired username'})
    