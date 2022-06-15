from typing import Literal
from django.test import TestCase
from django.utils import timezone
from rest_framework.authtoken.models import Token
from trader.models import Account, Preferences
from users.models import Trader, SubscriptionInfo
from .test_data import InitDataTestData
from .test_data import AddTradingAccountTestData
from trader.metaapi import Transaction
from django.conf import settings

"""
Adding last_data_refresh_time to init_data
# What if user triggers a data refresh himself
If time of last updating happened before or on time user added account
    last_data_refresh_time = time user added account
Else If time of last updating happened after user added account
    last_data_refresh_time = last time all data was refreshed
"""

class InitDataTest(TestCase):
    def setUp(self) -> None:
        self.test_data = InitDataTestData
        self.trader_with_no_data = Trader.objects.create(**self.test_data.trader_with_no_data)
        self.trader_with_data = Trader.objects.create(**self.test_data.trader_with_data)
        no_data_token = Token.objects.create(user=self.trader_with_no_data).key
        with_data_token = Token.objects.create(user=self.trader_with_data).key
        self.no_data_headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {no_data_token}'
        }
        self.with_data_headers = {
            'Content-Type': 'application/json',
            'HTTP_AUTHORIZATION': f'Token {with_data_token}'
        }
    
    def test_trader_with_no_data(self):
        resp = self.client.get('/trader/get-init-data/', **self.no_data_headers)
        days_left_before_free_trial_expires = self.days_left_before_free_trial_expires(self.trader_with_no_data)
        self.assertEquals(resp.status_code, 200)
        self.assertDictEqual(
            resp.json(),
            {
                'user_data': {
                    'id': self.trader_with_no_data.id,
                    'email': self.trader_with_no_data.email,
                    'is_subscribed': self.trader_with_no_data.is_subscribed,
                    'on_free': self.trader_with_no_data.on_free,
                    'subscription_plan': self.format_subscription_plan(self.trader_with_no_data),
                    'days_left_before_free_trial_expires': days_left_before_free_trial_expires
                },
                'trade_data': {
                    'current_account_id': -1,
                    'last_data_refresh_time': self.trader_with_no_data.last_data_refresh_time.isoformat().replace('+00:00', 'Z'),
                    'accounts': {}
                }
            }
        )

    def test_trader_with_data_added_account_after_last_general_data_refresh(self):
        """
        To test the scenario where a trader with data requests for his init data
        And this trader's account was added after the last data refresh
        """
        test_data = AddTradingAccountTestData.good_account_details
        account = Account.objects.create_account(
            self.trader_with_data,
            test_data['account-info'],
            *Transaction.from_raw_data(test_data['deals'].copy())
        )
        account.time_added = timezone.now()
        account.save()
        pref = Preferences.objects.get(user=self.trader_with_data)
        pref.current_account = account
        pref.save()
        resp = self.client.get('/trader/get-init-data/', **self.with_data_headers)
        days_left_before_free_trial_expires = self.days_left_before_free_trial_expires(self.trader_with_data)
        self.assertEquals(resp.status_code, 200)
        self.maxDiff = None
        self.assertDictEqual(
            resp.json(),
            {
                'user_data': {
                    'id': self.trader_with_data.id,
                    'email': self.trader_with_data.email,
                    'is_subscribed': self.trader_with_data.is_subscribed,
                    'on_free': self.trader_with_data.on_free,
                    'subscription_plan': self.format_subscription_plan(self.trader_with_data),
                    'days_left_before_free_trial_expires': days_left_before_free_trial_expires
                },
                'trade_data': {
                    'current_account_id': pref.current_account.id,
                    'last_data_refresh_time': self.trader_with_data.last_data_refresh_time.isoformat().replace('+00:00', 'Z'),
                    'accounts': {
                        f'{account.id}': {
                            'name': account.name,
                            'trades': [{
                                'pair': trade.pair,
                                'action': trade.action,
                                'profitLoss': float(trade.profit_loss),
                                'commission': float(trade.commission),
                                'swap': float(trade.swap),
                                'openTime': trade.open_time.isoformat().replace('+00:00', 'Z'),
                                'closeTime': trade.close_time.isoformat().replace('+00:00', 'Z'),
                                'openPrice': float(trade.open_price),
                                'closePrice': float(trade.close_price),
                                'takeProfit': float(trade.take_profit),
                                'stopLoss': float(trade.stop_loss)
                            } for trade in account.get_all_trades()],
                            'deposits': [{
                                'account': account.id,
                                'amount': float(deposit.amount),
                                'time': deposit.time.isoformat().replace('+00:00', 'Z')
                            } for deposit in account.get_all_deposits()],
                            'withdrawals': [{
                                'account': account.id,
                                'amount': float(withdrawal.amount),
                                'time': withdrawal.time.isoformat().replace('+00:00', 'Z')
                            } for withdrawal in account.get_all_withdrawals()]
                        }
                    }
                }
            }
        )
    
    def test_trader_with_data_added_account_after_last_general_data_refresh_and_is_subscribed_to_monthly(self):
        """
        To test the scenario where a trader with data requests for his init data
        And this trader's account was added after the last data refresh
        """
        self.subscribe_trader(self.trader_with_data, 'monthly')
        test_data = AddTradingAccountTestData.good_account_details
        account = Account.objects.create_account(
            self.trader_with_data,
            test_data['account-info'],
            *Transaction.from_raw_data(test_data['deals'].copy())
        )
        account.time_added = timezone.now()
        account.save()
        pref = Preferences.objects.get(user=self.trader_with_data)
        pref.current_account = account
        pref.save()
        resp = self.client.get('/trader/get-init-data/', **self.with_data_headers)
        days_left_before_free_trial_expires = self.days_left_before_free_trial_expires(self.trader_with_data)
        self.assertEquals(resp.status_code, 200)
        self.maxDiff = None
        self.assertDictEqual(
            resp.json(),
            {
                'user_data': {
                    'id': self.trader_with_data.id,
                    'email': self.trader_with_data.email,
                    'is_subscribed': self.trader_with_data.is_subscribed,
                    'on_free': self.trader_with_data.on_free,
                    'subscription_plan': self.format_subscription_plan(self.trader_with_data),
                    'days_left_before_free_trial_expires': days_left_before_free_trial_expires
                },
                'trade_data': {
                    'current_account_id': pref.current_account.id,
                    'last_data_refresh_time': self.trader_with_data.last_data_refresh_time.isoformat().replace('+00:00', 'Z'),
                    'accounts': {
                        f'{account.id}': {
                            'name': account.name,
                            'trades': [{
                                'pair': trade.pair,
                                'action': trade.action,
                                'profitLoss': float(trade.profit_loss),
                                'commission': float(trade.commission),
                                'swap': float(trade.swap),
                                'openTime': trade.open_time.isoformat().replace('+00:00', 'Z'),
                                'closeTime': trade.close_time.isoformat().replace('+00:00', 'Z'),
                                'openPrice': float(trade.open_price),
                                'closePrice': float(trade.close_price),
                                'takeProfit': float(trade.take_profit),
                                'stopLoss': float(trade.stop_loss)
                            } for trade in account.get_all_trades()],
                            'deposits': [{
                                'account': account.id,
                                'amount': float(deposit.amount),
                                'time': deposit.time.isoformat().replace('+00:00', 'Z')
                            } for deposit in account.get_all_deposits()],
                            'withdrawals': [{
                                'account': account.id,
                                'amount': float(withdrawal.amount),
                                'time': withdrawal.time.isoformat().replace('+00:00', 'Z')
                            } for withdrawal in account.get_all_withdrawals()]
                        }
                    }
                }
            }
        )

    def test_trader_with_data_added_account_after_last_general_data_refresh_and_is_subscribed_to_yearly(self):
        """
        To test the scenario where a trader with data requests for his init data
        And this trader's account was added after the last data refresh
        """
        self.subscribe_trader(self.trader_with_data, 'yearly')
        test_data = AddTradingAccountTestData.good_account_details
        account = Account.objects.create_account(
            self.trader_with_data,
            test_data['account-info'],
            *Transaction.from_raw_data(test_data['deals'].copy())
        )
        account.time_added = timezone.now()
        account.save()
        pref = Preferences.objects.get(user=self.trader_with_data)
        pref.current_account = account
        pref.save()
        resp = self.client.get('/trader/get-init-data/', **self.with_data_headers)
        days_left_before_free_trial_expires = self.days_left_before_free_trial_expires(self.trader_with_data)
        self.assertEquals(resp.status_code, 200)
        self.maxDiff = None
        self.assertDictEqual(
            resp.json(),
            {
                'user_data': {
                    'id': self.trader_with_data.id,
                    'email': self.trader_with_data.email,
                    'is_subscribed': self.trader_with_data.is_subscribed,
                    'on_free': self.trader_with_data.on_free,
                    'subscription_plan': self.format_subscription_plan(self.trader_with_data),
                    'days_left_before_free_trial_expires': days_left_before_free_trial_expires
                },
                'trade_data': {
                    'current_account_id': pref.current_account.id,
                    'last_data_refresh_time': self.trader_with_data.last_data_refresh_time.isoformat().replace('+00:00', 'Z'),
                    'accounts': {
                        f'{account.id}': {
                            'name': account.name,
                            'trades': [{
                                'pair': trade.pair,
                                'action': trade.action,
                                'profitLoss': float(trade.profit_loss),
                                'commission': float(trade.commission),
                                'swap': float(trade.swap),
                                'openTime': trade.open_time.isoformat().replace('+00:00', 'Z'),
                                'closeTime': trade.close_time.isoformat().replace('+00:00', 'Z'),
                                'openPrice': float(trade.open_price),
                                'closePrice': float(trade.close_price),
                                'takeProfit': float(trade.take_profit),
                                'stopLoss': float(trade.stop_loss)
                            } for trade in account.get_all_trades()],
                            'deposits': [{
                                'account': account.id,
                                'amount': float(deposit.amount),
                                'time': deposit.time.isoformat().replace('+00:00', 'Z')
                            } for deposit in account.get_all_deposits()],
                            'withdrawals': [{
                                'account': account.id,
                                'amount': float(withdrawal.amount),
                                'time': withdrawal.time.isoformat().replace('+00:00', 'Z')
                            } for withdrawal in account.get_all_withdrawals()]
                        }
                    }
                }
            }
        )

    def subscribe_trader(self, trader: Trader, plan: Literal['yearly'] | Literal['monthly']):
        FLUTTERWAVE = SubscriptionInfo.FLUTTERWAVE
        CODE = SubscriptionInfo.CODE
        PLAN_INDEX = SubscriptionInfo.MONTHLY
        if plan != 'monthly':
            PLAN_INDEX = SubscriptionInfo.YEARLY
        trader.subscriptioninfo.is_subscribed = True
        trader.subscriptioninfo.payment_method = SubscriptionInfo.PAYMENT_CHOICES[FLUTTERWAVE][CODE]
        trader.subscriptioninfo.subscription_plan = SubscriptionInfo.PLAN_CHOICES[PLAN_INDEX][CODE]
        trader.subscriptioninfo.save()
    
    def format_subscription_plan(self, trader: Trader):
        MONTHLY = SubscriptionInfo.MONTHLY
        YEARLY = SubscriptionInfo.YEARLY
        CODE = SubscriptionInfo.CODE
        if not trader.is_subscribed:
            return 'none'
        elif trader.subscription_plan == SubscriptionInfo.PLAN_CHOICES[MONTHLY][CODE]:
            return 'monthly'
        elif trader.subscription_plan == SubscriptionInfo.PLAN_CHOICES[YEARLY][CODE]:
            return 'yearly'
    
    def days_left_before_free_trial_expires(self, trader: Trader):
        if not trader.time_of_free_trial_start:
            return 'free trial not started'
        day_of_free_trial_over = (trader.time_of_free_trial_start 
            + timezone.timedelta(days=settings.FREE_TRIAL_PERIOD))
        days_left_before_free_trial_expires = day_of_free_trial_over - timezone.now()
        if days_left_before_free_trial_expires.days < 0:
            return 0
        return days_left_before_free_trial_expires.days