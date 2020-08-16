from server.models import User, Alias
from rest_framework import serializers

class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150)
    is_active = serializers.BooleanField()
    date_joined = serializers.DateTimeField()

    def create(self, validated_data):
        """
        Create and return a new `User` instance, given the validated data.
        """
        return User.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `User` instance, given the validated data.
        """
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.date_joined = validated_data.get('date_joined', instance.date_joined)
        
        instance.save()
        
        return instance

class AliasSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=150)
    proxy_address = serializers.CharField()
    date = serializers.DateTimeField()
    is_disconnected = serializers.BooleanField()
    
    def create(self, validated_data):
        """
        Create and return a new `Alias` instance, given the validated data.
        """
        return Alias.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Alias` instance, given the validated data.
        """
        instance.name = validated_data.get('name', instance.name)
        instance.proxy_address = validated_data.get('proxy_address', instance.proxy_address)
        instance.date = validated_data.get('date', instance.date)
        instance.is_disconnected = validated_data.get('is_disconnected', instance.is_disconnected)
        
        instance.save(update_fields=["is_disconnected"])
        
        return instance

