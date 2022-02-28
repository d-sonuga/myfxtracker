from collections import namedtuple
from datetime import datetime
from django.db import IntegrityError, models
from django.core.serializers.json import DjangoJSONEncoder
from django.utils import timezone
from users.models import Trader, User


class IntegerFromCharField(models.CharField):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def to_python(self, value):
        value_in_str = super().to_python(value).split('.')[0]
        return float(value_in_str)
    
    def get_prep_value(self, value):
        return str(value)


class TransactionIdField(IntegerFromCharField):
    """
    To store transaction ids for trades, deposits and withdrawals.
    Stores them as characters, loads them as integers
    """
    def __init__(self, unique=False, *args, **kwargs):
        super().__init__(unique=unique, max_length=100)


class MagicNumberField(IntegerFromCharField):
    """
    To store transaction magic numbers for transactions
    Stores them as characters, loads them as integers
    """
    def __init__(self, *args, **kwargs):
        super().__init__(max_length=100)


class AccountManager(models.Manager):
    def create_account(self, user, rawdata):
        new_account = self.create(
            user=user,
            currency=rawdata['account-currency'],
            broker=rawdata['account-company'],
            name=rawdata['account-name'],
            trade_server=rawdata['account-server'],
            credit=rawdata['account-credit'],
            profit_loss=rawdata['account-profit'],
            equity=rawdata['account-equity'],
            margin=rawdata['account-margin'],
            free_margin=rawdata['account-free-margin'],
            margin_level=rawdata['account-margin-level'],
            margin_call_level=rawdata['account-margin-call-level'],
            margin_stopout_level=rawdata['account-margin-stopout-level'],
            login_number=rawdata['account-login-number'],
            leverage=rawdata['account-leverage'],
            type=rawdata['account-trade-mode'],
            stopout_level_format=rawdata['account-stopout-level-format']
        )
        for trade_data in get_account_trades(rawdata['account-transactions']):
            Trade.objects.create_trade(new_account, trade_data)
        for deposit_data in get_account_deposits(rawdata['account-transactions']):
            Deposit.objects.create_deposit(new_account, deposit_data)
        for withdrawal_data in get_account_withdrawals(rawdata['account-transactions']):
            Withdrawal.objects.create_withdrawal(new_account, withdrawal_data)
        for unknown_transaction_data in get_account_unknown_transactions(rawdata['account-transactions']):
            UnknownTransaction.objects.create_unknown_transaction(new_account, unknown_transaction_data)
        return new_account
    
    def get_by_name_broker_login_no(self, name, broker, login_no):
        return self.get(name=name, broker=broker, login_number=login_no)


def is_deposit(item):
    return item['action'] == 'deposit' and item['pair'] is None

def is_withdrawal(item):
    return item['action'] == 'withdrawal' and item['pair'] is None


def get_account_trades(transaction_data):
    return list(filter(
            lambda item:
                not is_deposit(item) and
                not is_withdrawal(item)
                and item['pair'] is not None,
            transaction_data
        )
    )

def get_account_deposits(transaction_data):
    return list(filter(
            is_deposit,
            transaction_data
        )
    )

def get_account_withdrawals(transaction_data):
    return list(filter(
            is_withdrawal,
            transaction_data
        )
    )


def get_account_unknown_transactions(transaction_data):
    account_trades = get_account_trades(transaction_data)
    non_trades = filter(
        lambda item:
            item not in account_trades,
            transaction_data
    )
    return ((
        transaction for transaction in non_trades
        if not is_deposit(transaction) and not is_withdrawal(transaction)
    ))


