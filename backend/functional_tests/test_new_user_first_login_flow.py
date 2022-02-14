from django.test import override_settings, tag
from trader.models import Account
from users.models import Trader
from allauth.account.models import EmailAddress
from .base_functional_test import BaseFunctionalTest
from trader.tests.test_data import LoginDetails
from datasource_endpoint.tests.test_data import DatasourceInitialInfoData

"""
When a user first logs in, there ought to be instructions telling him / her
how to go about settings up the data source and a button / link to download
the data source EA
This tests the flow from that first login to the presence of the instructions
to the simulation of the following of the instructions.
The following of the instructions has to be simulated because it requires
the use of the mt terminal which can tbe automated right now
"""

@override_settings(DEBUG=True)
@tag('new-user-login-flow')
class NewTraderLoginFlow(BaseFunctionalTest):
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

    def test_flow(self):
        self.login_new_user()
        self.assert_instructions_are_in_app_pages_and_not_settings()
        self.simulate_follow_instructions()

    def login_new_user(self):
        details = LoginDetails.good_details
        self.navigate(f'{self.base_url}/log-in')
        self.assert_title_is_site_name()
        self.fill_login_form(details)
        submit_button = self.get_submit_button()
        self.do_until_max_wait(submit_button.click)
        self.wait_a_little()
        self.assert_is_current_url(f'{self.base_url}/app')
    
    def assert_instructions_are_in_app_pages_and_not_settings(self):
        def navigate(url):
            self.navigate(f'{self.base_url}/app/{url}')
        def assert_instructions_are_in_page():
            self.assert_element_is_in_page('data-source-setup-instructions')
        navigate('journal')
        assert_instructions_are_in_page()
        navigate('cash-and-gains')
        assert_instructions_are_in_page()
        navigate('long-short-analysis')
        assert_instructions_are_in_page()
        navigate('pairs-analysis')
        assert_instructions_are_in_page()
        navigate('trader-time-analysis')
        assert_instructions_are_in_page()
        navigate('period-analysis')
        assert_instructions_are_in_page()
        navigate('expenses')
        assert_instructions_are_in_page()
        navigate('settings')
        self.assert_element_is_not_in_page('data-source-setup-instructions')

    def simulate_follow_instructions(self):
        self.navigate(f'{self.base_url}/app')
        download_ea_mt4 = self.find_by_testid('download-ea-mt4')
        download_ea_mt5 = self.find_by_testid('download-ea-mt5')
        self.do_until_max_wait(download_ea_mt4.click)
        self.do_until_max_wait(download_ea_mt5.click)
        # When a user has successfully followed all the instructions
        # The database will have his trade account data
        trader = Trader.objects.get(email=self.details['email'])
        Account.objects.create_account(
            trader,
            DatasourceInitialInfoData.good_details_with_transactions['data']
        )
        self.fail()

    def fill_login_form(self, details):
        email = self.find_by_testid('email')
        password = self.find_by_testid('password')
        email.send_keys(details['email'])
        password.send_keys(details['password'])