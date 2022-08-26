from django.urls import path
from .views import login, get_init_data, change_bank_account_number, change_bank_name, logout, create_wba_affiliate


urlpatterns = [
    #path('init_data/', get_init_data),
    #path('sign_up/', sign_up),
    path('login/', login),
    path('get-init-data/', get_init_data),
    path('change-bank-account-number/', change_bank_account_number),
    path('change-bank-name/', change_bank_name),
    path('logout/', logout),
    path('create-wba-affiliate/', create_wba_affiliate)
]
