from django.test import TestCase, tag
from django.contrib.auth.models import User
import datetime
from dateutil import parser
from .const import WEBHOOK_RENEWED
from users.models import PaypalSubscription
# from ..views import update_next_billing_time

"""
class SubscriptionRenewedTest(TestCase):
    def setUp(self):
        self.user_details = {'username': 'the user name', 'password': 'the password'}
        self.user = User.objects.create(username=self.user_details['username'])
        self.user.password = self.user_details['password']
        self.user.save()

        PaypalSubscription.objects.create(
            subscription_id=WEBHOOK_RENEWED['resource']['id'],
            subscription_info=self.user.subscriptioninfo,
            next_billing_time=datetime.date.today(),
            paypal_email=WEBHOOK_RENEWED['resource']['subscriber']['email_address']
        )
        self.user.subscriptioninfo.is_subscribed = True
        self.user.subscriptioninfo.save()

    @tag('subscr_renewed')
    def test_post_subscription_activated(self):
        update_next_billing_time(WEBHOOK_RENEWED)
        user = User.objects.get(username=self.user_details['username'])
        self.assertEquals(
            parser.parse(WEBHOOK_RENEWED['resource']['billing_info']['next_billing_time'].split('T')[0]).year,
            user.subscriptioninfo.last_payed.year
        )
        self.assertEquals(
            parser.parse(WEBHOOK_RENEWED['resource']['billing_info']['next_billing_time'].split('T')[0]).month,
            user.subscriptioninfo.last_payed.month
        )
        self.assertEquals(
            parser.parse(WEBHOOK_RENEWED['resource']['billing_info']['next_billing_time'].split('T')[0]).day,
            user.subscriptioninfo.last_payed.day
        )
"""