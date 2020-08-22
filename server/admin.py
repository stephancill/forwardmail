from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as GenericUserAdmin
from .models import User
from .forms import UserCreationForm, UserCreationForm


class UserAdmin(GenericUserAdmin):
    add_form = UserCreationForm
    form = UserCreationForm
    model = User
    list_display = ('email', 'is_staff', 'is_active',)
    list_filter = ('email', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email', 'first_name')
    ordering = ('email', 'first_name')


admin.site.register(User, UserAdmin)
