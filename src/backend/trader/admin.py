from django.contrib import admin
from .models import (Account, Trade, Deposit, Withdrawal,
    UnknownTransaction, FailedTransactionSave, MetaApiError, AccountDataLastRefreshed)

admin.site.register(Account)
admin.site.register(Trade)
admin.site.register(Deposit)
admin.site.register(Withdrawal)
admin.site.register(UnknownTransaction)
admin.site.register(FailedTransactionSave)
admin.site.register(MetaApiError)
admin.site.register(AccountDataLastRefreshed)
