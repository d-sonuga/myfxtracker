# Generated by Django 4.0.3 on 2022-03-16 15:02

from django.db import migrations, models
import trader.models


class Migration(migrations.Migration):

    dependencies = [
        ('trader', '0030_account_ma_account_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='volume',
            field=models.DecimalField(decimal_places=2, default=2, max_digits=19),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='trade',
            name='broker_close_time',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='trade',
            name='broker_open_time',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='trade',
            name='order_id',
            field=trader.models.TransactionIdField(default=1, max_length=100, unique=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='trade',
            name='position_id',
            field=trader.models.TransactionIdField(default=1, max_length=100, unique=False),
            preserve_default=False,
        ),
    ]
