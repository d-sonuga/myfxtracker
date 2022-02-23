from django.db import IntegrityError, models
from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager
from django.core.mail import mail_admins
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
        traderinfo = TraderInfo.objects.create(
            user=new_trader,
            how_you_heard_about_us=kwargs.get('how_you_heard_about_us', ''),
            trading_time_before_joining=kwargs.get('trading_time_before_joining', '')
        )
        DatasourceUsername.objects.create(traderinfo=traderinfo)
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
        traderinfo = TraderInfo.objects.get(datasourceusername__username=ds_username)
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
            if __name in ('ds_username', 'datasource_username'):
                return traderinfo.datasourceusername.username
            subscriptioninfo = super().__getattribute__('subscriptioninfo')
            try:
                return getattr(traderinfo, __name)
            except AttributeError:
                return getattr(subscriptioninfo, __name)
    
    def delete(self):
        ds_username = self.traderinfo.datasourceusername
        ds_username.traderinfo = None
        ds_username.save()
        super().delete()

    class Meta:
        proxy = True

    
def datasource_username_is_invalid(username):
    ds_username_set = DatasourceUsername.objects.filter(username=username)
    if ds_username_set.count() == 0:
        return True
    return ds_username_set[0].username is None

def datasource_username_is_valid(username):
    return not datasource_username_is_invalid(username)


class TraderInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_feedback_question = models.SmallIntegerField(default=0)
    logins_after_ask = models.SmallIntegerField(null=True)
    # The answer to the question 'How did you hear about us?' asked on sign up
    how_you_heard_about_us = models.TextField()
    # The answer to the question 'How long have you been trading' asked on sign up
    trading_time_before_joining = models.TextField()

    def datasource_username_has_expired(self):
        return self.datasourceusername.has_expired()
    
    def get_datasource_username(self):
        return self.datasourceusername.username
    
    def __getattribute__(self, __name):
        if __name in ('ds_username', 'datasource_username'):
            return super().__getattribute__('datasourceusername')
        return super().__getattribute__(__name)


class DatasourceUsernameManager(models.Manager):
    def create(self, traderinfo):
        username = nanoid.generate()
        try:
            return super().create(username=username, traderinfo=traderinfo)
        except IntegrityError:
            # Integrity errors are thrown for duplicate ds_username
            # just retry until a unique one is generated
            return self.create(traderinfo=traderinfo)


class DatasourceUsername(models.Model):
    traderinfo = models.OneToOneField(TraderInfo, on_delete=models.DO_NOTHING, null=True)
    username = models.CharField(max_length=25, unique=True)

    objects = DatasourceUsernameManager()

    def is_valid(self):
        return self.traderinfo is None
    
    def has_expired(self):
        return self.traderinfo.user.subscriptioninfo.subscription_has_expired()


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


class MailChimpErrorManager(models.Manager):
    def create(self, *args, **kwargs):
        error = super().create(*args, **kwargs)
        mail_admins(
            'A Mailchimp Error',
            f'There was a mailchimp error when performing action {error.action} '
            f'for a user with email address {error.email}'
        )
        return error


class MailChimpError(models.Model):
    """
    To record all instances where any mailchimp mishaps happen
    so they can be resolved later
    """
    actions = (
        ('dellistmem', 'delete_list_member'),
        ('addlistmem', 'add_list_member')
    )
    email = models.CharField(max_length=60)
    action = models.CharField(max_length=20)

    objects = MailChimpErrorManager()