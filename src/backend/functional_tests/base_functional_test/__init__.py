import subprocess
import time
from django.test import LiveServerTestCase, tag
from django.contrib.sites.models import Site
from django.conf import settings
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException


@tag('functional')
class BaseFunctionalTest(LiveServerTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.browser = webdriver.Remote(
            command_executor='http://firefox:4444/wd/hub',
            desired_capabilities=DesiredCapabilities.FIREFOX
        )
        cls.start_server()
        cls.server_domain = 'backend'
        cls.live_server_url = f'http://backend:8000'
        # For making requests from the browser
        cls.base_url = f'http://frontend:3000'
        # The maximum amount of sleep seconds to be used in the do_until_max_wait function
        cls.MAX_WAIT = 60
        cls.site_name = 'MyFxTracker'
        cls.maildump_server_address = 'http://localhost:1080'
        site = Site.objects.get(id=settings.SITE_ID)
        # The password related emails use this domain as the domain they show
        site.domain = 'backend'
        site.save()
    
    @classmethod
    def start_server(cls):
        launch_gunicorn_command = ['gunicorn', 'core.wsgi', '-b', '0.0.0.0:8000']
        subprocess.Popen(launch_gunicorn_command)
    
    @classmethod
    def stop_server(cls):
        kill_gunicorn_server_command = ['bash', '-c', 'kill $(lsof -t -i:8000)']
        subprocess.run(kill_gunicorn_server_command)

    @classmethod
    def tearDownClass(cls):
        cls.browser.quit()
        cls.stop_server()
        super().tearDownClass()
    
    def open_url(self, url):
        self.browser.get(url)

    def navigate(self, url):
        self.open_url(f'{self.base_url}/{url}')
    
    def close_current_tab_and_open_new_tab(self):
        body = self.browser.find_element(By.TAG_NAME, 'body')
        body.send_keys(Keys.CONTROL + 'w')

    def assert_title_is_site_name(self):
        self.assertEquals(self.browser.title, self.site_name)
    
    def assert_is_current_url(self, url):
        browser_url = (self.browser.current_url
            if not self.browser.current_url.endswith('/')
            else self.browser.current_url[:-1]
        )
        url_to_compare = (url
            if not url.endswith('/')
            else url[:-1]
        )
        self.assertEquals(browser_url, url_to_compare)

    def create_select_el(self, el):
        # All select options have their test id as their value
        class Select:
            def __init__(self, el, browser, find_by_testid, do_until_max_wait):
                self.el = el
                self.browser = browser
                self.find_by_testid = find_by_testid
                self.do_until_max_wait = do_until_max_wait
            def select(self, value):
                self.do_until_max_wait(self.el.click)
                def click_option():
                    option = self.find_by_testid(value, 'li')
                    self.do_until_max_wait(option.click)
                self.do_until_max_wait(click_option)
        return Select(el, self.browser, self.find_by_testid, self.do_until_max_wait)

    def find_by_testid(self, testid, el='input'):
        return self.browser.find_element_by_css_selector(f'*[data-testid="{testid}"]')

    def assert_element_is_in_page(self, testid):
        try:
            self.find_by_testid(testid)
        except Exception:
            self.assertTrue(False, f'The element with testid {testid} was not found in page')
    
    def assert_element_is_not_in_page(self, testid):
        try:
            self.find_by_testid(testid)
            self.assertTrue(False, 'The element is in the page')
        except NoSuchElementException:
            pass

    def do_until_max_wait(self, func, func_args=(), initial_wait_time=0):
        try:
            print('executing')
            return func(*func_args)
        except Exception as e:
            if initial_wait_time >= self.MAX_WAIT:
                raise e
            else:
                self.wait(1)
                return self.do_until_max_wait(func, func_args, initial_wait_time + 1)

    def wait(self, secs):
        time.sleep(secs)

    def wait_a_little(self):
        self.wait(3)

    def wait_a_lot(self):
        self.wait(10)

    def intentional_fail(self):
        self.assertTrue(False, 'Finish the test')

    def get_submit_button(self):
        submit_button = self.find_by_testid('submit-button', 'button')
        return submit_button