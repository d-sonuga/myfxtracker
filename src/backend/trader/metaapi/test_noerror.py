from typing import Tuple, List, Union
from trader.tests.test_data import AddTradingAccountTestData


class MainMetaApi:
    """
    Test MA api to be used to test a scenario where the server returns
    no errors
    """
    def __init__(self, token):
        self.metatrader_account_api = self
    
    @property
    def id(self):
        return 'dummyaccountid'

    async def create_account(self, account):
        return self
    
    async def get_account(self, account_id):
        return self
    
    async def get_rpc_connection(self):
        return self
    
    async def get_account_information(self):
        return AddTradingAccountTestData.good_account_details['account-info']

    async def get_deals_by_time_range(self, start, end):
        return AddTradingAccountTestData.good_account_details['deals']