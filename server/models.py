from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_("first name"), max_length=150)
    email = models.EmailField(_("email address"), unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name"]

    objects = UserManager()

    def __str__(self):
        return self.email
   
class Alias(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField("alias name", max_length=150)
    proxy_address = models.EmailField("alias address", unique=True)
    date = models.DateTimeField(default=timezone.now)
    is_disconnected = models.BooleanField(default=False)

    def __str__(self):
        return "{} to {}".format(self.proxy_address, self.user.email)

    class Meta:
        ordering = ["-date", "name"]
