import email
from django.db.models.fields import DateField
from dj_rest_auth.registration.serializers import RegisterSerializer as RestAuthRegisterSerializer
from rest_framework import serializers
from .models import Note, Trade, Deposit, Withdrawal, Account, Preferences
from users.models import Trader
from allauth.account.utils import setup_user_email
import datetime 
from enum import Enum


class Choice(Enum):
    PAIRS = 'pairs'
    ACTIONS = 'actions'
    TO_STR = 'to_str'
    FROM_STR = 'from_str'


class TradeSerializer(serializers.ModelSerializer):

    pair = serializers.CharField()
    action = serializers.CharField()


    def validate_action(self, value):
        if switch_db_str(value, Choice.ACTIONS, Choice.TO_STR):
            return value
        raise serializers.ValidationError('Action is invalid')

    def create(self, validated_data):
        validated_data['pair'] = switch_db_str(validated_data['pair'], Choice.PAIRS, Choice.TO_STR)
        validated_data['action'] = switch_db_str(validated_data['action'], Choice.ACTIONS, Choice.TO_STR)
        validated_data['date_added'] = datetime.date.today()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if validated_data.get('pair'):
            validated_data['pair'] = switch_db_str(validated_data['pair'], Choice.PAIRS, Choice.TO_STR)
        if validated_data.get('action'):
            validated_data['action'] = switch_db_str(validated_data['action'], Choice.ACTIONS, Choice.TO_STR)
        return super().update(instance, validated_data)

    class Meta:
        model = Trade
        fields = '__all__'


class DepositSerializer(serializers.ModelSerializer):

    class Meta:
        model = Deposit
        fields = '__all__'


class WithdrawalSerializer(serializers.ModelSerializer):

    class Meta:
        model = Withdrawal
        fields = '__all__'


class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        exclude = ['user']


class TradeListSerializer(serializers.ListField):
    child = TradeSerializer(many=True)


class DepositListSerializer(serializers.ListField):
    child = DepositSerializer(many=True)


class WithdrawalListSerializer(serializers.ListField):
    child = WithdrawalSerializer(many=True)


class DataSerializer(serializers.Serializer):
    current_account_i = serializers.IntegerField()
    trades_list = TradeListSerializer()
    deposits_list = DepositListSerializer()
    withdrawals_list = WithdrawalListSerializer()

    def create(self, validated_data):
        return

    def update(self, instance, validated_data):
        return


class InitDataSerializer(serializers.Serializer):
    accounts = AccountSerializer(many=True)
    data = DataSerializer()

    def create(self, validated_data):
        return

    def update(self, instance, validated_data):
        return


class PrefSerializer(serializers.ModelSerializer):

    class Meta:
        model = Preferences
        fields = '__all__'

class SignUpSerializer(RestAuthRegisterSerializer):
    howYouHeard = serializers.CharField(max_length=100, required=True)
    yearsSpentTrading = serializers.CharField(max_length=100, required=True)

    def save(self, request):
        """
        Todo: Check if the referrer is valid
        """
        new_trader = Trader.objects.create(
            email=self.validated_data['email'],
            password=self.validated_data['password1'],
            how_you_heard_about_us=self.validated_data['howYouHeard'],
            trading_time_before_joining=self.validated_data['yearsSpentTrading'],
            referrer=request.data.get('referrer')
        )
        setup_user_email(request, new_trader, [])
        return new_trader


def switch_db_str(item, field, direction):
    # 'b' -> 'Buy' when choices are action choices, direction is 1 (FROM_STR)
    # 'AUDUSD' -> 'auus' when choices are pair choices and direction is 0 (TO_STR)
    choices = Trade.pair_choices if field == Choice.PAIRS else Trade.action_choices
    n = 0 if direction == Choice.TO_STR else 1
    for choice in choices:
        if item == choice[1 - n]:
            return choice[n]
    return item



class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'


class AddAccountInfoSerializer(serializers.Serializer):
    login = serializers.IntegerField()
    password = serializers.CharField(max_length=300)
    server = serializers.CharField(max_length=300)
    platform = serializers.CharField(max_length=5)

    def validate_login(self, login):
        """
        An MT login number is always greater than 0
        """
        if login <= 0:
            raise serializers.ValidationError('A valid login is required.')
        return login
    
    def validate_password(self, password):
        """
        I'm guessing that an MT password is always greater than or equal to 5
        """
        if len(password) < 5:
            raise serializers.ValidationError('A valid password is required.')
        return password

    def validate_platform(self, platform):
        """
        A platform can be either mt4 or mt5
        """
        if platform not in ('mt4', 'mt5'):
            raise serializers.ValidationError('A valid platform is required.')
        return platform