from django.contrib.auth.forms import UserCreationForm, UserChangeForm, AuthenticationForm, forms
from django_registration.forms import RegistrationForm
from django.core.exceptions import ValidationError
from .models import User, Alias

class NewAliasForm(forms.Form):
    alias_name = forms.CharField(label='Alias Name', max_length=150, min_length=1, widget=forms.TextInput(attrs={'form':'new-alias-form'}))

class UserRegistrationForm(RegistrationForm):

    class Meta(RegistrationForm.Meta):
        model = User
        fields = ("first_name", "email")

class UserLoginForm(AuthenticationForm):
    def confirm_login_allowed(self, user):
        pass

class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = User
        fields = ("email", "first_name")

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = User
        fields = ("email", "first_name")