from django.urls import include, path
from django.contrib.auth.decorators import login_required
from functools import wraps

from . import views

urlpatterns = [
    path('', views.AliasPage.as_view(), name='home'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('alias/<int:alias_id>/<str:method>', views.AliasAction.as_view(), name='alias_action'),
    path('register/', views.Register.as_view(), name='register'),
    path('settings/', views.SettingsPage.as_view(), name='settings')
]