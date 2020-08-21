from django.contrib.auth.forms import UserCreationForm, UserChangeForm, forms
from .models import User, Alias

class NewAliasForm(forms.Form):
    alias_name = forms.CharField(label='Alias Name', max_length=150, min_length=1, widget=forms.TextInput(attrs={'form':'new-alias-form'}))

class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = User
        fields = ("email", "first_name")


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = User
        fields = ("email", "first_name", "is_verified")