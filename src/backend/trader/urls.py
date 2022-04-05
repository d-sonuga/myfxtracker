from django.urls import path
from .views import (add_trade, add_deposit, add_withdrawal, update_trade, get_init_data,
            add_account, DeleteTrade, DeleteAccount, set_account_pref, add_trading_account,
            send_weekly_reports, sign_up, login, logout, delete_account, refresh_data,
            get_all_notes, save_note, update_note, delete_note, redirect_to_signup,
            refresh_all_accounts_data, remove_trading_account, pending_add_trading_account,
            pending_refresh_data)


urlpatterns = [
    path('sign-up/', sign_up),
    # The name argument is needed by the email confirmation mechanism to
    # determine the appropriate login url
    path('login/', login, name='account_login'),
    path('send_weekly_reports/', send_weekly_reports),
    path('logout/', logout),
    path('delete-account/', delete_account),
    path('get-all-notes/', get_all_notes),
    path('save-note/', save_note),
    path('save-note/<int:pk>/', update_note),
    path('delete-note/<int:pk>/', delete_note),
    path('get-init-data/', get_init_data),
    path('redirect-to-signup/', redirect_to_signup, name='account_signup'),
    path('add-trading-account/', add_trading_account),
    path('pending-add-trading-account/', pending_add_trading_account),
    path('refresh-data/', refresh_data),
    path('pending-refresh-data/', pending_refresh_data),
    path('refresh-all-account-data/', refresh_all_accounts_data),
    path('remove-trading-account/<int:pk>/', remove_trading_account),

    path('add_trade/', add_trade),
    path('delete_trade/<int:pk>/', DeleteTrade.as_view()),
    #path('init_data/', get_init_data),
    path('add_deposit/', add_deposit),
    path('add_withdrawal/', add_withdrawal),
    path('add_account/', add_account),
    path('delete_account/<int:pk>/', DeleteAccount.as_view()),
    path('update_trade/<int:pk>/', update_trade),
    path('set_account_pref/', set_account_pref)
]

