from django.db import models
from users.models import User


class DatasourceErrors(models.Model):
    datasource_choices = (
        ('mt4', 'mt4'),
        ('mt5', 'mt5')
    )
    datasource = models.CharField(choices=datasource_choices, max_length=3)
    function_name = models.CharField(max_length=50)
    error_code = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)