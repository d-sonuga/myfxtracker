# Generated by Django 4.0.5 on 2022-08-26 13:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0018_affiliate_bank_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='affiliate',
            name='bank_account_name',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]