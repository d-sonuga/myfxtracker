from rest_framework.authtoken.models import Token
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from .permissions import IsAdmin
from .forms import LogInForm
import json


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    form = LogInForm(request.data)
    if form.is_valid():
        email = form.cleaned_data.get('email').lower()
        password = form.cleaned_data.get('password')
        user_set = User.objects.filter(email=email)
        if user_set.count() == 0:
            return Response(
                {'email': [{'message': 'email does not exist'}]},
                status=status.HTTP_400_BAD_REQUEST
            )
        user = user_set[0]
        if not check_password(password, user.password):
            return Response(
                {'password': [{'message': 'Invalid password'}]},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not user.userinfo.is_admin:
            return Response(
                {'not_admin': [{'message': 'The user is not an admin'}]},
                status=status.HTTP_400_BAD_REQUEST
            )
        token = Token.objects.get_or_create(user=user)[0]
        return Response({'token': token.key}, status=status.HTTP_200_OK)
    else:
        return Response(json.loads(form.errors.as_json()), status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def get_init_data(request):
    """
    Returns a user's accounts and related info
    Format of init data
    {
        'admin_data': {
            'trader_emails': [
                'email1',
                'email2',
                ...
            ]
        }
    }
    """
    init_data = {
        'admin_data': {
            'trader_emails': User.objects.filter(userinfo__is_trader=True).values_list('email', flat=True)
        }
    }
    return Response(init_data, status=status.HTTP_200_OK)