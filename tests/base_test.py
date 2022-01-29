from abc import abstractmethod
from selenium import webdriver


class BaseTest:
    def __init__(self):
        self.driver = webdriver.Firefox()

    @abstractmethod
    def run(self):
        pass

    @abstractmethod
    def stop(self):
        pass