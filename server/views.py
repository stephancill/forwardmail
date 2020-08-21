from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.shortcuts import render, loader, redirect
from django.urls import reverse_lazy
from django.views import generic, View
from django_registration.backends.activation.views import RegistrationView

import config
import logging

from .forms import CustomUserCreationForm, NewAliasForm, UserRegistrationForm, UserLoginForm
from .models import Alias
from .mixins import UserVerifiedMixin
from .utilities import random_address, create_remote_alias

logger = logging.getLogger(__name__)

class AliasPage(UserVerifiedMixin, View):

    def post(self, request):
        form = NewAliasForm(request.POST)
        if form.is_valid():
            address = random_address()
            success = create_remote_alias(address, request.user.email)
            if success:
                alias = Alias.objects.create(user_id=request.user.id, name=form.cleaned_data.get("alias_name"), proxy_address=address)
                alias.save()
            return redirect("home")

        return redirect("home")

    def get(self, request):
        aliases = Alias.objects.filter(user_id=request.user.id)
        context = {
            "aliases": aliases,
            "new_alias_form": NewAliasForm()
        }
        template = loader.get_template("aliases.html")
        return render(request, "aliases.html", context=context)

class AliasAction(UserVerifiedMixin, View):
    def get(self, request, alias_id, method):
        alias = Alias.objects.get(user_id=request.user.id, id=alias_id)
        if not alias:
            return redirect("home")
        
        if method == "disconnect":
            alias.is_disconnected = not alias.is_disconnected
            alias.save(update_fields=["is_disconnected"])
        elif method == "delete":
            alias.delete()

        return redirect("home")

    def post(self, request, alias_id, method):
        alias = Alias.objects.get(user_id=request.user.id, id=alias_id)
        if not alias:
            return redirect("home")
        
        name = request.POST.get("alias_name")
        if method == "update" and name:
            alias.name = name
            alias.save(update_fields=["name"])
        
        return redirect("home")

class SettingsPage(LoginRequiredMixin, View):
    def get(self, request):
        context = {}
        return render(request, "settings.html", context=context)

    def post(self, request):
        if "resend_activation" in request.path and not request.user.is_active:
            ResendActivationView.as_view()(request)
            return render(request, "django_registration/registration_complete.html")

        return redirect("settings")

class CustomLoginView(LoginView):
    authentication_form = UserLoginForm


class CustomRegistrationView(RegistrationView):
    form = UserRegistrationForm

    def send_activation_email(self, user):
        activation_key = self.get_activation_key(user)    
        activation_url = "{endpoint}{url}".format(endpoint=config.SERVER_ENDPOINT, url=reverse_lazy("django_registration_activate", args=[activation_key]))
        message = EmailMessage(
            subject="Activate your ForwardMail account.",
            to=[user.email]
        )
        message.template_id = "account-activation"
        message.merge_global_data = {
            "activation_url": activation_url,
            "user_name": user.first_name
        }
        logger.info(message.merge_global_data)
        message.send()

class ResendActivationView(CustomRegistrationView):
    def post(self, request, *args, **kwargs):
        self.send_activation_email(request.user)