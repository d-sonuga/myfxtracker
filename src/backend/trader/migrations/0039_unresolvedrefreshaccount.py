# Generated by Django 4.0.3 on 2022-04-05 13:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_alter_traderinfo_last_data_refresh_time'),
        ('trader', '0038_addaccounterror'),
    ]

    operations = [
        migrations.CreateModel(
            name='UnresolvedRefreshAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.trader')),
            ],
        ),
    ]