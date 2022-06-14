import datetime
from django.test import TestCase, tag
from django.utils import timezone
from django.conf import settings
from trader.setup_scheduler import schedule_update_status_of_free_trial_users
from trader.models import Trader
from .test_data import update_free_trial_status_test_data


class UpdateFreeTrialStatus(TestCase):
    def setUp(self) -> None:
        test_data = update_free_trial_status_test_data
        self.trader_still_on_free_trial1 = Trader.objects.create(**test_data.user_details1)
        self.trader_still_on_free_trial2 = Trader.objects.create(**test_data.user_details2)
        self.trader_still_on_free_trial2.date_joined = (timezone.now()
            - datetime.timedelta(days=settings.FREE_TRIAL_PERIOD + 1))
        self.trader_still_on_free_trial2.save()
        self.trader_with_expired_free_trial = Trader.objects.create(**test_data.user_details3) 
        self.trader_with_expired_free_trial.date_joined = (timezone.now()
            - datetime.timedelta(days=settings.FREE_TRIAL_PERIOD + 1))
        self.trader_with_expired_free_trial.save()
        self.trader_with_expired_free_trial.subscriptioninfo.time_of_free_trial_start = (timezone.now()
            - datetime.timedelta(days=settings.FREE_TRIAL_PERIOD + 1))
        self.trader_with_expired_free_trial.subscriptioninfo.save()
        
    def test_update_free_trial_status(self):
        self.assertTrue(self.trader_still_on_free_trial1.on_free)
        self.assertTrue(self.trader_still_on_free_trial2.on_free)
        self.assertTrue(self.trader_with_expired_free_trial.on_free)
        schedule_update_status_of_free_trial_users()
        self.trader_still_on_free_trial = Trader.objects.get(id=self.trader_still_on_free_trial1.id)
        self.trader_still_on_free_trial2 = Trader.objects.get(id=self.trader_still_on_free_trial2.id)
        self.trader_with_expired_free_trial = Trader.objects.get(id=self.trader_with_expired_free_trial.id)
        self.assertTrue(self.trader_still_on_free_trial1.on_free)
        self.assertTrue(self.trader_still_on_free_trial2.on_free)
        self.assertFalse(self.trader_with_expired_free_trial.on_free)
        