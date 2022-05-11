from django.urls import path, include
from django.contrib import admin


urlpatterns = [
    path('trader/', include('trader.urls')),
    path('users/', include('users.urls')),
    path('aff/', include('affiliate.urls')),
    path('admin/', admin.site.urls),
    path('pp/', include('paypal_endpoint.urls')),
    path('ps/', include('paystack_endpoint.urls')),
    path('datasource/', include('datasource_endpoint.urls')),
    path('django-rq/', include('django_rq.urls')),
    path('', include('serve.urls'))
]

