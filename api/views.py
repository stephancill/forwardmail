from django.shortcuts import render
from django.http import JsonResponse

import json

import rest_framework.authentication as authentication
import rest_framework.permissions as permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from server.forms import NewAliasForm
from server.models import Alias

from server.utilities import random_address, create_remote_alias

from .serializers import AliasSerializer, UserSerializer

class ListAliases(APIView):
    """
    View to list all users in the system.

    * Requires token authentication.
    """
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        """
        Return a list of all aliases for authenticated user.
        """
        aliases = Alias.objects.filter(user_id=request.user.id)
        serializer = AliasSerializer(aliases, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request):
        data = request.POST or json.loads(request.body)
        form = NewAliasForm(data)
        if form.is_valid():
            address = random_address()
            success = create_remote_alias(address, request.user.email)
            if success:
                alias = Alias.objects.create(user_id=request.user.id, name=form.cleaned_data.get("alias_name"), proxy_address=address)
                alias.save()

                serializer = AliasSerializer(alias)
                return JsonResponse(serializer.data, status=201)
        return JsonResponse(form.errors, status=400)

class AliasActions(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, alias_id, method):
        try:
            alias = Alias.objects.get(user_id=request.user.id, id=alias_id)
        except Alias.DoesNotExist:
            return JsonResponse({"message": "Requested alias could not be found"}, status=404)
            
        if not method in ["disconnect", "delete", "rename"]:
            return JsonResponse({"message": "Invalid method"}, status=401)

        if method == "disconnect":
            alias.is_disconnected = not alias.is_disconnected
            alias.save(update_fields=["is_disconnected"])
        elif method == "delete":
            alias.delete()
            return JsonResponse({}, status=200)
        elif method == "rename":
            name = request.POST.get("alias_name")
            if name:
                alias.name = name
                alias.save(update_fields=["name"])
            
        serializer = AliasSerializer(alias)
        return JsonResponse(serializer.data, status=201) 

class UserSelf(APIView):
    """
    Get User object.

    * Requires token authentication.
    """
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        """
        Return a list of all aliases for authenticated user.
        """
        serializer = UserSerializer(request.user)
        return JsonResponse(serializer.data, safe=False)