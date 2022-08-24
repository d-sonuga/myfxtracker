from django import forms
from django.core.exceptions import ValidationError
from .models import Affiliate
from django.contrib.auth.models import User


class SignUpForm(forms.Form):
    username = forms.CharField(max_length=50)
    paypal_email = forms.EmailField()
    password = forms.CharField()

    def clean_username(self):
        username = self.cleaned_data.get('username')
        for user in User.objects.all():
            if username == user.username:
                raise ValidationError('The username already exists')
        return username
    
    def clean_password(self):
        password = self.cleaned_data.get('password')
        if len(password) < 8:
            raise ValidationError('Password should be at least 8 characters')
        return password


class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField()
    
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if Affiliate.objects.filter(user__username=username).count() == 0:
            raise ValidationError('The username is invalid')
        return username
    
    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        affiliate_set = Affiliate.objects.filter(user__username=username)
        if affiliate_set.count() == 0:
            raise ValidationError('Username does not exist')
        affiliate = affiliate_set[0]
        if not affiliate.user.check_password(password):
            raise ValidationError('Invalid password')
        return super().clean()
