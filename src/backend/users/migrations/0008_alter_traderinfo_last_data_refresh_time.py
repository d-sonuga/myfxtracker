# Generated by Django 4.0.3 on 2022-04-03 16:31

from django.db import migrations, models
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_traderinfo_last_data_refresh_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='traderinfo',
            name='last_data_refresh_time',
            field=models.DateTimeField(default=users.models.trader_info_default_last_data_refresh_time),
        ),
    ]
