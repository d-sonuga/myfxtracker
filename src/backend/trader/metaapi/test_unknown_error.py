from trader.tests.test_data import AddTradingAccountTestData
from .base_test_api import BaseTestMetaApi


class MainMetaApi(BaseTestMetaApi):
    """
    Test MA api to be used to test a scenario where the server returns
    no errors
    """
    def __init__(self, token):
        self.metatrader_account_api = self
    
    async def create_account(self, account):
        raise Exception

    async def get_account_information(self):
        raise Exception

    async def get_deals_by_time_range(self, start, end):
        raise Exception

    async def remove(self):
        raise Exception

    async def redeploy(self):
        raise Exception
    
    async def undeploy(self):
        raise Exception
    
    async def get_account(self, *args, **kwargs):
        return self
