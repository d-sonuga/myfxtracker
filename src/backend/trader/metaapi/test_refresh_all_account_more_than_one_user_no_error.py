from trader.tests.test_data import RefreshAllAccountsTestData
from .base_test_api import BaseTestMetaApi


class MainMetaApi(BaseTestMetaApi):
    """
    Test MA api to be used to test a scenario where the server returns
    no errors
    """
    def __init__(self, token):
        self.metatrader_account_api = self
        test_data = RefreshAllAccountsTestData.MoreThanOneUser
        self.account_data_set = []
        for attr in dir(test_data):
            if attr.startswith('user') and attr.endswith('details'):
                user_data = getattr(test_data, attr)
                for account_data in user_data['data'].values():
                    self.account_data_set.append(account_data)
    
    async def get_account(self, account_id):
        for account_data in self.account_data_set:
            if account_id == account_data['new_account_info']['ma_account_id']:
                return TestMTAccount(account_id, account_data)
    

class TestMTAccount:
    def __init__(self, id, data):
        self.data = data
        self.id = id
    
    async def get_rpc_connection(self):
        return self
    
    async def get_account_information(self):
        return self.data['new_account_info']
    
    async def get_deals_by_time_range(self, start, end):
        return self.data['new_deals']