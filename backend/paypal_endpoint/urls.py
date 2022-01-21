from django.urls import path
from .views import process_wh, pay_aff

urlpatterns = [
    path('wh/', process_wh),
    path('pay_aff/', pay_aff)
]