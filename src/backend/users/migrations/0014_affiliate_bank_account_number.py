# Generated by Django 4.0.5 on 2022-08-24 20:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_remove_affiliate_amount_earned_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='affiliate',
            name='bank_account_number',
            field=models.IntegerField(null=True),
        ),
    ]
