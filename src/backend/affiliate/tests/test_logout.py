from django.test import TestCase
from rest_framework.authtoken.models import Token
from users.models import Affiliate


class LogoutTest(TestCase):
    def setUp(self):
        aff = Affiliate.objects.create_affiliate(
            username='aff',
            password='password'
        )
        valid_token = Token.objects.create(user=aff.user).key
        self.valid_request_headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {valid_token}'
        }
    
    def test_valid_user_logout(self):
        self.assertEquals(Token.objects.all().count(), 1)
        resp = self.client.delete('/aff/logout/', **self.valid_request_headers)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(Token.objects.all().count(), 0)
    
        