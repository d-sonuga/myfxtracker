import dateutil
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import status
import json
import hashlib
import hmac
import requests
from dateutil import parser as dparser
from users.models import PaystackSubscription


@csrf_exempt
def process_wh(request):
    if not wh_valid(request):
        print('paystack sig', 'invalid')
        return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
    webhook = json.loads(request.body)
    if webhook['event'] == 'charge.success':
        update_db(webhook)
    return HttpResponse(status=status.HTTP_200_OK)


def wh_valid(request):
    paystack_sig = request.headers.get('X-Paystack-Signature')
    sig = hmac.HMAC(settings.PAYSTACK_SECRET.encode(), request.body, digestmod='sha512').hexdigest()
    return sig == paystack_sig


def update_db(webhook):
    reference = webhook['data']['reference']
    user_id = webhook['data']['metadata']['user_id']
    paystack_subscription = PaystackSubscription.objects.create(
        reference=reference,
        subscription_info=User.objects.get(id=user_id).subscriptioninfo
    )
    subscription_info = paystack_subscription.subscription_info
    print(webhook)
    paystack_subscription.customer_code = webhook['data']['customer']['customer_code']
    subscription_info.payment_method = 'ps'
    subscription_info.save()
    paystack_subscription.save()

    transactions = requests.get(
        f'{settings.PAYSTACK_BASE_URL}/transaction/',
        headers={'Authorization': f'Bearer {settings.PAYSTACK_SECRET}'}
    ).json()
    print('transaction', transactions)
    customer_code = ''
    for transaction in transactions['data']:
        if reference == transaction['reference']:
            customer_code = transaction['customer']['customer_code']
            paystack_subscription.customer_code = customer_code
            paystack_subscription.save()
            subscription_info.last_payed = dparser.parse(transaction['created_at'].split('T')[0])
            subscription_info.is_subscribed = True
            subscription_info.save()
            break
    
    subscription_list = requests.get(
        f'{settings.PAYSTACK_BASE_URL}/subscription',
        headers={'Authorization': f'Bearer {settings.PAYSTACK_SECRET}'}
    ).json()
    print('subscriptions list', subscription_list)
    # get customer code from transaction
    # get subscription info with customer code
    for subscription in subscription_list['data']:
        if customer_code == subscription['customer']['customer_code']:
            paystack_subscription.subscription_code = subscription['subscription_code']
            paystack_subscription.email_token = subscription['email_token']
            paystack_subscription.next_billing_time = dparser.parse(
                subscription['next_payment_date'].split('T')[0]
            )
            paystack_subscription.save()
            break


def unsubscribe_user(user):
    response = requests.post(
        f'{settings.PAYSTACK_BASE_URL}/subscription/disable',
        headers={
            'Authorization': f'Bearer {settings.PAYSTACK_SECRET}',
        },
        json={
            'code': user.subscriptioninfo.paystack_subscription.subscription_code,
            'token': user.subscriptioninfo.paystack_subscription.email_token
        }
    )
    return response.status_code == 200
    


    
