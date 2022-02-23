from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse


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
def f(request):
    return JsonResponse()


urlpatterns = [
    path('trader/', include('trader.urls')),
    path('users/', include('users.urls')),
    path('aff/', include('affiliate.urls')),
    path('admin/', include('admin.urls')),
    path('pp/', include('paypal_endpoint.urls')),
    path('ps/', include('paystack_endpoint.urls')),
    path('datasource/', include('datasource_endpoint.urls')),
    path('', include('serve.urls'))
]

