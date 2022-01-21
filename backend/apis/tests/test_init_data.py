from django.test import TestCase, tag
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.authtoken.models import Token
from ..models import Trade, Deposit, Withdrawal, Account


class InitDataTest(TestCase):
    """To test the initial data gotten by the main app"""

    def setUp(self):
        self.key = 'xmewhfu4yy9r73098493274983674>{'
        self.user_details = {'email': 'sonugademilade8703@gmail.com'}
        self.user = User.objects.create(**self.user_details)
        self.user.set_password('password')
        self.user.save()
        self.account = Account.objects.create(name='Account 1', user=self.user)
        Token.objects.create(key=self.key, user=self.user)
        date = timezone.now().strftime('%Y-%m-%d')
        Deposit.objects.create(amount=12084.33, account=self.account, date=date)
        Withdrawal.objects.create(amount=12084.33, account=self.account, date=date)
        Trade.objects.create(pair=Trade.pair_choices[0][1], action=Trade.action_choices[1][1], entry_date=date,
                             exit_date=date, risk_reward_ratio=4, profit_loss=43829.50, pips=9, account=self.account)

    @tag('init_data')
    def test_init_data(self):
        headers = {'HTTP_AUTHORIZATION': f'Token {self.key}'}
        resp = self.client.get('/apis/init_data/', content_type='application/json', **headers)
        print(resp)
        print(resp.serialize())
        self.assertTrue(isinstance(resp.json(), list))

