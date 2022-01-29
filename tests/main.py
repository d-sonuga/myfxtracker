from selenium.webdriver.firefox import webdriver
from tests import tests


def main():
    for test_cls in tests:
        test = test_cls()
        test.run()
        test.stop()

if __name__ == '__main__':
    main()