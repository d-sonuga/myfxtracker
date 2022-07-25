import datetime
from selectors import EpollSelector
import statistics
from django.http import HttpResponse
from django.shortcuts import redirect
from django.utils import timezone
from flutterwave_endpoint.models import FlutterwaveError
from itsdangerous import base64_decode
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.generics import DestroyAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from rest_framework.views import APIView
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LoginView
from users.models import SubscriptionInfo, Trader, User
from trader.models import Note
from .serializers import (RecordNewSubscriptionSerializer, TradeSerializer, DepositSerializer, AccountSerializer, PrefSerializer,
                          WithdrawalSerializer, switch_db_str, Choice, NoteSerializer)
from .models import (AddAccountError, RefreshAccountError, RemoveAccountError, Trade, Deposit, UnsubscriptionError,
                    UnknownTransaction, UnresolvedAddAccount, UnresolvedRefreshAccount, UnresolvedRemoveAccount, UnresolvedUnsubscription,
                    Withdrawal, Account, Preferences, MetaApiError, UnresolvedDeployAccount, DeployAccountError)
from .permissions import IsOwner, IsAccountOwner, IsTraderOrAdmin, IsTrader
import datetime as dt
from .serializers import AddAccountInfoSerializer
from . import metaapi
from django.db import IntegrityError, connection, transaction
from .permissions import IsRefreshRequestFromSite, IsTradingAccountOwner
import logging

logger = logging.getLogger(__name__)

class DeleteTrade(DestroyAPIView):
    serializer_class = TradeSerializer
    permission_classes = [IsAuthenticated, IsTrader, IsOwner]
    lookup_url_kwarg = 'pk'

    def get_queryset(self):
        return Trade.objects.filter(account__user=self.request.user)


class DeleteAccount(DestroyAPIView):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated, IsTrader, IsAccountOwner]
    lookup_url_kwarg = 'pk'

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsTrader])
def add_trade(request):
    serializer = TradeSerializer(data=request.data)
    if serializer.is_valid():
        new_trade = serializer.save()
        return Response({
            'new_trade_id': new_trade.id, 
            'entry_image': new_trade.entry_image.url if new_trade.entry_image else '',
            'exit_image': new_trade.exit_image.url if new_trade.exit_image else ''
            },
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsTrader])
def add_deposit(request):
    serializer = DepositSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsTrader])
def add_withdrawal(request):
    serializer = WithdrawalSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsTrader])
def update_trade(request, pk):
    trade = Trade.objects.get(id=pk)
    serializer = TradeSerializer(trade, data=request.data, partial=True)
    if serializer.is_valid(raise_exception=True):
        updated_trade = serializer.save()
        return Response({
            'entry_image': updated_trade.entry_image.url if updated_trade.entry_image else '',
            'exit_image': updated_trade.exit_image.url if updated_trade.exit_image else ''
            }, status=status.HTTP_200_OK
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsTrader])
def add_account(request):
    serializer = AccountSerializer(data=request.data)
    if serializer.is_valid():
        if not request.data.get('amount'):
            return Response({'amount': 'This field is required'}, status=status.HTTP_400_BAD_REQUEST)
        new_account = serializer.save(user=request.user)
        if Preferences.objects.filter(user=request.user).count() == 0:
            Preferences.objects.create(current_account=new_account, user=request.user)
        Deposit.objects.create(account=new_account, amount=request.data.get('amount'), date=datetime.datetime.now())
        return Response({'new_account_id': new_account.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsTrader])
def set_account_pref(request):
    if request.data.get('current_account') == 0:
        Preferences.objects.get(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    prefs = Preferences.objects.get(user=request.user)
    serializer = PrefSerializer(prefs, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsTraderOrAdmin])
