# Generated by Django 4.0.4 on 2022-05-10 14:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trader', '0043_accountdatalastrefreshed'),
    ]

    operations = [
        migrations.AddField(
            model_name='unresolvedaddaccount',
            name='broker_info_content',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='unresolvedaddaccount',
            name='broker_info_name',
            field=models.CharField(max_length=2000, null=True),
        ),
    ]
