from django.urls import path
from .views import login, get_init_data, change_bank_account_number


urlpatterns = [
    #path('init_data/', get_init_data),
    #path('sign_up/', sign_up),
    path('login/', login),
    path('get-init-data/', get_init_data),
    path('change-bank-account-number/', change_bank_account_number)
]
