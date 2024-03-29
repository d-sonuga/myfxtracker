from django.urls import path
from .views import login, get_init_data, change_bank_account_number, change_bank_name, logout, create_affiliate, change_bank_account_name


urlpatterns = [
    #path('init_data/', get_init_data),
    #path('sign_up/', sign_up),
    path('login/', login),
    path('get-init-data/', get_init_data),
    path('change-bank-account-number/', change_bank_account_number),
    path('change-bank-name/', change_bank_name),
    path('change-bank-account-name/', change_bank_account_name),
    path('logout/', logout),
    path('create-affiliate/', create_affiliate)
]