class Account(models.Model):
    stopout_level_formats = (
        ('p', 'percentage'),
        ('m', 'money')
    )
    account_types = (
        ('d', 'demo'),
        ('c', 'contest'),
        ('r', 'real')
    )
    name = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    login_number = TransactionIdField()
    currency = models.TextField()
    broker = models.TextField()
    trade_server = models.TextField()
    balance = models.DecimalField(decimal_places=2, max_digits=19, default=0)
    credit = models.DecimalField(decimal_places=2, max_digits=19)
    profit_loss = models.DecimalField(decimal_places=2, max_digits=19)
    equity = models.DecimalField(decimal_places=2, max_digits=19)
    margin = models.DecimalField(decimal_places=2, max_digits=19)
    margin_level = models.DecimalField(decimal_places=2, max_digits=19)
    free_margin = models.DecimalField(decimal_places=2, max_digits=19)
    margin_call_level = models.DecimalField(decimal_places=2, max_digits=19)
    margin_stopout_level = models.DecimalField(decimal_places=2, max_digits=19)
    leverage = models.DecimalField(decimal_places=2, max_digits=19)
    stopout_level_format = models.CharField(choices=stopout_level_formats, max_length=10)
    type = models.CharField(choices=account_types, max_length=10)

    objects = AccountManager()

    def no_of_trades(self):
        return self.trade_set.all().count()
    
    def no_of_deposits(self):
        return self.deposit_set.all().count()
    
    def no_of_withdrawals(self):
        return self.withdrawal_set.all().count()
    
    def save_trades(self, transaction_data):
        for trade in get_account_trades(transaction_data):
            try:
                Trade.objects.create_trade(self, trade)
            except IntegrityError:
                pass
    
    def save_deposits(self, transaction_data):
        for deposit in get_account_deposits(transaction_data):
            try:
                Deposit.objects.create_deposit(self, deposit)
            except IntegrityError:
                pass

    def save_withdrawals(self, transaction_data):
        for withdrawal in get_account_withdrawals(transaction_data):
            try:
                Withdrawal.objects.create_withdrawal(self, withdrawal)
            except IntegrityError:
                pass
    
    def get_all_deposits(self):
        return self.deposit_set.all()
    
    def get_all_withdrawals(self):
        return self.withdrawal_set.all()

    def get_all_trades(self):
        return self.trade_set.all()

    def __str__(self):
        return f'{self.user.username}\'s account'
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['login_number', 'user'], name='trader_no_duplicate_account')
        ]


class TradeManager(models.Manager):
    def create_trade(self, account, rawdata):
        swap = float(rawdata['swap'])
        commission = float(rawdata['commission'])
        return self.create(
            account=account,
            pair=rawdata['pair'],
            open_price=float(rawdata['open-price']),
            close_price=float(rawdata['close-price']),
            profit_loss=float(rawdata['profit']),
            open_time=format_time(rawdata['open-time']),
            close_time=format_time(rawdata['close-time']),
            trade_id=int(rawdata['transaction-id']),
            action=rawdata['action'],
            swap=swap if swap >= 0 else swap * -1,
            commission=commission if commission >= 0 else commission * -1,
            stop_loss=float(rawdata['stop-loss']),
            take_profit=float(rawdata['take-profit']),
            comment=rawdata['comment'],
            magic_number=float(rawdata['magic-number'])
        )
    

class Trade(models.Model):
    pair = models.CharField(max_length=10)
    action = models.CharField(max_length=50)
    entry_date = models.DateField(null=True)
    exit_date = models.DateField(blank=True, null=True)
    risk_reward_ratio = models.DecimalField(decimal_places=2, max_digits=19, null=True)
    profit_loss = models.DecimalField(decimal_places=2, max_digits=19)
    open_price = models.DecimalField(decimal_places=2, max_digits=19)
    close_price = models.DecimalField(decimal_places=2, max_digits=19)
    take_profit = models.DecimalField(decimal_places=2, max_digits=19)
    stop_loss = models.DecimalField(decimal_places=2, max_digits=19)
    swap = models.DecimalField(decimal_places=2, max_digits=19)
    commission = models.DecimalField(decimal_places=2, max_digits=19)
    comment = models.TextField(null=True)
    open_time = models.DateTimeField()
    close_time = models.DateTimeField()
    # order ticket id in mt4, position id in mt5
    trade_id = TransactionIdField()
    magic_number = MagicNumberField()
    pips = models.DecimalField(decimal_places=2, max_digits=19, null=True)
    notes = models.TextField(blank=True, null=True)
    entry_image_link = models.URLField(blank=True, null=True)
    exit_image_link = models.URLField(blank=True, null=True)
    entry_image = models.ImageField(null=True)
    exit_image = models.ImageField(null=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)

    objects = TradeManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['account', 'trade_id'], name='trader_no_duplicate_trade')
        ]
        ordering = ('close_time',)


