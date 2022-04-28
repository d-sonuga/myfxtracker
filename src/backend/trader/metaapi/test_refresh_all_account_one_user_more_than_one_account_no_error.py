from trader.tests.test_data import RefreshAllAccountsTestData
from .base_test_api import BaseTestMetaApi


class MainMetaApi(BaseTestMetaApi):
    """
    Test MA api to be used to test a scenario where the server returns
    no errors
    """
    def __init__(self, token):
        self.metatrader_account_api = self
        test_data = RefreshAllAccountsTestData.OneTrader.TraderWithMoreThanOneAccount.data
        self.account_data_set = [account_data for account_data in test_data.values()]
    
    async def get_account(self, account_id):
        for account_data in self.account_data_set:
            if account_id == account_data['new_account_info']['ma_account_id']:
                return TestMTAccount(self, account_id, account_data)
    

class TestMTAccount:
    def __init__(self, test_api: MainMetaApi, id, data):
        self.test_api = test_api
        self.data = data
        self.id = id

    def __getattribute__(self, __name: str):
        try:
            return super().__getattribute__(__name)
        except AttributeError as e:
            test_api = super().__getattribute__('test_api')
            return getattr(test_api, __name)
    
    def get_rpc_connection(self):
        return self
    
    async def get_account_information(self):
        return self.data['new_account_info']
    
    async def get_deals_by_time_range(self, start, end):
        return self.data['new_deals']