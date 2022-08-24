from django.test import TestCase
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
    
    def make_request(self, data):
        return self.client.post('/aff/login/', data)