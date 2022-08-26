from django.contrib import admin
from .models import User, Trader, SubscriptionInfo, Affiliate

admin.site.register(User)
admin.site.register(Trader)
admin.site.register(SubscriptionInfo)
admin.site.register(Affiliate)