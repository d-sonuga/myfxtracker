from rest_framework.permissions import BasePermission
from django.conf import settings


class IsOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user == obj.account.user:
            return True
        return False


class IsAccountOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user == obj.user:
            return True
        return False


class IsTrader(BasePermission):
    
    def has_permission(self, request, view):
        return request.user.is_trader


class IsTraderOrAdmin(BasePermission):
    
    def has_permission(self, request, view):
        return request.user.is_trader or request.user.is_admin

class IsFromSite(BasePermission):
    def has_permission(self, request, view):
        return request.META.get('Weekly-Reports-Key') == settings.WEEKLY_REPORTS_KEY