# Generated by Django 4.0.4 on 2022-04-24 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trader', '0042_removeaccounterror_account'),
    ]

    operations = [
        migrations.CreateModel(
            name='AccountDataLastRefreshed',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField()),
            ],
        ),
    ]