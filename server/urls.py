from django.urls import include, path
from django.contrib.auth.decorators import login_required

from . import views

urlpatterns = [
    path('', login_required(views.AliasPage.as_view()), name='home'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('register/', views.Register.as_view(), name='register'),
    path('alias/<int:alias_id>/<str:method>', views.AliasAction.as_view(), name='alias_action'),
]