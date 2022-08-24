from rest_framework import serializers
from users.models import Affiliate

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def get_affiliate(self, username, password):
        affiliate_set = Affiliate.objects.filter(user__username=username)
        if affiliate_set.count() != 0:
            affiliate = affiliate_set[0]
            if affiliate.user.check_password(password):
                return affiliate
            return None
        return None

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        affiliate = self.get_affiliate(username, password)
        if not affiliate:
            raise serializers.ValidationError('Unable to log in with provided credentials')
        attrs['affiliate'] = affiliate
        return attrs