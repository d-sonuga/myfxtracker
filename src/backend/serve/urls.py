from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.serve),
    re_path(r'^(?:.*)/?$', views.serve)
]
