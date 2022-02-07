from dj_rest_auth.registration.views import RegisterView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from dj_rest_auth.views import LogoutView
from users.models import User
from mailchimp_marketing import Client
from django.conf import settings
import hashlib
from dateutil import parser
from trader.permissions import IsTrader
from paypal_endpoint.views import unsubscribe_user as unsubscribe_paypal_user
from paystack_endpoint.views import unsubscribe_user as unsubscribe_paystack_user
from affiliate.models import Affiliate
from .models import PaypalSubscription, PaystackSubscription, SubscriptionInfo, get_payment_method
from .serializers import (UserSerializer, SubscriptionInfoSerializer, SignUpSerializer, TraderInfo,
     TraderInfoSerializer)


"""
Handles the registration of traders
When a sign up request for the trader app is sent from the frontend,
it is this view that handles the request.
When a user is registered, it creates a new entry in the user table
for the user and sets the user's user_info.is_trader to true
The referrer condition checks if the user registered through an
affiliate link

The response sent back to the frontend when the sign up is successful is
of the following format:
{
    'detail': 'Verification e-mail sent.'
}

But when there are errors, the response is of the following format:
{
    'email': [list of email error strings],
    'password1': [list of password1 error strings],
    'password2': [list of password2 error strings],
    'non_field_errors': [list of non field errors]
}
"""
class Register(RegisterView):
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        new_user = User.objects.get(
            email=request.data.get('email'), userinfo__is_affiliate=False, userinfo__is_trader=False
        )
        new_user.userinfo.is_trader = True
        new_user.userinfo.save()
        TraderInfo.objects.create(
            user=new_user,
            how_you_heard_about_us=request.data.get('howYouHeard'),
            trading_time_before_joining=request.data.get('yearsSpentTrading')
        )
        referrer = request.data.get('ref', None)
        if referrer:
            ref_set = Affiliate.objects.filter(user__username=referrer.lower())
            if ref_set.count() != 0:
                new_user.subscriptioninfo.referrer = ref_set[0]
                new_user.subscriptioninfo.save()
        return response

"""
Handles signing out
Deletes the user's auth token from the db
"""
class SignOutView(LogoutView):

    def get(self, request, *args, **kwargs):
        final_response = super().get(self, request, *args, **kwargs)
        try:
            Token.objects.get(user_id=request.user.id).delete()
        except Token.DoesNotExist:
            return Response({'detail': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        return final_response


"""
This was supposed to have been used to update both on the server and on
Mailchimp, but for now, that feature has been disabled
"""
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_email(request):
    user = User.objects.get(id=request.user.id)
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid(raise_exception=True):
        try:
            API_KEY = settings.MAILCHIMP_API_KEY
            AUDIENCE_ID = settings.MAILCHIMP_AUDIENCE_ID
            SERVER_PREFIX = settings.MAILCHIMP_SERVER_PREFIX
            mailchimp = Client()

            mailchimp.set_config({
                'api_key': API_KEY,
                'server': SERVER_PREFIX
            })
            member_info = {
                'email_address': request.data['email']
            }
            mailchimp.lists.update_list_member(
                AUDIENCE_ID, hashlib.md5(request.user.email.encode()).hexdigest(), member_info
            )
        except Exception:
            return Response({'network_error': 'Could not be updated'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        serializer.save()
        return Response({'detail': 'done'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def subscribe_user(request):
    # Consider paystack later
    subscription_info = SubscriptionInfo.objects.get(user=request.user)
    if request.data.get('payment_method') == 'paypal':
        PaypalSubscription.objects.create(
            subscription_id=request.data.get('subscription_id'),
            subscription_info=subscription_info,
            paypal_email=request.data.get('paypal_email'),
            next_billing_time=parser.parse(request.data.get('next_billing_time').split('T')[0])
        )
        subscription_info.payment_method = 'pp'
        subscription_info.next_billing_time = parser.parse(
            request.data.get('next_billing_time').split('T')[0]
        )
    subscription_info.is_subscribed = True
    subscription_info.on_free = False
    subscription_info.save()
    return Response({'detail': 'ok'}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def unsubscribe_user(request):
    if get_payment_method(request.user) == 'paypal':
        if not unsubscribe_paypal_user(request.user):
            return Response({'error': 'Could not unsubscribe'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if not unsubscribe_paystack_user(request.user):
            return Response({'error': 'Could not unsubscribe'}, status=status.HTTP_400_BAD_REQUEST)
        pass
    return remove_user_subscr_from_db(request)

def remove_user_subscr_from_db(request):
    if request.user.subscriptioninfo.payment_method == 'pp':
        request.user.subscriptioninfo.paypalsubscription.delete()
    else:
        request.user.subscriptioninfo.paystacksubscription.delete()
    request.user.subscriptioninfo.is_subscribed = False
    request.user.subscriptioninfo.save()
    return Response({'detail': 'ok'}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsTrader])
def set_logins_after_ask(request):
    traderinfo = TraderInfo.objects.get(user=request.user)
    serializer = TraderInfoSerializer(traderinfo, request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
