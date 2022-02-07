from django.test import TestCase, tag
from users.models import User
from django.utils import timezone
from django.conf import settings
from rest_framework.authtoken.models import Token
from ..models import Trade, Deposit, Withdrawal, Account

"""
class InitDataTest(TestCase):
    To test the weekly reports feature

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

    @tag('weekly_reports_auth')
    def test_weekly_reports_auth(self):
        self.unauth_headers = {
            'HTTP_AUTHORIZATION': f'Token {self.key}',
            'Testing-Auth': 'True'
        }
        self.auth_headers = {
            'HTTP_AUTHORIZATION': f'Token {self.key}',
            'Testing-Auth': 'True',
            'Weekly-Reports-Key': settings.WEEKLY_REPORTS_KEY
        }

        # Test for unauthorized rejections
        resp = self.client.get('/trader/send_weekly_reports/', content_type='application/json',
                **self.unauth_headers)
        self.assertEquals(resp.status_code, 403)
        self.assertEquals(resp.json()['detail'], 'You do not have permission to perform this action.')

        # Test for authorized acceptance
        resp = self.client.get('/trader/send_weekly_reports/', content_type='application/json',
                **self.auth_headers)
        self.assertEquals(resp.status_code, 200)

    @tag('weekly_reports_email')
    def test_weekly_reports_email(self):
        headers = {
            'Weekly-Reports-Key': settings.WEEKLY_REPORTS_KEY
        }
        resp = self.client.get('/trader/send_weekly_reports/', content_type='application/json',
                **headers)
        print(resp.status_code)
        print(resp.serialize())
"""