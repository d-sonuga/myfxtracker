from django.urls import path
from .views import login


urlpatterns = [
    #path('init_data/', get_init_data),
    #path('sign_up/', sign_up),
    path('login/', login)
]
