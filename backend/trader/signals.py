from django.dispatch import receiver
from django.db.models.signals import post_delete
from django.conf import settings
from trader.models import Trade
import os


@receiver(post_delete, sender=Trade)
def trade_deleted(sender, instance, **kwargs):
    if instance.entry_image:
        try:
            os.remove(f'{settings.BASE_DIR}/{instance.entry_image.url}')
        except Exception:
            pass
    if instance.exit_image:
        try:
            os.remove(f'{settings.BASE_DIR}/{instance.exit_image.url}')
        except Exception:
            pass
