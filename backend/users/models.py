from django.db import models
from django.contrib.auth.models import User
from affiliate.models import Affiliate


class UserInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_affiliate = models.BooleanField()
    is_trader = models.BooleanField()
    is_admin = models.BooleanField(default=False)
    

class TraderInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_feedback_question = models.SmallIntegerField(default=0)
    logins_after_ask = models.SmallIntegerField(null=True)


class SubscriptionInfo(models.Model):
    PAYMENT_CHOICES = (
        ('pp', 'paypal'),
        ('ps', 'paystack')
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_subscribed = models.BooleanField(default=False)
    referrer = models.OneToOneField(Affiliate, on_delete=models.SET_NULL, default=None, null=True)
    payment_method = models.CharField(choices=PAYMENT_CHOICES, max_length=5, null=True)
    on_free = models.BooleanField(default=True)
    next_billing_time = models.DateField()


class PaypalSubscription(models.Model):
    subscription_info = models.OneToOneField(SubscriptionInfo, on_delete=models.CASCADE)
    subscription_id = models.CharField(max_length=128)
    paypal_email = models.EmailField()
    next_billing_time = models.DateField()


class PaystackSubscription(models.Model):
    subscription_info = models.OneToOneField(SubscriptionInfo, on_delete=models.CASCADE)
    reference = models.CharField(max_length=50)
    customer_code = models.CharField(max_length=50, null=True)
    subscription_code = models.CharField(max_length=50, null=True)
    email_token = models.CharField(max_length=50, null=True)
    next_billing_time = models.DateField(null=True)


def get_payment_method(user):
    if user.subscriptioninfo.payment_method == SubscriptionInfo.PAYMENT_CHOICES[0][0]:
        return 'paypal'
    else:
        return 'paystack'