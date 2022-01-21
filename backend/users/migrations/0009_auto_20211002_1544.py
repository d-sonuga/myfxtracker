# Generated by Django 3.2.7 on 2021-10-02 15:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_paypalsubscription_next_billing_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paypalsubscription',
            name='paypal_email',
            field=models.EmailField(max_length=254),
        ),
        migrations.CreateModel(
            name='PaystackSubscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reference', models.IntegerField()),
                ('customer_code', models.CharField(max_length=50, null=True)),
                ('subscription_code', models.CharField(max_length=50, null=True)),
                ('email_token', models.CharField(max_length=50, null=True)),
                ('next_billing_time', models.DateField(null=True)),
                ('subscription_info', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='users.subscriptioninfo')),
            ],
        ),
    ]
