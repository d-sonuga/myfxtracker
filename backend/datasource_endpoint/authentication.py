from users.models import Trader, datasource_username_is_valid
from rest_framework.authentication import BaseAuthentication


class DatasourceUsernameAuth(BaseAuthentication):
    def authenticate(self, request):
        headers = request.META.get('headers')
        ds_username = headers.get('Datasource-Username') if headers else None
        if not ds_username:
            ds_username = request.headers.get('Datasource-Username',
                request.META.get('HTTP_DATASOURCE_USERNAME')
            )
        if ds_username:
            if datasource_username_is_valid(ds_username):
                return (Trader.objects.get_by_datasource_username(ds_username), {})
