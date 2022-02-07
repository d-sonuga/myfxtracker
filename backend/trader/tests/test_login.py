""""
Test the login view

Cases:
------
1
Email and password are present, provided the way they ought to be and the details
match a user saved in the database and verified
Return should be a success with the token key for authentication.

2
The details are the way they ought to be, but the email isn't in the database
Return should be an error

3
The details are the way they ought to be, but the password is wrong
Return should be an error

4
The details are the way they ought to be, but the email isn't verified
Return should be an error

5
The email or password or both are missing.
Return should be an error
"""

from django.test import TestCase
from django.core import mail
from users.models import User
from allauth.account.models import EmailAddress
from .test_data import LoginDetails, SignUpDetails


class LoginTests(TestCase):
    def setUp(self) -> None:
        # Usernames where added just to prevent django from complaining of duplicates usernames
        # User with the good details should exist and be verified to be able to log in
        good_user = User.objects.create_trader(
            **LoginDetails.good_details,
            how_you_heard_about_us=SignUpDetails.other_values['howYouHeard'],
            trading_time_before_joining=SignUpDetails.other_values['yearsSpentTrading']
        )
        EmailAddress.objects.create(user=good_user, email=good_user.email, verified=True, primary=True)

        # User with unverified email
        unverified_user = User.objects.create_trader(
            **LoginDetails.bad_details_email_not_verified,
            how_you_heard_about_us=SignUpDetails.other_values['howYouHeard'],
            trading_time_before_joining=SignUpDetails.other_values['yearsSpentTrading']
        )
        EmailAddress.objects.create(
            user=unverified_user, email=unverified_user.email, verified=False, primary=True\
        )
    
    # Case 1
    def test_login_good_details(self):
        resp = self.client.post('/trader/login/', LoginDetails.good_details)
        self.assertEquals(resp.status_code, 200)
        self.assertTrue(resp.json()['key'])

    # Case 2
    def test_login_email_doesnt_exist(self):
        resp = self.client.post('/trader/login/', LoginDetails.bad_details_user_email_doesnt_exist)
        self.assertEquals(resp.status_code, 400)
        self.assertDictEqual(
            resp.json(), {'non_field_errors': ['Unable to log in with provided credentials.']}
        )

    # Case 3
    def test_login_wrong_password(self):
        resp = self.client.post('/trader/login/', LoginDetails.bad_details_wrong_password)
        self.assertEquals(resp.status_code, 400)
        self.assertDictEqual(
            resp.json(), {'non_field_errors': ['Unable to log in with provided credentials.']}
        )

    # Case 4
    def test_login_unverified_user(self):
        # This test will fail when under development because unverified users
        # are allowed to log in under development
        """
        resp = self.client.post('/trader/login/', LoginDetails.bad_details_email_not_verified)
        self.assertEquals(resp.status_code, 400)
        self.assertDictEqual(
            resp.json(), {'non_field_errors': ['E-mail is not verified.']}
        )
        """

    # Case 5
    def test_login_missing_details(self):
        # Email missing
        resp = self.client.post('/trader/login/', LoginDetails.bad_detail_email_missing)
        self.assertEquals(resp.status_code, 400)
        self.assertDictEqual(
            resp.json(), {'non_field_errors': ['Must include "email" and "password".']}
        )
        
        # Password missing
        resp = self.client.post('/trader/login/', LoginDetails.bad_details_password_missing)
        self.assertEquals(resp.status_code, 400)
        self.assertDictEqual(
            resp.json(), {'password': ['This field is required.']}
        )

        # All missing
        resp = self.client.post('/trader/login/', LoginDetails.bad_details_no_email_or_password)
        self.assertEquals(resp.status_code, 400)
        self.assertDictEqual(
            resp.json(), {'password': ['This field is required.']}
        )
