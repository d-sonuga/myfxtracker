from users.models import Trader, datasource_username_is_invalid
from rest_framework.authentication import BaseAuthentication


class DatasourceUsernameAuth(BaseAuthentication):
    def authenticate(self, request):
        headers = request.META.get('headers')
        if headers:
            ds_username = headers.get('Datasource-Username', '')
            if ds_username:
                if not datasource_username_is_invalid(ds_username):
                    return (Trader.objects.get_by_datasource_username(ds_username), {})
