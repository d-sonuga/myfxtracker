# Generated by Django 3.2.7 on 2021-10-03 21:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_auto_20211003_2153'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subscriptioninfo',
            name='last_payed',
        ),
    ]
