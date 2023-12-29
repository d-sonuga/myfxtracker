from django.test import TestCase
from rest_framework.authtoken.models import Token
from .test_data.login_test_data import LoginTestData
from .test_data.init_data_test_data import InitDataTestData
from .test_data.change_account_number_test import ChangeAccountNumberTestData
from trader.tests.test_data import LoginDetails
from users.models import Affiliate, Trader, SubscriptionInfo


class ChangeAccountNumberTests(TestCase):
    def setUp(self) -> None:
        self.affiliate_with_no_account_number = Affiliate.objects.create_affiliate(**LoginTestData.affiliate_details)
        self.affiliate_with_account_number = Affiliate.objects.create_affiliate(**ChangeAccountNumberTestData.affiliate_details_with_account_number)
        self.trader = Trader.objects.create(**LoginDetails.good_details)
        self.affiliate_no_account_number_token = Token.objects.create(user=self.affiliate_with_no_account_number.user).key
        self.affiliate_with_account_number_token = Token.objects.create(user=self.affiliate_with_account_number.user).key
        self.trader_token = Token.objects.create(user=self.trader).key
        self.trader_token_header = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {self.trader_token}'
        }
        self.affiliate_with_account_number_token_header = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {self.affiliate_with_account_number_token}'
        }
        self.affiliate_no_account_number_token_header = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {self.affiliate_no_account_number_token}'
        }
        self.invalid_token_header = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token uhzfoeufjoewi,jizfa'
        }
        self.no_token_header = {
            'Content-Type': 'application/json'
        }

    def test_change_account_number_valid_affiliate(self):
        """
        To test the scenario where an affiliate with no account number requests to change
        an associated bank account number
        """
        old_bank_account_number = self.affiliate_with_no_account_number.bank_account_number
        new_bank_account_number = 64834738927380002
        resp = self.make_request(self.affiliate_no_account_number_token_header, new_bank_account_number)
        self.assertEqual(resp.status_code, 200)
        affiliate = Affiliate.objects.get(id=self.affiliate_with_no_account_number.id)
        self.assertNotEqual(affiliate.bank_account_number, old_bank_account_number)
        self.assertEqual(affiliate.bank_account_number, new_bank_account_number)

    def test_change_account_number_valid_affiliate_big_number(self):
        """
        To test the scenario where an affiliate with requests to change his account number to
        a very big one
        """
        old_bank_account_number = self.affiliate_with_no_account_number.bank_account_number
        new_bank_account_number = 648347389273800024364328664873648726483673
        resp = self.make_request(self.affiliate_no_account_number_token_header, new_bank_account_number)
        self.assertEqual(resp.status_code, 200)
        affiliate = Affiliate.objects.get(id=self.affiliate_with_no_account_number.id)
        self.assertNotEqual(affiliate.bank_account_number, old_bank_account_number)
        self.assertEqual(affiliate.bank_account_number, new_bank_account_number)

    def test_change_account_number_not_an_affiliate(self):
        """
        To test the scenario where a non affiliate makes a request to change a bank account number
        """
        resp = self.make_request(self.trader_token_header, 4327463876738)
        self.assertEqual(resp.status_code, 403)
        self.assertEqual(resp.json(), {'detail': 'You do not have permission to perform this action.'})
    
    def test_change_account_number_invalid_token(self):
        """
        To test the scenario where a request is made to change a bank account number with an invalid token
        """
        resp = self.make_request(self.invalid_token_header, 4327463876738)
        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.json(), {'detail': 'Invalid token.'})

    def test_change_account_number_not_an_affiliate(self):
        """
        To test the scenario where a request is made to change a bank account number
        with no token
        """
        resp = self.make_request(self.no_token_header, 4327463876738)
        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.json(), {'detail': 'Authentication credentials were not provided.'})

    def test_change_account_number_no_number(self):
        """
        To test the scenario where a request is made to change a bank account number
        with no number
        """
        old_account_number = self.affiliate_with_account_number.bank_account_number
        resp = self.make_request(self.affiliate_with_account_number_token_header)
        self.assertEqual(resp.status_code, 200)
        affiliate = Affiliate.objects.get(id=self.affiliate_with_account_number.id)
        self.assertEqual(affiliate.bank_account_number, old_account_number)


    def make_request(self, header, new_account_number=None):
        if new_account_number:
            return self.client.post(
                '/aff/change-bank-account-number/',
                {'bank_account_number': new_account_number},
                **header
            )
        return self.client.post(
            '/aff/change-bank-account-number/',
            **header
        )
