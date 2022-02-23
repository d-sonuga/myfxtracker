from django.urls import path
from .views import get_init_data, login, sign_up


urlpatterns = [
    path('init_data/', get_init_data),
    path('sign_up/', sign_up),
    path('login/', login)
]