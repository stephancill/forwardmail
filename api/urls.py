from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token

from . import views

urlpatterns = [
    path('token', obtain_auth_token),
    path('aliases', views.ListAliases.as_view(), name='aliases'),
    path('aliases/<int:alias_id>/<str:method>', views.AliasActions.as_view(), name='api_alias_actions'),
    path('self', views.UserSelf.as_view(), name='self')
]
