from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from allauth.account.signals import email_confirmed
from django_rest_passwordreset.signals import reset_password_token_created
from mailchimp_marketing import Client
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_delete, post_save
import hashlib
import datetime
from .models import SubscriptionInfo, UserInfo


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': "{}?token={}".format(reverse('password_reset:reset-password-request'), reset_password_token.key),
        'token': reset_password_token.key
    }

    # render email text
    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        # title:
        "Password Reset on {title}".format(title="MyFxJournal"),
        # message:
        email_plaintext_message,
        # from:
        "localhost",
        # to:
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()


@receiver(email_confirmed)
def email_confirmed_(request, email_address, **kwargs):
    if not settings.DEBUG:
        API_KEY = settings.MAILCHIMP_API_KEY
        AUDIENCE_ID = settings.MAILCHIMP_AUDIENCE_ID
        SERVER_PREFIX = settings.MAILCHIMP_SERVER_PREFIX
        mailchimp = Client()

        mailchimp.set_config({
            'api_key': API_KEY,
            'server': SERVER_PREFIX
        })
        member_info = {
            'email_address': email_address.email,
            'status': 'subscribed'
        }
        mailchimp.lists.add_list_member(AUDIENCE_ID, member_info)


@receiver(post_save, sender=User)
def user_account_created(sender, instance, using, **kwargs):
    subscr_query = SubscriptionInfo.objects.filter(user=instance)
    if subscr_query.count() == 0:
        # Todo: handle referrer info
        SubscriptionInfo.objects.create(user=instance, is_subscribed=False,
            on_free=True, next_billing_time=datetime.datetime.today() + datetime.timedelta(days=35))
        UserInfo.objects.create(user=instance, is_trader=False, is_affiliate=False)


@receiver(post_delete, sender=User)
def user_account_deleted(sender, instance, using, **kwargs):
    if not settings.DEBUG:
        API_KEY = settings.MAILCHIMP_API_KEY
        AUDIENCE_ID = settings.MAILCHIMP_AUDIENCE_ID
        SERVER_PREFIX = settings.MAILCHIMP_SERVER_PREFIX
        mailchimp = Client()

        mailchimp.set_config({
            'api_key': API_KEY,
            'server': SERVER_PREFIX
        })
        mailchimp.lists.delete_list_member(
            AUDIENCE_ID, hashlib.md5(instance.email.encode()).hexdigest()
        )