class DepositManager(models.Manager):
    def create_deposit(self, account, rawdata):
        self.create(
            account=account,
            amount=rawdata['profit'],
            time=format_time(rawdata['close-time']),
            deposit_id=format_time_for_saving_as_transaction_id(rawdata['transaction-id'])
        )
    
    def is_duplicate(self, account, rawdata):
        return self.filter(
            account=account,    
            deposit_id=int(rawdata['transaction-id'])
        ).count() != 0


class Deposit(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField(decimal_places=2, max_digits=19)
    time = models.DateTimeField()
    deposit_id = TransactionIdField()

    objects = DepositManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['account', 'deposit_id'], name='trader_no_duplicate_deposit')
        ]
        ordering = ('time',)


class WithdrawalManager(models.Manager):
    def create_withdrawal(self, account, rawdata):
        amount = float(rawdata['profit'])
        self.create(
            account=account,
            amount=amount if amount > 0 else amount * -1,
            time=format_time(rawdata['close-time']),
            withdrawal_id=format_time_for_saving_as_transaction_id(rawdata['transaction-id'])
        )
    
    def is_duplicate(self, account, rawdata):
        return self.filter(
            account=account,
            withdrawal_id=int(rawdata['transaction-id'])
        ).count() != 0


class Withdrawal(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField(decimal_places=2, max_digits=19)
    time = models.DateTimeField()
    withdrawal_id = TransactionIdField()

    objects = WithdrawalManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['account', 'withdrawal_id'], name='trader_no_duplicate_withdrawal')
        ]
        ordering = ('time',)


class UnknownTransactionManager(models.Manager):
    def create_unknown_transaction(self, account, rawdata):
        self.create(
            account=account,
            transaction_id=rawdata['transaction-id'],
            data=rawdata
        )


class UnknownTransaction(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    transaction_id = TransactionIdField()
    data = models.JSONField(encoder=DjangoJSONEncoder)

    objects = UnknownTransactionManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['account', 'transaction_id'],
                name='trader_no_duplicate_unknown_transaction'
            )
        ]


class NoteManager(models.Manager):
    def create(self, **kwargs):
        if kwargs.get('lastEdited'):
            kwargs['last_edited'] = kwargs['lastEdited']
            del kwargs['lastEdited']
        return super().create(**kwargs)


class Note(models.Model):
    user = models.ForeignKey(Trader, on_delete=models.CASCADE)
    title = models.CharField(max_length=10000)
    content = models.JSONField(encoder=DjangoJSONEncoder)
    last_edited = models.DateTimeField()

    objects = NoteManager()


class Preferences(models.Model):
    user = models.OneToOneField(Trader, on_delete=models.CASCADE)
    current_account = models.ForeignKey(Account, on_delete=models.CASCADE, null=True)


class DeletedImages(models.Model):
    url = models.CharField(max_length=100)


def format_time(time_str):
    """
    convert time from datasource format to one django's time field expects
    """
    date_time = time_str.split(' ')
    # if the time section has a dot instead of a column
    if date_time[1].find('.') != -1:
        date_time[1] = date_time[1].replace('.', ':')
    # remove milliseconds if any
    if len(date_time[1].split(':')) == 3:
        date_time[1] = date_time[1][:-3]
    time_str = ' '.join(date_time).replace('.', '-')
    return timezone.make_aware(datetime.strptime(time_str, '%Y-%m-%d %H:%M'))


def format_time_for_saving_as_transaction_id(value):
    # 'year.month.date hour:minute:second'
    date, time = value.split(' ')
    [year, month, day] = [int(val) for val in date.split('.')]
    [hour, minute, second] = [int(val) for val in time.split(':')]
    datetimestamp = datetime(
        year, month, day, hour, minute, second
    ).timestamp()
    transaction_id = ''.join((str(datetimestamp), str(second)))
    return transaction_id