from django.urls import path, include, re_path
from dj_rest_auth.registration.views import RegisterView, ConfirmEmailView, VerifyEmailView
from dj_rest_auth.views import (PasswordResetConfirmView,
                                PasswordChangeView, LoginView, LogoutView)
from .views import update_email, subscribe_user, unsubscribe_user, Register, set_logins_after_ask


urlpatterns = [
    path('sign-up/', Register.as_view()),
    re_path(
        r'^account-confirm-email/(?P<key>[-:\w]+)/$', ConfirmEmailView.as_view(),
        name='account_confirm_email',
    ),
    path('sign-up/verify-email/', VerifyEmailView.as_view(), name='rest_verify_email'),
    path('account-confirm-email/', VerifyEmailView.as_view(), name='account_email_verification_sent'),

    path('login/', LoginView.as_view(), name='account_login'),
    path('logout/', LogoutView.as_view(), name='account_logout'),

    path('password-reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('password-reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),
    path('password-change/', PasswordChangeView.as_view()),
    path('update_email/', update_email),
    path('subscribe_user/', subscribe_user),
    path('unsubscribe_user/', unsubscribe_user),
    path('set_logins_after_ask/', set_logins_after_ask)

]
