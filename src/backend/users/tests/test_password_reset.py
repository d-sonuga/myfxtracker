"""
Test the password reset view

Cases:
------
1

"""

from django.test import TestCase
from django.core import mail
from users.models import User
from allauth.account.models import EmailAddress
from .test_data import PasswordResetDetails


class PasswordResetTests(TestCase):
    def setUp(self):
        # The verified user with the good details
        good_user = User.objects.create(**PasswordResetDetails.good_details)
        good_user.set_password('password')
        good_user.save()
    
    # Case 1
    def test_reset_with_valid_email(self):
        resp = self.client.post('/users/password-reset/', PasswordResetDetails.good_details)
        # print('here', resp.serialize())
        self.assertEquals(resp.status_code, 200)
        self.assertEquals(len(mail.outbox), 1)

    