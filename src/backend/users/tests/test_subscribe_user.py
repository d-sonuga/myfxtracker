from datetime import datetime
# from ..models import PaypalSubscription
from django.test import TestCase, tag
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from dateutil import parser

"""

class SubscribeUserTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='the user name')
        self.user.set_password('password')
        self.paypal_subscription_id = 'thepaypalsubscriptionid'
        self.next_billing_time = '2021-10-02T08:27:18Z'
        self.paypal_email = 'paypalemail@mail.com'
        self.request_headers = {
            'HTTP_AUTHORIZATION': f'Token {Token.objects.create(key=",xfjq483rxupq89983qh4", user=self.user)}'
        }
        
    @tag('subscr_user')
    def test_subscribe_user(self):
        response = self.client.post('/users/subscribe_user/', {'payment_method': 'paypal', 
            'subscription_id': self.paypal_subscription_id,
            'paypal_email': self.paypal_email, 'next_billing_time': self.next_billing_time},
            content_type='application/json',
            **self.request_headers)
        user = User.objects.get(username=self.user.username)
        paypal_subscription = PaypalSubscription.objects.get(subscription_info=user.subscriptioninfo)
        self.assertEquals(response.status_code, 200)
        self.assertTrue(user.subscriptioninfo.is_subscribed)
        self.assertEquals(user.subscriptioninfo.payment_method, 'pp')
        self.assertEquals(paypal_subscription.subscription_id, self.paypal_subscription_id)
        #self.assertEquals(paypal_subscription.next_billing_time, )
        self.assertEquals(paypal_subscription.paypal_email, self.paypal_email)

"""
