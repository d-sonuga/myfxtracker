from django.db import models
from django.contrib.auth.models import User


class Affiliate(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    payment_email = models.EmailField()
    amount_earned = models.DecimalField(max_digits=10, decimal_places=2)
    next_payout = models.DecimalField(max_digits=10, decimal_places=2)


class FailedPayout(models.Model):
    affiliate = models.ForeignKey(Affiliate, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
