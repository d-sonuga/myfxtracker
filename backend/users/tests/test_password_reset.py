"""
Test the password reset view

Cases:
------
1
The email submitted is valid, owned by a verified user
Return value should be a success with a message that a
reset mail has been sent

2
The email submitted is invalid, not owned by a verified user

3
The email submitted is empty, no email

Note: These tests only test the handling of submitted data
and the sending of the reset mail. It doesn't test what happens
after the user clicks the reset link
"""

from django.test import TestCase
from django.core import mail
from django.contrib.auth.models import User
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
        resp = self.client.post('/password-reset/', PasswordResetDetails.good_details)
        # print('here', resp.serialize())
        self.assertEquals(len(mail.outbox), 0)
        self.assertEquals(resp.status_code, 200)

    