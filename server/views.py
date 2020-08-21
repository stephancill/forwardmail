from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse
from django.shortcuts import render, loader, redirect
from django.urls import reverse_lazy
from django.views import generic, View

from .forms import CustomUserCreationForm, NewAliasForm
from .models import Alias
from .mixins import UserVerifiedMixin
from .utilities import random_address, create_remote_alias

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
        return HttpResponse(template.render(context, request))

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
        context = {
            
        }
        template = loader.get_template("settings.html")
        return HttpResponse(template.render(context, request))

class Register(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'registration/register.html'