from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.serve),
    path('robots.txt', views.robotsfile),
    re_path(r'^(?:.*)/?$', views.serve)
]
