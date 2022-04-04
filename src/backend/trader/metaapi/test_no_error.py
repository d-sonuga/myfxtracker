from django.conf import settings
from trader.tests.test_data import AddTradingAccountTestData
from .base_test_api import BaseTestMetaApi


class MainMetaApi(BaseTestMetaApi):
    """
    Test MA api to be used to test a scenario where the server returns
    no errors
    """
    def __init__(self, token):
        self.metatrader_account_api = self
        self.test_data = settings.TEST_DATA if hasattr(settings, 'TEST_DATA') else AddTradingAccountTestData
    
    async def get_account_information(self):
        return self.test_data.good_account_details['account-info']

    async def get_deals_by_time_range(self, start, end):
        return self.test_data.good_account_details['deals']

    async def remove(self, *args, **kwargs):
        pass