from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Expense, UserProfile

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'], # using email as username or separate? Simple tracker usually uses email as login.
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        # Note: In the frontend, we use name/email/password. 
        # For simplicity, we can map email to username or just use username.
        # Let's assume the frontend sends 'username' for now or we handle it in views.
        if 'first_name' in validated_data:
            user.first_name = validated_data['first_name']
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('monthly_budget',)

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ('user',)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
