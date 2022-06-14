from django.dispatch import receiver
from django.utils import timezone
from django.conf import settings
from django.db.models.signals import post_save
from redis import StrictRedis
from trader.models import Account
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
