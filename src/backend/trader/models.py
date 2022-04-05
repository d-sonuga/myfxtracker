from datetime import datetime
from django.db import IntegrityError, models, transaction
from django.core.serializers.json import DjangoJSONEncoder
from django.utils import timezone
from django.core import mail
from trader.metaapi_types import AccountData, TradeData, RawDepositWithdrawalDealData, RawTradeDealData
from users.models import Trader, User
from typing import List


# Variables used to keep track of how many mails concerning model errors have been sent
no_of_unknown_transactions_sent = 0

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
    def __init__(self, unique=True, *args, **kwargs):
        super().__init__(unique=unique, max_length=100, *args)


class AccountManager(models.Manager):
    @transaction.atomic
    def create_account(
        self,
        user,
        account_data: AccountData,
        trade_data: List[TradeData],
        deposit_data: List[RawDepositWithdrawalDealData],
        withdrawal_data: List[RawDepositWithdrawalDealData],
        unknown_transaction_data: List[RawDepositWithdrawalDealData | RawTradeDealData]
    ):
        new_account = self.create(
            user=user,
            currency=account_data['currency'],
            broker=account_data['broker'],
            name=account_data['name'],
            server=account_data['server'],
            credit=account_data['credit'],
            equity=account_data['equity'],
            margin=account_data['margin'],
            free_margin=account_data['freeMargin'],
            login=account_data['login'],
            leverage=account_data['leverage'],
            type=account_data['type'],
            platform=account_data['platform'],
            balance=account_data['balance'],
            investor_mode=account_data['investorMode'],
            trade_allowed=account_data['tradeAllowed'],
            margin_mode=account_data['marginMode'],
            ma_account_id=account_data['ma_account_id']
        )
        Trade.objects.create_trades(new_account, trade_data)
        Deposit.objects.create_deposits(new_account, deposit_data)
        Withdrawal.objects.create_withdrawals(new_account, withdrawal_data)
        UnknownTransaction.objects.create_unknown_transactions(new_account, unknown_transaction_data)
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
                and item['pair'] is not None
                and (item['action'] == 'buy' or item['action'] == 'sell'),
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
    platform_choices = (
        ('mt4', 'mt4'),
        ('mt5', 'mt5')
    )
    name = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    login = models.PositiveBigIntegerField()
    currency = models.TextField()
    broker = models.TextField()
    server = models.TextField()
    balance = models.DecimalField(decimal_places=2, max_digits=19, default=0)
    credit = models.DecimalField(decimal_places=2, max_digits=19)
    equity = models.DecimalField(decimal_places=2, max_digits=19)
    margin = models.DecimalField(decimal_places=2, max_digits=19)
    free_margin = models.DecimalField(decimal_places=2, max_digits=19)
    leverage = models.DecimalField(decimal_places=2, max_digits=19)
    type = models.CharField(max_length=75)
    platform = models.CharField(choices=platform_choices, max_length=5)
    investor_mode = models.BooleanField()
    trade_allowed = models.BooleanField()
    margin_mode = models.CharField(max_length=50)
    # The id used to identify the account when making requests to the MA servers
    ma_account_id = models.CharField(max_length=200)
    # The time the account got added in the database
    time_added = models.DateTimeField(default=timezone.now)

    objects = AccountManager()

    def no_of_trades(self):
        return self.trade_set.all().count()
    
    def no_of_deposits(self):
        return self.deposit_set.all().count()
    
    def no_of_withdrawals(self):
        return self.withdrawal_set.all().count()

    def no_of_unknown_transactions(self):
        return self.get_all_unknown_transactions().count()
    
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

    def get_all_unknown_transactions(self):
        return self.unknowntransaction_set.all()
    
    @transaction.atomic
    def update_account(
        self,
        account_info: AccountData,
        unsaved_trade_data: List[TradeData],
        unsaved_deposit_data: List[RawDepositWithdrawalDealData],
        unsaved_withdrawal_data: List[RawDepositWithdrawalDealData],
        unsaved_unknown_transaction_data: List[RawDepositWithdrawalDealData | RawTradeDealData]
    ):
        self.credit = account_info['credit']
        self.equity = account_info['equity']
        self.margin = account_info['margin']
        self.free_margin = account_info['freeMargin']
        self.leverage = account_info['leverage']
        self.balance = account_info['balance']
        self.save()
        Trade.objects.create_trades(self, unsaved_trade_data)
        Deposit.objects.create_deposits(self, unsaved_deposit_data)
        Withdrawal.objects.create_withdrawals(self, unsaved_withdrawal_data)
        UnknownTransaction.objects.create_unknown_transactions(self, unsaved_unknown_transaction_data)

    def __str__(self):
        return f'{self.user.username}\'s account'
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['login', 'user'], name='trader_no_duplicate_account'),
            models.UniqueConstraint(fields=['ma_account_id'], name='trader_unique_ma_account_id')
        ]


