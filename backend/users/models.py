from django.db import IntegrityError, models
from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager
from datetime import datetime, date, timedelta
import nanoid


class TraderManager(DjangoUserManager):
    def create(self, **kwargs):
        new_trader = super().create(
            email=kwargs['email'],
            is_trader=True,
            username=kwargs.get('username', kwargs['email'])
        )
        new_trader.set_password(kwargs['password'])
        TraderInfo.objects.create(
            user=new_trader,
            how_you_heard_about_us=kwargs.get('how_you_heard_about_us', ''),
            trading_time_before_joining=kwargs.get('trading_time_before_joining', '')
        )
        referrer = kwargs.get('referrer')
        if referrer:
            ref = Affiliate.objects.get(user__username=referrer.lower())
            if ref:
                new_trader.set_referrer(ref)    
        # The next billing time will still be updated when the user sets up his/her trader data source
        # Because the free trial doesnt start until after the user activates a data source
        SubscriptionInfo.objects.create(user=new_trader, is_subscribed=False,
            on_free=True, next_billing_time=datetime.today() + timedelta(days=35))
        return new_trader

    def all(self):
        return super().filter(is_trader=True)
    
    def filter(self, *args, **kwargs):
        return super().filter(is_trader=True, *args, **kwargs)

    def get_by_datasource_username(self, ds_username):
        traderinfo = TraderInfo.objects.get(datasource_username=ds_username)
        return traderinfo.user


class UserManager(DjangoUserManager):
    pass


class User(AbstractUser):
    is_affiliate = models.BooleanField(default=False)
    is_trader = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()
    
    def set_password(self, raw_password, save=True):
        super().set_password(raw_password)
        if save:
            self.save()


class Trader(User):
    objects = TraderManager()

    def __getattribute__(self, __name):
        try:
            return super().__getattribute__(__name)
        except AttributeError as e:
            traderinfo = super().__getattribute__('traderinfo')
            subscriptioninfo = super().__getattribute__('subscriptioninfo')
            try:
                return getattr(traderinfo, __name)
            except AttributeError:
                return getattr(subscriptioninfo, __name)

    class Meta:
        proxy = True


class TraderInfoManager(models.Manager):
    def create(self, *args, **kwargs):
        new_traderinfo = super().create(*args, **kwargs)
        self.create_datasource_username(new_traderinfo)
        return new_traderinfo

    def create_datasource_username(self, traderinfo, save=True):
        try:
            traderinfo.datasource_username = nanoid.generate()
            if save:
                traderinfo.save()
        except IntegrityError:
            # retry to generate another username
            self.create_datasource_username(traderinfo, save)


class TraderInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_feedback_question = models.SmallIntegerField(default=0)
    logins_after_ask = models.SmallIntegerField(null=True)
    # new fields not yet added in database
    # The answer to the question 'How did you hear about us?' asked on sign up
    how_you_heard_about_us = models.TextField()
    # The answer to the question 'How long have you been trading' asked on sign up
    trading_time_before_joining = models.TextField()
    datasource_username = models.CharField(max_length=25, unique=True)

    objects = TraderInfoManager()

    def datasource_username_has_expired(self):
        return self.user.subscriptioninfo.subscription_has_expired()
    
    def get_datasource_username(self):
        return self.datasource_username
    
    def __getattribute__(self, __name):
        if __name == 'ds_username':
            return super().__getattribute__('datasource_username')
        return super().__getattribute__(__name)

    
def datasource_username_is_invalid(username):
    return TraderInfo.objects.filter(datasource_username=username).count() == 0

def datasource_username_is_valid(username):
    return TraderInfo.objects.filter(datasource_username=username).count() != 0

class Affiliate(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    payment_email = models.EmailField()
    amount_earned = models.DecimalField(max_digits=10, decimal_places=2)
    next_payout = models.DecimalField(max_digits=10, decimal_places=2)


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

    def subscription_has_expired(self, today=date.today()):
        return self.next_billing_time - today <= timedelta(days=0)

    def set_referrer(self, referrer, save=True):
        self.referrer = referrer
        if save:
            self.save()
    
    def set_next_billing_time(self, date, save=True):
        self.next_billing_time = date
        if save:
            self.save()


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