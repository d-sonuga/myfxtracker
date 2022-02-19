from rest_framework.authentication import BaseAuthentication, TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from users.models import Trader, datasource_username_is_invalid
from django.conf import settings


class UserAuthentication(TokenAuthentication):
    def authenticate(self, request):
        try:
            token_auth = super().authenticate(request)
            if token_auth is not None:
                user, auth = token_auth
                if user.is_trader:
                    return (Trader.objects.get(id=user.id), auth)
                return user, auth
        except Exception as e:
            raise 