class TradeManager(models.Manager):
    # To prevent the sending of too many emails
    _no_of_trades_with_unknown_actions_sent = 0
    def create_trade(self, account: Account, rawdata: TradeData):
        if rawdata.action.startswith('unknown'):
            self.send_admin_unknown_trade_action_error(account, rawdata.action)
        swap = rawdata.swap
        commission = rawdata.commission
        return self.create(
            account=account,
            pair=rawdata.symbol,
            open_price=rawdata.open_price,
            close_price=rawdata.close_price,
            profit_loss=rawdata.profit,
            open_time=rawdata.open_time,
            close_time=rawdata.close_time,
            broker_open_time=rawdata.broker_open_time,
            broker_close_time=rawdata.broker_close_time,
            trade_id=rawdata.id,
            order_id=rawdata.order_id,
            position_id=rawdata.position_id,
            volume=rawdata.volume,
            action=rawdata.action,
            swap=swap if swap >= 0 else swap * -1,
            commission=commission if commission >= 0 else commission * -1,
            stop_loss=rawdata.stop_loss,
            take_profit=rawdata.take_profit,
            magic=rawdata.magic,
            reason=rawdata.reason
        )
    
    def create_trades(self, account: Account, rawdata: List[TradeData]):
        for data in rawdata:
            self.create_trade(account, data)
    
    def send_admin_unknown_trade_action_error(self, account: Account, action):
        if self._no_of_trades_with_unknown_actions_sent < 3:
            mail.mail_admins(
                'A Trade With An Unknown Action',
                f'A trade with an unknown action, {action}, has been saved for a user '
                f'{account.user.email} with id {account.user_id} for his/her account '
                f'with id {account.id} '
                'at time %s'.format(timezone.now().strftime('%Y-%m-%d %H:%M:%S'))
            )
            self._no_of_trades_with_unknown_actions_sent += 1

class Trade(models.Model):
    pair = models.CharField(max_length=10)
    action = models.CharField(max_length=10)
    profit_loss = models.DecimalField(decimal_places=2, max_digits=19)
    open_price = models.DecimalField(decimal_places=2, max_digits=19)
    close_price = models.DecimalField(decimal_places=2, max_digits=19)
    take_profit = models.DecimalField(decimal_places=2, max_digits=19)
    stop_loss = models.DecimalField(decimal_places=2, max_digits=19)
    swap = models.DecimalField(decimal_places=2, max_digits=19)
    commission = models.DecimalField(decimal_places=2, max_digits=19)
    volume = models.DecimalField(decimal_places=2, max_digits=19)
    open_time = models.DateTimeField()
    close_time = models.DateTimeField()
    # order ticket id in mt4, position id in mt5
    trade_id = TransactionIdField()
    order_id = TransactionIdField(unique=False)
    position_id = TransactionIdField(unique=False)
    magic = models.IntegerField()
    notes = models.TextField(blank=True, null=True)
    reason = models.CharField(max_length=100)
    broker_open_time = models.CharField(max_length=100)
    broker_close_time = models.CharField(max_length=100)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)

    objects = TradeManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['account', 'trade_id'], name='trader_no_duplicate_trade')
        ]
        ordering = ('close_time',)


