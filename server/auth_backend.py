from django.contrib.auth.backends import ModelBackend
from .models import User

class ExternalAuthBackend(ModelBackend):
    """Log in to Django without providing a password."""
    def authenticate(self, request, username=None, is_external=True):
        print("helooooo")
        try:
            user = User.objects.get(email=username, is_external=True)
            if user and not is_external:
                return None

            return user
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id, is_external=True)
        except User.DoesNotExist:
            return None