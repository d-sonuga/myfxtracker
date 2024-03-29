# Generated by Django 4.0.3 on 2022-04-04 16:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_alter_traderinfo_last_data_refresh_time'),
        ('trader', '0036_account_time_added'),
    ]

    operations = [
        migrations.CreateModel(
            name='UnresolvedAddAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('login', models.PositiveBigIntegerField()),
                ('server', models.TextField()),
                ('platform', models.CharField(choices=[('mt4', 'mt4'), ('mt5', 'mt5')], max_length=5)),
                ('time_added', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.trader')),
            ],
        ),
    ]