class DepositManager(models.Manager):
    def create_deposit(self, account: Account, rawdata: RawDepositWithdrawalDealData):
        self.create(
            account=account,
            amount=rawdata['profit'],
            time=rawdata['time'],
            deposit_id=rawdata['id'],
            broker_time=rawdata['brokerTime']
        )
    
    def create_deposits(self, account: Account, rawdata: List[RawDepositWithdrawalDealData]):
        for data in rawdata:
            self.create_deposit(account, data)
    
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
    broker_time = models.CharField(max_length=100)

    objects = DepositManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['account', 'deposit_id'], name='trader_no_duplicate_deposit')
        ]
        ordering = ('time',)


class WithdrawalManager(models.Manager):
    def create_withdrawal(self, account: Account, rawdata: RawDepositWithdrawalDealData):
        self.create(
            account=account,
            amount=rawdata['profit'],
            time=rawdata['time'],
            withdrawal_id=rawdata['id'],
            broker_time=rawdata['brokerTime']
        )
    
    def create_withdrawals(self, account: Account, rawdata: List[RawDepositWithdrawalDealData]):
        for data in rawdata:
            self.create_withdrawal(account, data)
    
    def is_duplicate(self, account, rawdata):
        return self.filter(
            account=account,
            withdrawal_id=rawdata['id']
        ).count() != 0


class Withdrawal(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField(decimal_places=2, max_digits=19)
    time = models.DateTimeField()
    withdrawal_id = TransactionIdField()
    broker_time = models.CharField(max_length=100)

    objects = WithdrawalManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['account', 'withdrawal_id'], name='trader_no_duplicate_withdrawal')
        ]
        ordering = ('time',)


class UnknownTransactionManager(models.Manager):
    def create_unknown_transaction(
        self,
        account: Account,
        rawdata: RawTradeDealData | RawDepositWithdrawalDealData
    ):
        self.mail_unknown_transaction(account)
        return self.create(
            account=account,
            data=rawdata
        )
    
    def create_unknown_transactions(
        self,
        account: Account,
        rawdata: RawTradeDealData | RawDepositWithdrawalDealData
    ):
        for data in rawdata:
            self.create_unknown_transaction(account, data)

    def mail_unknown_transaction(self, account):
        global no_of_unknown_transactions_sent
        if no_of_unknown_transactions_sent < 3:
            mail.mail_admins(
                'An Unrecognized Transaction',
                f'An unrecognized transaction has been saved for a user {account.user.email} '
                f'with id {account.user_id} for his/her account with id {account.id} at '
                'time %s'.format(timezone.now().strftime('%Y-%m-%d %H:%M:%S'))
            )
            no_of_unknown_transactions_sent += 1


class UnknownTransaction(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    data = models.JSONField(encoder=DjangoJSONEncoder)
    time = models.DateTimeField(default=timezone.now)

    objects = UnknownTransactionManager()


class FailedTransactionSave(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    data = models.JSONField(encoder=DjangoJSONEncoder)
    time = models.DateTimeField(default=timezone.now)


class MetaApiError(models.Model):
    user = models.ForeignKey(Trader, on_delete=models.CASCADE)
    error = models.CharField(max_length=50)
    time = models.DateTimeField(default=timezone.now)


class UnresolvedAddAccount(models.Model):
    user = models.ForeignKey(Trader, on_delete=models.CASCADE)
    name = models.TextField()
    login = models.PositiveBigIntegerField()
    server = models.TextField()
    platform = models.CharField(choices=Account.platform_choices, max_length=5)
    time_added = models.DateTimeField(auto_now_add=True)


class AddAccountError(models.Model):
    user = models.ForeignKey(Trader, on_delete=models.CASCADE)
    name = models.TextField()
    login = models.PositiveBigIntegerField()
    server = models.TextField()
    platform = models.CharField(choices=Account.platform_choices, max_length=5)
    time_added = models.DateTimeField(auto_now_add=True)
    error = models.JSONField(encoder=DjangoJSONEncoder)


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