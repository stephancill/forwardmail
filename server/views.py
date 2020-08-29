from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView as GenericLoginView 
from django.contrib.auth.views import PasswordResetView as GenericPasswordResetView
from django.contrib.auth import authenticate, login
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.shortcuts import render, loader, redirect
from django.urls import reverse_lazy, reverse
from django.views import generic, View
from django_registration.backends.activation.views import RegistrationView as GenericRegistrationView

import config
import hashlib
import jwt
import logging
import os
import requests

from .forms import NewAliasForm, UserRegistrationForm, UserLoginForm
from .models import Alias, User
from .managers import UserManager
from .mixins import AccountActivatedMixin
from .utilities import random_address, create_remote_alias

logger = logging.getLogger(__name__)

class AuthenticatedBasePage(AccountActivatedMixin, View):
    pass

class AliasPage(AuthenticatedBasePage):

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

class AliasAction(AuthenticatedBasePage):
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
        if "delete_account" in request.path:
            request.user.delete()
        
        return redirect("settings")

class LoginView(GenericLoginView):
    authentication_form = UserLoginForm

class GoogleLoginView(View):
    def get(self, request):
        state = request.GET.get("state")
        code = request.GET.get("code")
        r = requests.post("https://oauth2.googleapis.com/token", data={
            "code": code,
            "client_id": config.GOOGLE_OAUTH_CLIENT_ID,
            "client_secret": config.GOOGLE_OAUTH_SECRET,
            "redirect_uri": config.SERVER_ENDPOINT + reverse("login_google"),
            "grant_type": "authorization_code"
        })
        response = r.json()
        user_info = jwt.decode(response.get("id_token"), verify=False)
        email = user_info.get("email")
        first_name = user_info.get("given_name")
        if email:
            user = authenticate(request, username=email, is_external=True)
            if not user:
                user = User.objects.create_user(email, first_name=first_name, is_external=True, is_active=True)
                print(user)
            login(request, user)
        return redirect("home")

    def post(self, request):
        state = hashlib.sha256(os.urandom(1024)).hexdigest()
        request.session["state"] = state
        params = {
            "client_id": config.GOOGLE_OAUTH_CLIENT_ID,
            "response_type": "code",
            "scope": "openid email profile",
            "redirect_uri": config.SERVER_ENDPOINT + reverse("login_google"),
            "state": state # TODO: Store and validate state
        }
        params_encoded = "&".join([key + "=" + value for key, value in params.items()])
        url = "https://accounts.google.com/o/oauth2/v2/auth?" + params_encoded
        return redirect(url)

class RegistrationView(GenericRegistrationView):

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

        if config.DEBUG:
            print("\n\n", activation_url)
        else:
            message.send()

class ResendActivationView(RegistrationView):
    def post(self, request, *args, **kwargs):
        self.send_activation_email(request.user)

# class PasswordResetView(GenericPasswordResetView):
#     form_class = CustomPasswordResetForm