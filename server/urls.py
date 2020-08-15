from django.urls import include, path

from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('register/', views.Register.as_view(), name='register'),
]