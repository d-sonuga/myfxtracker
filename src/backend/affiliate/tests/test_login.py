from django.test import TestCase
from rest_framework.authtoken.models import Token
from .test_data.login_test_data import LoginTestData
from users.models import Affiliate


class LoginTests(TestCase):
    def test_login_valid_affiliate_details(self):
        """
        To test the case where the affiliate details are associated with
        a valid affiliate in the db
        """
        Affiliate.objects.create_affiliate(**LoginTestData.affiliate_details)
        resp = self.make_request(LoginTestData.affiliate_details)
        self.assertEqual(resp.status_code, 200)
        self.assertIn('key', resp.json())
        user_token_set = Token.objects.filter(key=resp.json()['key'])
        self.assertEqual(user_token_set.count(), 1)
    
    def test_login_invalid_affiliate_details(self):
        """
        To test the case where the affiliate details are not associated with
        a valid affiliate in the db
        """
        resp = self.make_request(LoginTestData.affiliate_details)
        self.assertEqual(resp.status_code, 400)
        self.assertNotIn('key', resp.json())
        self.assertEqual(resp.json(), {'non_field_errors': ['Unable to log in with provided credentials']})

    def test_login_missing_username(self):
        """
        To test the case where the username is missing in the data
        """
        resp = self.make_request(LoginTestData.affiliate_details)
        self.assertEqual(resp.status_code, 400)
        self.assertNotIn('key', resp.json())
        self.assertEqual(resp.json(), {'non_field_errors': ['Unable to log in with provided credentials']})

    def test_login_missing_password(self):
        """
        To test the case where the password is missing in the data
        """
        resp = self.make_request(LoginTestData.affiliate_details)
        self.assertEqual(resp.status_code, 400)
        self.assertNotIn('key', resp.json())
        self.assertEqual(resp.json(), {'non_field_errors': ['Unable to log in with provided credentials']})

    def test_login_missing_username_and_password(self):
        """
        To test the case where the username and password are missing
        """
        resp = self.make_request(LoginTestData.affiliate_details)
        self.assertEqual(resp.status_code, 400)
        self.assertNotIn('key', resp.json())
        self.assertEqual(resp.json(), {'non_field_errors': ['Unable to log in with provided credentials']})

    def make_request(self, data):
        return self.client.post('/aff/login/', data)