# Generated by Django 4.0.2 on 2022-02-02 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DatasourceErrors',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datasource', models.CharField(choices=[('mt4', 'mt4'), ('mt5', 'mt5')], max_length=3)),
                ('function_name', models.CharField(max_length=50)),
                ('error_code', models.IntegerField()),
            ],
        ),
    ]