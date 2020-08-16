from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, loader, redirect
from django.urls import reverse_lazy
from django.views import generic, View
from .forms import CustomUserCreationForm, NewAliasForm
from .models import Alias
import requests
from .utilities import random_address, create_remote_alias

class AliasPage(View):
    def post(self, request):
        form = NewAliasForm(request.POST)
        if form.is_valid():
            # TODO: Create alias
            address = random_address()

            success = create_remote_alias(address, request.user.email)
            if success:
                alias = Alias.objects.create(user_id=request.user.id, name=form.cleaned_data.get("alias_name"), proxy_address=address)
                alias.save()
            # TODO: Check for validation issues
            return redirect("home")

        # TODO: Show form errors
        return redirect("home")

    def get(self, request):
        aliases = Alias.objects.filter(user_id=request.user.id)
        context = {
            "aliases": aliases,
            "new_alias_form": NewAliasForm()
        }
        template = loader.get_template('aliases.html')
        return HttpResponse(template.render(context, request))

class Register(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'registration/register.html'