# Generated by Django 4.0.2 on 2022-02-18 13:26

import django.core.serializers.json
from django.db import migrations, models
import django.db.models.deletion
import trader.models


class Migration(migrations.Migration):

    dependencies = [
        ('trader', '0022_alter_account_login_number_alter_deposit_deposit_id_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='UnknownTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transaction_id', trader.models.TransactionIdField(max_length=100)),
                ('data', models.JSONField(encoder=django.core.serializers.json.DjangoJSONEncoder)),
            ],
        ),
        migrations.AddConstraint(
            model_name='account',
            constraint=models.UniqueConstraint(fields=('login_number', 'user'), name='trader_no_duplicate_account'),
        ),
        migrations.AddField(
            model_name='unknowntransaction',
            name='account',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='trader.account'),
        ),
        migrations.AddConstraint(
            model_name='unknowntransaction',
            constraint=models.UniqueConstraint(fields=('account', 'transaction_id'), name='trader_no_duplicate_unknown_transaction'),
        ),
    ]