from ..models import PaypalSubscription
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.test import tag


"""
class SubscribeUserTest(TestCase):
    
    This test is only for the database logic.
    The actual paypal unsubscription has to be tested manually
    
    def setUp(self):
        self.user = User.objects.create(username='3 user name')
        self.user.set_password('pasword')
        self.paypal_subscription_id = 'thepypalsubscriptionid'
        self.request_headers = {
            'HTTP_AUTHORIZATION': f'Token {Token.objects.create(key=",xfjq483rxupq89983qh4", user=self.user)}'
        }
        PaypalSubscription.objects.create(
            subscription_info=self.user.subscriptioninfo, subscription_id=self.paypal_subscription_id
        )
        
    @tag('unsubscr_user')
    def test_unsubscribe_user(self):
        response = self.client.put('/users/unsubscribe_user/', {'payment_method': 'paypal', 
            'subscription_id': self.paypal_subscription_id}, content_type='application/json',
            **self.request_headers)
        self.assertEquals(response.status_code, 200)
        self.assertFalse(self.user.subscriptioninfo.is_subscribed)
        self.assertEquals(
            PaypalSubscription.objects.filter(subscription_info=self.user.subscriptioninfo).count(), 0
        )

"""
