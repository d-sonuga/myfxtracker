# Generated by Django 4.0.2 on 2022-02-15 16:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trader', '0017_alter_account_type_alter_preferences_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='account',
            name='stopout_level',
        ),
    ]
