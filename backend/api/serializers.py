from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Expense, Budget

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        if 'first_name' in validated_data:
            user.first_name = validated_data['first_name']
        user.save()
        return user

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ('amount',)

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ('user',)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
