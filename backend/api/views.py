from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Expense, Budget
from .serializers import UserSerializer, ExpenseSerializer, BudgetSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

class BudgetView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        budget, created = Budget.objects.get_or_create(user=request.user)
        serializer = BudgetSerializer(budget)
        # Include user details if needed, or keep it clean
        data = serializer.data
        return Response(data)

    def put(self, request):
        budget, created = Budget.objects.get_or_create(user=request.user)
        serializer = BudgetSerializer(budget, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = {
            'username': request.user.username,
            'email': request.user.email,
            'name': request.user.first_name,
        }
        return Response(data)

    def put(self, request):
        user = request.user
        if 'email' in request.data:
            user.email = request.data['email']
        if 'name' in request.data:
            user.first_name = request.data['name']
        user.save()
        return Response({
            'username': user.username,
            'email': user.email,
            'name': user.first_name,
        })
