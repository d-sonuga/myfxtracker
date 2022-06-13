from django.db import models
from django.core.serializers.json import DjangoJSONEncoder
from django.utils import timezone


class FlutterwaveError(models.Model):
    err_type = models.CharField(max_length=100)
    err_data = models.JSONField(encoder=DjangoJSONEncoder)
    time = models.DateTimeField(default=timezone.now)