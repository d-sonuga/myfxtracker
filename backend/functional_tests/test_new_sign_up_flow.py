import string
from users.models import User
from django.test import override_settings
import requests
from .base_functional_test import BaseFunctionalTest
from trader.tests.test_data import SignUpDetails

"""
Tests the flow from when a user signs up to when he logs into the trader app
From signing up, to attempting to login without verifying email to verifying email
to finally logging in to changing password and relogging in to resetting password
and relogging in
"""
@override_settings(DEBUG=True)
class SignUpChangePasswordFlowTests(BaseFunctionalTest):
    
    def test_flow(self):
        # After signing up, user will no longer be None
        self.user = None
        self.sign_up_new_user()
        self.attempt_to_login_without_verifying_email()
        self.verify_email()
        self.attempt_to_login_after_verifying_email()
        self.change_password()
        self.reattempt_login_after_changing_password()
        self.reset_password()
        self.reattempt_login_after_resetting_password()

    def sign_up_new_user(self):
        sign_up_url = 'sign-up'
        self.assert_user_about_to_be_created_doesnt_exist_yet()
        self.navigate(sign_up_url)
        self.assert_title_is_site_name()
        submit_button = self.get_submit_button()
        details = SignUpDetails.good_details
        self.fill_sign_up_form(details)
        self.do_until_max_wait(submit_button.click)
        self.do_until_max_wait(self.assert_success_alert_is_showing)
        self.assert_user_has_been_saved(details)
        # setting the self.user, now that user has been saved
        self.user = User.objects.get(email=details['email'])
    
    def attempt_to_login_without_verifying_email(self):
        login_url = 'log-in'
        self.close_current_tab_and_open_new_tab()
        self.navigate(login_url)
        self.assert_title_is_site_name()
        details = SignUpDetails.good_details
        self.fill_log_in_form(details)
        submit_button = self.get_submit_button()
        self.do_until_max_wait(submit_button.click)
        self.wait_a_little()
        # After a successful login, page redirects to the app dashboard
        # This login shouldnt be successful, so it shouldnt redirect
        self.assert_page_hasnt_changed(f'{self.base_url}/{login_url}')
        self.assert_non_field_error_alert_is_showing()
    
    def verify_email(self):
        self.close_current_tab_and_open_new_tab()
        self.wait_a_little()
        verify_email_link = self.get_email_verification_link()  
        self.open_url(verify_email_link)
    
    def attempt_to_login_after_verifying_email(self):
        app_dashboard_url = f'{self.base_url}/app'
        details = SignUpDetails.good_details
        self.attempt_login(details)
        self.wait_a_little()
        self.assert_is_current_url(app_dashboard_url)
    
    def change_password(self):
        details = SignUpDetails.good_details_password_change
        self.navigate('change-password')
        self.assert_user_password_is_not_yet_changed(details)
        self.fill_change_password_form(details)
        submit_button = self.get_submit_button()
        self.do_until_max_wait(submit_button.click)
        self.wait_a_little()
        self.assert_user_password_has_changed(details)
    
    def reattempt_login_after_changing_password(self):
        details = SignUpDetails.good_details_password_change
        self.attempt_login(details)

    def reset_password(self):
        self.close_current_tab_and_open_new_tab()
        self.navigate('reset-password')
        details = SignUpDetails.good_details_password_reset
        self.fill_reset_password_form(details)
        submit_button = self.get_submit_button()
        self.do_until_max_wait(submit_button.click)
        self.wait_a_little()
        self.assert_success_alert_is_showing()

    def reattempt_login_after_resetting_password(self):
        details = SignUpDetails.good_details_password_reset
        confirm_password_reset_url = self.get_reset_password_confirmation_link()
        user = User.objects.get(id=self.user.id)
        self.close_current_tab_and_open_new_tab()
        self.open_url(confirm_password_reset_url)
        self.assertFalse(user.check_password(details['password1']))
        self.fill_reset_password_confirm_form(details)
        submit_button = self.get_submit_button()
        self.do_until_max_wait(submit_button.click)
        self.wait_a_little()
        self.assert_password_has_reset(details)

    def get_email_verification_link(self):
        mail_description, verification_mail = self.get_last_mail()
        self.assertIn('Please Confirm Your E-mail Address', mail_description['subject'])
        self.assertIn(self.user.email, mail_description['recipients']['to'])
        url = extract_url(verification_mail)
        return url

    def get_reset_password_confirmation_link(self):
        mail_description, password_reset_mail = self.get_last_mail()
        self.assertIn('MyFxTracker - Reset Password', mail_description['subject'])
        self.assertIn(self.user.email, mail_description['recipients']['to'])
        url = extract_url(password_reset_mail)
        return url

    def attempt_login(self, details):
        login_url = 'log-in'
        self.close_current_tab_and_open_new_tab()
        self.navigate(login_url)
        self.assert_title_is_site_name()
        self.fill_log_in_form(details)
        submit_button = self.get_submit_button()
        self.wait_a_little()
        self.do_until_max_wait(submit_button.click)
    
    def get_last_mail(self):
        """
        maildump https://github.com/sj26/mailcatcher/blob/main/README.md
        Format of response from all messages request
        {
            "messages": [
                {
                    "sender": "webmaster@localhost",
                    "recipients": {
                        "to": [
                            "sonugademilade@gmail.com"
                        ],
                        "cc": [],
                        "bcc": []
                    },
                    "created_at": "2022-01-28T16:05:14+00:00",
                    "subject": "[myfxtracker.com] Please Confirm Your E-mail Address",
                    "id": 1,
                    "size": 666
                },
                ...
            ]
        }
        """
        mails = requests.get(f'{self.maildump_server_address}/messages').json()['messages']
        no_of_messages = len(mails)
        last_mail_description = mails[no_of_messages - 1]
        last_mail_message = requests.get(f'{self.maildump_server_address}/messages/{last_mail_description["id"]}.plain').text
        return last_mail_description, last_mail_message

    def fill_reset_password_form(self, details):
        email = self.find_by_testid('email')
        email.send_keys(details['email'])

    def fill_reset_password_confirm_form(self, details):
        email = self.find_by_testid('email')
        password1 = self.find_by_testid('new-password1')
        password2 = self.find_by_testid('new-password2')
        email.send_keys(details['email'])
        password1.send_keys(details['password1'])
        password2.send_keys(details['password2'])

    def assert_non_field_error_alert_is_showing(self):
        self.assert_element_is_in_page('non-field-error-alert')

    def assert_success_alert_is_showing(self):
        self.assert_element_is_in_page('success-alert')

    def assert_page_hasnt_changed(self, url):
        self.assertEquals(self.browser.current_url, url)

    def assert_password_has_reset(self, details):
        user = User.objects.get(id=self.user.id)
        self.assertTrue(user.check_password(details['password1']))

    def fill_log_in_form(self, details):
        email = self.find_by_testid('email')
        password = self.find_by_testid('password')
        email.send_keys(details['email'])
        password.send_keys(details['password1'])
            
    def assert_user_password_has_changed(self, details):
        user = User.objects.get(id=self.user.id)
        self.assertTrue(user.check_password(details['password1']))

    def assert_user_about_to_be_created_doesnt_exist_yet(self):
        non_existent_user_set = User.objects.filter(email=SignUpDetails.good_details['email'])
        self.assertEquals(non_existent_user_set.count(), 0)

    def assert_user_has_been_saved(self, details):
        new_user_set = User.objects.filter(email=details['email'])
        self.do_until_max_wait(
            self.assertEquals, (new_user_set.count(), 1)
        )
        new_user = new_user_set[0]
        self.do_until_max_wait(
            self.assertEquals, (new_user.email, details['email'], 'The email isn\'t the one the user entered')
        )
        password_is_same = new_user.check_password(details['password1'])
        self.do_until_max_wait(
            self.assertTrue, (
                password_is_same,
                'The password isnt the one the user entered'
            )
        )
        how_you_heard_about_us = new_user.traderinfo.how_you_heard_about_us
        trading_time_before_joining = new_user.traderinfo.trading_time_before_joining
        self.assertEquals(how_you_heard_about_us, details['howYouHeard'])
        self.assertEquals(trading_time_before_joining, details['yearsSpentTrading'])
        self.assertTrue(new_user.is_trader)
    
    def get_sign_up_input_elements(self):
        email = self.find_by_testid('email')
        password = self.find_by_testid('password')
        confirm_password = self.find_by_testid('confirm-password')
        years_spent_trading = self.find_by_testid('years-spent-trading', 'div')
        how_you_heard = self.find_by_testid('how-you-heard', 'div')
        years_spent_trading = self.create_select_el(years_spent_trading)
        how_you_heard = self.create_select_el(how_you_heard)
        return email, password, confirm_password, years_spent_trading, how_you_heard

    def fill_sign_up_form(self, details):
        email, password, confirm_password, years_spent_trading, how_you_heard = \
            self.get_sign_up_input_elements()
        email.send_keys(details['email'])
        password.send_keys(details['password1'])
        confirm_password.send_keys(details['password2'])
        years_spent_trading.select(details['yearsSpentTrading'])
        how_you_heard.select(details['howYouHeard'])

    def fill_change_password_form(self, details):
        password1 = self.find_by_testid('new-password1')
        password2 = self.find_by_testid('new-password2')
        password1.send_keys(details['password1'])
        password2.send_keys(details['password2'])

    def assert_user_password_is_not_yet_changed(self, details):
        user = User.objects.get(id=self.user.id)
        self.assertNotEquals(user.password, details['password1'])

def extract_url(mail):
    is_url = False
    url = ''
    for index, letter in enumerate(mail):
        if mail[index: index + 4] == 'http':
            is_url = True
        if is_url:
            if letter in string.whitespace:
                return url
            url += letter