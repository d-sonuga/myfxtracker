from rest_framework.permissions import BasePermission


class IsAffiliate(BasePermission):
    def has_permission(self, request, view):
        if request.user:
            return request.user.is_affiliate
        return False


class IsAdmin(BasePermission):
    
    def has_permission(self, request, view):
        return request.user.is_admin
