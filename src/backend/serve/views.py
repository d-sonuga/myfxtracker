from django.shortcuts import render


def serve(request):
    return render(request, 'index.html')
