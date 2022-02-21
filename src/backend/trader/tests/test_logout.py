from django.test import TestCase
from rest_framework.authtoken.models import Token
from users.models import Trader


class LogoutTest(TestCase):
    def setUp(self):
        trader = Trader.objects.create(
            email='sonugademilade8703@gmail.com',
            password='password'
        )
        valid_token = Token.objects.create(user=trader).key
        self.valid_request_headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {valid_token}'
        }
    
    def test_valid_user_logout(self):
        self.assertEquals(Token.objects.all().count(), 1)
        resp = self.client.delete('/trader/logout/', **self.valid_request_headers)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(Token.objects.all().count(), 0)
    
        