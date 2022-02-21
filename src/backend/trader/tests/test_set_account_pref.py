from django.test import TestCase, tag
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from ..models import Trade, Deposit, Withdrawal, Account


"""
class AddAccount(TestCase):
    def setUp(self):
        self.user1_key = 'xmewhfu4yy9r7309849nxgwfe674>{'
        self.user1 = User.objects.create(**{'username': '234', 'email': 'sonugadede@gmail.com'})
        Token.objects.create(key=self.user1_key, user=self.user1)
        self.headers = {'HTTP_AUTHORIZATION': f'Token {self.user1_key}'}
        self.account_name = 'Account UBA'
        self.account_name1 = 'Account UBA1'

    @tag('add_account')
    def test_set_pref(self):
        response = self.client.post('/trader/add_account/', data={'name': self.account_name, 'amount': 500},
                                    **self.headers)
        self.assertEquals(response.status_code, 201)
        new_account = Account.objects.all()[0]
        self.assertEquals(new_account.name, self.account_name)
        self.assertEquals(new_account.user, self.user1)

        response = self.client.post('/trader/add_account/', data={'name': self.account_name1},
                                    **self.headers)
        self.assertEquals(response.status_code, 400)
        self.assertEquals(response.json(), {'amount': 'This field is required'})

        response = self.client.post('/trader/add_account/', data={'amount': 500},
                                    **self.headers)
        self.assertEquals(response.status_code, 400)
        self.assertEquals(response.json(), {'name': ['This field is required.']})
"""
