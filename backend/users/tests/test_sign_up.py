"""
Test the sign up view

Cases:
-----
1
Email, password1 and password2 are provided the way they ought to be
Return should be a success, with the user created and the email not yet
verified.
# This is still untested
The email should only be verified after the clicking of the verification link

2
Any of the fields are missing.
The response should complain of a bad request, and specify the field that is lacking

3
The passwords don't match or any of them are lesser than 8 characters

4
The email used to sign up has already been used to sign up

Note: The cases concerning howYouHeard and yearsSpentTrading fields in user input
    are not covered because
    1. Time
    2. Are they really needed?
"""

from django.test import TestCase
from django.core import mail
from django.contrib.auth.models import User
from allauth.account.models import EmailAddress
from .test_data import SignUpDetails


class SignUpTests(TestCase):
    # Case 1
    def test_sign_up_good_details(self):
        # Does the user exist already
        self.assertEquals(User.objects.filter(email=SignUpDetails.good_details['email']).count(), 0)
        resp = self.client.post('/users/sign-up/', SignUpDetails.good_details)
        self.assertEquals(resp.status_code, 201)
        # The user should exist now
        self.assertEquals(User.objects.filter(email=SignUpDetails.good_details['email']).count(), 1)
        # The verification email should have been sent
        self.assertEquals(len(mail.outbox), 1)

    # Cases 2 and 3
    def test_sign_up_bad_details_only_email(self):
        resp = self.client.post('/users/sign-up/', SignUpDetails.bad_details_only_email)
        resp_body = resp.json()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp_body['password1'], ['This field is required.'])
        self.assertEquals(resp_body['password2'], ['This field is required.'])

    def test_sign_up_bad_details_only_password1(self):
        resp = self.client.post('/users/sign-up/', SignUpDetails.bad_details_only_password1)
        resp_body = resp.json()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp_body['email'], ['This field is required.'])
        self.assertEquals(resp_body['password2'], ['This field is required.'])

    def test_sign_up_bad_details_only_password2(self):
        resp = self.client.post('/users/sign-up/', SignUpDetails.bad_details_only_password2)
        resp_body = resp.json()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp_body['email'], ['This field is required.'])
        self.assertEquals(resp_body['password1'], ['This field is required.'])

    def test_sign_up_bad_details_email_missing(self):
        resp = self.client.post('/users/sign-up/', SignUpDetails.bad_details_email_missing)
        resp_body = resp.json()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp_body['email'], ['This field is required.'])
    
    def test_sign_up_bad_details_password1_missing(self):
        resp = self.client.post('/users/sign-up/', SignUpDetails.bad_details_password1_missing)
        resp_body = resp.json()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp_body['password1'], ['This field is required.'])

    def test_sign_up_bad_details_password2_missing(self):
        resp = self.client.post('/users/sign-up/', SignUpDetails.bad_details_password2_missing)
        resp_body = resp.json()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp_body['password2'], ['This field is required.'])

    def test_sign_up_bad_details_invalid_email(self):
        resp = self.client.post('/users/sign-up/', SignUpDetails.bad_details_invalid_email)
        resp_body = resp.json()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp_body['email'], ['Enter a valid email address.'])

    def test_sign_up_bad_details_passwords_dont_match(self):
        resp = self.client.post('/users/sign-up/', SignUpDetails.bad_details_passwords_not_match)
        resp_body = resp.json()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp_body['non_field_errors'], ['The two password fields didn\'t match.'])

    def test_sign_up_bad_details_password_too_short(self):
        resp = self.client.post('/users/sign-up/', SignUpDetails.bad_details_password_length)
        resp_body = resp.json()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp_body['password1'], ['Password must be a minimum of 8 characters.'])
    
    def test_email_sent(self):
        self.assertEquals(len(mail.outbox), 0)
        self.client.post('/users/sign-up/', SignUpDetails.good_details)
        self.assertEquals(len(mail.outbox), 1)

    def test_email_already_used(self):
        email = SignUpDetails.good_details.get('email')
        # The user already signed up with the email
        first_user_with_email = User.objects.create(email=email)
        first_user_with_email.set_password(SignUpDetails.good_details.get('password1'))
        # Verify the user
        EmailAddress.objects.create(
            user=first_user_with_email,
            email=first_user_with_email.email,
            verified=True, primary=True
        )
        duplicate_email_details = SignUpDetails.good_details
        resp = self.client.post('/users/sign-up/', duplicate_email_details)
        resp_body = resp.json()
        self.assertEquals(resp.status_code, 400)
        self.assertEquals(resp_body, {'email': ['A user is already registered with this e-mail address.']})