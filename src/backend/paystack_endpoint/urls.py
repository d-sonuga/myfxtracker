from django.urls import path
from .views import process_wh


urlpatterns = [
    path('wh/', process_wh)
]