from datetime import date, timedelta
import nanoid
from trader.models import Account, Trade
from users.models import Trader
from .base_test import BaseTest
from .test_data import DatasourceInitialInfoData


class TestInitialInfo(BaseTest):
    def setUp(self):
        self.test_data = DatasourceInitialInfoData
        details_no_transactions = self.test_data.good_details_with_no_transactions1['data']
        details_transactions = self.test_data.good_details_with_transactions['data']
        trader_with_no_transactions = Trader.objects.create(
            username='1',
            **self.test_data.trader_with_no_transaction_details
        )
        trader_with_transactions = Trader.objects.create(
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
        trader_with_expired_ds_username = Trader.objects.create(
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
        details = self.test_data.good_details_with_transactions
        no_of_trades = self.no_of_trades(details['data'])
        no_of_deposits = self.no_of_deposits(details['data'])
        no_of_withdrawals = self.no_of_withdrawals(details['data'])
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
        self.assertEquals(no_of_trades, details['no-of-trades'])
        self.assertEquals(no_of_withdrawals, details['no-of-withdrawals'])
        self.assertEquals(no_of_deposits, details['no-of-deposits'])
        # None of the commissions or swaps should be saved as a negative number
        newly_saved_trades = Trade.objects.all()
        self.assertTrue(all((trade.commission >= 0 for trade in newly_saved_trades)))
        self.assertTrue(all((trade.swap >= 0 for trade in newly_saved_trades)))

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
    
    def test_trader_with_a_saved_account_current_account_not_saved(self):
        trader_with_saved_account = Trader.objects.create(
            **self.test_data.trader_with_a_saved_account_details
        )
        Account.objects.create_account(
            trader_with_saved_account,
            self.test_data.saved_account_details_trader_with_a_saved_account['data']
        )
        unsaved_details = self.test_data.unsaved_account_details_trader_with_a_saved_account['data']
        unsaved_details_request_body = {
            'account-name': unsaved_details['account-name'],
            'account-company': unsaved_details['account-company'],
            'account-login-number': unsaved_details['account-login-number']
        }

        resp = self.client.post(
            '/datasource/get-initial-info/',
            unsaved_details_request_body,
            headers={'Datasource-Username': trader_with_saved_account.datasource_username}
        )

        self.assertEquals(resp.status_code, 200)
        self.assertDictEqual(resp.json(), {
            'no-of-transactions': 0,
            'account-data-has-been-saved': False
        })
    
    def test_trader_with_2_saved_accounts_current_account_saved(self):
        trader_with_saved_account = Trader.objects.create(
            **self.test_data.trader_with_2_saved_accounts_details
        )
        Account.objects.create_account(
            trader_with_saved_account,
            self.test_data.saved_account_details_trader_with_2_saved_accounts1['data']
        )
        Account.objects.create_account(
            trader_with_saved_account,
            self.test_data.saved_account_details_trader_with_2_saved_accounts2['data']
        )
        self.assertEquals(Account.objects.filter(user=trader_with_saved_account).count(), 2)
        saved_details2 = self.test_data.saved_account_details_trader_with_2_saved_accounts2
        saved_details_request_body = {
            'account-name': saved_details2['data']['account-name'],
            'account-company': saved_details2['data']['account-company'],
            'account-login-number': saved_details2['data']['account-login-number']
        }

        resp = self.client.post(
            '/datasource/get-initial-info/',
            saved_details_request_body,
            headers={'Datasource-Username': trader_with_saved_account.datasource_username}
        )

        self.assertEquals(resp.status_code, 200)
        self.assertDictEqual(resp.json(), {
            'no-of-transactions': saved_details2['no-of-trades'] +
                + saved_details2['no-of-deposits']
                + saved_details2['no-of-withdrawals'],
            'account-data-has-been-saved': True
        })