from django.test import TestCase, tag
from users.models import User
from ..models import Affiliate

"""
class AffSignUpTest(TestCase):
    def setUp(self):
        self.data = {
            'username': 'username',
            'password': 'password',
            'paypal_email': 'paypal@pay.com'
        }
        self.bad_data = {
            'username': '',
            'password': '33',
            'paypal_email': '12'
        }


    @tag('aff_sign_up')
    def test_sign_up(self):
        resp = self.client.post(
            '/aff/sign_up/', data=self.data, content_type='application/json'
        )
        user_set = User.objects.filter(username=self.data.get('username'))
        self.assertEquals(resp.status_code, 200)
        self.assertTrue(user_set.count != 0)
        self.assertTrue(Affiliate.objects.filter(user=user_set[0]).count() != 0)


    @tag('aff_bad_sign_up')
    def test_aff_bad_sign_up(self):
        resp = self.client.post(
            '/aff/sign_up/', data=self.bad_data, content_type='application/json'
        )
        self.assertEquals(resp.status_code, 400)
        self.assertTrue('paypal_email' in resp.json())
        self.assertTrue('username' in resp.json())
        self.assertTrue('password' in resp.json())


    @tag('aff_username_exists_sign_up')
    def test_aff_bad_username_sign_up(self):
        User.objects.create(username=self.data.get('username'), email=self.data.get('paypal_email'))
        resp = self.client.post(
            '/aff/sign_up/', data=self.data, content_type='application/json'
        )
        self.assertEquals(resp.status_code, 400)
        self.assertTrue('username' in resp.json())


    @tag('aff_affiliate_already_exists_sign_up')
    def test_aff_affiliate_exists_sign_up(self):
        
        If the data signed up with belongs to an affiliate,
        it can't be used
        
        user = User.objects.create(
            username=self.data.get('username'), email=self.data.get('paypal_email'),
            is_affiliate=True
        )
        Affiliate.objects.create(
            user=user, 
            payment_email=self.data.get('paypal_email'),
            amount_earned=0
        )
        user.save()
        self.assertTrue(Affiliate.objects.filter(user=user).count() == 1)
        resp = self.client.post(
            '/aff/sign_up/', data=self.data, content_type='application/json'
        )
        self.assertEquals(resp.status_code, 400)
        self.assertTrue(Affiliate.objects.filter(user=user).count() == 1)
"""