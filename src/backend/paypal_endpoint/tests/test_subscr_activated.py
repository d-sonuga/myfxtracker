from django.test import TestCase
from django.contrib.auth.models import User
from .const import WEBHOOK_ACTIVATED
from users.models import PaypalSubscription
# from ..views import update_paypal_subscription

"""
class SubscriptionActivatedTest(TestCase):
    def setUp(self):
        self.user_details = {'username': 'the user name', 'password': 'the password'}
        self.user = User.objects.create(self.user_details['username'])
        self.user.password = self.user_details['password']
        self.user.save()

        PaypalSubscription.objects.create(
            subscription_id=WEBHOOK_ACTIVATED['resource']['id'],
            subscription_info=self.user.subscriptioninfo
        )
        self.user.subscriptioninfo.is_subscribed = True
        self.user.subscriptioninfo.save()

    def test_post_subscription_activated(self):
        update_paypal_subscription(WEBHOOK_ACTIVATED)
        user = User.objects.get(username=self.details['username'])
        self.assertEquals(
            user.subscriptioninfo.paypalsubscription.paypal_email,
            WEBHOOK_ACTIVATED['resource']['subscriber']['email_address']
        )
"""