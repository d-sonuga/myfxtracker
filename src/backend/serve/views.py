from django.shortcuts import redirect, render


def serve(request):
    return render(request, 'index.html')


def robotsfile(request):
    return redirect('/static/robots.txt')