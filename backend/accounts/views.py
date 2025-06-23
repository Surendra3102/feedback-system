from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from rest_framework.generics import ListAPIView

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


from .models import EmployeeInfo, ManagerInfo, User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get("username")
        email = data.get("email", "")
        password = data.get("password")
        role = data.get("role")

        if role not in ['employee', 'manager']:
            return Response({"error": "Invalid role."}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=400)

        # Handle EMPLOYEE registration
        if role == 'employee':
            emp_id = data.get("emp_id")
            if not emp_id:
                return Response({"error": "Employee ID is required."}, status=400)

            try:
                emp_info = EmployeeInfo.objects.get(emp_id=emp_id)
            except EmployeeInfo.DoesNotExist:
                return Response({"error": "Invalid Employee ID."}, status=400)

            user = User(username=username, email=email, role="employee")
            user.set_password(password)
            user.save()
            return Response({"success": "Employee registered."}, status=201)

        # Handle MANAGER registration
        elif role == 'manager':
            manager_id = data.get("manager_id")
            if not manager_id:
                return Response({"error": "Manager ID is required."}, status=400)

            try:
                manager_info = ManagerInfo.objects.get(manager_id=manager_id)
            except ManagerInfo.DoesNotExist:
                return Response({"error": "Invalid Manager ID."}, status=400)

            user = User(username=username, email=email, role="manager")
            user.set_password(password)
            user.save()
            return Response({"success": "Manager registered."}, status=201)
        
class EmployeeListView(ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(role='employee')