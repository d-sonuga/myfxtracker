from rest_framework.permissions import BasePermission


class IsAffiliate(BasePermission):
    def has_permission(self, request, view):
        if request.user:
            return request.user.userinfo.is_affiliate
        return False