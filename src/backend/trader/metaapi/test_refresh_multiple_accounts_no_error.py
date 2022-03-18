from trader.tests.test_data import RefreshAccountDataTestData
from .base_test_api import BaseTestMetaApi


class MainMetaApi(BaseTestMetaApi):
    """
    Test MA api to be used to test a scenario where the server returns
    no errors
    """
    def __init__(self, token):
        self.metatrader_account_api = self
        self.account_data_set = [
            getattr(RefreshAccountDataTestData.MoreThanOneAccountUserData, attr)
            for attr in dir(RefreshAccountDataTestData.MoreThanOneAccountUserData)
            if attr.startswith('account') and attr.endswith('_data')
        ]
    
    async def get_account(self, account_id):
        for account_data in self.account_data_set:
            if account_id == account_data['new_account_info']['ma_account_id']:
                return TestMTAccount(account_id, account_data)

    async def get_account_information(self):
        return RefreshAccountDataTestData.OneAccountUserData.new_account_info

    async def get_deals_by_time_range(self, start, end):
        return RefreshAccountDataTestData.OneAccountUserData.new_deals
    

class TestMTAccount:
    def __init__(self, id, data):
        self.data = data
        self.id = id
    
    def get_rpc_connection(self):
        return self
    
    async def get_account_information(self):
        return self.data['new_account_info']
    
    async def get_deals_by_time_range(self, start, end):
        return self.data['new_deals']