from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import transaction
from users.models import Trader
from trader.models import Account
from trader.tests.test_data import AddTradingAccountTestData
from trader.metaapi.main import Transaction


class Command(BaseCommand):
    """
    python manage.py seed
    """

    help = "To initialize the DB with the dummy user for archiving purposes."

    @transaction.atomic
    def handle(self, *args, **options):
        email = "i-hope-this-email-doesnt-exist@gmail.com"
        if settings.IS_ARCHIVE and not Trader.objects.filter(email=email).exists():
            trader = Trader.objects.create(
                email="i-hope-this-email-doesnt-exist@gmail.com",
                password="password"
            )
            account_details = AddTradingAccountTestData.good_account_details
            try:
                Account.objects.create_account(
                    trader,
                    account_details["account-info"],
                    *Transaction.from_raw_data(account_details["deals"])
                )
            except:
                pass
