from django.contrib.auth.forms import UserCreationForm as GenericUserCreationForm
from django.contrib.auth.forms import UserChangeForm as GenericUserChangeForm
from django.contrib.auth.forms import AuthenticationForm as GenericAuthenticationForm
from django_registration.forms import RegistrationForm as GenericRegistrationForm
from django_registration.forms import forms
from django.core.exceptions import ValidationError
from .models import User, Alias

class NewAliasForm(forms.Form):
    alias_name = forms.CharField(label='Alias Name', max_length=150, min_length=1, widget=forms.TextInput(attrs={'form':'new-alias-form'}))

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
        fields = ("email", "first_name")

class UserCreationForm(GenericUserChangeForm):
    class Meta:
        model = User
        fields = ("email", "first_name")