from django.urls import path
from .views import get_initial_info, save_initial_data, save_data, save_error


urlpatterns = [
    path('get-initial-info/', get_initial_info),
    path('save-initial-data/', save_initial_data),
    path('save-data/', save_data),
    path('save-error/', save_error)
]