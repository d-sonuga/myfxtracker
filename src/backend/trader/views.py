import datetime
from inspect import trace
from platform import platform
from sqlite3 import connect
from django.shortcuts import redirect
from django.utils import timezone
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
from users.models import Trader, User
from trader.models import Note
from .serializers import (TradeSerializer, DepositSerializer, AccountSerializer, PrefSerializer,
                          WithdrawalSerializer, switch_db_str, Choice, NoteSerializer)
from .models import AddAccountError, Trade, Deposit, UnknownTransaction, UnresolvedAddAccount, Withdrawal, Account, Preferences, MetaApiError
from .permissions import IsOwner, IsAccountOwner, IsTraderOrAdmin, IsTrader
import datetime as dt
from .serializers import AddAccountInfoSerializer
from . import metaapi
from django.db import IntegrityError, connection, transaction
from .permissions import IsRefreshRequestFromSite, IsTradingAccountOwner


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
        request.user.auth_token.delete()
        return Response()


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated, IsTrader]

    def delete(self, request):
        request.user.delete()
        return Response()


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
        accounts = Account.objects.filter(user=request.user)
        trader_pref = Preferences.objects.get(user=request.user)
        current_account_id = (
            trader_pref.current_account.id
            if trader_pref.current_account is not None
            else -1
        )
        last_data_refresh_time = request.user.last_data_refresh_time
        init_data = {
            'user_data': {
                'id': request.user.id,
                'email': request.user.email,
                'is_subscribed': request.user.subscriptioninfo.is_subscribed,
                'on_free': request.user.subscriptioninfo.on_free,
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

class AddTradingAccountView(APIView):
    permission_classes = [IsAuthenticated, IsTrader]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        reg_account_info_serializer = AddAccountInfoSerializer(data=request.data)
        if reg_account_info_serializer.is_valid():
            if self.account_is_duplicate():
                return Response(
                    {'non_field_errors': ['The account already exists.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if self.account_is_being_resolved():
                return Response({'detail': 'pending'}, status=status.HTTP_200_OK)
            UnresolvedAddAccount.objects.create(
                user=request.user,
                name=request.data['name'],
                login=request.data['login'],
                server=request.data['server'],
                platform=request.data['platform']
            )
            django_rq.enqueue(resolve_add_account, request.data, request.user)
            return Response({'detail': 'pending'}, status=status.HTTP_200_OK)
        return Response(reg_account_info_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

def resolve_add_account(data, user):
    try:
        class classyrequest:
            def __init__(self, data, user):
                self.data = data
                self.user = user
        request = classyrequest(data, user)
        mtapi = metaapi.MetaApi()
        ma_acc_id, account_name = mtapi.create_account(request.data)
        (account_data, trade_data, deposit_data, withdrawal_data, 
            unknown_transaction_data) = mtapi.get_all_data(ma_acc_id, account_name)
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
            traderinfo = request.user.traderinfo
            traderinfo.last_data_refresh_time = new_account.time_added
            traderinfo.save()
    except Exception as exc:
        handle_resolve_add_account_exception(request, exc)
    finally:
        UnresolvedAddAccount.objects.get(
            user=request.user,
            name=request.data['name'],
            login=request.data['login'],
            server=request.data['server'],
            platform=request.data['platform']
        ).delete()

def handle_resolve_add_account_exception(request, exc):
    account_details = {
        'name': request.data.get('name'),
        'server': request.data.get('server'),
        'login': request.data.get('login'),
        'platform': request.data.get('platform')
    }
    def create_add_account_error(err):
        AddAccountError.objects.create(**account_details, user=request.user, error=err)
    if isinstance(exc, (
            metaapi.BrokerNotSupportedError,
            metaapi.UserAuthenticationError,
            metaapi.CurrentlyUnavailableError,
            metaapi.UnknownError
        )
    ):
        MetaApiError.objects.create(user=request.user, error=exc.detail)
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
            create_add_account_error({'non_field_errors': ['unknown error']})
    else:
        create_add_account_error({'non_field_errors': ['unknown error']})


class PendingAddTradingAccount(APIView):
    permission_classes = [IsAuthenticated, IsTrader]

    def post(self, request, *args, **kwargs):
        details = {
            'name': request.data.get('name'),
            'server': request.data.get('server'),
            'login': request.data.get('login'),
            'platform': request.data.get('platform')
        }
        unresolved_account_set = UnresolvedAddAccount.objects.filter(user=request.user, **details)
        if unresolved_account_set.count() != 0:
            return Response({'detail': 'pending'}, status=status.HTTP_200_OK)
        account_set = Account.objects.filter(user=request.user, **details)
        if account_set.count() != 0:
            resp_data = GetInitData.build_init_data(request)
            return Response(resp_data, status=status.HTTP_201_CREATED)
        else:
            add_account_error_set = AddAccountError.objects.filter(**details, user=request.user)
            if add_account_error_set.count() != 0:
                add_account_error = add_account_error_set[0]
                resp_data = add_account_error.error
                add_account_error.delete()
                return Response(resp_data, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'detail': 'account details not found'}, status=status.HTTP_400_BAD_REQUEST)

    
class RefreshData(APIView):
    permission_classes = [IsAuthenticated, IsTrader]
    def get(self, request, *args, **kwargs):
        RefreshData.refresh_account_data(request.user)
        updated_data = GetInitData.build_init_data(request)
        return Response(updated_data)
    
    @staticmethod
    def refresh_account_data(trader: Trader):
        mtapi = metaapi.MetaApi()
        for account, unsaved_data in mtapi.get_all_unsaved_data(trader):
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

    def handle_exception(self, exc):
        if isinstance(exc, metaapi.UnknownError):
            MetaApiError.objects.create(user=self.request.user, error=exc.detail)
            return Response({'detail': exc.detail}, status.HTTP_400_BAD_REQUEST)
        return super().handle_exception(exc)

ERROR_FROM_METAAPI = 550

class RefreshAllAccountsData(APIView):
    """
    To be called periodically to update all account data
    If any error occurs, the a response with status
    ERROR_NOT_ALL_ACCOUNTS_UPDATED will be returned, but that won't
    stop it from attempting to update the other accounts.
    """
    permission_classes = [IsRefreshRequestFromSite]

    def get(self, request, *args, **kwargs):
        error_occured = False
        for trader in Trader.objects.all():
            try:
                RefreshData.refresh_account_data(trader)
            except metaapi.UnknownError as exc:
                MetaApiError.objects.create(user=trader, error=exc.detail)
                error_occured = True
        if error_occured:
            return Response(status=ERROR_FROM_METAAPI)
        return Response()


class RemoveTradingAccount(APIView):
    permission_classes = [IsAuthenticated, IsTrader]
    
    @transaction.atomic
    def delete(self, request, pk, *args, **kwargs):
        account = Account.objects.get(user=request.user, id=pk)
        mtapi = metaapi.MetaApi()
        mtapi.remove_account(account.ma_account_id)
        account.delete()
        return Response()
    
    def handle_exception(self, exc):
        if isinstance(exc, Account.DoesNotExist):
            return Response(
                {'detail': 'Account with requested id does not exist.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if isinstance(exc, metaapi.UnknownError):
            MetaApiError.objects.create(user=self.request.user, error=exc.detail)
            return Response(
                {'detail': exc.detail},
                status=ERROR_FROM_METAAPI
            )
        return super().handle_exception(exc)

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
refresh_all_accounts_data = RefreshAllAccountsData.as_view()
remove_trading_account = RemoveTradingAccount.as_view()