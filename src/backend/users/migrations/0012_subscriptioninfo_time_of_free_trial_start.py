# Generated by Django 4.0.5 on 2022-06-14 20:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_alter_subscriptioninfo_subscription_plan'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscriptioninfo',
            name='time_of_free_trial_start',
            field=models.DateTimeField(null=True),
        ),
    ]