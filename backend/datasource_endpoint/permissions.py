from rest_framework.permissions import BasePermission, IsAuthenticated as BaseIsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import status


class DatasourceUsernameNotExpired(BasePermission):
    def has_permission(self, request, view):
        if request.user.traderinfo.datasource_username_has_expired():
            raise DatasourceUsernameExpiredError()
        else:
            return True

class IsAuthenticated(BaseIsAuthenticated):
    def has_permission(self, *args, **kwargs):
        if not super().has_permission(*args, **kwargs):
            raise InvalidDatasourceUsernameError()
        return True

class InvalidDatasourceUsernameError(PermissionDenied):
    def __init__(self, *args):
        self.detail = 'invalid username'
        self.status_code = status.HTTP_403_FORBIDDEN

class DatasourceUsernameExpiredError(PermissionDenied):
    def __init__(self, *args):
        self.detail = 'expired username'
        self.status_code = status.HTTP_403_FORBIDDEN
