# Generated by Django 4.0.3 on 2022-03-15 19:17

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_mailchimperror'),
        ('trader', '0025_failedtransactionsave'),
    ]

    operations = [
        migrations.CreateModel(
            name='MetaApiError',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('error', models.CharField(max_length=50)),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.trader')),
            ],
        ),
    ]
