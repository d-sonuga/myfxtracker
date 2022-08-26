from django.test import TestCase
from django.utils import timezone
from django.conf import settings
from trader.setup_scheduler import schedule_account_data_refresh, schedule_update_status_of_free_trial_users
from trader.models import AccountDataLastRefreshed
from users.models import Trader
import datetime

dummy_time = datetime.datetime(2022, 8, 26, 11, 3, 49, 675785, tzinfo=datetime.timezone.utc)
def dummy_timefunc():
    return dummy_time

class Queue:
    """
    A queue for testing purposes
    """
    def __init__(self):
        self.queue = []
        self.queue_in_time = []
    def enqueue(self, item, *args, **kwargs):
        self.queue.append((item, args, kwargs))
    def enqueue_in(self, time_delta, f, *args, **kwargs):
        self.queue_in_time.append((time_delta, f, args, kwargs))
    def run_queue_items(self):
        for (f, args, kwargs) in self.queue:
            f(*args, **kwargs)
        self.queue = []
    def __len__(self):
        return len(self.queue)

class ScheduledFunctionsTest(TestCase):
    def test_schedule_account_data_refresh_no_refresh_in_interval(self):
        """
        To test that the schedule_account_data_refresh function enqueues the 
        refresh_all_accounts_data function appropriately when account data hasn't been refreshed in
        the past account data refresh interval (30 minutes)
        """
        current_time = dummy_time
        longer_than_30_mins_ago = current_time - timezone.timedelta(days=1)
        AccountDataLastRefreshed.set_last_refreshed(longer_than_30_mins_ago)
        queue = Queue()
        self.assertEqual(len(queue.queue_in_time), 0)
        self.assertEqual(len(queue), 0)
        schedule_account_data_refresh(queue, dummy_timefunc)
        self.assertEqual(len(queue), 1)
        self.assertEqual(queue.queue[0][0].__name__, 'refresh_all_accounts_data')
        queue.run_queue_items()
        self.assertEqual(len(queue.queue_in_time), 1)
        self.assertEqual(queue.queue_in_time[0][0], timezone.timedelta(minutes=settings.TRADER_ACCOUNT_DATA_REFRESH_INTERVAL))
        self.assertEqual(AccountDataLastRefreshed.last_refresh_time(), current_time)
        
    def test_schedule_account_data_refresh_refresh_in_interval(self):
        """
        To test that the schedule_account_data_refresh function doesn't enqueue the 
        refresh_all_accounts_data function when account data has been refreshed in
        the past account data refresh interval (30 minutes)
        """
        current_time = dummy_time
        less_than_30_mins_ago = current_time - timezone.timedelta(minutes=29)
        AccountDataLastRefreshed.set_last_refreshed(less_than_30_mins_ago)
        queue = Queue()
        self.assertEqual(len(queue.queue_in_time), 0)
        self.assertEqual(len(queue), 0)
        schedule_account_data_refresh(queue, dummy_timefunc)
        self.assertEqual(len(queue), 0)
        self.assertEqual(AccountDataLastRefreshed.last_refresh_time(), less_than_30_mins_ago)

    def test_schedule_update_status_free_trial_users(self):
        """
        To test that the schedule_update_free_trial_status function is rescheduled
        for one day after running
        """
        queue = Queue()
        self.assertEqual(len(queue.queue_in_time), 0)
        self.assertEqual(len(queue.queue), 0)
        schedule_update_status_of_free_trial_users(queue, dummy_timefunc)
        self.assertEqual(len(queue.queue), 0)
        self.assertEqual(len(queue.queue_in_time), 1)
        self.assertEqual(queue.queue_in_time[0][0], timezone.timedelta(days=1))
        self.assertEqual(queue.queue_in_time[0][1].__name__, schedule_update_status_of_free_trial_users.__name__)
    
    def test_user_free_trial_not_expired_update_status(self):
        """
        To test the scenario where schedule_update_free_trial_status is run and
        a user with an active free trial exists
        """
        not_expired_set, _ = self.setup_dummy_traders_on_free_trial(expired=False, timefunc=dummy_timefunc)
        queue = Queue()
        self.assert_queue_is_empty(queue)
        schedule_update_status_of_free_trial_users(queue, dummy_timefunc)
        queue.run_queue_items()
        for trader in [Trader.objects.get(id=trader.id) for trader in not_expired_set]:
            self.assertTrue(trader.on_free)
            for account in trader.account_set.all():
                self.assertTrue(account.deployed)
    
    def test_user_free_trial_expired_update_status(self):
        """
        To test the scenario where schedule_update_free_trial_status is run and some users
        free trial have expired
        """
        not_expired_set, expired_set = self.setup_dummy_traders_on_free_trial(expired=True, timefunc=dummy_timefunc)
        queue = Queue()
        self.assert_queue_is_empty(queue)
        # Asserting that traders with expired free trials have not best been updated
        for trader in [Trader.objects.get(id=trader.id) for trader in expired_set]:
            self.assertTrue(trader.on_free)
            for account in trader.account_set.all():
                self.assertTrue(account.deployed)
        schedule_update_status_of_free_trial_users(queue, dummy_timefunc)
        queue.run_queue_items()
        for trader in [Trader.objects.get(id=trader.id) for trader in not_expired_set]:
            self.assertTrue(trader.on_free)
            for account in trader.account_set.all():
                self.assertTrue(account.deployed)
        
        for trader in [Trader.objects.get(id=trader.id) for trader in expired_set]:
            self.assertFalse(trader.on_free)
            for account in trader.account_set.all():
                self.assertFalse(account.deployed)

    def setup_dummy_traders_on_free_trial(self, expired, timefunc):
        import random
        no_of_on_free_trial_traders = random.randint(10, 20)
        free_trial_traders = []
        expired_free_trial_traders = []
        if expired:
            no_of_free_trial_expired_traders = random.randint(10, 20)
        else:
            no_of_free_trial_expired_traders = 0
        for i in range(0, no_of_on_free_trial_traders):
            trader = Trader.objects.create(email=self.create_email(i), password='password')
            free_trial_traders.append(trader)
        for i in range(0, no_of_free_trial_expired_traders):
            number = i + no_of_on_free_trial_traders
            trader = Trader.objects.create(email=self.create_email(number), password='password')
            trader.subscriptioninfo.time_of_free_trial_start = timefunc() - timezone.timedelta(days=settings.FREE_TRIAL_PERIOD + 1)
            trader.subscriptioninfo.save()
            expired_free_trial_traders.append(trader)
        from trader.models import Account
        from trader.metaapi import Transaction
        from trader.tests.test_data import RefreshAllAccountsTestData
        test_data = RefreshAllAccountsTestData.MoreThanOneUser
        if len(expired_free_trial_traders) > 1:
            data = test_data.user0_details['data']['account1_data']
            Account.objects.create_account(
                expired_free_trial_traders[0],
                data['original_account_info'],
                *Transaction.from_raw_data(data['original_deals'])
            )
        data = test_data.user1_details['data']['account1_data']
        Account.objects.create_account(
            free_trial_traders[0],
            data['original_account_info'],
            *Transaction.from_raw_data(data['original_deals'])
        )
        return free_trial_traders, expired_free_trial_traders
        
    def create_email(self, i):
        return 'dummyemail' + str(i) + '@gmail.com'

    def assert_queue_is_empty(self, queue):
        self.assertEqual(len(queue.queue), 0)
        self.assertEqual(len(queue.queue_in_time), 0)
