from django.conf import settings
from django.test import TestCase
from importlib_metadata import os
from users.models import Trader
from .test_data import SignUpDetails
from allauth.account.models import EmailAddress
from rest_framework.authtoken.models import Token


class EADownload(TestCase):
    def setUp(self):
        self.test_data = SignUpDetails.good_details
        trader = Trader.objects.create(**self.test_data, password=self.test_data['password1'])
        EmailAddress.objects.create(user=trader, email=self.test_data['email'], verified=True, primary=True)
        self.headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {Token.objects.create(user=trader, key=Token.generate_key()).key}'
        }

    def test_mt4_ea_download(self):
        resp = self.client.get('/trader/download_ea/?variant=mt4', **self.headers)
        mt4 = self.openfile('MyFxTracker.ex4')
        mt5 = self.openfile('MyFxTracker.ex5')
        self.assertEquals(resp.content, mt4)
        self.assertNotEquals(resp.content, mt5)

    def test_mt5_ea_download(self):
        resp = self.client.get('/trader/download_ea/?variant=mt5', **self.headers)
        mt5 = self.openfile('MyFxTracker.ex5')
        mt4 = self.openfile('MyFxTracker.ex4')
        self.assertEquals(resp.content, mt5)
        self.assertNotEquals(resp.content, mt4)
        
    
    def openfile(self, name):
        with open(os.path.join(settings.BASE_DIR, 'trader', 'expert_advisors', name), 'rb') as f:
            return f.read()