def old_get_init_data(request):
    """
    Returns a user's accounts and related info
    Format of init data
    {
        'user_data': {
            'id': id-of-current-user,
            'email': 'email-of-current-user',
            'is_subscribed': true | false 
        },
        'trade_data': {
            'current_account_id': id-of-currently-selected-account,
            'accounts': {
                'Account Id': {
                    'name': 'Name of the account',
                    'trades': 'Trades associated with the account',
                    'deposits': 'Deposits in account',
                    'withdrawals': 'withdrawals from the account'
                },
                ...
            }
        }
    }
    """
    update_user_subscription_info(request)
    if request.headers.get('trader-email') and request.user.userinfo.is_admin:
        user = User.objects.get(email=request.headers['trader-email'], userinfo__is_trader=True)
    else:
        user = request.user
    
    init_data = {
        'user_data': {
            'id': user.id,
            'email': user.email,
            'is_subscribed': user.subscriptioninfo.is_subscribed,
            'on_free': user.subscriptioninfo.on_free,
            'current_feedback_question': user.traderinfo.current_feedback_question,
            'logins_after_ask': (user.traderinfo.logins_after_ask 
                if user.traderinfo.logins_after_ask is not None else -1)
        },
        'trade_data': {
            'no_of_trades': 0,
            'current_account_id': 0,
            'accounts': {}
        }
    }
    accounts = Account.objects.filter(user=user)
    if accounts.count() > 0:
        try:
            pref = Preferences.objects.get(user=user)
        except Preferences.DoesNotExist:
            pref = Preferences.objects.create(user=user, current_account=accounts[0])
        current_account_id = pref.current_account.id
        init_data['trade_data']['current_account_id'] = current_account_id
        for account in accounts:
            account_trades = Trade.objects.filter(account=account).order_by('pk')
            for trade in account_trades:
                init_data['trade_data']['no_of_trades'] += 1
                trade.action = switch_db_str(trade.action, Choice.ACTIONS, Choice.FROM_STR)
                trade.pair = switch_db_str(trade.pair, Choice.PAIRS, Choice.FROM_STR)
            init_data['trade_data']['accounts'][account.id] = {
                'deposits': DepositSerializer(Deposit.objects.filter(account=account), many=True).data,
                'withdrawals': WithdrawalSerializer(Withdrawal.objects.filter(account=account), many=True).data,
                'trades': TradeSerializer(account_trades, many=True).data,
                'name': account.name
            }
    return Response(init_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def send_weekly_reports(request):
    """
    Load all trades from the past week
    Send their summary to their owners
    """
    if request.META.get('Testing-Auth') != 'True':
        user_set, account_set, trade_list = load_trades_from_past_week()
        for user in user_set:
            accounts = account_set.filter(user=user)
            data = dict(overall_no_of_trades=0, altered_accounts_no=0, accounts=dict())
            for account in accounts:
                trades = list(filter(lambda trade: trade.account.id == account.id, trade_list))
                profit_losses = list(map(lambda trade: trade.profit_loss, trades))
                if len(trades) == 0:
                    continue
                build_summary(data, trades, profit_losses, account)
                send_email(user, data)
    return Response(status=status.HTTP_200_OK)


def load_trades_from_past_week():
    user_set = User.objects.filter(userinfo__is_trader=True)
    account_set = Account.objects.all()
    trade_list = list(filter(
            lambda trade: True if(trade.date_added and trade.date_added.month == dt.date.today().month 
                and dt.date.today() - trade.date_added <= dt.timedelta(days=7)) else False,
            Trade.objects.all()
    ))
    return user_set, account_set, trade_list


def build_summary(data, trades, profit_losses, account):
    data['accounts'][account.name] = {
        'no_of_trades': len(trades),
        'account_gain': sum(profit_losses),
        'pips': sum(list(map(lambda trade: trade.pips, trades))),
        'best_trade': max(profit_losses),
        'worst_trade': abs(min(profit_losses)),
    }
    data['overall_no_of_trades'] += len(trades)
    data['altered_accounts_no'] += 1


def send_email(user, data):
    html_file = 'wr3.html'
    text_file = 'wr2.txt'
    html_content = render_to_string(f'apis/{html_file}', {
                'accounts': data['accounts'], 'overall_no_of_trades': data['overall_no_of_trades'],
                'altered_accounts_no': data['altered_accounts_no']})
    text_content = render_to_string(f'apis/{text_file}', {
                'accounts': data['accounts'], 'overall_no_of_trades': data['overall_no_of_trades'],
                'altered_accounts_no': data['altered_accounts_no']})
    msg = EmailMultiAlternatives(
        'MyFxTracker Weekly Reports',
        text_content,
        settings.EMAIL_HOST_USER,
        [user.email],
    )
    msg.attach_alternative(html_content, 'text/html')
    msg.send()


def update_user_subscription_info(request):
    """"
    Making site completely free
    """
    return
    if dt.date.today() - request.user.subscriptioninfo.next_billing_time > dt.timedelta(days=5):
        request.user.subscriptioninfo.is_subscribed = False
        request.user.subscriptioninfo.on_free = False
        request.user.subscriptioninfo.save()
    else:
        if not request.user.subscriptioninfo.is_subscribed:
            request.user.subscriptioninfo.is_subscribed = True
            request.user.subscriptioninfo.save()


class Logout(APIView):
    permission_classes = [IsAuthenticated, IsTrader]

    def delete(self, request):
        logger.info(f'Logging out user with an id of {request.user.id}')
        request.user.auth_token.delete()
        return Response()


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated, IsTrader]

    def delete(self, request):
        logger.info(f'Request to delete account by {request.user.id}')
        if request.user.account_set.exists():
            logger.info(f'User {request.user.id}, who requested an account deletion, '
                'still has unremoved accounts')
            if self.account_removal_error_exists():
                logger.info(f'Sending remove account error as delete account '
                    'response to user {request.user.id}')
                error = self.get_account_removal_error()
                return Response(error, status=status.HTTP_400_BAD_REQUEST)
            if not self.accounts_are_being_removed():
                logger.info(f'Proceeding to remove trading accounts of user {request.user.id}')
                for account in Account.objects.filter(user=request.user):
                    UnresolvedRemoveAccount.objects.create(user=request.user, account=account)
                    rq_enqueue(
                        resolve_remove_trading_account,
                        request.user,
                        account
                    )
            return Response({'detail': 'pending'})
        logger.info(f'User {request.user.id}, who requested an account deletion, is still subscribed')
        if request.user.is_subscribed:
            if self.unsubscription_error_exists():
                logger.info(f'Sending unsubscription error as delete account '
                    'response to user {request.user.id}')
                error = self.get_unsubscription_error()
                return Response(error, status=status.HTTP_400_BAD_REQUEST)
            if not self.unsubscription_is_being_resolved():
                logger.info(f'Proceeding to unsubscribe user {request.user.id} '
                    'before finally deleting the account')
                UnresolvedUnsubscription.objects.create(user=self.request.user)
                rq_enqueue(resolve_unsubscription, self.request.user)
            return Response({'detail': 'pending'})
        logger.info(f'Account of user {request.user.id} is now deleting')
        request.user.delete()
        return Response({'detail': 'removed'})
        
    def accounts_are_being_removed(self):
        return UnresolvedRemoveAccount.objects.filter(
            user=self.request.user
        ).exists()
    
    def account_removal_error_exists(self):
        return RemoveAccountError.objects.filter(
            user=self.request.user
        ).exists()
    
    def get_account_removal_error(self):
        remove_account_error_set = RemoveAccountError.objects.filter(user=self.request.user)
        error = remove_account_error_set[0].consume_error()
        remove_account_error_set.delete()
        return error

    def unsubscription_is_being_resolved(self):
        return UnresolvedUnsubscription.objects.filter(
            user=self.request.user
        ).exists()
    
    def unsubscription_error_exists(self):
        return UnsubscriptionError.objects.filter(
            user=self.request.user
        ).exists()
    
    def get_unsubscription_error(self):
        return UnsubscriptionError.objects.get(
            user=self.request.user
        ).consume_error()


class NoteViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsTrader]
    serializer_class = NoteSerializer

    def get_queryset(self):
        return self.request.user.note_set

    def get_object(self):
        return Note.objects.get(id=self.kwargs.get('pk'))

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data={
            'user': request.user.pk, 'title': request.data.get('title'),
            'content': request.data.get('content'),
            'last_edited': request.data.get('lastEdited')
        })
        if serializer.is_valid():
            new_note = serializer.save()
            return Response({'id': new_note.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

"""
    Returns a user's accounts and related info
    Format of init data
    {
        'user_data': {
            'id': id-of-current-user,
            'email': 'email-of-current-user',
            'is_subscribed': true | false,
            'on_free': true | false
        },
        'trade_data': {
            'current_account_id': id-of-currently-selected-account,
            'accounts': {
                'Account Id': {
                    'name': 'Name of the account',
                    'trades': 'Trades associated with the account',
                    'deposits': 'Deposits in account',
                    'withdrawals': 'withdrawals from the account'
                },
                ...
            }
        }
    }
"""
class GetInitData(APIView):
    permission_classes = [IsAuthenticated, IsTrader]

    def get(self, request, *args, **kwargs):
        init_data = GetInitData.build_init_data(request)
        return Response(init_data, status=status.HTTP_200_OK)
    
    @staticmethod
    def build_init_data(request):
        logger.info(f'Building init data of user {request.user.id}')
        accounts = Account.objects.filter(user=request.user)
        trader_pref = Preferences.objects.get(user=request.user)
        current_account_id = (
            trader_pref.current_account.id
            if trader_pref.current_account is not None
            else -1
        )
        last_data_refresh_time = request.user.last_data_refresh_time
        MONTHLY = SubscriptionInfo.MONTHLY
        CODE = SubscriptionInfo.CODE
        subscription_plan = 'none'
        if request.user.is_subscribed:
            subscription_plan = (
                'monthly'
                if request.user.subscription_plan == SubscriptionInfo.PLAN_CHOICES[MONTHLY][CODE]
                else 'yearly'
            )
        if request.user.time_of_free_trial_start:
            day_of_free_trial_expiring = (request.user.time_of_free_trial_start 
                + timezone.timedelta(days=settings.FREE_TRIAL_PERIOD))
            no_of_days_for_free_trial_to_expire = (
                0
                if (day_of_free_trial_expiring - timezone.now()).days <= 0
                else (day_of_free_trial_expiring - timezone.now()).days
            )
        else:
            no_of_days_for_free_trial_to_expire = 'free trial not started'
        logger.critical(f'User with id of {request.user.id} '
            f'on_free: {request.user.subscriptioninfo.on_free} is getting some init data')
        init_data = {
            'user_data': {
                'id': request.user.id,
                'email': request.user.email,
                'is_subscribed': request.user.subscriptioninfo.is_subscribed,
                'on_free': request.user.subscriptioninfo.on_free,
                'subscription_plan': subscription_plan,
                'days_left_before_free_trial_expires': no_of_days_for_free_trial_to_expire
            },
            'trade_data': {
                'current_account_id': current_account_id,
                'last_data_refresh_time': last_data_refresh_time,
                'accounts': {
                    account.id: {
                        'name': account.name,
                        'trades': [{
                            'pair': trade.pair,
                            'action': trade.action,
                            'profitLoss': trade.profit_loss,
                            'commission': trade.commission,
                            'swap': trade.swap,
                            'openTime': trade.open_time,
                            'closeTime': trade.close_time,
                            'openPrice': trade.open_price,
                            'closePrice': trade.close_price,
                            'takeProfit': trade.take_profit,
                            'stopLoss': trade.stop_loss,
                        } for trade in account.get_all_trades()],
                        'deposits': [{
                            'account': account.id,
                            'amount': deposit.amount,
                            'time': deposit.time
                        } for deposit in account.get_all_deposits()],
                        'withdrawals': [{
                            'account': account.id,
                            'amount': withdrawal.amount,
                            'time': withdrawal.time
                        } for withdrawal in account.get_all_withdrawals()]
                    } for account in accounts
                }
            }
        }
        return init_data


class RedirectToSignup(APIView):
    def get(self, request, *args, **kwargs):
        return redirect(settings.SIGN_UP_URL)
    
    def post(self, request, *args, **kwargs):
        return redirect(settings.SIGN_UP_URL)

import django_rq
from .redis_utils import rq_enqueue

class AddTradingAccountView(APIView):
    permission_classes = [IsAuthenticated, IsTrader]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        logger.info(request.data)
        reg_account_info_serializer = AddAccountInfoSerializer(data=request.data)
        logger.info(f'Trading account details of user with id {request.user.id} reached backend')
        if reg_account_info_serializer.is_valid():
            logger.info(f'Trading account details of user with id {request.user.id} validated')
            if self.account_is_duplicate():
                logger.info(f'Trading account details of user with id {request.user.id} considered duplicate')
                return Response(
                    {'non_field_errors': ['The account already exists.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if self.account_is_being_resolved():
                logger.info(f'Trading account of user with id {request.user.id} is being resolved')
                return Response({'detail': 'pending'}, status=status.HTTP_200_OK)
            if self.add_account_error_exists():
                error = self.get_add_account_error()
                logger.info(f'Trading account of user with id {request.user.id} addition encountered error {error}')
                return Response(error, status=status.HTTP_400_BAD_REQUEST)
            content = request.data.get('brokerInfoContent')
            if content:
                content = base64_decode(content)
            UnresolvedAddAccount.objects.create(
                user=request.user,
                name=request.data['name'],
                login=request.data['login'],
                server=request.data['server'],
                platform=request.data['platform'],
                broker_info_name=request.data.get('brokerInfoName'),
                broker_info_content=content
            )
            logger.info(f'Trading account of user with id {request.user.id} about to be enqueued for addition')
            rq_enqueue(resolve_add_account, request.data, request.user)
            return Response({'detail': 'pending'}, status=status.HTTP_200_OK)
        logger.info(f'Trading account details of user with id {request.user.id} considered invalid')
        return Response(reg_account_info_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @staticmethod
    def add_account(data: dict, user: Trader):
        class classyrequest:
            def __init__(self, data, user):
                self.data = data
                self.user = user
        request = classyrequest(data, user)
        logger.info(f'Initializing metaapi to add trading account for user with id {user.id}')
        mtapi = metaapi.MetaApi()
        logger.info(f'Adding trading account for user with id {user.id}')
        ma_acc_id, account_name = mtapi.create_account(request.data)
        logger.info(f'Getting all trading data of newly added account for trader with id {user.id}')
        (account_data, trade_data, deposit_data, withdrawal_data, 
            unknown_transaction_data) = mtapi.get_all_data(ma_acc_id, account_name)
        logger.info(f'Creating trading account entry in db for user with id {user.id}')
        new_account = Account.objects.create_account(
            request.user,
            account_data,
            trade_data,
            deposit_data,
            withdrawal_data,
            unknown_transaction_data
        )
        if Account.objects.filter(user=request.user).count() == 1:
            # If the account just created is the first account the user added,
            # let the time be the last account data updated time
            logger.info(f'Updating user with id {user.id} last data refresh time')
            traderinfo = request.user.traderinfo
            traderinfo.last_data_refresh_time = new_account.time_added
            traderinfo.save()
        logger.info(f'Done adding a trading account for user with id {user.id}')

    @staticmethod
    def handle_resolve_add_account_exception(user, data, exc):
        account_details = {
            'name': data.get('name'),
            'server': data.get('server'),
            'login': data.get('login'),
            'platform': data.get('platform')
        }
        def create_add_account_error(err):
            AddAccountError.objects.create(**account_details, user=user, error=err)
        if isinstance(exc, (
                metaapi.BrokerNotSupportedError,
                metaapi.UserAuthenticationError,
                metaapi.CurrentlyUnavailableError,
                metaapi.UnknownError
            )
        ):
            logger.info(f'Encountered a MetaApi error while adding account for user {user.id}')
            MetaApiError.objects.create(user=user, error=exc.detail)
            if isinstance(exc, metaapi.BrokerNotSupportedError):
                create_add_account_error({'server': [exc.detail]})
            else:
                create_add_account_error({'non_field_errors': [exc.detail]})
        elif isinstance(exc, IntegrityError):
            if any((
                exc.args[0].count(constraint) != 0
                for constraint in ('trader_no_duplicate_account', 'trader_unique_ma_account_id') 
            )):
                create_add_account_error({'non_field_errors': ['The account already exists.']})
            else:
                logger.exception('An unknown integrity error occured while adding an account')
                if hasattr(exc, 'detail'):
                    create_add_account_error({'non_field_errors': [exc.detail]})
                else:
                    create_add_account_error({'non_field_errors': ['unknown error']})
        else:
            logger.exception('Unknown error in add account')
            if hasattr(exc, 'detail'):
                create_add_account_error({'non_field_errors': [exc.detail]})
            else:
                create_add_account_error({'non_field_errors': ['unknown error']})

    def account_is_duplicate(self):
        return Account.objects.filter(
            name=self.request.data.get('name'),
            server=self.request.data.get('server'),
            login=self.request.data.get('login'),
            platform=self.request.data.get('platform'),
            user=self.request.user
        ).count() != 0
    
    def account_is_being_resolved(self):
        return UnresolvedAddAccount.objects.filter(
            name=self.request.data.get('name'),
            server=self.request.data.get('server'),
            login=self.request.data.get('login'),
            platform=self.request.data.get('platform'),
            user=self.request.user
        ).count() != 0

    
    def add_account_error_exists(self):
        return AddAccountError.objects.filter(
            name=self.request.data.get('name'),
            server=self.request.data.get('server'),
            login=self.request.data.get('login'),
            platform=self.request.data.get('platform'),
            user=self.request.user
        ).exists()
    
    def get_add_account_error(self):
        return AddAccountError.objects.get(
            name=self.request.data.get('name'),
            server=self.request.data.get('server'),
            login=self.request.data.get('login'),
            platform=self.request.data.get('platform'),
            user=self.request.user
        ).consume_error()

def resolve_add_account(data, user):
    try:
        AddTradingAccountView.add_account(data, user)
    except Exception as exc:
        AddTradingAccountView.handle_resolve_add_account_exception(user, data, exc)
    finally:
        UnresolvedAddAccount.objects.get(
            user=user,
            name=data['name'],
            login=data['login'],
            server=data['server'],
            platform=data['platform']
        ).delete()


class PendingAddTradingAccount(APIView):
    permission_classes = [IsAuthenticated, IsTrader]

    def post(self, request, *args, **kwargs):
        logger.info(f'Received follow up request for add account from user {request.user.id}')
        if self.account_is_being_resolved():
            logger.info(f'User {request.user.id}\'s account is still being added, returning pending response')
            return Response({'detail': 'pending'}, status=status.HTTP_200_OK)
        if self.account_has_been_added():
            logger.info(f'User {request.user.id}\'s account has been successfully added, returning init data')
            resp_data = GetInitData.build_init_data(request)
            return Response(resp_data, status=status.HTTP_201_CREATED)
        if self.add_account_error_exists():
            logger.info(f'User {request.user.id}\'s add account resolved with an error, returning error')
            error = self.get_add_account_error()
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'account details not found'}, status=status.HTTP_400_BAD_REQUEST)
    
    def account_is_being_resolved(self):
        return UnresolvedAddAccount.objects.filter(
            name=self.request.data.get('name'),
            server=self.request.data.get('server'),
            login=self.request.data.get('login'),
            platform=self.request.data.get('platform'),
            user=self.request.user
        ).count() != 0

    
    def add_account_error_exists(self):
        return AddAccountError.objects.filter(
            name=self.request.data.get('name'),
            server=self.request.data.get('server'),
            login=self.request.data.get('login'),
            platform=self.request.data.get('platform'),
            user=self.request.user
        ).exists()
    
    def get_add_account_error(self):
        return AddAccountError.objects.get(
            name=self.request.data.get('name'),
            server=self.request.data.get('server'),
            login=self.request.data.get('login'),
            platform=self.request.data.get('platform'),
            user=self.request.user
        ).consume_error()

    def account_has_been_added(self):
        return Account.objects.filter(
            name=self.request.data.get('name'),
            server=self.request.data.get('server'),
            login=self.request.data.get('login'),
            platform=self.request.data.get('platform'),
            user=self.request.user
        ).count() != 0

    
class RefreshData(APIView):
    permission_classes = [IsAuthenticated, IsTrader]
    
    def get(self, request, *args, **kwargs):
        logger.info(f'Received refresh data request from user {request.user.id}')
        if self.refresh_account_data_is_being_resolved():
            logger.info(f'User {request.user.id} account data is still being refreshed, returning pending')
            return Response({'detail': 'pending'})
        if self.refresh_account_error_exists():
            logger.info(f'User {request.user.id} account data refresh resolved with an error, returning error')
            error = self.get_refresh_account_error()
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        logger.info(f'Placing refresh account data request on queue for user {request.user.id}')
        UnresolvedRefreshAccount.objects.create(user=request.user)
        rq_enqueue(resolve_refresh_account_data, request.user)
        return Response({'detail': 'pending'})
    
    def refresh_account_data_is_being_resolved(self):
        return UnresolvedRefreshAccount.objects.filter(
            user=self.request.user
        ).count() != 0
    
    def refresh_account_error_exists(self):
        return RefreshAccountError.objects.filter(
            user=self.request.user
        ).exists()
    
    def get_refresh_account_error(self):
        return RefreshAccountError.objects.get(user=self.request.user).consume_error()

    @staticmethod
    @transaction.atomic
    def refresh_account_data(trader: Trader):
        mtapi = metaapi.MetaApi()
        for account, unsaved_data in mtapi.get_all_unsaved_data(trader):
            if account.deployed:
                (account_info, unsaved_trade_data, unsaved_deposit_data,
                    unsaved_withdrawal_data, unsaved_unknown_transaction_data) = unsaved_data
                account.update_account(
                    account_info,
                    unsaved_trade_data,
                    unsaved_deposit_data,
                    unsaved_withdrawal_data,
                    unsaved_unknown_transaction_data
                )
        trader.traderinfo.last_data_refresh_time = timezone.now()
        trader.traderinfo.save()

    @staticmethod
    def handle_resolve_refresh_account_exception(trader, exc):
        logger.exception('Unknown error in refresh account')
        if isinstance(exc, metaapi.UnknownError):
            MetaApiError.objects.create(user=trader, error=exc.detail)
            RefreshAccountError.objects.create(user=trader, error={'detail': exc.detail})
        else:
            RefreshAccountError.objects.create(user=trader, error={'detail': 'unknown error'})

def resolve_refresh_account_data(trader):
    try:
        RefreshData.refresh_account_data(trader)
    except Exception as exc:
        RefreshData.handle_resolve_refresh_account_exception(trader, exc)
    finally:
        UnresolvedRefreshAccount.objects.get(user=trader).delete()


class PendingRefreshData(APIView):
    permission_classes = [IsAuthenticated, IsTrader]

    def get(self, request, *args, **kwargs):
        logger.info(f'Received follow up request for refreshing data from user {request.user.id}')
        if self.refresh_account_data_is_being_resolved():
            logger.info(f'User {request.user.id}\'s account data is still being refreshed, returning pending')
            return Response({'detail': 'pending'})
        if self.refresh_account_error_exists():
            logger.info(f'User {request.user.id}\'s account data refresh was '
                'resolved with an error, returning error')
            error = self.get_refresh_account_error()
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        logger.info(f'User {request.user.id}\'s account data has been refreshed, returning init data')
        updated_data = GetInitData.build_init_data(request)
        return Response(updated_data)
    
    def refresh_account_data_is_being_resolved(self):
        return UnresolvedRefreshAccount.objects.filter(
            user=self.request.user
        ).exists()

    def refresh_account_error_exists(self):
        return RefreshAccountError.objects.filter(
            user=self.request.user
        ).exists()
    
    def get_refresh_account_error(self):
        return RefreshAccountError.objects.get(user=self.request.user).consume_error()

ERROR_FROM_METAAPI = 550


class RemoveTradingAccountView(APIView):
    permission_classes = [IsAuthenticated, IsTrader]
    
    def delete(self, request, pk, *args, **kwargs):
        logger.info(f'Received request from user {request.user.id} to remove trading account {pk}')
        if not self.account_exists(pk):
            logger.info(f'Trading account {pk} requested for removal by user {request.user.id} either '
                'has already been removed or never existed, returning removed')
            return Response({'detail': 'removed'})
        if not self.user_is_account_owner(pk):
            logger.info(f'User {request.user.id} requested trading account removal '
                'for a trading account that is for someone else, returning unauthorized')
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        account = Account.objects.get(id=pk)
        if self.account_removal_is_being_resolved(account):
            logger.info(f'Trading account {pk} of user {request.user.id} is '
                'still being removed, returning pending')
            return Response({'detail': 'pending'})
        if self.remove_account_error_exists(account):
            logger.info(f'Trading account removal of account {pk} of user {request.user.id} '
                'resolved with an error, returning error')
            error = self.get_remove_account_error(account)
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        logger.info(f'Placing request to remove trading account {pk} of user {request.user.id} on queue')
        UnresolvedRemoveAccount.objects.create(user=request.user, account=account)
        rq_enqueue(resolve_remove_trading_account, request.user, account)
        return Response({'detail': 'pending'})
    
    def account_exists(self, pk):
        return Account.objects.filter(id=pk).exists()
    
    def user_is_account_owner(self, pk):
        return Account.objects.get(id=pk).user == self.request.user
    
    def remove_account_error_exists(self, account):
        return RemoveAccountError.objects.filter(
            user=self.request.user, account=account
        ).exists()
    
    def get_remove_account_error(self, account):
        return RemoveAccountError.objects.get(
            user=self.request.user, account=account
        ).consume_error()
    
    def account_removal_is_being_resolved(self, account):
        return UnresolvedRemoveAccount.objects.filter(
            user=self.request.user,
            account=account
        ).exists()

    @staticmethod
    def remove_trading_account(user, account):
        mtapi = metaapi.MetaApi()
        mtapi.remove_account(account.ma_account_id)
        UnresolvedRemoveAccount.objects.get(user=user, account=account).delete()
        account.delete()

    def handle_exception(self, exc):
        if isinstance(exc, Account.DoesNotExist):
            return Response(
                {'detail': 'Account with requested id does not exist.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().handle_exception(exc)
    
    @staticmethod
    def handle_resolve_remove_trading_account_exception(user, account, exc):
        logger.exception('Unknown error occured in remove trading account')
        if isinstance(exc, metaapi.UnknownError):
            MetaApiError.objects.create(user=user, error=exc.detail)
            RemoveAccountError.objects.create(user=user, account=account, error={'detail': exc.detail})
        else:
            RemoveAccountError.objects.create(user=user, account=account, error={'detail': 'unknown error'})
        UnresolvedRemoveAccount.objects.get(user=user, account=account).delete()
        

@transaction.atomic
def resolve_remove_trading_account(user, account, post_success_func=None, post_error_func=None):
    try:
        RemoveTradingAccountView.remove_trading_account(user, account)
        if post_success_func:
            post_success_func()
    except Exception as exc:
        if post_error_func:
            post_error_func()
        RemoveTradingAccountView.handle_resolve_remove_trading_account_exception(user, account, exc)


class RecordNewSubscriptionView(APIView):
    permission_classes = [IsAuthenticated, IsTrader]

    def post(self, request):
        logger.info(f'Received request to record new subscription from user {request.user.id}')
        serializer = RecordNewSubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            logger.info(f'Data submitted by user {request.user.id} to record new subscription validated')
            if not request.user.subscriptioninfo.is_subscribed:
                logger.info(f'Recording user {request.user.id} as subscribed')
                FLUTTERWAVE = SubscriptionInfo.FLUTTERWAVE
                self.record_trader_as_subscribed(payment_method=FLUTTERWAVE)
                if self.user_has_undeployed_accounts():
                    logger.info(f'Placing request to redeploy trading accounts '
                        f'of user {request.user.id} on queue')
                    UnresolvedDeployAccount.objects.create(user=request.user)
                    rq_enqueue(resolve_deploy_account, request.user)
                    return Response({'status': 'pending'})
            if self.account_deployment_is_being_resolved():
                logger.info(f'User {request.user.id}\'s trading account are being redeployed, returning pending')
                return Response({'status': 'pending'})
            if self.deploy_account_error_exists():
                logger.info(f'User {request.user.id}\'s trading account redeployment '
                    'resolved with an error, returning error')
                error = self.get_deploy_account_error()
                return Response(error, status=status.HTTP_400_BAD_REQUEST)
            logger.info(f'User {request.user.id} is already recorded as subscribed, '
                'and there are no accounts to redeploy, returning not pending')
            return Response({'status': 'not pending'})
        logger.info(f'Data submitted by user {request.user.id} to record new '
            'subscription has errors, returning errors')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    
    def record_trader_as_subscribed(self, payment_method: int):
        request = self.request
        MONTHLY = SubscriptionInfo.MONTHLY
        YEARLY = SubscriptionInfo.YEARLY
        CODE = SubscriptionInfo.CODE
        if request.data.get('amount') == settings.MONTHLY_PLAN_PRICE:
            PLAN_INDEX = MONTHLY
        else:
            PLAN_INDEX = YEARLY
        request.user.subscriptioninfo.last_billed_time = settings.TIMEFUNC()
        request.user.subscriptioninfo.is_subscribed = True
        request.user.subscriptioninfo.payment_method = SubscriptionInfo.PAYMENT_CHOICES[payment_method][CODE]
        request.user.subscriptioninfo.subscription_plan = SubscriptionInfo.PLAN_CHOICES[PLAN_INDEX][CODE]
        request.user.subscriptioninfo.save()
    
    def user_has_undeployed_accounts(self):
        return Account.objects.filter(user=self.request.user)

    def account_deployment_is_being_resolved(self):
        return UnresolvedDeployAccount.objects.filter(
            user=self.request.user
        ).count() != 0
    
    def deploy_account_error_exists(self):
        return DeployAccountError.objects.filter(
            user=self.request.user
        ).exists()
    
    def get_deploy_account_error(self):
        return DeployAccountError.objects.get(
            user=self.request.user
        ).consume_error()
    
    @staticmethod
    @transaction.atomic
    def deploy_account(trader: Trader):
        mtapi = metaapi.MetaApi()
        for account in Account.objects.filter(user=trader):
            mtapi.redeploy_account(account.ma_account_id)
            account.deployed = True
            account.save()

    @staticmethod
    def handle_resolve_deploy_account_exception(trader, exc):
        logger.exception('An unknown error occured while redeploying account in record new subscription')
        if isinstance(exc, metaapi.UnknownError):
            MetaApiError.objects.create(user=trader, error=exc.detail)
            DeployAccountError.objects.create(user=trader, error={'detail': exc.detail})
        else:
            DeployAccountError.objects.create(user=trader, error={'detail': 'unknown error'})

def resolve_deploy_account(trader):
    try:
        RecordNewSubscriptionView.deploy_account(trader)
    except Exception as exc:
        RecordNewSubscriptionView.handle_resolve_deploy_account_exception(trader, exc)
    finally:
        UnresolvedDeployAccount.objects.get(user=trader).delete()

from flutterwave_endpoint import flwapi

class CancelSubscriptionView(APIView):
    permission_classes = [IsAuthenticated, IsTrader]

    def get(self, request, *args, **kwargs):
        logger.info(f'Received request to cancel subscription from user {request.user.id}')
        if not request.user.is_subscribed:
            logger.info(f'User {request.user.id} is already recorded as unsubscribed, either it had always'
                'been that way or a previous request to unsubscribe has been resolved, returning not pending')
            return Response({'detail': 'not pending'})
        if self.unsubscription_is_being_resolved():
            logger.info(f'user{request.user.id}\'s unsubscription is still being resolved, returning pending')
            return Response({'detail': 'pending'})
        if self.unsubscription_error_exists():
            logger.info(f'User {request.user.id}\'s unsubscription resolved with errors, returning errors')
            error = self.get_unsubscription_error()
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        logger.info(f'Placing request to cancel user {request.user.id}\'s subscription on queue')
        rq_enqueue(resolve_unsubscription, request.user)
        UnresolvedUnsubscription.objects.create(user=request.user)
        return Response({'detail': 'pending'})
    
    def unsubscription_is_being_resolved(self):
        return UnresolvedUnsubscription.objects.filter(
            user=self.request.user
        ).exists()

    def unsubscription_error_exists(self):
        return UnsubscriptionError.objects.filter(
            user=self.request.user
        ).exists()

    def get_unsubscription_error(self):
        return UnsubscriptionError.objects.get(
            user=self.request.user
        ).consume_error()

    @staticmethod
    @transaction.atomic
    def unsubscribe_user(trader: Trader):
        mtapi = metaapi.MetaApi()
        for account in Account.objects.filter(user=trader):
            mtapi.undeploy_account(account.ma_account_id)
            account.deployed = False
            account.save()
        flapi = flwapi.FlApi()
        flapi.cancel_subscription(trader.email)
        trader.subscriptioninfo.is_subscribed = False
        trader.subscriptioninfo.save()
    
    @staticmethod
    def handle_unsubscribe_exception(trader, exc):
        logger.exception('An unknown error occured while cancelling subscription')
        if isinstance(exc, metaapi.UnknownError):
            MetaApiError.objects.create(user=trader, error=exc.detail)
            UnsubscriptionError.objects.create(user=trader, error={'detail': exc.detail})
        elif isinstance(exc, flwapi.PlanStatusError):
            FlutterwaveError.objects.create(err_type=exc.type, err_data=exc.err)
            UnsubscriptionError.objects.create(user=trader, error={'detail': exc.type})
        else:
            UnsubscriptionError.objects.create(user=trader, error={'detail': 'unknown error'})

def resolve_unsubscription(trader: Trader):
    try:
        CancelSubscriptionView.unsubscribe_user(trader)
    except Exception as exc:
        CancelSubscriptionView.handle_unsubscribe_exception(trader, exc)
    finally:
        UnresolvedUnsubscription.objects.get(user=trader).delete()

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

def create_tester_accounts(request):
    """
    Create accounts for the beta testing guys
    """
    emails = [
        'tegaabiri08@gmail.com', 'dharey77@gmail.com', 'ezefranklin2@gmail.com',
        'prinzkuldek@gmail.com', 'thejoshuasamuel@gmail.com', 'omoniyitolulope05@gmail.com',
        'owiefavour7@gmail.com', 'fadaofficial01@gmail.com', 'oyewaledaniel48@gmail.com',
        'bisiriyuadeniyi21@gmail.com', 'olakunlelawal290@gmail.com', 'wondyolulana@gmail.com'
    ]
    for email in emails:
        if not Trader.objects.filter(email=email).exists():
            new_tester = Trader.objects.create(email=email, password='password')
            try:
                email_info = new_tester.emailaddress_set.all()[0]
                email_info.verified = True
                email_info.save()
            except Exception:
                pass
        tester = Trader.objects.get(email=email)
        if tester.emailaddress_set.all().count() == 0:
            from allauth.account.models import EmailAddress
            EmailAddress.objects.create(user=tester, email=email, verified=True, primary=True)
    from django.http import HttpResponse
    return HttpResponse()

login = LoginView.as_view()
sign_up = RegisterView.as_view()
logout = Logout.as_view()
delete_account = DeleteAccountView.as_view()
get_all_notes = NoteViewSet.as_view({'get': 'list'})
save_note = NoteViewSet.as_view({'post': 'create'})
update_note = NoteViewSet.as_view({'put': 'partial_update'})
delete_note = NoteViewSet.as_view({'delete': 'destroy'})
get_init_data = GetInitData.as_view()
redirect_to_signup = RedirectToSignup.as_view()
add_trading_account = AddTradingAccountView.as_view()
pending_add_trading_account = PendingAddTradingAccount.as_view()
refresh_data = RefreshData.as_view()
pending_refresh_data = PendingRefreshData.as_view()
remove_trading_account = RemoveTradingAccountView.as_view()
record_new_subscription = RecordNewSubscriptionView.as_view()
cancel_subscription = CancelSubscriptionView.as_view()