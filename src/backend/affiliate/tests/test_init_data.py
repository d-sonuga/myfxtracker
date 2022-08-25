from django.test import TestCase
from rest_framework.authtoken.models import Token
from .test_data.login_test_data import LoginTestData
from .test_data.init_data_test_data import InitDataTestData
from trader.tests.test_data import LoginDetails
from users.models import Affiliate, Trader, SubscriptionInfo


class InitDataTests(TestCase):
    def setUp(self) -> None:
        self.affiliate = Affiliate.objects.create_affiliate(**LoginTestData.affiliate_details)
        self.trader = Trader.objects.create(**LoginDetails.good_details)
        self.affiliate_token = Token.objects.create(user=self.affiliate.user).key
        self.trader_token = Token.objects.create(user=self.trader).key
        self.trader_token_header = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {self.trader_token}'
        }
        self.affiliate_token_header = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {self.affiliate_token}'
        }
        self.invalid_token_header = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token uhzfoeufjoewi,jizfa'
        }
        self.no_token_header = {
            'Content-Type': 'application/json'
        }

    def test_init_data_valid_token_no_referred_users(self):
        """
        To test the scenario where an init data request is made with a
        token belonging to a valid affiliate with no referred users
        """
        resp = self.make_request(self.affiliate_token_header)
        self.assertEquals(resp.status_code, 200)
        referred_users_subscription_info = SubscriptionInfo.objects.filter(referrer=self.affiliate)
        referred_users = [si.user for si in referred_users_subscription_info]
        self.assertEqual(resp.json(), {
            'username': self.affiliate.user.username,
            'no_of_sign_ups': len(referred_users),
            'no_of_subscribers': referred_users_subscription_info.filter(is_subscribed=True).count(),
            'bank_account_number': self.affiliate.bank_account_number
        })
    
    def test_init_data_valid_token_some_referred_users(self):
        """
        To test the scenario where an init data request is made with a
        token belonging to a valid affiliate with some referred users
        """
        for details in InitDataTestData.users_details():
            trader = Trader.objects.create(**details)
            trader.subscriptioninfo.referrer = self.affiliate
            trader.subscriptioninfo.save()
        
        resp = self.make_request(self.affiliate_token_header)
        self.assertEquals(resp.status_code, 200)
        referred_users_subscription_info = SubscriptionInfo.objects.filter(referrer=self.affiliate)
        referred_users = [si.user for si in referred_users_subscription_info]
        self.assertEqual(resp.json(), {
            'username': self.affiliate.user.username,
            'no_of_sign_ups': len(referred_users),
            'no_of_subscribers': referred_users_subscription_info.filter(is_subscribed=True).count(),
            'bank_account_number': self.affiliate.bank_account_number
        })
    
    def test_init_data_non_affiliate_token(self):
        """
        To test the scenario where an init data request is made with a token
        belonging to a non affiliate
        """
        resp = self.make_request(self.trader_token_header)
        self.assertEqual(resp.status_code, 403)
        self.assertEqual(resp.json(), {'detail': 'You do not have permission to perform this action.'})

    def test_init_data_invalid_token(self):
        """
        To test the scenario where an init data request is made with
        an invalid token
        """
        resp = self.make_request(self.invalid_token_header)
        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.json(), {'detail': 'Invalid token.'})
    
    def test_init_data_no_token(self):
        """
        To test the scenario where an init data request is made with no token
        """
        resp = self.make_request(self.no_token_header)
        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.json(), {'detail': 'Authentication credentials were not provided.'})

    def make_request(self, header):
        return self.client.get('/aff/get-init-data/', **header)