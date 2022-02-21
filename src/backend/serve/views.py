from django.shortcuts import render
from django.views.decorators.cache import never_cache


@never_cache
def serve(request):
    return render(request, 'index.html')
