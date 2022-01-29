from lib2to3.pytree import Base
from unittest import BaseTestSuite
from selenium import webdriver
from base_test import BaseTest


class SignUpFlow(BaseTest):
    def run(self):
        self.driver.get('https://python.org')

    def stop(self):
        self.driver.close()