# Generated by Django 4.0.5 on 2022-08-26 12:48

from django.db import migrations, models
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0017_alter_affiliate_bank_account_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='affiliate',
            name='bank_name',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='affiliate',
            name='bank_account_number',
            field=users.models.IntegerAsCharField(blank=True, max_length=50, null=True),
        ),
    ]
