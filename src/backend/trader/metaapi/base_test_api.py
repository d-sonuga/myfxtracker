from abc import abstractmethod
from typing import Tuple, List, Union
from trader.tests.test_data import AddTradingAccountTestData


class BaseTestMetaApi:
    """
    Base Test MA api to be used to test scenarios where the server returns
    predetermined values/errors
    """
    def __init__(self, token):
        self.metatrader_account_api = self
    
    @property
    def id(self):
        return AddTradingAccountTestData.good_account_details['account-info']['ma_account_id']

    async def create_account(self, account):
        return self
    
    async def get_account(self, account_id):
        return self
    
    def get_rpc_connection(self):
        return self
    
    @abstractmethod
    async def get_account_information(self):
        pass

    @abstractmethod
    async def get_deals_by_time_range(self, start, end):
        pass
    
    async def connect(self):
        pass