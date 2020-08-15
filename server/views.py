from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, loader
from django.urls import reverse_lazy
from django.views import generic

from .forms import CustomUserCreationForm

@login_required
def index(request):
    context = {
        
    }
    template = loader.get_template('aliases.html')
    return HttpResponse(template.render(context, request))

class Register(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'registration/register.html'