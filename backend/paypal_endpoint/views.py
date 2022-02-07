from requests.models import encode_multipart_formdata
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
from django.http import HttpResponse
from django.conf import settings
import requests
import json
import datetime
from dateutil import parser as dateparser
from affiliate.models import Affiliate#, FailedPayout
from users.models import PaypalSubscription




@csrf_exempt
def process_wh(request):
    if not verify_wh(request):
        return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
    body = json.loads(request.body.decode())
    if body['event_type'] == 'BILLING.SUBSCRIPTION.ACTIVATED':
        handle_subscription_activated(body)
    elif body['event_type'] == 'BILLING.SUBSCRIPTION.CANCELLED':
        cancel_subscription(body)
    elif body['event_type'] == 'BILLING.SUBSCRIPTION.RENEWED':
        handle_subscription_renewed(body)
        pass
    return HttpResponse(status.HTTP_200_OK)


def verify_wh(request):
    access_token = get_access_token()
    headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {access_token}'}
    body = build_verification_body(request)
    request = requests.post(
        f'{settings.PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature', headers=headers,
        data=body
    )
    print('body 2', request.text)
    return request.json()['verification_status'] == 'SUCCESS'


def get_access_token():
    access_token = cache.get('ACCESS_TOKEN', None)
    if not access_token:
        access_token_request_raw = requests.post(
            f'{settings.PAYPAL_BASE_URL}/v1/oauth2/token', 
            headers={'Accept': 'application/json', 'Accept-Language': 'en_US'},
            auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET),
            data={'grant_type': 'client_credentials'}
        )
        access_token_request_body = access_token_request_raw.json()
        access_token = access_token_request_body['access_token']
        cache.set('ACCESS_TOKEN', access_token, access_token_request_body['expires_in'])
    return access_token


def build_verification_body(request):
    body = {
        'transmission_id': request.headers['Paypal-Transmission-Id'],
        'transmission_time': request.headers['Paypal-Transmission-Time'],
        'cert_url': request.headers['Paypal-Cert-Url'],
        'auth_algo': request.headers.get('Paypal-Auth-Algo'),
        'transmission_sig': request.headers.get('Paypal-Transmission-Sig'),
        'webhook_id': settings.PAYPAL_WEBHOOK_ID,
        'webhook_event': json.loads(request.body)
    }
    return json.dumps(body)


def handle_subscription_activated(webhook):
    print('activated', webhook)
    paypal_email = webhook['resource']['subscriber']['email_address']
    subscription_id = webhook['resource']['id']
    paypal_subscription = PaypalSubscription.objects.get(subscription_id=subscription_id)
    paypal_subscription.paypal_email = paypal_email
    paypal_subscription.save()
    # If it failed at the frontend
    subscription_info = paypal_subscription.subscription_info
    subscription_info.is_subscribed = True
    subscription_info.on_free = False
    subscription_info.next_billing_time = dateparser.parse(
        webhook['resource']['billing_info']['next_billing_time']
    ).split('T')[0]
    subscription_info.save()

    if subscription_info.referrer:
        subscription_info.referrer.amount_earned += \
            int(webhook['resource']['billing_info']['last_payment']['amount']['value'])
        subscription_info.referrer.next_payout = subscription_info.referrer.amount_earned
        subscription_info.referrer.save()


def unsubscribe_user(user):
    subscription_id = user.subscriptioninfo.paypalsubscription.subscription_id
    headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {get_access_token()}'}
    request = requests.post(
        f'{settings.PAYPAL_BASE_URL}/v1/billing/subscriptions/{subscription_id}/cancel',
        headers=headers,
        json={'reason': 'Didn\'t give reason'}
    )
    return request.status_code == 204


def handle_subscription_renewed(webhook):
    subscription_id = webhook['resource']['id']
    paypal_subscription = PaypalSubscription.objects.get(subscription_id=subscription_id)
    subscription_info = paypal_subscription.subscription_info
    subscription_info.next_billing_time = dateparser.parse(
        webhook['resource']['billing_info']['next_billing_time'].split('T')[0]
    )
    if subscription_info.referrer:
        subscription_info.referrer.amount_earned += \
            int(webhook['resource']['billing_info']['last_payment']['amount']['value'])
        subscription_info.referrer.next_payout += subscription_info.referrer.amount_earned
        subscription_info.referrer.save()
    subscription_info.save()

def cancel_subscription(webhook):
    subscription_id = webhook['resource']['id']
    paypal_subscription = PaypalSubscription.objects.filter(subscription_id=subscription_id)
    if paypal_subscription.count() == 0:
        return
    paypal_subscription[0].subscription_info.is_subscribed = False
    paypal_subscription[0].subscription_info.is_subscribed.save()
    paypal_subscription[0].delete()
    

def pay_aff(request):
    if request.headers.get('KEY') != settings.PAY_USER_KEY:
        return HttpResponse(status=status.HTTP_401_UNAUTHORIZED)
    if datetime.date.today().month != (datetime.date.today() - datetime.timedelta(days=1)).month:
        # Pay affiliates
        # Clear next_payout
        for affiliate in Affiliate.objects.all():
            batch_id = datetime.datetime.now().timestamp()
            # Pay the amount in next payout
            resp = requests.post(
                f'{settings.PAYPAL_BASE_URL}/v1/payments/payouts',
                headers={'Authorization': f'Bearer {get_access_token()}'},
                json={
                    'sender_batch_header': {
                        'sender_batch_id': f'{batch_id}',
                        'recipient_type':'EMAIL',
                        'email_subject':'Your MyFxTracker affiliate earnings'
                    }, 
                    'items': [
                        {
                            'amount': {'value': f'{settings.SUBSCRIPTION_COST / 2}', 'currency':'USD'}, 
                            'sender_item_id': f'{batch_id + 1}',
                            'recipient_wallet':'PAYPAL',
                            'receiver': f'{affiliate.payment_email}'
                        }
                    ]
                }
            )
            if resp.status_code != 201:
                FailedPayout.objects.create(affiliate=affiliate, amount=affiliate.next_payout)
            affiliate.next_payout = 0
            affiliate.save()
    return HttpResponse(status=status.HTTP_200_OK)
