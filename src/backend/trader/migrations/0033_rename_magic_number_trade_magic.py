# Generated by Django 4.0.3 on 2022-03-16 15:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trader', '0032_remove_account_volume_trade_volume'),
    ]

    operations = [
        migrations.RenameField(
            model_name='trade',
            old_name='magic_number',
            new_name='magic',
        ),
    ]
