from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Expense, UserProfile
from .serializers import UserSerializer, ExpenseSerializer, UserProfileSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        data = serializer.data
        data['username'] = request.user.username
        data['email'] = request.user.email
        data['name'] = request.user.first_name
        return Response(data)

    def put(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            user_updated = False
            if 'email' in request.data:
                request.user.email = request.data['email']
                user_updated = True
            if 'name' in request.data:
                request.user.first_name = request.data['name']
                user_updated = True
            if user_updated:
                request.user.save()
                
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

