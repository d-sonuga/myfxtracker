from django.test import TestCase
from users.models import User
from .test_data import UserModelAttributesTestData


class TestUserAttributes(TestCase):
    def setUp(self):
        self.user = User.objects.create(email='mail@gmail.com', username='fakeuser')

    def test_user_has_is_trader_attribute(self):
        self.assertIn('is_trader', dir(self.user))

    def test_user_has_is_affiliate_attribute(self):
        self.assertIn('is_affiliate', dir(self.user))
    
    def test_user_model_has_create_trader_method(self):
        self.assertIn('create_trader', dir(User.objects))
        fake_trader_data = UserModelAttributesTestData.fake_trader_data
        trader_set = User.objects.filter(is_trader=True)
        self.assertEquals(trader_set.count(), 0)
        User.objects.create_trader(**fake_trader_data)
        trader_set = User.objects.filter(is_trader=True)
        self.assertEquals(trader_set.count(), 1)