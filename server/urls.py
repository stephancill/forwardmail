from django.urls import include, path
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import PasswordResetView
from django.views.generic.base import TemplateView 
from functools import wraps

from . import views
from . import forms

urlpatterns = [
    path('', views.AliasPage.as_view(), name='home'),
    path('terms-of-service/', TemplateView.as_view(template_name='terms-of-service.html'), name='terms_of_service'),
    path('privacy/', TemplateView.as_view(template_name='privacy-policy.html'), name='privacy_policy'),
    path('alias/<int:alias_id>/<str:method>', views.AliasAction.as_view(), name='alias_action'),
    path('settings/', views.SettingsPage.as_view(), name='settings'),
    path('settings/resend_activation', views.SettingsPage.as_view(), name='resend_activation'),
    path('settings/delete_account', views.SettingsPage.as_view(), name='delete_account'),
    path('accounts/register/', views.RegistrationView.as_view(form_class=forms.UserRegistrationForm), name='django_registration_register'),
    path('accounts/', include('django_registration.backends.activation.urls')),
    path('accounts/login/', views.LoginView.as_view(), name='login'),
    path('accounts/password_reset/', PasswordResetView.as_view(form_class=forms.PasswordResetForm), name='password_change'),
    path('accounts/', include('django.contrib.auth.urls')),
]