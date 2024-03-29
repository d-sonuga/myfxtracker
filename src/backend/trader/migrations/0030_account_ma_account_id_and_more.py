# Generated by Django 4.0.3 on 2022-03-16 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trader', '0029_alter_account_login'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='ma_account_id',
            field=models.CharField(default='', max_length=200),
            preserve_default=False,
        ),
        migrations.AddConstraint(
            model_name='account',
            constraint=models.UniqueConstraint(fields=('ma_account_id',), name='trader_unique_ma_account_id'),
        ),
    ]
