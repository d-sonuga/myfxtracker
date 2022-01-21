# Generated by Django 3.2.7 on 2021-10-07 08:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('affiliate', '0002_alter_affiliate_unsubscribed_users'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='affiliate',
            name='unsubscribed_users',
        ),
        migrations.AddField(
            model_name='affiliate',
            name='next_payout',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
            preserve_default=False,
        ),
    ]
