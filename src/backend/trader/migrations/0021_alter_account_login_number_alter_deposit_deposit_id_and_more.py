# Generated by Django 4.0.2 on 2022-02-15 19:54

from django.db import migrations, models
import trader.models


class Migration(migrations.Migration):

    dependencies = [
        ('trader', '0020_alter_account_balance_alter_account_credit_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='login_number',
            field=trader.models.TransactionIdField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='deposit',
            name='deposit_id',
            field=trader.models.TransactionIdField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='trade',
            name='magic_number',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='trade',
            name='trade_id',
            field=trader.models.TransactionIdField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='withdrawal',
            name='withdrawal_id',
            field=trader.models.TransactionIdField(max_length=100, unique=True),
        ),
    ]
