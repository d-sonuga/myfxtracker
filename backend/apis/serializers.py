from django.db.models.fields import DateField
from rest_framework import serializers
from .models import Trade, Deposit, Withdrawal, Account, Preferences
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


def switch_db_str(item, field, direction):
    # 'b' -> 'Buy' when choices are action choices, direction is 1 (FROM_STR)
    # 'AUDUSD' -> 'auus' when choices are pair choices and direction is 0 (TO_STR)
    choices = Trade.pair_choices if field == Choice.PAIRS else Trade.action_choices
    n = 0 if direction == Choice.TO_STR else 1
    for choice in choices:
        if item == choice[1 - n]:
            return choice[n]
    return item
