from django.test import TestCase
from datetime import date, timedelta
import nanoid
from users.models import User
from trader.models import Account, Trade
from ..models import DatasourceErrors
from .test_data import SaveErrorTestData


class TestSaveError(TestCase):
    def setUp(self):
        self.test_data = SaveErrorTestData
        trader = User.objects.create_trader(
            username='1',
            **self.test_data.trader_details
        )
        self.valid_trader_account = Account.objects.create_account(
            trader,
            self.test_data.account_transaction_data
        )
        self.valid_ds_username = trader.get_datasource_username()
        self.invalid_ds_username = nanoid.generate()
        trader_with_expired_username = User.objects.create_trader(
            username='2',
            **self.test_data.trader_details
        )
        self.expired_trader_account = Account.objects.create_account(
            trader_with_expired_username,
            self.test_data.account_transaction_data
        )
        expired_date = date.today() - timedelta(days=35)
        trader_with_expired_username.set_next_billing_time(expired_date)
        self.expired_ds_username = trader_with_expired_username.get_datasource_username()
    
    def test_with_valid_ds_username(self):
        self.assertEquals(DatasourceErrors.objects.count(), 0)
        resp = self.make_request(self.valid_ds_username, self.test_data.error_data)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(DatasourceErrors.objects.count(), 1)
    
    def test_with_invalid_ds_username(self):
        self.assertEquals(DatasourceErrors.objects.count(), 0)
        resp = self.make_request(self.invalid_ds_username, self.test_data.error_data)
        self.assertEquals(resp.status_code, 403)
        self.assertDictEqual(resp.json(), {'detail': 'invalid username'})
        self.assertEquals(DatasourceErrors.objects.count(), 0)
    
    def test_with_expired_ds_username(self):
        self.assertEquals(DatasourceErrors.objects.count(), 0)
        resp = self.make_request(self.expired_ds_username, self.test_data.error_data)
        self.assertEquals(resp.status_code, 403)
        self.assertDictEqual(resp.json(), {'detail': 'expired username'})
        self.assertEquals(DatasourceErrors.objects.count(), 0)

    def make_request(self, ds_username, data):
        return self.client.post('/datasource/save-error/',
            data,
            content_type='application/json',
            headers={'Datasource-Username': ds_username}
        )