from django.test import TestCase
from trader.models import get_account_trades, get_account_withdrawals, get_account_deposits


class BaseTest(TestCase):
    def no_of_trades(self, account_data):
        return len(
            self.get_account_trades(account_data.get('account-transactions', []))
        )

    def no_of_deposits(self, account_data):
        return len(
            self.get_account_deposits(account_data.get('account-transactions', []))
        )

    def no_of_withdrawals(self, account_data):
        return len(
            self.get_account_withdrawals(account_data.get('account-transactions', []))
        )

    def get_account_trades(self, transaction_data):
        return get_account_trades(transaction_data)
    
    def get_account_deposits(self, transaction_data):
        return get_account_deposits(transaction_data)

    def get_account_withdrawals(self, transaction_data):
        return get_account_withdrawals(transaction_data)