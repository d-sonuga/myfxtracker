from django.test import tag
from functional_tests.base_functional_test import BaseFunctionalTest
from allauth.account.models import EmailAddress
from users.models import Trader
from trader.tests.test_data import LoginDetails


"""
Trader deletes account
He shouldnt be able to log back in
"""
class TraderDeleteAccount(BaseFunctionalTest):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Create a new and verified user for the test
        cls.details = LoginDetails.good_details
        cls.new_user = Trader.objects.create(
            email=cls.details['email'],
            password=cls.details['password']
        )
        cls.new_user.set_password(cls.details['password'])
        cls.new_user.save()
        EmailAddress.objects.create(user=cls.new_user, email=cls.new_user.email, verified=True, primary=True)

    def test_delete_account(self):
        self.login()
        self.delete_account()
        self.attempt_to_login()
    
    def delete_account(self):
        self.navigate('app/settings')
        delete_account_button = self.do_until_max_wait(lambda: self.find_by_testid('delete-account-button'))
        self.do_until_max_wait(delete_account_button.click)
        confirm_delete_account_button = self.do_until_max_wait(lambda: self.find_by_testid('confirm-delete-account-button'))
        self.do_until_max_wait(confirm_delete_account_button.click)
        self.do_until_max_wait(lambda: self.assert_is_current_url(f'{self.base_url}/log-in/'))

    def login(self):
        self.navigate('log-in')
        self.fill_login_form(self.details)
        submit_button = self.get_submit_button()
        self.do_until_max_wait(submit_button.click)
        self.wait_a_little()

    def attempt_to_login(self):
        self.login()
        self.wait_a_little()
        self.do_until_max_wait(lambda: self.assert_is_current_url(f'{self.base_url}/log-in/'))
        self.assert_element_is_in_page('non-field-error-alert')

    def fill_login_form(self, details):
        email = self.find_by_testid('email')
        password = self.find_by_testid('password')
        email.send_keys(details['email'])
        password.send_keys(details['password'])