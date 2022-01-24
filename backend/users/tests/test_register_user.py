from django.test import TestCase, tag
from django.contrib.auth.models import User
from affiliate.models import Affiliate

"""
Old deprecated tests that were used when adding referrers
To be removed as soon as proper tests are in place
"""

"""
class RegisterUserTest(TestCase):
    def setUp(self):
        aff_username = 'refusername'
        self.data = {
            'email': 'mail@gmail.com',
            'password1': 'password1',
            'password2': 'password1',
            'ref': aff_username
        }
        self.aff_email = 'ref@mail.com'
        ref = User.objects.create(username=aff_username)
        ref.userinfo.is_affiliate = True
        ref.userinfo.save()
        self.ref = Affiliate.objects.create(
            user=ref, amount_earned=0, next_payout=0, payment_email=self.aff_email
        )
        

    @tag('sign_up_ref')
    def test_referrer_is_updated_on_sign_up(self):
        resp = self.client.post('/users/sign-up/', self.data, content_type='application/json')
        self.assertEquals(resp.status_code, 201)
        new_user = User.objects.get(email=self.data.get('email'))
        self.assertEquals(new_user.subscriptioninfo.referrer.id, self.ref.id)
        self.assertTrue(new_user.userinfo.is_trader)
        self.assertFalse(new_user.userinfo.is_affiliate)

    
    @tag('sign_up_trader_aff')
    def test_affiliate_email_doesnt_affect_trader_email(self):
        no_of_traders_with_aff_email = User.objects.filter(
            email=self.aff_email, userinfo__is_trader=True, userinfo__is_affiliate=False
        ).count()
        self.assertTrue(no_of_traders_with_aff_email == 0)
        
        resp = self.client.post(
            '/users/sign-up/', 
            {'email': self.aff_email, 'password1': 'password', 'password2': 'password'},
            content_type='application/json'
        )
        self.assertEquals(resp.status_code, 201)
        no_of_traders_with_aff_email = User.objects.filter(
            email=self.aff_email, userinfo__is_trader=True, userinfo__is_affiliate=False
        ).count()
        self.assertTrue(no_of_traders_with_aff_email == 1)

        resp = self.client.post(
            '/users/sign-up/', 
            {'email': self.aff_email, 'password1': 'password', 'password2': 'password'},
            content_type='application/json'
        )
        self.assertEquals(resp.status_code, 400)
        self.assertTrue(no_of_traders_with_aff_email == 1)
"""