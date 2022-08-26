from django.test import TestCase
from pyparsing import CharsNotIn
from rest_framework.authtoken.models import Token
from .test_data.login_test_data import LoginTestData
from .test_data.init_data_test_data import InitDataTestData
from .test_data.change_account_number_test import ChangeAccountNumberTestData
from trader.tests.test_data import LoginDetails
from users.models import Affiliate, Trader, SubscriptionInfo


class ChangeAccountNameTests(TestCase):
    def setUp(self) -> None:
        self.affiliate_with_no_account_name = Affiliate.objects.create_affiliate(**LoginTestData.affiliate_details)
        self.affiliate_with_account_name = Affiliate.objects.create_affiliate(**ChangeAccountNumberTestData.affiliate_details_with_account_name)
        self.trader = Trader.objects.create(**LoginDetails.good_details)
        self.affiliate_no_account_name_token = Token.objects.create(user=self.affiliate_with_no_account_name.user).key
        self.affiliate_with_account_name_token = Token.objects.create(user=self.affiliate_with_account_name.user).key
        self.trader_token = Token.objects.create(user=self.trader).key
        self.trader_token_header = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {self.trader_token}'
        }
        self.affiliate_with_account_name_token_header = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {self.affiliate_with_account_name_token}'
        }
        self.affiliate_no_account_name_token_header = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {self.affiliate_no_account_name_token}'
        }
        self.invalid_token_header = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token uhzfoeufjoewi,jizfa'
        }
        self.no_token_header = {
            'Content-Type': 'application/json'
        }

    def test_change_account_name_valid_affiliate(self):
        """
        To test the scenario where an affiliate with no account name requests to change
        an associated bank account name
        """
        old_bank_account_name = self.affiliate_with_no_account_name.bank_account_name
        new_bank_account_name = 'TheAccount'
        resp = self.make_request(self.affiliate_no_account_name_token_header, new_bank_account_name)
        self.assertEqual(resp.status_code, 200)
        affiliate = Affiliate.objects.get(id=self.affiliate_with_no_account_name.id)
        self.assertNotEqual(affiliate.bank_account_name, old_bank_account_name)
        self.assertEqual(affiliate.bank_account_name, new_bank_account_name)

    def test_change_account_name_not_an_affiliate(self):
        """
        To test the scenario where a non affiliate makes a request to change a bank account name
        """
        resp = self.make_request(self.trader_token_header, 'The Name')
        self.assertEqual(resp.status_code, 403)
        self.assertEqual(resp.json(), {'detail': 'You do not have permission to perform this action.'})
    
    def test_change_account_name_invalid_token(self):
        """
        To test the scenario where a request is made to change a bank account name with an invalid token
        """
        resp = self.make_request(self.invalid_token_header, 'The Name')
        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.json(), {'detail': 'Invalid token.'})

    def test_change_account_name_not_an_affiliate(self):
        """
        To test the scenario where a request is made to change a bank account name
        with no token
        """
        resp = self.make_request(self.no_token_header, 'The Name')
        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.json(), {'detail': 'Authentication credentials were not provided.'})

    def test_change_account_name_no_name(self):
        """
        To test the scenario where a request is made to change a bank account name
        with no name
        """
        old_account_name = self.affiliate_with_account_name.bank_account_name
        resp = self.make_request(self.affiliate_with_account_name_token_header)
        self.assertEqual(resp.status_code, 200)
        affiliate = Affiliate.objects.get(id=self.affiliate_with_account_name.id)
        self.assertEqual(affiliate.bank_account_name, old_account_name)


    def make_request(self, header, new_account_number=None):
        if new_account_number:
            return self.client.post(
                '/aff/change-bank-account-name/',
                {'bank_account_name': new_account_number},
                **header
            )

        return self.client.post(
            '/aff/change-bank-account-name/',
            **header
        )

