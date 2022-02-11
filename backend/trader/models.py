from datetime import datetime
from django.db import IntegrityError, models
from django.utils import timezone
from users.models import User


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
            stopout_level=rawdata['account-stopout-level'],
            stopout_level_format=rawdata['account-stopout-level-format'],

        )
        for trade_data in get_account_trades(rawdata['account-transactions']):
            Trade.objects.create_trade(new_account, trade_data)
        for deposit_data in get_account_deposits(rawdata['account-transactions']):
            Deposit.objects.create_deposit(new_account, deposit_data)
        for withdrawal_data in get_account_withdrawals(rawdata['account-transactions']):
            Withdrawal.objects.create_withdrawal(new_account, withdrawal_data)
        return new_account
    
    def get_by_name_broker_login_no(self, name, broker, login_no):
        return self.get(name=name, broker=broker, login_number=login_no)

def is_deposit(item):
    return item['comment'] is not None and item['comment'].lower() == 'deposit' and item['pair'] is None

def is_withdrawal(item):
    return item['comment'] is not None and item['comment'].lower() == 'withdrawal' and item['pair'] is None

def get_account_trades(transaction_data):
    return list(filter(
            lambda item:
                not is_deposit(item) and
                not is_withdrawal(item) and
                len(item['pair']) != 0,
            transaction_data
        )
    )

def get_account_deposits(transaction_data):
    return list(filter(
            lambda item:
                item['comment'] and item['comment'].lower() == 'deposit',
            transaction_data
        )
    )

def get_account_withdrawals(transaction_data):
    return list(filter(
            lambda item:
                item['comment'] and item['comment'].lower() == 'withdrawal',
            transaction_data
        )
    )


class Account(models.Model):
    stopout_level_formats = (
        ('p', 'percentage'),
        ('m', 'money')
    )
    account_types = (
        ('d', 'demo'),
        ('c', 'competition'),
        ('r', 'real')
    )
    name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    login_number = models.IntegerField()
    currency = models.TextField()
    broker = models.TextField()
    trade_server = models.TextField()
    balance = models.DecimalField(decimal_places=2, max_digits=11, default=0)
    credit = models.DecimalField(decimal_places=2, max_digits=11)
    profit_loss = models.DecimalField(decimal_places=2, max_digits=11)
    equity = models.DecimalField(decimal_places=2, max_digits=11)
    margin = models.DecimalField(decimal_places=2, max_digits=11)
    margin_level = models.DecimalField(decimal_places=2, max_digits=11)
    free_margin = models.DecimalField(decimal_places=2, max_digits=11)
    margin_call_level = models.DecimalField(decimal_places=2, max_digits=11)
    margin_stopout_level = models.DecimalField(decimal_places=2, max_digits=11)
    leverage = models.DecimalField(decimal_places=2, max_digits=11)
    stopout_level = models.DecimalField(decimal_places=2, max_digits=11)
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


class TradeManager(models.Manager):
    def create_trade(self, account, rawdata):
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
            swap=float(rawdata['swap']),
            lots=float(rawdata['lots']),
            commission=float(rawdata['commission']),
            stop_loss=float(rawdata['stop-loss']),
            take_profit=float(rawdata['take-profit']),
            comment=rawdata['comment'],
            magic_number=float(rawdata['magic-number'])
        )
    

class Trade(models.Model):
    action_choices = (
        ('b', 'Buy'),
        ('s', 'Sell')
    )
    pair = models.CharField(max_length=10)
    action = models.CharField(choices=action_choices, max_length=4)
    entry_date = models.DateField(null=True)
    exit_date = models.DateField(blank=True, null=True)
    risk_reward_ratio = models.DecimalField(decimal_places=2, max_digits=9, null=True)
    profit_loss = models.DecimalField(decimal_places=2, max_digits=11)
    open_price = models.DecimalField(decimal_places=2, max_digits=11)
    close_price = models.DecimalField(decimal_places=2, max_digits=11)
    take_profit = models.DecimalField(decimal_places=2, max_digits=11)
    stop_loss = models.DecimalField(decimal_places=2, max_digits=11)
    swap = models.DecimalField(decimal_places=2, max_digits=11)
    commission = models.DecimalField(decimal_places=2, max_digits=11)
    lots = models.DecimalField(decimal_places=2, max_digits=11)
    comment = models.TextField(null=True)
    open_time = models.DateTimeField()
    close_time = models.DateTimeField()
    # order ticket id in mt4, position id in mt5
    trade_id = models.IntegerField(unique=True)
    magic_number = models.IntegerField()
    pips = models.DecimalField(decimal_places=2, max_digits=7, null=True)
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


class DepositManager(models.Manager):
    def create_deposit(self, account, rawdata):
        self.create(
            account=account,
            amount=rawdata['profit'],
            time=format_time(rawdata['close-time']),
            deposit_id=int(rawdata['transaction-id'])
        )
    
    def is_duplicate(self, account, rawdata):
        return self.filter(
            account=account,    
            deposit_id=int(rawdata['transaction-id'])
        ).count() != 0


class Deposit(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField(decimal_places=2, max_digits=11)
    time = models.DateTimeField()
    deposit_id = models.IntegerField()

    objects = DepositManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['account', 'deposit_id'], name='trader_no_duplicate_deposit')
        ]


class WithdrawalManager(models.Manager):
    def create_withdrawal(self, account, rawdata):
        self.create(
            account=account,
            amount=rawdata['profit'],
            time=format_time(rawdata['close-time']),
            withdrawal_id=int(rawdata['transaction-id'])
        )
    
    def is_duplicate(self, account, rawdata):
        return self.filter(
            account=account,
            withdrawal_id=int(rawdata['transaction-id'])
        ).count() != 0


class Withdrawal(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField(decimal_places=2, max_digits=11)
    time = models.DateTimeField()
    withdrawal_id = models.IntegerField()

    objects = WithdrawalManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['account', 'withdrawal_id'], name='trader_no_duplicate_withdrawal')
        ]


class Preferences(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    current_account = models.ForeignKey(Account, on_delete=models.CASCADE)


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