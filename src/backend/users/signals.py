from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from allauth.account.signals import email_confirmed
from django_rest_passwordreset.signals import reset_password_token_created, pre_password_reset, post_password_reset
from django.contrib.sites.models import Site
from django.conf import settings
from trader.models import Preferences
from users.models import User
from django.db.models.signals import post_delete, post_save
import hashlib
from .models import SubscriptionInfo, Trader, MailChimpError
from . import mailchimp
import os



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
    site_domain = Site.objects.get_current().domain
    # send an e-mail to the user
    context = {
        'domain': f'{site_domain}:3000' if os.getenv('TEST') == 'true' else site_domain,
        'token': reset_password_token.key,
    }

    # render email text
    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        # title:
        '{name} - Reset Password'.format(name="MyFxTracker"),
        # message:
        email_plaintext_message,
        # from:
        site_domain,
        # to:
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()

@receiver(email_confirmed)
def email_confirmed_(request, email_address, **kwargs):
    try:
        member_info = {
            'email_address': email_address.email,
            'status': 'subscribed'
        }
        mailchimp_api = mailchimp.MailChimpApi()
        mailchimp_api.add_member_to_list(member_info=member_info)
    except Exception:
        MailChimpError.objects.create(email=email_address.email, action='add_list_member')


@receiver(post_save, sender=Trader)
def user_account_saved(sender, instance, created, using, **kwargs):
    if created:
        Preferences.objects.create(user=instance, current_account=None)


@receiver(post_delete, sender=User)
def user_account_deleted(sender, instance, using, **kwargs):
    if not settings.IS_ARCHIVE:
        try:
            email_encoding = hashlib.md5(instance.email.encode()).hexdigest()
            mailchimp_api = mailchimp.MailChimpApi()
            mailchimp_api.delete_list_member(email_encoding=email_encoding)
        except Exception:
            MailChimpError.objects.create(email=instance.email, action='delete_list_member')
