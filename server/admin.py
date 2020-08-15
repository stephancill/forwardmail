from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from .forms import CustomUserChangeForm, CustomUserCreationForm


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
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


admin.site.register(User, CustomUserAdmin)
