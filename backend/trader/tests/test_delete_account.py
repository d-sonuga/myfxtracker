from django.conf import settings
from django.test import TestCase, override_settings
from rest_framework.authtoken.models import Token
from users.models import Trader


@override_settings(DEBUG=True)
class DeleteAccountTest(TestCase):
    def setUp(self) -> None:
        trader = Trader.objects.create(
            email='sonugademilade8703@gmail.com',
            password='password'
        )
        trader_token = Token.objects.create(user=trader).key
        self.valid_headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {trader_token}'
        }

    def test_valid_account_delete(self):
        self.assertEquals(Trader.objects.all().count(), 1)
        resp = self.client.delete('/trader/delete-account/', **self.valid_headers)
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(Trader.objects.all().count(), 0)