# Generated by Django 4.0.2 on 2022-02-02 17:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trader', '0006_alter_trade_risk_reward_ratio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trade',
            name='magic_number',
            field=models.IntegerField(),
        ),
    ]
