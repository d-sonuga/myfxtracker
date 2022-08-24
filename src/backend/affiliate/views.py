from affiliate.serializers import LoginSerializer
from users.models import User
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.authtoken.models import Token
import json
from users.models import SubscriptionInfo
from .models import Affiliate
from .forms import SignUpForm, LoginForm
from .permissions import IsAffiliate


"""
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAffiliate])
def get_init_data(request):
    Returns a user's accounts and related info
    Format of init data
    {
        'aff_data': {
            'id': id-of-current-user,
            'email': 'current-user-email',
            'payment_email': 'email-paypal-of user',
            'amount_earned': 'money gained from aff program',
            'signed_up': 'users signed up',
            'subscribed': 'users subscribed'
        }
    }
    affiliate_set = Affiliate.objects.filter(user=request.user)
    if affiliate_set.count() == 0:
        return Response({'detail': 'not affiliate'}, status=status.HTTP_400_BAD_REQUEST)
    referred_users = SubscriptionInfo.objects.filter(referrer=request.user.affiliate)
    init_data = {
        'aff_data': {
            'id': request.user.id,
            'username': request.user.username,
            'payment_email': request.user.affiliate.payment_email,
            'amount_earned': request.user.affiliate.amount_earned,
            'signed_up': referred_users.count(),
            'subscribed': referred_users.filter(is_subscribed=True, user__emailaddress__verified=True).count()
        }
    }
    return Response(init_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up(request):
    Either user is already a trader or is not
    Either affiliate with the given info already exists or it doesn't

    If user is already trader but not affiliate
        create
    If user is not trader and not affiliate
        create and set is_affiliate to true, is_trader to false
    If user is affiliate already
        don't create
    form = SignUpForm(request.data)
    if form.is_valid(): 
        username = form.cleaned_data.get('username').lower()
        password = form.cleaned_data.get('password')
        paypal_email = form.cleaned_data.get('paypal_email')
        user = User.objects.create(username=username)
        user.set_password(password)
        user.userinfo.is_affiliate = True
        user.userinfo.save()
        user.save()
        Affiliate.objects.create(
            user=user, payment_email=paypal_email, amount_earned=0, next_payout=0
        )
        token = Token.objects.get_or_create(user=user)[0]
        return Response({'token': token.key}, status=status.HTTP_200_OK)
    else:
        return Response(json.loads(form.errors.as_json()), status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    form = LogInForm(request.data)
    if form.is_valid():
        username = form.cleaned_data.get('username').lower()
        password = form.cleaned_data.get('password')
        user_set = User.objects.filter(username=username)
        if user_set.count() == 0:
            return Response(
                {'username': [{'message': 'username does not exist'}]},
                status=status.HTTP_400_BAD_REQUEST
            )
        user = user_set[0]
        if not check_password(password, user.password):
            return Response(
                {'password': [{'message': 'Invalid password'}]},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not user.userinfo.is_affiliate:
            return Response(
                {'not_affiliate': [{'message': 'The user is not an affiliate'}]},
                status=status.HTTP_400_BAD_REQUEST
            )
        token = Token.objects.get_or_create(user=user)[0]
        return Response({'token': token.key}, status=status.HTTP_200_OK)
    else:
        return Response(json.loads(form.errors.as_json()), status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):


login = LoginView.as_view()
"""
from rest_framework.authtoken.models import Token
class LoginView(APIView):
    def post(self, request, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            token, _ = Token.objects.get_or_create(user=serializer.validated_data['affiliate'].user)
            return Response({'key': token.key})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

login = LoginView.as_view()