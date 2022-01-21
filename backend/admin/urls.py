from django.urls import path
from django.urls import path
from .views import login, get_init_data

urlpatterns = [
    path('login/', login),
    path('init_data/', get_init_data)
]
