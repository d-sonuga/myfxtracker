from django.dispatch import receiver
from django.utils import timezone
from django.conf import settings
from django.db.models.signals import post_save
from redis import StrictRedis
from users.models import MailChimpError, TraderInfo
from trader.models import Account
from users import mailchimp
import logging

logger = logging.getLogger(__name__)


def clear_redis_db():
    with StrictRedis.from_url(settings.RQ_QUEUES['default']['URL']) as conn:
        conn.flushall()
        conn.close()
    with StrictRedis.from_url(settings.RQ_QUEUES['low']['URL']) as conn:
        conn.flushall()
        conn.close()


@receiver(post_save, sender=Account)
def record_free_trial_start(sender, instance: Account, created: bool, **kwargs):
    if created:
        if instance.user.time_of_free_trial_start is None:
            instance.user.subscriptioninfo.time_of_free_trial_start = instance.time_added
            instance.user.subscriptioninfo.save()


@receiver(post_save, sender=Account)
def trigger_mailchimp_customer_journey(sender, instance: Account, created: bool, **kwargs):
    try:
        if not instance.user.traderinfo.post_account_connect_mailchimp_journey_triggered:
            mailchimp_api = mailchimp.MailChimpApi()
            mailchimp_api.trigger_customer_journey(email=instance.user.email)
            instance.user.traderinfo.post_account_connect_mailchimp_journey_triggered = True
            instance.user.traderinfo.save()
    except Exception:
        MailChimpError.objects.create(email=instance.user.email, action='trigjourney')