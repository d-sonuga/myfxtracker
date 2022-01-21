from django.urls import path
from .views import (add_trade, add_deposit, add_withdrawal, update_trade, get_init_data,
                    add_account, DeleteTrade, DeleteAccount, set_account_pref,
                    send_weekly_reports)


urlpatterns = [
    path('add_trade/', add_trade),
    path('delete_trade/<int:pk>/', DeleteTrade.as_view()),
    path('init_data/', get_init_data),
    path('add_deposit/', add_deposit),
    path('add_withdrawal/', add_withdrawal),
    path('add_account/', add_account),
    path('delete_account/<int:pk>/', DeleteAccount.as_view()),
    path('update_trade/<int:pk>/', update_trade),
    path('set_account_pref/', set_account_pref),
    path('send_weekly_reports/', send_weekly_reports)
]

