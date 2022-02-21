from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from allauth.account.adapter import get_adapter
from django.contrib.auth.models import User
from .models import SubscriptionInfo, TraderInfo


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class SubscriptionInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionInfo
        fields = '__all__'


"""
I can't really remember why this is here
"""
class SignUpSerializer(RegisterSerializer):
    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if email and trader_email_address_exists(email):
            raise serializers.ValidationError(
                'A user is already registered with this e-mail address.'
            )
        return email


class TraderInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TraderInfo
        fields = '__all__'


def trader_email_address_exists(email):
    return User.objects.filter(email=email, userinfo__is_trader=True).count() != 0