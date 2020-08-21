from django.urls import include, path
from django.contrib.auth.decorators import login_required
from functools import wraps

from . import views
from . import forms

urlpatterns = [
    path('', views.AliasPage.as_view(), name='home'),
    path('alias/<int:alias_id>/<str:method>', views.AliasAction.as_view(), name='alias_action'),
    path('settings/', views.SettingsPage.as_view(), name='settings'),
    path('settings/resend_activation', views.SettingsPage.as_view(), name='resend_activation'),
    path('settings/delete_account', views.SettingsPage.as_view(), name='delete_account'),
    path('accounts/register/', views.CustomRegistrationView.as_view(form_class=forms.UserRegistrationForm), name='django_registration_register'),
    path('accounts/', include('django_registration.backends.activation.urls')),
    path('accounts/login/', views.CustomLoginView.as_view(), name='login'),
    path('accounts/', include('django.contrib.auth.urls')),
]