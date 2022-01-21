from django.urls import path, include
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.http import HttpResponse


@csrf_exempt
def e(request):
    import requests
    from django.http import HttpResponse
    r = requests.get(request.POST['url'])
    if r.status_code == 200:
        return HttpResponse(r.content)
    else:
        r = requests.post(request.POST['url'])
        return HttpResponse(r.content)
        
def doc(request):
    return HttpResponse('index.html')


urlpatterns = [
    path('exp/', e),
    path('docs/', doc),
    path('apis/', include('apis.urls')),
    path('users/', include('users.urls')),
    path('app/', include('serve.urls')),
    path('aff/', include('affiliate.urls')),
    path('admin/', include('admin.urls')),
    path('pp/', include('paypal_endpoint.urls')),
    path('ps/', include('paystack_endpoint.urls')),
    *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
    path('', include('serve.urls'))
]

