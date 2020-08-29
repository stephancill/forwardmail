from django.contrib.auth.forms import UserCreationForm as GenericUserCreationForm
from django.contrib.auth.forms import UserChangeForm as GenericUserChangeForm
from django.contrib.auth.forms import PasswordResetForm as GenericPasswordResetForm
from django.contrib.auth.forms import AuthenticationForm as GenericAuthenticationForm
from django.core.mail import EmailMessage
from django.urls import reverse_lazy
from django_registration.forms import RegistrationForm as GenericRegistrationForm
from django_registration.forms import forms
from django.core.exceptions import ValidationError

import config
from .models import User, Alias

class NewAliasForm(forms.Form):
    alias_name = forms.CharField(label='Alias Name', max_length=150, min_length=1, widget=forms.TextInput(attrs={'form':'new-alias-form'}))

class PasswordResetForm(GenericPasswordResetForm):
    def send_mail(self, subject_template_name, email_template_name,
                  context, from_email, to_email, html_email_template_name=None):
        uid = context.get("uid")
        token = context.get("token")
        user = context.get("user")
        reset_url = "{endpoint}{url}".format(endpoint=config.SERVER_ENDPOINT, url=reverse_lazy("password_reset_confirm", kwargs={"uidb64": uid, "token": token}))
        message = EmailMessage(
            subject="Reset your ForwardMail password.",
            to=[to_email]
        )
        message.template_id = "reset-password"
        message.merge_global_data = {
            "reset_url": reset_url,
            "user_name": user.first_name
        }
        if config.DEBUG:
            print(reset_url)
        else:
            message.send()

class UserRegistrationForm(GenericRegistrationForm):
    class Meta(GenericRegistrationForm.Meta):
        model = User
        fields = ("first_name", "email")

class UserLoginForm(GenericAuthenticationForm):
    def confirm_login_allowed(self, user):
        pass

class UserCreationForm(GenericUserCreationForm):
    class Meta(GenericUserCreationForm.Meta):
        model = User
        fields = ("first_name", "email")

class UserCreationForm(GenericUserChangeForm):
    class Meta:
        model = User
        fields = ("first_name", "email")